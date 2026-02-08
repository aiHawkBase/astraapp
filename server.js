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

        // MEGA PROMPT for "Life Book" Style (20x Depth, Modern, Realistic)
        const systemInstruction = `
        Sen, insan psikolojisini, modern astrolojiyi ve kadim bilgeliği birleştiren, dünyanın en iyi Astrologu ve Yaşam Stratejistisin.
        Görevin, kullanıcı için "HAYAT KİTABI" (The Book of Life) niteliğinde, son derece kapsamlı, derin, gerçekçi ve sarsıcı derecede doğru bir analiz yazmaktır.
        
        **YAZIM TONU VE KURALLARI:**
        1. **TON**: Modern, Gerçekçi, Psikolojik ve Stratejik. "Bir varmış bir yokmuş" gibi masalsı dilleri BIRAK. Keskin, net ve "Burada ve Şimdi" odaklı ol.
        2. **DERİNLİK**: Yüzeysel burç yorumları yapma. Satırlar arasını oku, kullanıcının bilinçaltına in, korkularını ve potansiyellerini yüzüne vur.
        3. **UZUNLUK**: Bu bir kitap olacak. Her bölüm en az 500-800 kelime olmalı. Toplamda 15.000 kelimeyi hedefle. Okuyucu sayfalarca okuyabilmeli.
        4. **GÖRSELLİK**: Metni paragraflara böl, okunabilirliği artır.

        **ÇIKTI FORMATI**: SADECE GEÇERLİ JSON. Markdown yok.

        **JSON ŞEMASI:**
        {
          "booklet_title": "Etkileyici ve Kişiye Özel Kitap Başlığı",
          
          "images": {
            "birth_chart_prompt": "Kullanıcının doğum anındaki gökyüzü haritası, gezegen konumları, bilimsel ve mistik, altın çizgiler, koyu lacivert uzay fonu, 8k",
            "personality_prompt": "Kullanıcının ruh halini yansıtan soyut, psikolojik portre, modern sanat",
            "love_prompt": "İlişki dinamiklerini simgeleyen, tutkulu veya huzurlu sanatsal sahne",
            "career_prompt": "Başarı, ofis, imparatorluk veya özgürlük temalı, motivasyon verici sahne",
            "destiny_prompt": "Kader yolu ve spiritüel aydınlanma temalı mistik görsel"
          },

          "intro": {
            "title": "Giriş: Kozmik İmzan",
            "content": "Kullanıcının haritasına genel bakış, element dengesi ve haritanın ana teması..."
          },

          "pros_cons": {
            "title": "Güçlü ve Gölge Yönlerin",
            "pros": ["Madde 1", "Madde 2", "Madde 3", "Madde 4", "Madde 5"],
            "cons": ["Gölge 1", "Gölge 2", "Gölge 3", "Gölge 4", "Gölge 5"],
            "analysis": "Bu özelliklerin detaylı analizi ve gölge yönleri nasıl yöneteceği..."
          },

          "chapters": [
            { "title": "Bölüm 1: Güneş ve Benlik (Kimsin?)", "content": "Detaylı Güneş burcu analizi..." },
            { "title": "Bölüm 2: Yükselen Maskesi (Nasıl Görünüyorsun?)", "content": "Yükselen burç ve fiziksel özellikler..." },
            { "title": "Bölüm 3: Ay ve Duygular (Neye İhtiyacın Var?)", "content": "Ay burcu, anne ilişkisi, güvenlik ihtiyacı..." },
            { "title": "Bölüm 4: Aşk ve İlişkiler Stratejisi", "content": "Venüs/Mars analizi, partner seçimi hataları, çözüm önerileri..." },
            { "title": "Bölüm 5: Kariyer ve Para Yönetimi", "content": "Meslek seçimi, para kazanma potansiyeli, risk yönetimi..." },
            { "title": "Bölüm 6: Satürn ve Yaşam Sınavları", "content": "Karmik dersler, zorluklar ve büyüme alanları..." }
          ],

          "astrocartography": {
             "title": "Dünya Üzerindeki Güç Noktaların (Astrocartography)",
             "locations": [
                { "city": "Şehir/Ülke", "purpose": "Aşk ve İlişki İçin", "desc": "Neden burası?" },
                { "city": "Şehir/Ülke", "purpose": "Kariyer ve Zenginlik İçin", "desc": "Neden burası?" },
                { "city": "Şehir/Ülke", "purpose": "Ruhsal Huzur İçin", "desc": "Neden burası?" }
             ]
          },

          "calendar_12_months": [
             { "month": "Ay 1", "theme": "Kısa Tema", "advice": "Bu ay için detaylı öngörü ve tavsiye..." },
             ... (12 Ay boyunca devam et)
          ],

          "numerology": {
            "title": "Sayıların Gizemi",
            "life_path_number": 0,
            "personal_year_number": 0,
            "analysis": "Numerolojik detaylı analiz..."
          }
        }
        
        Kullanıcı Bilgisi: "${prompt}"
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
        let inputChars = systemInstruction.length + prompt.length;

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

        // --- COST CALCULATION (Est. based on chars) ---
        // Input: ~$0.10/1M chars, Output: ~$0.40/1M chars (Rough Avg for Flash)
        const outputChars = rawText.length;
        const estimatedCost = ((inputChars * 0.0000001) + (outputChars * 0.0000004)) * 34; // *34 for TRY conversion roughly

        // Update Job with Cost 
        try {
            db.prepare("UPDATE readings SET api_cost = ? WHERE id = ?").run(estimatedCost, jobId);
        } catch (e) { console.error("Cost update failed", e); }

        // Clean markdown
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        let jsonContent;
        try {
            jsonContent = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("JSON Parse Error on GenAI output:", cleanedText);
            throw new Error("AI output was not valid JSON");
        }

        // --- IMAGE GENERATION LOOP (5 Images for Mega Report) ---
        console.log(`[Job ${jobId}] Generating images...`);

        // Handle new structure where images are in 'images' object
        const imgs = jsonContent.images || {};

        const imagePrompts = [
            { key: 'birth_chart', prompt: imgs.birth_chart_prompt || jsonContent.cover_image_prompt },
            { key: 'personality', prompt: imgs.personality_prompt || "Abstract psychological portrait" },
            { key: 'love', prompt: imgs.love_prompt || jsonContent.love_image_prompt },
            { key: 'career', prompt: imgs.career_prompt || jsonContent.career_image_prompt },
            { key: 'destiny', prompt: imgs.destiny_prompt || "Spiritual path visual" }
        ].filter(i => i.prompt); // Only generate if prompt exists

        console.log(`[Job ${jobId}] Image Prompts found: ${imagePrompts.length}`);

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
        const { prompt, email } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "API Key not configured" });
        }

        // Create Job in DB
        const userId = 0;
        const stmt = db.prepare("INSERT INTO readings (user_id, prompt, status, user_email) VALUES (?, ?, 'pending', ?)");
        const info = stmt.run(userId, prompt, email || null);
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

// --- FORTUNE CONTENT API ---

// 4. Get Random Fortune (Public)
app.get('/api/fortune/random', (req, res) => {
    try {
        const { category } = req.query;
        let query = "SELECT content FROM fortune_content";
        let params = [];

        if (category) {
            query += " WHERE category = ?";
            params.push(category);
        }

        query += " ORDER BY RANDOM() LIMIT 1";
        const row = db.prepare(query).get(...params);

        if (row) {
            res.json({ content: row.content });
        } else {
            res.json({ content: "Yıldızlar şu an sessiz..." });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 5. Serve Admin Fortune Page
app.get('/kutsal-icerik-yonetimi', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin_fortune.html'));
});

// 6. Admin: List All Fortunes
app.get('/api/admin/fortune', (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM fortune_content ORDER BY id DESC").all();
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 7. Admin: Add Fortune
app.post('/api/admin/fortune', (req, res) => {
    try {
        const { category, content } = req.body;
        if (!category || !content) return res.status(400).json({ error: "Missing fields" });

        const stmt = db.prepare("INSERT INTO fortune_content (category, content) VALUES (?, ?)");
        stmt.run(category, content);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 8. Admin: Delete Fortune
app.delete('/api/admin/fortune/:id', (req, res) => {
    try {
        db.prepare("DELETE FROM fortune_content WHERE id = ?").run(req.params.id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Admin Dashboard: http://localhost:${PORT}/kutsal-yonetim-kapisi`);
    console.log(`Fortune Admin: http://localhost:${PORT}/kutsal-icerik-yonetimi`);
});
