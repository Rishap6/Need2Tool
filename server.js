require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

// ✨ Generate full tool
app.post('/generate-tool', async (req, res) => {
  const userNeed = req.body.need;

  if (!userNeed) {
    return res.status(400).json({ error: "Need is required." });
  }

  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          {
            role: 'system',
            content: 'You are a professional front-end web developer. Your job is to generate clean, responsive, and complete HTML+CSS+JavaScript apps inside a single <html> document. Only return code. No explanations, comments, or markdown.'
          },
          {
            role: 'user',
            content: `Generate a standalone web tool that fulfills this need: "${userNeed}". The tool must be functional, minimal, and browser-ready. Avoid backend code and keep it lightweight.`
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedCode = response.data.choices[0]?.message?.content;
    console.log("Raw Together AI Response:", generatedCode);

    if (generatedCode && generatedCode.includes("<html")) {
      res.json({ code: generatedCode });
    } else {
      res.json({ code: null });
    }
  } catch (err) {
    console.error("Together API Error:", err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate tool.' });
  }
});

// 🧠 Suggest prompt (Updated for beginner-friendly tools)
app.post('/suggest', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that gives beginner-friendly frontend project ideas.'
          },
          {
            role: 'user',
            content: `Suggest a fun, easy, and creative frontend tool idea that a beginner can build using only HTML, CSS, and JavaScript.
Avoid anything that involves APIs, AI, authentication, login systems, databases, or complex backend logic.`
          }
        ],
        temperature: 0.9
      },
      {
        headers: {
          'Authorization': `Bearer ${TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const idea = response.data.choices[0]?.message?.content?.trim();

    // 🛑 Block ideas with complex words
    const bannedWords = ['api', 'ai', 'authentication', 'login', 'database', 'backend'];
    const isTooHard = idea && bannedWords.some(word => idea.toLowerCase().includes(word));

    if (!idea || isTooHard) {
      return res.json({
        idea: "Build a simple theme switcher website where users can toggle between light and dark mode with smooth animations."
      });
    }

    console.log("Suggested idea:", idea);
    res.json({ idea });

  } catch (err) {
    console.error("Suggestion API Error:", err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to suggest idea.' });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});

