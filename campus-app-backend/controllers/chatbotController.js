const knowledge = require('./chatbotKnowledge');
const faq = require('./chatbotFaq');
const memory = new Map(); // sessionId -> { lastIntent, lastTime }

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

function levenshtein(a, b) {
  const m = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
        ? m[i - 1][j - 1]
        : 1 + Math.min(m[i - 1][j - 1], m[i][j - 1], m[i - 1][j]);
    }
  }
  return m[b.length][a.length];
}

function matchIntent(message) {
  const raw = message || '';
  if (!raw.trim()) return knowledge.find(k => k.id === 'help');
  for (const entry of knowledge) {
    if (entry.triggers.some(r => r.test(raw))) return entry;
  }
  const norm = normalize(raw);
  let best = null;
  let bestScore = Infinity;
  for (const entry of knowledge) {
    for (const kw of entry.keywords) {
      const dist = levenshtein(norm, kw);
      if (dist < bestScore && dist <= Math.max(2, Math.floor(kw.length * 0.4))) {
        best = entry; bestScore = dist;
      }
    }
  }
  return best || knowledge.find(k => k.id === 'fallback');
}

function buildReply(intent, dynamic) {
  if (intent.id === 'events_today' && dynamic?.eventsToday) {
    return dynamic.eventsToday;
  }
  if (intent.id === 'events_tomorrow' && dynamic?.eventsTomorrow) {
    return dynamic.eventsTomorrow;
  }
  if (intent.id === 'events_week' && dynamic?.eventsWeek) {
    return dynamic.eventsWeek;
  }
  return intent.response;
}

async function getTodaysEvents(db) {
  const start = new Date();
  start.setHours(0,0,0,0);
  const end = new Date();
  end.setHours(23,59,59,999);
  try {
    const snapshot = await db.collection('events')
      .where('date', '>=', start)
      .where('date', '<=', end)
      .limit(5)
      .get();
    if (snapshot.empty) return 'No events found for today. Check the Events tab for more upcoming activities.';
    const items = snapshot.docs.map(d => {
      const e = d.data();
      const time = e.time || '';
      return `• ${e.title}${time?` at ${time}`:''}`;
    });
    return `Today\'s events:\n${items.join('\n')}`;
  } catch {
    return 'I\'m having trouble fetching events right now. Please check the Events tab.';
  }
}

async function getTomorrowEvents(db) {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(0,0,0,0);
  const end = new Date(start);
  end.setHours(23,59,59,999);
  try {
    const snapshot = await db.collection('events')
      .where('date', '>=', start)
      .where('date', '<=', end)
      .limit(5)
      .get();
    if (snapshot.empty) return 'No events scheduled for tomorrow.';
    const items = snapshot.docs.map(d => {
      const e = d.data();
      const time = e.time || '';
      return `• ${e.title}${time?` at ${time}`:''}`;
    });
    return `Tomorrow's events:\n${items.join('\n')}`;
  } catch {
    return 'Unable to fetch tomorrow events.';
  }
}

async function getWeekEvents(db) {
  const now = new Date();
  const day = now.getDay(); // 0 Sun .. 6 Sat
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0,0,0,0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23,59,59,999);
  try {
    const snapshot = await db.collection('events')
      .where('date', '>=', monday)
      .where('date', '<=', sunday)
      .limit(15)
      .get();
    if (snapshot.empty) return 'No events found for this week.';
    const items = snapshot.docs.map(d => {
      const e = d.data();
      const dayStr = e.date?.toDate?.().toLocaleDateString?.([], { weekday: 'short' }) || '';
      const time = e.time || '';
      return `• ${dayStr} ${e.title}${time?` @ ${time}`:''}`;
    });
    return `This week's events:\n${items.join('\n')}`;
  } catch {
    return 'Unable to fetch week events.';
  }
}

function faqSearch(message) {
  const norm = normalize(message);
  let best = null; let bestScore = 0;
  for (const entry of faq) {
    const qNorm = normalize(entry.q);
    let score = 0;
    qNorm.split(' ').forEach(w => { if (norm.includes(w)) score += 1; });
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  if (best && bestScore >= 2) {
    return best.a;
  }
  return null;
}

function detectSentiment(message) {
  const norm = normalize(message);
  const positive = ['great','awesome','good','thanks','thank you','love','cool'];
  const negative = ['bad','sad','tired','angry','hate','stress','stressed','upset'];
  if (positive.some(w => norm.includes(w))) return 'positive';
  if (negative.some(w => norm.includes(w))) return 'negative';
  return 'neutral';
}

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    const db = req.app.locals.db;
    const sessionId = req.headers['x-session-id'] || 'default';
    const intent = matchIntent(message);
    let dynamic = {};
    if (intent.id === 'events_today') dynamic.eventsToday = await getTodaysEvents(db);
    if (intent.id === 'events_tomorrow') dynamic.eventsTomorrow = await getTomorrowEvents(db);
    if (intent.id === 'events_week') dynamic.eventsWeek = await getWeekEvents(db);

    let reply = buildReply(intent, dynamic);

    if (intent.id === 'fallback') {
      const faqAns = faqSearch(message);
      if (faqAns) {
        reply = faqAns;
      }
    }

    // Sentiment adjustment for greetings or wellbeing
    const sentiment = detectSentiment(message);
    if ((intent.id === 'greeting' || intent.id === 'wellbeing') && sentiment !== 'neutral') {
      if (sentiment === 'positive') reply += " Glad to hear that!";
      else if (sentiment === 'negative') reply += " I'm sorry you're feeling that way. Campus counseling resources are available if you need support.";
    }
    memory.set(sessionId, { lastIntent: intent.id, lastTime: Date.now() });
    return res.json({ reply, intent: intent.id, suggestions: intent.suggestions });
  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ error: 'Chatbot failed.' });
  }
};

module.exports = { handleChat };