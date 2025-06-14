require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

app.post('/generate-tool', async (req, res) => {
  const userNeed = req.body.need;

  if (!userNeed) {
    return res.status(400).json({ error: "Need is required." });
  }

  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1', // You can change to another supported model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI tool generator. Respond ONLY with valid HTML code including CSS and JS, wrapped in a single <html> tag.'
          },
          {
            role: 'user',
            content: `Create a complete standalone HTML + CSS + JS app for this request: ${userNeed}`
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

    console.log("Raw Together AI Response:", generatedCode); // Helpful for debugging

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
