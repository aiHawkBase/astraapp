const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

const { db, initDb } = require('./database');

// Initialize Database
// Initialize Database
initDb();

// Ensure Default User (ID 0) Exists for Anonymous Readings
try {
    const defaultUser = db.prepare("SELECT id FROM users WHERE id = 0").get();
    if (!defaultUser) {
        console.log("Creating default anonymous user (ID 0)...");
        db.prepare("INSERT INTO users (id, name, email) VALUES (0, 'Anonymous', 'anon@astra.app')").run();
    }
} catch (error) {
    console.error("Error creating default user:", error);
}

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

        // Initialize GoogleGenAI Client
        const { GoogleGenAI } = require("@google/genai");
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Enhanced Prompt for Booklet Style & 3 Images
        const systemInstruction = `
        Sen mistik, derin ve bilge bir astrologsun. Kullanıcı için "Astra Kozmik Kitapçığı" (Astra Cosmic Booklet) adında çok kapsamlı, 
        kitap uzunluğunda (en az 2000 kelime), derinlemesine bir analiz raporu hazırlayacaksın.
        
        Çıktı FORMATI kesinlikle geçerli bir JSON olmalıdır. Markdown blokları kullanma ("\`\`\`json" ekleme).
        
        JSON Şeması:
        {
          "booklet_title": "Kullanıcıya Özel Başlık",
          "cover_image_prompt": "Astra mistik temalı, kullanıcıyı temsil eden, yüksek kaliteli, 4k, cinematic prompt",
          "love_image_prompt": "Kullanıcının aşk hayatını simgeleyen, romantik ve mistik, tarot tarzı prompt",
          "career_image_prompt": "Kullanıcının kariyer ve finans yolunu simgeleyen, altın ve zenginlik temalı prompt",
          "chapters": [
            {
              "title": "Bölüm Başlığı (Örn: Kozmik Kimlik)",
              "content": "Uzun paragraf içeriği..."
            },
            ... (En az 7 bölüm, Bölüm 7 özellikle Numeroloji ve Kader üzerine olmalı)
          ],
          "numerology": {
            "life_path_number": 6,
            "analysis": "Numeroloji analizi detaylı..."
          }
        }
        
        İçerik Gereksinimleri:
        1. **Uzunluk ve Derinlik**: Her bölüm en az 300 kelime olmalı. Sanki bir kitap okuyormuş hissi ver. Şiirsel ve profesyonel bir dil kullan.
        2. **Numeroloji**: Sadece sayı verme. Bu sayının yönetici gezegenini, elementini, önceki yaşam karmasını ve bu hayattaki "Dharma"sını (Görevini) anlat.
        3. **Görsel Tasvirleri (Prompts)**: 
           - Kapak Resmi: Mistik, yıldızlar, kullanıcının burcu.
           - Aşk Resmi: Pembe/Mor tonlar, kupa ası teması, ruh eşi silüeti.
           - Kariyer Resmi: Altın/Yeşil tonlar, pentagram tılsımı, bereket kapısı.
        
        Kullanıcı Girdisi: "${prompt}"
        `;

        const response = await ai.models.generateContent({
            model: modelToUse,
            contents: systemInstruction,
            config: {
                responseMimeType: 'application/json'
            }
        });

        // SDK V2 Handling
        let rawText = "";

        // If response has a text function, use it
        if (typeof response.text === 'function') {
            rawText = response.text();
        } else if (response.response && typeof response.response.text === 'function') {
            // Some versions nest the response
            rawText = response.response.text();
        } else if (response.candidates && response.candidates[0] && response.candidates[0].content) {
            // Fallback: manual extraction
            rawText = response.candidates[0].content.parts.map(p => p.text).join('');
        } else {
            throw new Error("Unexpected response format from Gemini API");
        }

        // Clean markdown
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        let jsonContent;
        try {
            jsonContent = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("JSON Parse Error on GenAI output:", cleanedText);
            throw new Error("AI output was not valid JSON");
        }

        // --- IMAGE GENERATION LOOP (3 Images) ---
        console.log(`[Job ${jobId}] Generating images...`);
        const imagePrompts = [
            { key: 'cover', prompt: jsonContent.cover_image_prompt },
            { key: 'love', prompt: jsonContent.love_image_prompt },
            { key: 'career', prompt: jsonContent.career_image_prompt }
        ];

        const generatedImages = {};

        // Helper function for image gen
        const generateImage = async (p) => {
            if (!p) return null;
            try {
                // Use Nano Banana (gemini-2.5-flash-image)
                const imgRes = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: p,
                    config: { responseModalities: ['IMAGE'] }
                });

                const candidates = imgRes.candidates;
                if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
                    for (const part of candidates[0].content.parts) {
                        if (part.inlineData) {
                            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                        }
                    }
                }
            } catch (e) {
                console.warn(`Image gen failed for prompt: ${p.substring(0, 20)}... Error: ${e.message}`);
                return null;
            }
            return null;
        };

        // Parallel Execution
        const imageResults = await Promise.all(imagePrompts.map(async (item) => {
            const url = await generateImage(item.prompt);
            return { key: item.key, url: url };
        }));

        // Map results back to object
        imageResults.forEach(res => { generatedImages[res.key] = res.url; });

        // Add images to JSON content to store cleanly
        jsonContent.images = generatedImages;

        // Complete Job
        db.prepare("UPDATE readings SET status = 'completed', content_json = ?, model_used = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(JSON.stringify(jsonContent), modelToUse, jobId);
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

        // Initialize GoogleGenAI Client
        const { GoogleGenAI } = require("@google/genai");
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        try {
            // Attempt to use Gemini 2.5 Flash Image (Nano Banana)
            // Model: gemini-2.5-flash-image
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: prompt
            });

            // Inspect response for image data
            const candidates = response.candidates;
            if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
                for (const part of candidates[0].content.parts) {
                    if (part.inlineData) {
                        return res.json({ imageUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` });
                    }
                }
            }

            console.warn("Gemini Image Gen: No image data found in response.");

        } catch (genError) {
            console.warn("Gemini Image Gen Failed (Using Fallback):", genError.message);
        }

        // Fallback: Return null so frontend uses Pollinations
        res.json({ imageUrl: null });

    } catch (error) {
        console.error('Image Gen Error:', error);
        res.json({ imageUrl: null, error: error.message });
    }
});

// --- ADMIN ROUTES ---

// 1. Serve Admin Dashboard (Obscure Path)
app.get('/kutsal-yonetim-kapisi', (req, res) => {
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
    console.log(`Admin Dashboard: http://localhost:${PORT}/kutsal-yonetim-kapisi`);
});
