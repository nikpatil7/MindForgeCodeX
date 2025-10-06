// server/routes/mentor.js
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const questionCache = new Map(); // simple in-memory cache
const MAX_CACHE = 100;

router.post('/', async (req, res) => {
  try {
    const { question } = req.body || {};
    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ ok: false, error: 'question is required' });
    }

    // Return cached response if exists
    if (questionCache.has(question)) {
      return res.json(questionCache.get(question));
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) return res.status(500).json({ ok: false, error: 'Gemini API key not set' });

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const systemPrompt = `You are Mini Mentor — a concise, friendly academic assistant. When given a student question, respond with ONLY valid JSON in the following shape (no extra text):
{"answer":"...","follow_up":"optional short suggestion"}
Keep answers short and clear.`;

    const prompt = `${systemPrompt}\n\nStudent question: ${question}`;

    const tryModels = ['gemini-2.0-flash', 'gemini-1.5-pro-latest', 'gemini-pro'];
    const generationConfig = { temperature: 0.2, maxOutputTokens: 400 };

    let text = '';
    const errors = [];

    // Try multiple models with timeout
    for (const name of tryModels) {
      try {
        const model = genAI.getGenerativeModel({ model: name, generationConfig });
        const timeoutMs = 10000;
        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), timeoutMs))
        ]);
        text = result?.response?.text() || '';
        if (text) break;
      } catch (err) {
        errors.push({ model: name, message: err?.message || String(err) });
      }
    }

    if (!text) {
      return res.status(502).json({ ok: false, error: 'AI model unavailable', tried: tryModels, details: errors });
    }

    // Extract JSON safely
    function extractJson(input) {
      if (!input) return '';
      const trimmed = String(input).trim();
      const codeFence = trimmed.match(/```[a-zA-Z]*\n([\s\S]*?)```/);
      const candidate = codeFence ? codeFence[1] : trimmed;
      const start = candidate.indexOf('{');
      const end = candidate.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) return candidate.slice(start, end + 1);
      return candidate;
    }

    const jsonString = extractJson(text);
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      parsed = { answer: text || 'Sorry, no response from the model.', follow_up: '' };
    }

    const payload = {
      ok: true,
      answer: parsed.answer || '',
      follow_up: parsed.follow_up || '',
      mentor: { answer: parsed.answer || '', follow_up: parsed.follow_up || '' }
    };

    // Cache result
    questionCache.set(question, payload);
    if (questionCache.size > MAX_CACHE) {
      const firstKey = questionCache.keys().next().value;
      questionCache.delete(firstKey);
    }

    return res.json(payload);
  } catch (err) {
    console.error('Mentor error:', err?.message || err);
    const isDev = process.env.NODE_ENV !== 'production';
    return res.status(500).json({
      ok: false,
      error: 'internal server error',
      ...(isDev ? { message: err?.message, stack: err?.stack } : {})
    });
  }
});

module.exports = router;
