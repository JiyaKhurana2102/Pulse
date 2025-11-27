// Structured knowledge base for UTD Guide chatbot
// Each entry includes: id, category, triggers, keywords (lowercase), response, suggestions

module.exports = [
  {
    id: 'greeting',
    category: 'general',
    triggers: [/\b(hi|hello|hey|yo|sup)\b/i, /good (morning|afternoon|evening)/i],
    keywords: ['hi','hello','hey','greetings','good morning','good evening'],
    response: "Hi! I'm UTD Guide. Ask me about parking, dining, events, deadlines, study rooms, campus map, or just say 'help'.",
    suggestions: ['parking info','events today','dining options','help']
  },
  {
    id: 'wellbeing',
    category: 'general',
    triggers: [/how are you/i, /hows it going/i],
    keywords: ['how are you','hows it going'],
    response: "I'm just code, but I'm running smoothly and ready to help!",
    suggestions: ['events today','library hours','parking']
  },
  {
    id: 'parking',
    category: 'campus',
    triggers: [/parking|permit|garages?|ps[1-9]/i],
    keywords: ['parking','permit','garage','ps1','ps2','ps3','ps4'],
    response: "Parking: Green & Orange permits are common for students. Garages PS1–PS4 fill early. Visitor metered spots available. Always verify rules on the UTD Parking portal before parking.",
    suggestions: ['parking tips','map','events today']
  },
  {
    id: 'dining',
    category: 'campus',
    triggers: [/dining|food|eat|restaurant|cafe|coffee/i],
    keywords: ['dining','food','eat','restaurant','cafe','coffee'],
    response: "Dining: Student Union food court, Chick-fil-A, Panda Express, Einstein Bros, Starbucks. Northside offers more options (Mexican, sushi, burgers).",
    suggestions: ['dining hours','coffee spots','events today']
  },
  {
    id: 'studyrooms',
    category: 'academics',
    triggers: [/study ?rooms?|reserve|booking/i],
    keywords: ['study room','reserve','booking'],
    response: "Study Rooms: Use the Study Rooms screen to check availability and reserve. Peak demand afternoons & exam weeks—book early.",
    suggestions: ['library hours','quiet places','events today']
  },
  {
    id: 'map',
    category: 'campus',
    triggers: [/map|directions?|campus|building|where is/i],
    keywords: ['map','directions','campus','building','where is'],
    response: "Campus Map: Use the Map screen. Building codes: ECSW (Engineering & CS West), JSOM (Jindal School), SSB (Student Services), ATEC (Arts & Technology).",
    suggestions: ['parking','library hours','events today']
  },
  {
    id: 'library',
    category: 'academics',
    triggers: [/library|mcdermott/i],
    keywords: ['library','mcdermott'],
    response: "Library: McDermott Library usually opens early and closes late during regular terms, with extended hours near finals. Check official site for exact hours.",
    suggestions: ['study room','quiet places','events today']
  },
  {
    id: 'events_today',
    category: 'events',
    triggers: [/events? (today|tonight)|today'?s events|what events.*today/i],
    keywords: ['events today','today events'],
    response: "[DYNAMIC_EVENTS_TODAY]",
    suggestions: ['events tomorrow','create event','groups']
  },
  {
    id: 'events_tomorrow',
    category: 'events',
    triggers: [/events? tomorrow|tomorrow'?s events|what events.*tomorrow/i],
    keywords: ['events tomorrow','tomorrow events'],
    response: '[DYNAMIC_EVENTS_TOMORROW]',
    suggestions: ['events this week','events today','create event']
  },
  {
    id: 'events_week',
    category: 'events',
    triggers: [/events? (this )?week|this week events|week events/i],
    keywords: ['events week','this week events'],
    response: '[DYNAMIC_EVENTS_WEEK]',
    suggestions: ['events today','events tomorrow','create event']
  },
  {
    id: 'help',
    category: 'general',
    triggers: [/^help$|what can you do|options|commands?/i],
    keywords: ['help','what can you do','options','commands'],
    response: "I can answer about parking, dining, events (ask 'events today'), study rooms, campus map, library, and more. Say 'events today', 'parking', or 'map'.",
    suggestions: ['events today','parking','dining','map']
  },
  {
    id: 'fallback',
    category: 'fallback',
    triggers: [],
    keywords: [],
    response: "I didn't quite catch that. Try asking about parking, dining, events today, study rooms, the campus map, or say 'help'.",
    suggestions: ['help','events today','parking','dining']
  }
];
