# Astra Digital Ocean Kolay Kurulum Rehberi (GÜNCELLENDİ)

Sistemi çok daha kolay kurulabilir hale getirdik. Artık backend klasörüyle uğraşmanıza gerek yok. Her şey ana dizinde.

1.  **Güncellemeleri Gönder (Astra V2):**
    Terminalden şu komutları gir:
    ```bash
    git add .
    git commit -m "Feat: Astra V2 - SQLite Database, Job Queue & Admin Dashboard"
    git push -u origin main
    ```

2.  **Digital Ocean Paneline Dön:**
    *   Commit attıktan sonra Digital Ocean otomatik olarak yeniden build almaya başlayacaktır. (Yeni paketler yüklenecek)
    *   **Activity** sekmesinden takibini yapabilirsin.
    *   Kurulum bitince "Live App" butonuna basarak güncel siteyi gör.

3.  **Yönetim Paneli (YENİ):**
    *   Adres: `https://senin-site-adresin.com/admin`
    *   Şifre: `admin123`
    *   Buradan kuyruktaki işleri ve analizleri takip edebilirsin.

4.  **Environment Variables (Unutma!):**
    *   Key: `GEMINI_API_KEY`
    *   Value: `AIzaSy...` (Senin kodun)

**Not:** `app.js` dosyasını `fetch('/api/generate-reading')` şeklinde güncelledim. Bu sayede site adresi ne olursa olsun (localhost veya digital ocean) otomatik uyum sağlar.
