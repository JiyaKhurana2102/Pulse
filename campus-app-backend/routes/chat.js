// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /chat
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    // System prompt teaches the bot campus-specific behavior
    const systemPrompt = `
You are "UTD Guide" — a concise, helpful assistant for The University of Texas at Dallas campus.
- Keep answers short (1–3 sentences). Include one link if relevant.
- If user asks about an in-app action, respond as: "Open: <Screen> > <Subscreen>".
- Only give verified info; if unsure, say: "I don't have that info — try Campus Resources (Open: Campus Resources) or https://www.utdallas.edu."
`;

    const finalMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: finalMessages,
      max_tokens: 400,
      temperature: 0.2,
    });
    const reply = response.choices?.[0]?.message?.content || 'Sorry, something went wrong.';
    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
