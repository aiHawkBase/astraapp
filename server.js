const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from root

// --- ROUTES ---

// 1. Health Check
app.get('/api/health', (req, res) => {
    res.send('Astra API Server is running...');
});

// 2. Gemini Horoscope Generation
app.post('/api/generate-reading', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "API Key not configured" });
        }

        // Use Gemini 1.5 Pro for better reasoning and deeper astrological analysis
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Gemini API Error: ${error}`);
        }

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;

        // Clean markdown
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        res.json(JSON.parse(cleanedText));

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
