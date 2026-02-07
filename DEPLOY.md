# Astra Digital Ocean Kolay Kurulum Rehberi (GÜNCELLENDİ)

Sistemi çok daha kolay kurulabilir hale getirdik. Artık backend klasörüyle uğraşmanıza gerek yok. Her şey ana dizinde.

1.  **Güncellemeleri Gönder:**
    Terminalden şu komutları gir:
    ```bash
    git add .
    git commit -m "API model fix ve UI guncellemesi"
    git push -u origin main
    ```

2.  **Digital Ocean Paneline Dön:**
    *   Commit attıktan sonra Digital Ocean otomatik olarak yeniden build almaya başlayacaktır.
    *   **Activity** sekmesinden takibini yapabilirsin.
    *   Kurulum bitince "Live App" butonuna basarak güncel siteyi gör.

3.  **Environment Variables (Unutma!):**
    *   Key: `GEMINI_API_KEY`
    *   Value: `AIzaSyB...` (Senin kodun)

4.  **Bitti!**
    *   Verilen linke tıkladığında hem site açılacak hem de arka planda API çalışacak.

**Not:** `app.js` dosyasını `fetch('/api/generate-reading')` şeklinde güncelledim. Bu sayede site adresi ne olursa olsun (localhost veya digital ocean) otomatik uyum sağlar.
