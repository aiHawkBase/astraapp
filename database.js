const Database = require('better-sqlite3');
const path = require('path');

// Use a file inside the container (or persistent volume needed for DO)
// For Digital Ocean App Platform (Ephemeral), strictly use /tmp or a bound volume
const dbPath = process.env.NODE_ENV === 'production'
    ? '/tmp/astra.db'
    : path.join(__dirname, 'astra.db');

console.log(`Using Database at: ${dbPath}`);
const db = new Database(dbPath, { verbose: console.log });

function initDb() {
    console.log("Initializing Astra V2 Database...");

    db.exec(`
        -- Users Table
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            birth_date TEXT,
            birth_time TEXT,
            birth_city TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Readings Table (Queue System)
        CREATE TABLE IF NOT EXISTS readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
            prompt TEXT,
            content_json TEXT, -- The full generated reading
            error_message TEXT,
            model_used TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );

        -- Invoices Table
        CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            amount REAL,
            currency TEXT DEFAULT 'TRY',
            status TEXT DEFAULT 'paid', -- paid, refunded
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );

        -- Settings Table (Dynamic Config)
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        );

        -- Seed Default Settings
        INSERT OR IGNORE INTO settings (key, value) VALUES ('price_standard', '299');
        INSERT OR IGNORE INTO settings (key, value) VALUES ('model_name', 'gemini-3-flash-preview');
        INSERT OR IGNORE INTO settings (key, value) VALUES ('job_timeout_ms', '60000');
    `);

    // --- MIGRATIONS (Auto-run) ---
    try { db.exec("ALTER TABLE readings ADD COLUMN user_email TEXT"); } catch (e) { }
    try { db.exec("ALTER TABLE readings ADD COLUMN api_cost REAL"); } catch (e) { }
    try { db.exec("ALTER TABLE readings ADD COLUMN prompt_full TEXT"); } catch (e) { }

    // --- Fortune Content Table (Dynamic Data) ---
    db.exec(`
        CREATE TABLE IF NOT EXISTS fortune_content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT,
            content TEXT,
            weight INTEGER DEFAULT 1
        );
    `);

    // Seed Data if empty
    const checkFortune = db.prepare("SELECT count(*) as count FROM fortune_content").get();
    if (checkFortune.count === 0) {
        console.log("Seeding Fortune Content...");
        const seeds = [
            // Intro
            { cat: 'intro', txt: "Yıldızların konumu senin için nadir bir kapıyı aralıyor." },
            { cat: 'intro', txt: "Kozmik enerjiler şu an senin lehine dönüyor." },
            { cat: 'intro', txt: "Evrenin derinliklerinden gelen bir fısıltı var..." },
            { cat: 'intro', txt: "Kadim öğretiler bu anın önemini vurguluyor." },
            { cat: 'intro', txt: "Ruhsal rehberlerin sana bir mesaj göndermek istiyor." },

            // Love Subjects
            { cat: 'love_subject', txt: "Kalbinin derinliklerinde sakladığın o kişi" },
            { cat: 'love_subject', txt: "Beklenmedik bir karşılaşma" },
            { cat: 'love_subject', txt: "Uzun zamandır haber almadığın biri" },
            { cat: 'love_subject', txt: "Geçmişten gelen bir gölge" },
            { cat: 'love_subject', txt: "Kaderindeki o gizemli yabancı" },

            // Love Actions
            { cat: 'love_action', txt: "sana doğru bir adım atmaya hazırlanıyor." },
            { cat: 'love_action', txt: "seni rüyalarında görüyor." },
            { cat: 'love_action', txt: "ismini bir yıldız gibi anıyor." },
            { cat: 'love_action', txt: "bir işaret bekliyor." },
            { cat: 'love_action', txt: "seninle kozmik bir bağ kurmaya çalışıyor." },

            // Career
            { cat: 'career', txt: "Yakın zamanda önüne çıkacak bir fırsat, tüm planlarını değiştirebilir." },
            { cat: 'career', txt: "Emeklerinin karşılığını almak üzeresin, sabrın meyve verecek." },
            { cat: 'career', txt: "Bir kapı kapanırken, çok daha büyük bir kapı aralanıyor." },

            // Cliffhangers (Hard Truths)
            { cat: 'teaser', txt: "{LETTER} harfiyle başlayan biri senin hakkında konuşuyor." },
            { cat: 'teaser', txt: "Ayın 14'ü ile 20'si arasında çok dikkatli olmalısın." },
            { cat: 'teaser', txt: "Şu an güvendiğin birinin maskesi düşmek üzere." },
            { cat: 'teaser', txt: "Gizli bir hayranın yakında kendini belli edecek." }
        ];

        const insert = db.prepare("INSERT INTO fortune_content (category, content) VALUES (?, ?)");
        seeds.forEach(s => insert.run(s.cat, s.txt));
    }

    console.log("Database Schema Applied & Migrated.");
}

module.exports = { db, initDb };
