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

        // Use Gemini 3 Pro Preview (Latest available model as of Feb 2026)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${process.env.GEMINI_API_KEY}`, {
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
            const errorText = await response.text();
            console.error("Gemini API Error Detail:", errorText);

            try {
                const errorJson = JSON.parse(errorText);
                return res.status(response.status).json(errorJson);
            } catch (e) {
                return res.status(response.status).json({ error: errorText });
            }
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
// --- GEMINI IMAGE GENERATION ENDPOINT ---
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "API Key not configured" });
        }

        // Gemini Image Generation Model
        // Using 'gemini-2.0-flash' which supports multimodal generation
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseModalities: ["IMAGE"]
                    // Note: If this fails, app.js will fallback to Pollinations.
                }
            })
        });

        if (!response.ok) {
            // Eğer Gemini Image çalışmazsa (404/403), frontend'e hata dön, frontend Pollinations'a düşsün.
            const err = await response.text();
            console.error("Gemini Image API Error:", err);
            return res.status(response.status).json({ error: "Gemini Image API Failed", details: err });
        }

        const data = await response.json();

        // Gemini Image Response Structure (Base64)
        if (data.candidates && data.candidates[0].content.parts[0].inlineData) {
            const base64Image = data.candidates[0].content.parts[0].inlineData.data;
            const mimeType = data.candidates[0].content.parts[0].inlineData.mimeType;
            return res.json({ imageUrl: `data:${mimeType};base64,${base64Image}` });
        } else {
            return res.status(500).json({ error: "No image data in response" });
        }

    } catch (error) {
        console.error('Image Gen Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
