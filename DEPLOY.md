# Astra Digital Ocean Kolay Kurulum Rehberi (GÜNCELLENDİ)

Sistemi çok daha kolay kurulabilir hale getirdik. Artık backend klasörüyle uğraşmanıza gerek yok. Her şey ana dizinde.

1.  **Güncellemeleri Gönder:**
    Terminalden şu komutları gir:
    ```bash
    git add .
    git commit -m "Full stack yapılandırması"
    git push -u origin main
    ```

2.  **Digital Ocean Paneline Dön:**
    Eğer az önceki kurulum başarısız olduysa veya "Static Site" olarak kaldıysa:
    *   O uygulamayı silip (Destroy) baştan "Create App" diyebilirsin.
    *   Repo'yu seçtiğinde bu sefer **Otomatik Olarak "Web Service"** algılayacak. (Çünkü `package.json` artık ana dizinde).
    
    veya mevcut ayarları şöyle güncelle:
    *   **Source Directory:** `/` (Kök dizin - Sadece "/" işareti)
    *   **Resource Type:** Eğer hala "Static Site" görünüyorsa, "Manage" diyip silebilir ve yerine "Web Service" ekleyebilirsin. Ancak en temizi silip baştan kurmaktır.

3.  **Environment Variables (Unutma!):**
    *   Key: `GEMINI_API_KEY`
    *   Value: `AIzaSyB...` (Senin kodun)

4.  **Bitti!**
    *   Verilen linke tıkladığında hem site açılacak hem de arka planda API çalışacak.

**Not:** `app.js` dosyasını `fetch('/api/generate-reading')` şeklinde güncelledim. Bu sayede site adresi ne olursa olsun (localhost veya digital ocean) otomatik uyum sağlar.
