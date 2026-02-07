const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

const { db, initDb } = require('./database');

// Initialize Database
initDb();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from root

// --- JOB QUEUE PROCESSOR ---
async function processReadingJob(jobId, prompt) {
    console.log(`[Job ${jobId}] Processing started...`);
    try {
        db.prepare("UPDATE readings SET status = 'processing', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(jobId);

        // Use Dynamic Model from DB Settings (Admin Panel)
        let modelToUse = 'gemini-3-flash-preview'; // Default
        try {
            const setting = db.prepare("SELECT value FROM settings WHERE key = 'model_name'").get();
            if (setting) modelToUse = setting.value;
        } catch (e) { console.warn("Model setting read failed, using default"); }

        console.log(`[Job ${jobId}] Using Model: ${modelToUse}`);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error: ${errorText}`);
        }

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        // Clean markdown
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        // Validation
        JSON.parse(cleanedText); // Ensure it's valid JSON

        // Complete Job
        db.prepare("UPDATE readings SET status = 'completed', content_json = ?, model_used = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(cleanedText, modelToUse, jobId);
        console.log(`[Job ${jobId}] Completed successfully.`);

    } catch (error) {
        console.error(`[Job ${jobId}] Failed:`, error.message);
        db.prepare("UPDATE readings SET status = 'failed', error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(error.message, jobId);
    }
}

// --- ROUTES ---

app.get('/api/health', (req, res) => {
    res.send('Astra V2 API (DB Connected) is running...');
});

// 2. Async Horoscope Generation (Queue)
app.post('/api/generate-reading', (req, res) => {
    try {
        const { prompt } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "API Key not configured" });
        }

        // Create Job in DB
        // For V2, we assume anonymous user (id=0) or we can implement user tracking later
        const userId = 0;
        const stmt = db.prepare("INSERT INTO readings (user_id, prompt, status) VALUES (?, ?, 'pending')");
        const info = stmt.run(userId, prompt);
        const jobId = info.lastInsertRowid;

        // Trigger Async Processing (Fire & Forget)
        // In a production serverless env, this might need a real queue (Redis/RabbitMQ),
        // but for a persistent Node process (DO App), this works.
        processReadingJob(jobId, prompt);

        // Return Job ID immediately
        res.json({ jobId: jobId, status: 'pending', message: 'Analysis queued.' });

    } catch (error) {
        console.error('Queue Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 3. Check Job Status (Polling Endpoint)
app.get('/api/jobs/:id', (req, res) => {
    try {
        const job = db.prepare("SELECT * FROM readings WHERE id = ?").get(req.params.id);

        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        let response = {
            jobId: job.id,
            status: job.status,
            updated_at: job.updated_at
        };

        if (job.status === 'completed') {
            response.data = JSON.parse(job.content_json);
        } else if (job.status === 'failed') {
            response.error = job.error_message;
        }

        res.json(response);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
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

// --- ADMIN ROUTES ---

// 1. Serve Admin Dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// 2. List All Jobs (Latest First)
app.get('/api/admin/jobs', (req, res) => {
    try {
        const jobs = db.prepare("SELECT * FROM readings ORDER BY id DESC LIMIT 50").all();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Update Config (Settings)
app.post('/api/admin/config', (req, res) => {
    try {
        const { key, value } = req.body;
        db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(key, value);
        res.json({ success: true, message: "Setting updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Admin Dashboard: http://localhost:${PORT}/admin`);
});
