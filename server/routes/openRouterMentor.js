// const express = require('express');
// const router = express.Router();
// const fetch = require('node-fetch');

// const questionCache = new Map();
// const MAX_CACHE = 100;

// router.post('/', async (req, res) => {
//   try {
//     const { question } = req.body || {};
//     if (!question || typeof question !== 'string' || question.trim() === '') {
//       return res.status(400).json({ ok: false, error: 'question is required' });
//     }

//     // Check cache
//     if (questionCache.has(question)) {
//       return res.json(questionCache.get(question));
//     }

//     const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
//     const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o';
//     const APP_URL = process.env.APP_URL || 'https://mindforge.app';

//     if (!OPENROUTER_API_KEY) {
//       return res.status(500).json({ ok: false, error: 'OpenRouter API key not set' });
//     }

//     const systemPrompt = `You are ForgeAI — a concise, friendly academic assistant for the MindForge e-learning platform.
// Respond ONLY with valid JSON in this format:
// {"answer":"short, clear explanation","follow_up":"optional brief tip or next question"}
// Do NOT include markdown or extra text.`;

//     const body = {
//       model: OPENROUTER_MODEL,
//       messages: [
//         { role: 'system', content: systemPrompt },
//         { role: 'user', content: question },
//       ],
//     };

//     const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//         'HTTP-Referer': APP_URL,
//         'X-Title': 'MindForge',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await response.json();

//     if (!response.ok || !data?.choices?.[0]?.message?.content) {
//       return res.status(502).json({
//         ok: false,
//         error: 'AI model unavailable',
//         details: data || {},
//       });
//     }

//     let text = data.choices[0].message.content.trim();

//     // Safely extract JSON
//     function extractJson(input) {
//       if (!input) return '';
//       const trimmed = String(input).trim();
//       const codeFence = trimmed.match(/```[a-zA-Z]*\n([\s\S]*?)```/);
//       const candidate = codeFence ? codeFence[1] : trimmed;
//       const start = candidate.indexOf('{');
//       const end = candidate.lastIndexOf('}');
//       if (start !== -1 && end !== -1 && end > start) return candidate.slice(start, end + 1);
//       return candidate;
//     }

//     const jsonString = extractJson(text);
//     let parsed;
//     try {
//       parsed = JSON.parse(jsonString);
//     } catch {
//       parsed = { answer: text || 'Sorry, no valid response.', follow_up: '' };
//     }

//     const payload = {
//       ok: true,
//       answer: parsed.answer || '',
//       follow_up: parsed.follow_up || '',
//       mentor: { answer: parsed.answer || '', follow_up: parsed.follow_up || '' },
//     };

//     // Cache
//     questionCache.set(question, payload);
//     if (questionCache.size > MAX_CACHE) {
//       const firstKey = questionCache.keys().next().value;
//       questionCache.delete(firstKey);
//     }

//     return res.json(payload);
//   } catch (err) {
//     console.error('ForgeAI error:', err?.message || err);
//     const isDev = process.env.NODE_ENV !== 'production';
//     return res.status(500).json({
//       ok: false,
//       error: 'internal server error',
//       ...(isDev ? { message: err?.message, stack: err?.stack } : {}),
//     });
//   }
// });

// module.exports = router;
// server/routes/mentor.js
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const questionCache = new Map();
const MAX_CACHE = 100;

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.SITE_URL || 'https://mindforge-app-six.vercel.app',
    'X-Title': process.env.SITE_NAME || 'MindForge E-Learning',
  },
});

router.post('/', async (req, res) => {
  try {
    const { question } = req.body || {};
    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ ok: false, error: 'question is required' });
    }

    // return cached response
    if (questionCache.has(question)) {
      return res.json(questionCache.get(question));
    }

    const MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free';
    const FALLBACK_MODEL = process.env.OPENROUTER_FALLBACK_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';

    const systemPrompt = `You are ForgeAI — a concise, friendly academic mentor for students.
When given a question, reply ONLY with valid JSON:
{"answer":"...","follow_up":"optional short suggestion"}
Keep answers short, clear, and educational.`;

    let responseText = '';
    const tried = [];

    async function askModel(modelName) {
      const completion = await openai.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
      });
      tried.push(modelName);
      return completion.choices?.[0]?.message?.content || '';
    }

    try {
      responseText = await askModel(MODEL);
    } catch (err) {
      console.warn(`Primary model ${MODEL} failed:`, err.message);
      try {
        responseText = await askModel(FALLBACK_MODEL);
      } catch (err2) {
        console.warn(`Fallback model ${FALLBACK_MODEL} failed:`, err2.message);
      }
    }

    if (!responseText) {
      return res.status(502).json({ ok: false, error: 'AI model unavailable', tried });
    }

    // safe JSON extraction
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

    const jsonString = extractJson(responseText);
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      parsed = { answer: responseText || 'Sorry, no valid response.', follow_up: '' };
    }

    const result = {
      ok: true,
      answer: parsed.answer || '',
      follow_up: parsed.follow_up || '',
      mentor: { answer: parsed.answer || '', follow_up: parsed.follow_up || '' },
      model_used: tried,
    };

    // cache result
    questionCache.set(question, result);
    if (questionCache.size > MAX_CACHE) {
      const firstKey = questionCache.keys().next().value;
      questionCache.delete(firstKey);
    }

    return res.json(result);
  } catch (err) {
    console.error('ForgeAI error:', err?.message || err);
    const isDev = process.env.NODE_ENV !== 'production';
    return res.status(500).json({
      ok: false,
      error: 'internal server error',
      ...(isDev ? { message: err?.message, stack: err?.stack } : {}),
    });
  }
});

module.exports = router;
