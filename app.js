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
        // GERÇEK API KEY BURAYA GELECEK
        GEMINI_API_KEY: "AIzaSyB80rxZmoMoovwxK2jX_dD52_Hyp6EnuGQ",

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

            // 2. API İsteği
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }]
                    })
                });

                if (!response.ok) {
                    throw new Error(`API Hatası: ${response.status}`);
                }

                const data = await response.json();

                // 3. Yanıtı İşleme
                let rawText = data.candidates[0].content.parts[0].text;

                // Markdown temizliği (```json ... ``` kısımlarını kaldır)
                rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

                const parsedResult = JSON.parse(rawText);
                return parsedResult;

            } catch (error) {
                console.error("Gemini API Hatası:", error);
                // Hata durumunda fallback (yedek) veri dön
                return {
                    user_profile: { sun_sign: userProfile.sign, rising_sign: "Bilinmiyor", life_path_number: 0 },
                    short_readings: {
                        hook_1: "Yıldızlar şu an çok yoğun, enerjinizi hissedebiliyorum ama kelimelere dökerken bir engel var.",
                        current_vibe: "Karışık sinyaller alıyorsun.",
                        mystery_alert: "Yakında her şey netleşecek."
                    },
                    full_report: {
                        chapter_1_identity: "Sistemsel bir yoğunluk nedeniyle detaylı analize şu an ulaşılamıyor.",
                        chapter_2_love: "Lütfen daha sonra tekrar deneyiniz.",
                        chapter_3_career: "...",
                        chapter_4_forecast: { month_1: "...", month_2: "...", month_3: "..." }
                    },
                    image_prompts: ["Zodiac sign abstract art"]
                };
            }
        },

        async generateImage(prompt) {
            console.log("Görsel üretiliyor:", prompt);
            // Ücretsiz ve key gerektirmeyen Stable Diffusion API (Pollinations.ai)
            // Prompt'u URL-safe hale getir
            const encodedPrompt = encodeURIComponent(prompt + ", mystical, high quality, 8k, tarot style, golden ratio");
            const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=768&height=1024&seed=${Math.floor(Math.random() * 1000)}`;
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
    forms.advanced.addEventListener('submit', async (e) => {
        e.preventDefault();
        user.city = citySelect.value;
        user.district = districtSelect.value;
        user.birthTime = document.getElementById('birthTime').value;

        // Loading Screen
        const btn = document.getElementById('btn-finalize');
        const loader = document.getElementById('analysisLoader');
        const loadingText = document.getElementById('loadingText');
        const progress = document.querySelector('.progress');

        btn.style.display = 'none';
        loader.classList.remove('hidden');

        // Progress Animation
        let width = 0;
        const progressInterval = setInterval(() => {
            if (width < 90) { width += 0.5; progress.style.width = width + '%'; }
        }, 50);

        Mascot.say("Büyük veri tabanıma bağlanıyorum... Gemini AI analiz yapıyor...", 6000);

        // API CALL START
        try {
            const result = await AstraAPI.generateReading(user); // FETCHING MOCK DATA
            user.apiResult = result; // Save data for report

            // Finish Loading
            clearInterval(progressInterval);
            progress.style.width = '100%';

            setTimeout(() => {
                prepareTeaser2(result);
                switchStep(steps.s2, steps.t2);
                Mascot.say("Sonuçlar geldi... Gördüklerime inanamıyorum!");
            }, 800);

        } catch (error) {
            console.error(error);
            alert("Bağlantı hatası!");
        }
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

    forms.payment.addEventListener('submit', (e) => {
        e.preventDefault();
        const payBtn = forms.payment.querySelector('button');

        payBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Onaylanıyor...';
        payBtn.disabled = true;

        setTimeout(() => {
            switchStep(steps.pay, steps.succ);
            Mascot.say("Tebrikler! Yolculuğun asıl şimdi başlıyor.");

            // Arka planda raporu render (hazır olan datadan)
            renderFullReport();
        }, 2000);
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

        // GÖRSEL OLUŞTURMA İŞLEMLERİ (Paralel İstekler)
        // Kullanıcıyı bekletmemek için önce metni basacağız, görseller yüklenince güncellenecek
        const prompts = data.image_prompts || [];

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
                    <span class="loading-img">Kozmik Tarot Kartın Çiziliyor...</span>
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
                     <span class="loading-img">Ruh Hayvanın Beliriyor...</span>
                </div>
                <p><strong>Ruh Hayvanın:</strong> ${profile.spirit_animal}</p>
                <p>${report.chapter_3_emotion}</p>
            </div>

            <div class="report-page">
                <h2>Bölüm 4: Aşk ve İlişkiler</h2>
                <div class="chart-placeholder" id="img-love"></div>
                <p>${report.chapter_4_love}</p>
            </div>

            <div class="report-page">
                <h2>Bölüm 5: Karma ve Satürn</h2>
                <div class="chart-placeholder" id="img-karma"></div>
                <p>${report.chapter_5_karma}</p>
            </div>

            <div class="report-page">
                <h2>Bölüm 6: Kariyer ve Finans</h2>
                <div class="chart-placeholder" id="img-career"></div>
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
        `;

        contentDiv.innerHTML = reportHTML;

        // Görselleri Arka Planda Yükle
        if (prompts[0]) updateImage('img-cover', prompts[0]);
        if (prompts[1]) updateImage('img-spirit', prompts[1]);
        if (prompts[2]) updateImage('img-love', prompts[2]);
        if (prompts[3]) updateImage('img-career', prompts[3]);
        if (prompts[4]) updateImage('img-karma', prompts[4]);
    }

    async function updateImage(elementId, prompt) {
        const el = document.getElementById(elementId);
        if (!el) return;
        try {
            const url = await AstraAPI.generateImage(prompt);
            el.innerHTML = '';
            el.style.backgroundImage = `url('${url}')`;
            el.style.backgroundSize = 'cover';
            el.style.backgroundPosition = 'center';
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