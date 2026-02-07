document.addEventListener('DOMContentLoaded', () => {

    // --- GÜVENLİK KONTROLÜ ---
    if (typeof astroData === 'undefined' || typeof locationData === 'undefined') {
        console.error("Veri dosyaları (data.js veya locations.js) yüklenemedi.");
        alert("Sistem yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
        return;
    }

    // --- STATE (Durum Yönetimi) ---
    let user = {
        name: '',
        birthDate: null,
        birthTime: '',
        city: '',
        district: '',
        sign: '',
        element: '',
        elementKey: '',
        apiResult: null // API'den gelen JSON buraya kaydedilecek
    };

    // --- ASTRA API SERVICE (MOCK / READY FOR GEMINI) ---
    const AstraAPI = {
        // API Key artık sistemde (Backend) kayıtlıdır. Frontend'de saklanmaz.

        async generateReading(userProfile) {
            console.log("Gemini API'ye bağlanılıyor...", userProfile);

            // 1. Prompt Hazırlığı (ZENGİNLEŞTİRİLMİŞ İÇERİK)
            const prompt = `
            Sen dünyanın en ünlü ve sezgileri en kuvvetli astrologususun. Kullanıcı için hayatını değiştirecek derinlikte, 12 sayfalık bir kitap olabilecek kadar detaylı bir astroloji ve numeroloji analizi yap.
            
            KULLANICI BİLGİLERİ:
            İsim: ${userProfile.name}
            Doğum Tarihi: ${userProfile.birthDate}
            Doğum Saati: ${userProfile.birthTime}
            Doğum Yeri: ${userProfile.city}, ${userProfile.district}
            Burç: ${userProfile.sign} (Fiziksel Özellikler ve Karakter)
            Element: ${userProfile.element}

            İSTENEN JSON FORMATI (Sadece bu JSON'ı döndür, markdown kullanma):
            {
                "user_profile": {
                    "sun_sign": "Güneş Burcu (Örnek: Koç - Öncü Ateş)",
                    "rising_sign": "Yükselen Burcu (Tahmini ve detayı)",
                    "moon_sign": "Ay Burcu (Tahmini ve duygusal analizi)",
                    "life_path_number": "Hayat Yolu Sayısı (Numeroloji hesapla)",
                    "spirit_animal": "Ruh Hayvanı (Metaforik)"
                },
                "short_readings": {
                    "hook_1": "Kullanıcıyı şaşırtacak, ismine ve burcuna özel kısa, vurucu, gizemli bir cümle.",
                    "current_vibe": "Şu anki gökyüzü transitlerine göre kullanıcının hissettiği ruh hali (Satürn baskısı, Jüpiter şansı vb.).",
                    "mystery_alert": "Gelecek 6 ay içinde olması muhtemel DEVRİM niteliğinde bir olay uyarısı."
                },
                "full_report": {
                    "intro": "Kullanıcıya ismen hitap eden, destansı bir giriş yazısı.",
                    "chapter_1_identity": "GÜNEŞ BURCU: Egonun, yaşam enerjin ve dünyadaki duruşun üzerine derin analiz.",
                    "chapter_2_mask": "YÜKSELEN BURCU (ASC): Başkalarının seni nasıl gördüğü ve takındığın sosyal maske.",
                    "chapter_3_emotion": "AY BURCU: Bilinçaltın, annelik figürü algın ve duygusal ihtiyaçların.",
                    "chapter_4_love": "AŞK VE İLİŞKİLER (Venüs/Mars): İdeal eş tanımı, ilişkilerdeki tekrar eden hataların ve çözüm yolları.",
                    "chapter_5_karma": "SATÜRN VE KARMA: Bu hayattaki en büyük sınavın ne? Geçmiş yaşamdan getirdiğin borçlar.",
                    "chapter_6_career": "KARİYER VE PARA (MC/Jüpiter): En uygun meslekler, zenginlik potansiyeli ve başarı tüyoları.",
                    "chapter_7_numerology": "NUMEROLOJİ ANALİZİ: Hayat Yolu Sayısı'nın anlamı, kader yılı hesaplaması.",
                    "chapter_8_forecast_q1": "ÖNÜMÜZDEKİ 3 AY (Çeyrek 1): Detaylı öngörüler, kritik tarihler.",
                    "chapter_9_forecast_q2": "SONRAKİ 3 AY (Çeyrek 2): Beklenen fırsatlar ve riskler.",
                    "chapter_10_ritual": "KİŞİSEL RİTÜEL: Kullanıcının enerjisini yükseltmek için yapması gereken basit bir ritüel (doğal taş, meditasyon vb.)"
                },
                "image_prompts": [
                    "Kullanıcının burcunu ve elementini simgeleyen, altın detaylı, mistik tarot kartı (Cover)",
                    "Kullanıcının ruh hayvanını temsil eden spiritüel sanat eseri (Spirit)",
                    "Kullanıcının aşk hayatını simgeleyen iki gezegenin dansı, romantik ve kozmik (Love)",
                    "Kullanıcının kariyer yolunu aydınlatan altın bir kapı ve merdivenler (Career)",
                    "Kullanıcının karmasını temsil eden antik bir kum saati ve yıldızlar (Karma)"
                ]
            }
            `;

            // 2. API İsteği (Artık Kuyruk Sistemi - Job Queue)
            try {
                // V2: Önce Job ID al
                console.log("Job Talebi Gönderiliyor...");
                const initRes = await fetch('/api/generate-reading', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt })
                });

                if (!initRes.ok) throw new Error(`API Başlatma Hatası: ${initRes.status}`);

                const initData = await initRes.json();
                const jobId = initData.jobId;

                if (!jobId) {
                    // Fallback (Eski usül ani yanıt döndüyse)
                    if (initData.full_report) return initData;
                    throw new Error("Job ID alınamadı.");
                }

                console.log(`Job Başlatıldı: ${jobId}. Bekleniyor...`);

                // 3. Polling (Durum Sorgulama)
                let pollResult = null;
                let attempts = 0;
                const MAX_ATTEMPTS = 60; // 2 dk timeout (2s x 60)

                while (!pollResult && attempts < MAX_ATTEMPTS) {
                    attempts++;
                    await new Promise(r => setTimeout(r, 2000)); // 2 saniye bekle

                    const pollRes = await fetch(`/api/jobs/${jobId}`);
                    if (pollRes.ok) {
                        const pollData = await pollRes.json();
                        console.log(`Job Durumu (${jobId}):`, pollData.status);

                        if (pollData.status === 'completed') {
                            pollResult = pollData.data; // Sonuç hazır!
                        } else if (pollData.status === 'failed') {
                            throw new Error(pollData.error || "Analiz başarısız oldu.");
                        }
                    }
                }

                if (!pollResult) throw new Error("Zaman aşımı! Analiz çok uzun sürdü.");

                return pollResult; // Tamamlanan veri

            } catch (error) {
                console.error("Gemini API (Queue) Hatası:", error);

                // FALLBACK DATA (API Çalışmazsa Kullanıcıyı Mağdur Etme)
                return {
                    user_profile: {
                        sun_sign: userProfile.sign,
                        rising_sign: "Hesaplanıyor...",
                        moon_sign: "Hesaplanıyor...",
                        life_path_number: 1,
                        spirit_animal: "Anka Kuşu"
                    },
                    short_readings: {
                        hook_1: "Evrenin enerjisi şu an çok yoğun, detaylar netleşiyor.",
                        current_vibe: "Geçiş dönemi sancılı olabilir.",
                        mystery_alert: "Büyük bir fırsat kapıda."
                    },
                    full_report: {
                        intro: "Yıldızlar bazen sislerin ardına gizlenir... Ancak senin ışığın hala parlıyor.",
                        chapter_1_identity: "Güneş burcun senin özünü temsil eder. Sen güçlü bir karaktere sahipsin.",
                        chapter_2_mask: "Yükselen burcun, dünyaya taktığın maskeyi gösterir.",
                        chapter_3_emotion: "Ay burcun, duygusal derinliğini yansıtır.",
                        chapter_4_love: "Aşk hayatında tutku ve sadakat arıyorsun.",
                        chapter_5_karma: "Geçmişten getirdiğin yüklerden arınma vakti.",
                        chapter_6_career: "Yeteneklerini doğru kullanırsan başarı kaçınılmaz.",
                        chapter_7_numerology: "Hayat Yolu Sayın sana rehberlik edecek.",
                        chapter_8_forecast_q1: "Önümüzdeki 3 ay planlama zamanı.",
                        chapter_9_forecast_q2: "Sonraki 3 ay hasat zamanı.",
                        chapter_10_ritual: "Her sabah 5 dakika meditasyon yap."
                    },
                    image_prompts: ["mystical zodiac art", "tarot card justice", "cosmic love", "golden career ladder", "karma wheel"]
                };
            }
        },

        async generateImage(prompt) {
            console.log("Görsel üretiliyor:", prompt);
            // Pollinations.ai için "Pro" seviyesinde detaylı prompt zenginleştirme
            const refinedPrompt = `${prompt}, mystical tarot card style, cinematic lighting, 8k resolution, highly detailed, gold accents, ethereal atmosphere, digital art, masterpiece`;
            const encodedPrompt = encodeURIComponent(refinedPrompt);

            // Seed ekleyerek her seferinde farklı varyasyon gelmesini sağlıyoruz
            const seed = Math.floor(Math.random() * 99999);
            const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=800&height=1024&seed=${seed}&model=flux`; // Flux modeli daha kaliteli
            return imageUrl;
        }
    };

    // --- MASCOT CONTROLLER ---
    const Mascot = {
        elContainer: document.getElementById('mascot-container'),
        elBubble: document.getElementById('mascot-text'),
        timer: null,

        init() {
            this.elContainer.classList.remove('hidden');
            setTimeout(() => this.say("Merhaba! Ben Astra. Ruhunun derinliklerine inmeye hazır mısın?", 5000), 1000);
        },

        say(text, duration = 4000) {
            this.elBubble.textContent = text;
            this.elBubble.classList.add('show');
            this.elBubble.classList.remove('hidden');

            if (this.timer) clearTimeout(this.timer);

            if (duration > 0) {
                this.timer = setTimeout(() => {
                    this.hide();
                }, duration);
            }
        },

        hide() {
            this.elBubble.classList.remove('show');
        }
    };

    // --- DOM Elements ---
    const steps = {
        landing: document.getElementById('landing-page'),
        s1: document.getElementById('step-1'),
        t1: document.getElementById('step-teaser-1'),
        s2: document.getElementById('step-2'),
        t2: document.getElementById('step-teaser-2'),
        pay: document.getElementById('step-payment'),
        succ: document.getElementById('step-success'),
        report: document.getElementById('report-view')
    };

    const forms = {
        basic: document.getElementById('form-basic'),
        advanced: document.getElementById('form-advanced'),
        payment: document.getElementById('form-payment')
    };

    const citySelect = document.getElementById('birthCity');
    const districtSelect = document.getElementById('birthDistrict');

    // --- INIT ---
    Mascot.init();

    // LANDING PAGE ACTIONS
    document.getElementById('btn-start').addEventListener('click', () => {
        switchStep(steps.landing, steps.s1);
        Mascot.say("Harika! Önce seni biraz tanıyalım. Adın ne?");
    });

    // Şehirleri Doldur
    if (window.locationData) {
        Object.keys(window.locationData).sort().forEach(city => {
            let option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }

    // Şehir seçilince İlçeleri Doldur
    citySelect.addEventListener('change', (e) => {
        const selectedCity = e.target.value;
        districtSelect.innerHTML = '<option value="" disabled selected>İlçe Seçiniz</option>';

        if (window.locationData[selectedCity]) {
            window.locationData[selectedCity].forEach(dist => {
                let opt = document.createElement('option');
                opt.value = dist;
                opt.textContent = dist;
                districtSelect.appendChild(opt);
            });
            districtSelect.disabled = false;
            Mascot.say(`${selectedCity}... Çok özel bir enerji hattı üzerindedir.`);
        } else {
            districtSelect.disabled = true;
        }
    });

    // --- NAVIGATION HELPERS ---
    function switchStep(current, next, delay = 500) {
        current.style.opacity = '0';
        setTimeout(() => {
            current.classList.remove('active');
            current.classList.add('hidden');

            next.classList.remove('hidden');
            // Force reflow
            void next.offsetWidth;
            next.classList.add('active');
            next.style.opacity = '1';
        }, delay);
    }

    // --- STEP 1: Basic Info & TEASER 1 GENERATION ---
    forms.basic.addEventListener('submit', (e) => {
        e.preventDefault();
        user.name = document.getElementById('fullName').value;
        const dateVal = document.getElementById('birthDate').value;

        if (!dateVal) return;

        const date = new Date(dateVal);
        user.birthDate = dateVal;

        user.sign = getZodiacSign(date.getDate(), date.getMonth() + 1);
        const signData = astroData.signs[user.sign];
        user.element = signData.element;
        user.elementKey = getElementKey(user.element);

        // Populate Static Teaser (Hızlı geri bildirim için static data kullanıyoruz şimdilik)
        document.getElementById('zodiacIcon1').className = `icon ${signData.icon}`;
        document.getElementById('zodiacName1').innerText = `${signData.name} (${signData.dates})`;

        const charText = getRandom(astroData.deepCharacter[user.sign]);
        const vibeList = astroData.currentVibe[user.elementKey] || astroData.currentVibe['fire'];
        const vibeText = getRandom(vibeList);
        const mysteryText = getRandom(astroData.mysteryHook);

        document.getElementById('deepAnalysisText').innerText = `Sayın ${user.name}, ${charText}`;
        document.getElementById('currentVibeText').innerText = `Yıldızlar diyor ki: "${vibeText}"`;
        document.getElementById('mysteryHookText').innerText = mysteryText;

        switchStep(steps.s1, steps.t1);
        Mascot.say(`Hmm... Bir ${signData.name}. Sezgilerim beni yanıltmamış.`, 3000);
    });

    document.getElementById('btn-to-step2').addEventListener('click', () => {
        switchStep(steps.t1, steps.s2);
        Mascot.say("Şimdi detaya inelim. Doğum haritanın tam koordinatları için saati bilmem gerek.");
    });

    // --- STEP 2: Advanced Info & API CALL ---
    // --- STEP 2: Advanced Info & PRE-API TEASER ---
    forms.advanced.addEventListener('submit', (e) => {
        e.preventDefault();
        user.city = citySelect.value;
        user.district = districtSelect.value;
        user.birthTime = document.getElementById('birthTime').value;

        // Loading Screen (Kısa süreli, lokal veri işleniyor gibi)
        const btn = document.getElementById('btn-finalize');
        const loader = document.getElementById('analysisLoader');
        const progress = document.querySelector('.progress');

        btn.style.display = 'none';
        loader.classList.remove('hidden');

        // Fake Progress
        let width = 0;
        const progressInterval = setInterval(() => {
            if (width < 100) { width += 2; progress.style.width = width + '%'; }
        }, 20);

        Mascot.say("Doğum haritanın element dengesine bakıyorum...", 2000);

        // API ÇAĞRISI YOK - Sadece Local Data ile Teaser Hazırla
        setTimeout(() => {
            clearInterval(progressInterval);
            progress.style.width = '100%';

            // Local Data'dan Rastgele Teaser Seç
            const mystery = getRandom(astroData.mysteryHook);

            // Teaser 2 İçeriğini Doldur
            document.getElementById('locationHookText').innerHTML =
                `<strong>${user.city}</strong> koordinatları, kader ağında kritik bir düğüm noktası.`;

            document.getElementById('finalCallText').innerText =
                `Yıldızlar senin için "${mystery}" diyor. Bu bilgiye ulaşmak üzeresin.`;

            switchStep(steps.s2, steps.t2);
            Mascot.say("İnanılmaz... Çok nadir bir dizilim görüyorum!");
        }, 1500);
    });

    function prepareTeaser2(data) {
        // DYNAMIC CONTENT FROM API (Mock)
        document.getElementById('locationHookText').innerHTML =
            `<strong>${user.city}</strong> koordinatlarına göre: <br>"${data.short_readings.hook_1}"`;

        document.getElementById('finalCallText').innerText = data.short_readings.mystery_alert;
    }

    document.getElementById('btn-to-payment').addEventListener('click', () => {
        switchStep(steps.t2, steps.pay);
        startTimer();
        Mascot.say("Bu fırsatı kaçırma. Kaderin değişmek üzere.", 5000);
    });

    // --- PAYMENT ---
    function startTimer() {
        let duration = 60 * 15;
        const display = document.getElementById('countdown');
        if (window.timerInterval) clearInterval(window.timerInterval);

        window.timerInterval = setInterval(() => {
            let minutes = parseInt(duration / 60, 10);
            let seconds = parseInt(duration % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            if (display) display.textContent = minutes + ":" + seconds;
            if (--duration < 0) {
                duration = 0;
                clearInterval(window.timerInterval);
                if (display) display.textContent = "00:00";
            }
        }, 1000);
    }

    // --- PAYMENT SUCCESS & REAL API CALL ---
    forms.payment.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payBtn = forms.payment.querySelector('button');
        const defaultBtnText = payBtn.innerHTML;

        payBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Kozmik Bağlantı Kuruluyor...';
        payBtn.disabled = true;

        Mascot.say("Ödeme onaylandı! Yıldız haritanın kilidini açıyorum...", 3000);

        try {
            // 1. GERÇEK API ÇAĞRISI (Paralel Başlat)
            const apiPromise = AstraAPI.generateReading(user);

            // 2. Yapay Bekleme & Mesajlar (Premium His) - 8 Saniye
            const stepsMessages = [
                "Gezegen konumları hesaplanıyor...",
                "Doğum haritanın derinliklerine iniliyor...",
                "Karmik düğümler çözümleniyor...",
                "Ruh eşinle olan enerjin taranıyor...",
                "Neredeyse hazır..."
            ];

            for (let i = 0; i < stepsMessages.length; i++) {
                setTimeout(() => {
                    Mascot.say(stepsMessages[i], 1500);
                }, i * 1600);
            }

            // En az 8 saniye bekle
            await new Promise(resolve => setTimeout(resolve, 8000));

            const result = await apiPromise;

            // 2. Sonucu Kaydet
            if (result) {
                user.apiResult = result;

                // 3. Raporu Render Et (Arka planda)
                await renderFullReport();

                // 4. Başarılı sayfasına geç
                switchStep(steps.pay, steps.succ);
                Mascot.say("Tebrikler! Kozmik raporun hazır. Hayatını değiştirecek bilgiler seni bekliyor.");
            } else {
                throw new Error("API boş yanıt döndü");
            }

        } catch (error) {
            console.error("Kritik Hata:", error);
            payBtn.innerHTML = defaultBtnText;
            payBtn.disabled = false;
            Mascot.say("Üzgünüm, kozmik bağlantıda bir sorun oluştu. Lütfen tekrar dene.", 5000);
            alert("Bir hata oluştu. Lütfen tekrar deneyiniz.");
        }
    });

    document.getElementById('btn-view-report').addEventListener('click', () => {
        switchStep(steps.succ, steps.report);
        Mascot.say("İşte hayatının rehberi. Dikkatlice oku.");
    });

    // --- REPORT RENDERING (DYNAMIC) ---
    async function renderFullReport() {
        if (!user.apiResult) return;

        const data = user.apiResult;
        const report = data.full_report;
        const profile = data.user_profile;
        const contentDiv = document.getElementById('report-content');

        document.getElementById('report-user-name').innerText = user.name;
        document.getElementById('report-date').innerText = new Date().toLocaleDateString('tr-TR');

        // GÖRSEL OLUŞTURMA İŞLEMLERİ (SIRALI - Kullanıcı İsteği)
        const prompts = data.image_prompts || [];
        const imageIds = ['img-cover', 'img-spirit', 'img-love', 'img-career', 'img-karma'];

        // Önce placeholder metinleri göster

        let reportHTML = `
            <div class="report-intro">
                <h3>Merhaba ${user.name},</h3>
                <p class="intro-text">${report.intro}</p>
                <div class="user-badges">
                    <span class="badge">☀️ ${profile.sun_sign}</span>
                    <span class="badge">🏹 ${profile.rising_sign}</span>
                    <span class="badge">🌙 ${profile.moon_sign}</span>
                    <span class="badge">🔢 Yol: ${profile.life_path_number}</span>
                </div>
            </div>
            
            <div class="report-page">
                <h2>Bölüm 1: Kozmik Kimliğin & Güneş</h2>
                <div class="chart-placeholder" id="img-cover">
                    <div class="loading-spinner"><i class="fa-solid fa-paintbrush fa-spin"></i> Özel Kartın Çiziliyor...</div>
                </div>
                <p>${report.chapter_1_identity}</p>
            </div>

            <div class="report-page">
                <h2>Bölüm 2: Sosyal Masken (Yükselen)</h2>
                <p>${report.chapter_2_mask}</p>
            </div>

            <div class="report-page">
                <h2>Bölüm 3: Duygusal Dünyan (Ay)</h2>
                <div class="chart-placeholder" id="img-spirit">
                     <div class="loading-spinner"><i class="fa-solid fa-dragon fa-spin"></i> Ruh Hayvanın Çağırılıyor...</div>
                </div>
                <p><strong>Ruh Hayvanın:</strong> ${profile.spirit_animal}</p>
                <p>${report.chapter_3_emotion}</p>
            </div>

            <div class="report-page">
                <h2>Bölüm 4: Aşk ve İlişkiler</h2>
                <div class="chart-placeholder" id="img-love">
                    <div class="loading-spinner"><i class="fa-solid fa-heart fa-spin"></i> Aşk Enerjisi Şekilleniyor...</div>
                </div>
                <p>${report.chapter_4_love}</p>
            </div>

            <div class="report-page">
                <h2>Bölüm 5: Karma ve Satürn</h2>
                <div class="chart-placeholder" id="img-karma">
                    <div class="loading-spinner"><i class="fa-solid fa-infinity fa-spin"></i> Karmik Döngü Çiziliyor...</div>
                </div>
                <p>${report.chapter_5_karma}</p>
            </div>

            <div class="report-page">
                <h2>Bölüm 6: Kariyer ve Finans</h2>
                <div class="chart-placeholder" id="img-career">
                    <div class="loading-spinner"><i class="fa-solid fa-coins fa-spin"></i> Başarı Yolu Oluşturuluyor...</div>
                </div>
                <p>${report.chapter_6_career}</p>
            </div>

            <div class="report-page">
                <h2>Bölüm 7: Numeroloji & Kader</h2>
                <div class="numerology-box">
                    <div class="num-circle">${profile.life_path_number}</div>
                    <div class="num-desc">
                        <h4>Hayat Yolu Sayın</h4>
                        <p>${report.chapter_7_numerology}</p>
                    </div>
                </div>
            </div>

            <div class="report-page forecast-page">
                <h2>Bölüm 8 & 9: 6 Aylık Gelecek Projeksiyonu</h2>
                <div class="forecast-card">
                    <h3>Önümüzdeki 3 Ay (Çeyrek 1)</h3>
                    <p>${report.chapter_8_forecast_q1}</p>
                </div>
                <div class="forecast-card">
                    <h3>Sonraki 3 Ay (Çeyrek 2)</h3>
                    <p>${report.chapter_9_forecast_q2}</p>
                </div>
            </div>

            <div class="report-page ritual-page">
                <h2>Bölüm 10: Kişisel Ritüelin</h2>
                <div class="ritual-box">
                    <span class="ritual-icon">🕯️</span>
                    <p>${report.chapter_10_ritual}</p>
                </div>
            </div>
            
            <div class="report-actions" style="margin-top: 40px; text-align: center;">
                 <button id="btn-download-pdf" class="btn-primary" onclick="window.print()">
                    <i class="fa-solid fa-file-pdf"></i> Raporu PDF Olarak İndir
                 </button>
            </div>
        `;

        contentDiv.innerHTML = reportHTML;

        // Görselleri SIRAYLA (Sequential) Yükle
        for (let i = 0; i < prompts.length; i++) {
            if (i < imageIds.length) {
                // Her görsel için bekle
                await updateImage(imageIds[i], prompts[i]);
                // Küçük bir bekleme (opsiyonel, API limitine takılmamak için)
                await new Promise(r => setTimeout(r, 1000));
            }
        }
    }

    async function updateImage(elementId, prompt) {
        const el = document.getElementById(elementId);
        if (!el) return;

        // Spinning Icon + Message update
        el.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-paintbrush fa-spin"></i> Özel çizim yapılıyor...</div>`;

        try {
            console.log(`Görsel isteniyor (${elementId}):`, prompt);

            let imageUrl = null;

            // 1. Önce Gemini Image Gen (Server üzerinden) Dene
            try {
                // Pollinations yerine önce kendi API'mızı deniyoruz
                const res = await fetch('/api/generate-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.imageUrl) {
                        imageUrl = data.imageUrl; // Base64 data:image/... döndürecek
                        console.log("Gemini Image Kullanıldı");
                    }
                }
            } catch (err) {
                console.warn("Gemini Image Failed, falling back to Pollinations...", err);
            }

            // 2. Fallback: Pollinations.ai
            if (!imageUrl) {
                // Pollinations için "Pro" seviyesinde detaylı prompt zenginleştirme
                const refinedPrompt = `${prompt}, mystical tarot card style, cinematic lighting, 8k resolution, highly detailed, gold accents, ethereal atmosphere, digital art, masterpiece`;
                const encodedPrompt = encodeURIComponent(refinedPrompt);
                const seed = Math.floor(Math.random() * 99999);
                imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=800&height=1024&seed=${seed}&model=flux`;
            }

            // Görseli Bas (Önce yüklenmesini bekle)
            const img = new Image();
            img.src = imageUrl;

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = resolve; // Hata olsa bile devam et
            });

            el.innerHTML = '';
            el.style.backgroundImage = `url('${imageUrl}')`;
            el.style.backgroundSize = 'cover';
            el.style.backgroundPosition = 'center';
            el.style.height = '500px';
            el.style.borderRadius = '15px';
            el.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
            el.style.transition = "all 0.5s ease";

        } catch (e) {
            console.error("Resim yüklenemedi", e);
            el.innerHTML = '<span class="error">Görsel oluşturulamadı</span>';
        }
    }

    // --- UTILS ---
    function getElementKey(elName) {
        if (!elName) return 'fire';
        const map = { 'Ateş': 'fire', 'Toprak': 'earth', 'Hava': 'air', 'Su': 'water' };
        return map[elName] || 'fire';
    }

    function getZodiacSign(day, month) {
        if ((month == 1 && day <= 19) || (month == 12 && day >= 22)) return "oglak";
        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "kova";
        if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "balik";
        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "koc";
        if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "boga";
        if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "ikizler";
        if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "yengec";
        if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "aslan";
        if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "basak";
        if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "terazi";
        if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "akrep";
        if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "yay";
        return "koc";
    }

    function getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

});