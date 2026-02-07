# Astra Digital Ocean Kurulum Rehberi

Astra uygulamasının arka plan sistemini (Backend) canlıya almak için aşağıdaki adımları sırasıyla uygulayın.

## Adım 1: Kodları GitHub'a Yükleyin
Digital Ocean, kodları GitHub hesabınızdan çeker.

1.  GitHub.com üzerinde yeni bir **Repository** (Depo) oluşturun (Örn: `astra-app`).
2.  Bilgisayarınızdaki proje klasöründe terminali açın ve şu komutları girin:
    ```bash
    git init
    git add .
    git commit -m "İlk kurulum"
    git branch -M main
    git remote add origin https://github.com/KULLANICI_ADINIZ/astra-app.git
    git push -u origin main
    ```

## Adım 2: Digital Ocean App Platform
1.  [Digital Ocean Paneline](https://cloud.digitalocean.com/apps) gidin.
2.  Sağ üstteki **Create App** butonuna tıklayın.
3.  **Service Provider** olarak **GitHub** seçeneğini seçin.
4.  Açılan listeden az önce oluşturduğunuz `astra-app` reposunu seçin ve **Next** deyin.

## Adım 3: Ayarlar (Önemli!)
Digital Ocean kodunuzu otomatik algılayacaktır. Ancak şu ayarları kontrol edin:

1.  **Resources:**
    *   Listede `backend` veya `Web Services` adında bir servis göreceksiniz. Yanındaki **Edit** (Kalem ikonu) butonuna basın.
    *   **Source Directory:** `/backend` olarak seçilmeli (Çünkü `server.js` orada).
2.  **Environment Variables:**
    *   Yine **Edit** menüsünde **Environment Variables** kısmını bulun.
    *   **Add Variable** diyerek şunları ekleyin:
        - **Key:** `GEMINI_API_KEY`
        - **Value:** `AIzaSyB...` (Google AI Studio'dan aldığınız anahtar)
    *   **Save** diyerek kaydedin.

## Adım 4: Başlatma (Deploy)
1.  **Next** diyerek ilerleyin.
2.  Plan seçimi ekranında **Basic** (veya deneme için Starter) planını seçin.
3.  En sonda **Create Resources** butonuna basarak kurulumu başlatın. (Bu işlem 2-3 dakika sürebilir).

## Adım 5: Bağlantıyı Yapma
Kurulum bittiğinde size `https://astra-app-xyz.ondigitalocean.app` gibi bir link verilecek.

1.  Bu linki kopyalayın.
2.  Bilgisayarınızda `app.js` dosyasını açın.
3.  `AstraAPI` bölümündeki URL kısmına yapıştırın:
    ```javascript
    // Örnek:
    const API_URL = "https://astra-app-xyz.ondigitalocean.app/api/generate-reading";
    ```

Artık uygulamanız Google üzerinden değil, kendi güvenli sunucunuz üzerinden çalışıyor! 🚀
