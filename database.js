const Database = require('better-sqlite3');
const path = require('path');

// Use a file inside the container (or persistent volume needed for DO)
// For local dev, it creates astra.db in root
const dbPath = path.join(__dirname, 'astra.db');
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

    console.log("Database Schema Applied.");
}

module.exports = { db, initDb };
