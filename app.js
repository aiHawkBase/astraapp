document.addEventListener('DOMContentLoaded', () => {

    // --- GÜVENLİK KONTROLÜ ---
    if (typeof astroData === 'undefined' || typeof locationData === 'undefined') {
        console.error("Veri dosyaları (data.js veya locations.js) yüklenemedi.");
        alert("Sistem yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
        return;
    }

    // --- STATE (Durum Yönetimi) ---
    // Initialize Cosmos Background
    if (window.Cosmos) {
        window.Cosmos.init();
    }
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
            console.log("Astra API: Analiz İsteği Gönderiliyor...", userProfile);

            const name = userProfile.name || "Sevgili Ruh";
            const birthDate = userProfile.birthDate || "Bilinmiyor";
            const birthTime = userProfile.birthTime || "Bilinmiyor";
            const birthCity = userProfile.city || "Bilinmiyor";
            const sunSign = userProfile.sign || "Bilinmiyor";

            // 1. Prompt Hazırlığı (ZENGİNLEŞTİRİLMİŞ İÇERİK - 100 Sayfa Eşdeğeri)
            const prompt = `
            Sen evrenin sırlarına vakıf, kadim bilgeliklerle donanmış, Dünya'nın öncü astrologususun. 
            Görevin, aşağıda bilgileri verilen kişi için "Hayat Kitabı" niteliğinde, yaklaşık 100 sayfa uzunluğunda bir kitap derinliğinde (yaklaşık 15.000 kelime), 
            son derece detaylı, felsefi, psikolojik ve spiritüel derinliği olan, eşsiz bir astroloji raporu hazırlamaktır.

            **Kullanıcı Bilgileri:**
            - İsim: ${name}
            - Doğum Tarihi: ${birthDate}
            - Doğum Saati: ${birthTime}
            - Doğum Yeri: ${birthCity}
            - Burç: ${sunSign}

            **RAPOR YAZIM KURALLARI (ÇOK ÖNEMLİ - MAKSİMUM DERİNLİK):**
            1. **UZUNLUK VE DERİNLİK:** Her bölüm EN AZ 1500 kelime olmalıdır. Yüzeysel cümlelerden kaçın. Her konuyu derinlemesine analiz et.
            2. **ÜSLUP:** Mistik, akıcı, etkileyici, epik bir dil kullan. Okuyucuyu büyüle. Metaforlar, mitolojik hikayeler ve psikolojik analizlerle zenginleştir.
            3. **FORMAT:** Yanıtın SADECE aşağıda belirtilen JSON formatında olmalıdır. Markdown blokları ('''json) kullanma.
            
            **İSTENEN JSON FORMATI VE BÖLÜM İÇERİKLERİ:**
            {
                "user_profile": {
                     "sun_sign": "Güneş Burcu (Örnek: Koç - Öncü Ateş)",
                     "rising_sign": "Yükselen Burcu (Tahmini)",
                     "moon_sign": "Ay Burcu (Tahmini)",
                     "life_path_number": "Hayat Yolu Sayısı",
                     "spirit_animal": "Ruh Hayvanı"
                },
                "short_readings": {
                     "hook_1": "Kısa, vurucu ve gizemli bir cümle.",
                     "current_vibe": "Mevcut kozmik enerjinin kullanıcı üzerindeki etkisi.",
                     "mystery_alert": "Yaklaşan büyük bir değişimin habercisi."
                },
                "full_report": {
                    "intro": { "title": "Giriş", "content": "Kullanıcıya özel yazılmış, en az 1000 kelimelik, ruhsal potansiyelini ve bu raporun önemini anlatan destansı bir giriş." },
                    "chapters": [
                        { "title": "BÖLÜM 1: GÜNEŞ BURCU VE KOZMİK KİMLİK", "content": "Kişinin özü, yaşam amacı, babasıyla ilişkisi, parladığı alanlar, gölge yönleri ve mitolojik arketipleri. (En az 1000 kelime)" },
                        { "title": "BÖLÜM 2: YÜKSELEN BURCU VE SOSYAL MASKE", "content": "Dış dünyaya gösterdiği yüz, fiziksel özellikleri, ilk izlenimi, çocukluk travmaları ve başkalarının onu nasıl algıladığı. (En az 1000 kelime)" },
                        { "title": "BÖLÜM 3: AY BURCU VE DUYGUSAL DÜNYA", "content": "Bilinçaltı, annesiyle ilişkisi, duygusal ihtiyaçları, korkuları, güvende hissetme yolları ve ruhsal kökleri. (En az 1000 kelime)" },
                        { "title": "BÖLÜM 4: AŞK, İLİŞKİLER VE CİNSELLİK", "content": "Venüs ve Mars analizi, aşk dili, ideal partneri, ilişkilerde yaptığı hatalar, cinsel enerjisi ve karmik eşleşmeleri. (En az 1000 kelime)" },
                        { "title": "BÖLÜM 5: SATÜRN, KARMA VE ÖNCEKİ YAŞAMLAR", "content": "Karmik borçlar, yaşam sınavları, korkuları ve ruhsal büyüme planı. (En az 1000 kelime)" },
                        { "title": "BÖLÜM 6: KARİYER, FİNANS VE BAŞARI", "content": "Mesleki yetenekleri, zenginlik potansiyeli, finansal şansı ve ideal kariyer yolu. (En az 1000 kelime)" },
                        { "title": "BÖLÜM 7: KADER SAYISI", "content": "Hayat Yolu Numarasının derin analizi ve yaşam misyonu. (En az 800 kelime)" },
                        { "title": "BÖLÜM 8: GELECEK PROJEKSİYONU (İLK 3 AY)", "content": "Önümüzdeki 3 ay için ay ay detaylı öngörüler. (En az 800 kelime)" },
                        { "title": "BÖLÜM 9: GELECEK PROJEKSİYONU (SONRAKİ 3 AY)", "content": "Sonraki 3 ay için ay ay detaylı öngörüler. (En az 800 kelime)" },
                        { "title": "BÖLÜM 10: KİŞİSEL GÜÇ RİTÜELİ", "content": "Kullanıcıya özel, uygulanabilir ve dönüştürücü bir ritüel. (En az 800 kelime)" }
                    ]
                },
                "pros_cons": {
                    "title": "Güçlü ve Gölge Yönler",
                    "pros": ["Güçlü yön 1", "Güçlü yön 2", "Güçlü yön 3", "Güçlü yön 4", "Güçlü yön 5"],
                    "cons": ["Gölge yön 1", "Gölge yön 2", "Gölge yön 3", "Gölge yön 4", "Gölge yön 5"],
                    "analysis": "Bu özelliklerin detaylı analizi."
                },
                "astrocartography": {
                    "title": "Astro-Kartografi: Ruhsal Coğrafya",
                    "locations": [
                        { "city": "Şehir 1", "purpose": "Aşk/Kariyer/Karma", "desc": "Neden burası?" },
                        { "city": "Şehir 2", "purpose": "Aşk/Kariyer/Karma", "desc": "Neden burası?" },
                        { "city": "Şehir 3", "purpose": "Aşk/Kariyer/Karma", "desc": "Neden burası?" }
                    ]
                },
                "numerology": {
                    "title": "Numerolojik Öz: Hayat Yolu",
                    "life_path_number": "X",
                    "analysis": "Hayat yolu sayısının detaylı analizi."
                },
                "calendar_12_months": [
                    { "month": "Ocak", "theme": "Tema", "advice": "Tavsiye" },
                    { "month": "Şubat", "theme": "Tema", "advice": "Tavsiye" },
                    { "month": "Mart", "theme": "Tema", "advice": "Tavsiye" },
                    { "month": "Nisan", "theme": "Tema", "advice": "Tavsiye" },
                    { "month": "Mayıs", "theme": "Tema", "advice": "Tavsiye" },
                    { "month": "Haziran", "theme": "Tema", "advice": "Tavsiye" },
                    { "month": "Temmuz", "theme": "Tema", "advice": "Tavsiye" },
                    { "month": "Ağustos", "theme": "Tema", "advice": "Tavsiye" },
                    { "month": "Eylül", "theme": "Tema", "advice": "Tavsiye" },
                    { "month": "Ekim", "theme": "Tema", "advice": "Tavsiye" },
                    { "month": "Kasım", "theme": "Tema", "advice": "Tavsiye" },
                    { "month": "Aralık", "theme": "Tema", "advice": "Tavsiye" }
                ],
                "image_prompts": [
                    "Kullanıcının burcunu simgeleyen, altın detaylı, mistik tarot kartı, 8k, masterpiece (Cover)",
                    "Spiritüel sembolizm içeren soyut sanat eseri (Spirit)",
                    "Romantik ve kozmik bir atmosferde iki gezegenin dansı (Love)",
                    "Altın kapılar ve merdivenlerle dolu başarı yolu (Career)",
                    "Antik kum saati ve yıldızlar, mistik atmosfer (Karma)"
                ]
            }
            `;

            try {
                // Get Email
                const userEmail = document.getElementById('userEmail') ? document.getElementById('userEmail').value : null;

                // 1. Job Oluştur (API'ye Gönder)
                const res = await fetch('/api/generate-reading', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: prompt,
                        email: userEmail
                    })
                });

                if (!res.ok) throw new Error("API Hatası");

                const data = await res.json();
                const jobId = data.jobId;

                console.log(`Job Başlatıldı: ${jobId}. Bekleniyor...`);

                // 3. Polling (Durum Sorgulama)
                let pollResult = null;
                let attempts = 0;
                const MAX_ATTEMPTS = 90; // 3 dk timeout (2s x 90) - Uzun prompt için artırıldı

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
                        intro: "Sistemde geçici bir yoğunluk var, ancak yıldızların seninle olduğunu bil.",
                        chapter_1_identity: "Güneş burcun senin özünü temsil eder. Sen güçlü bir karaktere sahipsin.",
                        chapter_2_mask: "Yükselen burcun, dünyaya taktığın maskeyi gösterir.",
                        chapter_3_emotion: "Ay burcun, duygusal derinliğini yansıtır.",
                        chapter_4_love: "Aşk hayatında tutku ve sadakat arıyorsun.",
                        chapter_5_karma: "Geçmişten getirdiğin yüklerden arınma vakti.",
                        chapter_6_career: "Yeteneklerini doğru kullanırsan başarı kaçınılmaz.",
                        chapter_7_numerology: "Hayat Yolu Sayın sana rehberlik edecek.",
                        chapter_8_forecast_q1: "Önümüzdeki dönem planlama zamanı.",
                        chapter_9_forecast_q2: "Sonraki dönem hasat zamanı.",
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
    // --- NARRATOR CONTROLLER (Central Dialogue) ---
    const Narrator = {
        elOverlay: document.getElementById('narrative-overlay'),
        elText: document.getElementById('narrative-text'),
        elBtn: document.getElementById('narrative-btn'),
        resolve: null,

        init() {
            if (this.elBtn) {
                this.elBtn.addEventListener('click', () => {
                    this.hide();
                    if (this.resolve) {
                        this.resolve();
                        this.resolve = null;
                    }
                });
            }
        },

        say(text, btnText = "Devam Et") {
            return new Promise(resolve => {
                if (this.elText) this.elText.innerText = text;
                if (this.elBtn) this.elBtn.innerText = btnText;
                if (this.elOverlay) this.elOverlay.classList.remove('hidden');
                this.resolve = resolve;
            });
        },

        hide() {
            if (this.elOverlay) this.elOverlay.classList.add('hidden');
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
    Narrator.init();

    // LANDING PAGE ACTIONS
    document.getElementById('btn-start').addEventListener('click', async () => {
        switchStep(steps.landing, steps.s1);
        await Narrator.say("Harika! Önce seni biraz tanıyalım. Adın ne?", "Başla");
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
            // Narrator.say(`${selectedCity}... Çok özel bir enerji hattı üzerindedir.`, "Devam"); // Optional: Removed to avoid too many clicks
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

    // --- STEP 1: Basic Info & TEASER 1 GENERATION (DYNAMIC) ---
    forms.basic.addEventListener('submit', async (e) => {
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

        // Update UI Static Elements
        document.getElementById('zodiacIcon1').className = `icon ${signData.icon}`;
        document.getElementById('zodiacName1').innerText = `${signData.name} (${signData.dates})`;

        // --- RITUAL START ---
        const overlay = document.getElementById('ritual-overlay');
        overlay.classList.add('active');
        if (window.Cosmos) window.Cosmos.setSpeed(2.5); // WARP SPEED

        // Parallel API Fetches
        try {
            const [resIntro, resLoveSub, resLoveAct, resTeaser] = await Promise.all([
                fetch('/api/fortune/random?category=intro'),
                fetch('/api/fortune/random?category=love_subject'),
                fetch('/api/fortune/random?category=love_action'),
                fetch('/api/fortune/random?category=teaser')
            ]);

            const intro = (await resIntro.json()).content;
            const loveSub = (await resLoveSub.json()).content;
            const loveAct = (await resLoveAct.json()).content;
            const teaser = (await resTeaser.json()).content;

            // Wait a bit for ritual effect (min 2 seconds)
            await new Promise(r => setTimeout(r, 2000));

            // Populate Text
            document.getElementById('deepAnalysisText').innerHTML =
                `Sayın <strong>${user.name}</strong>, ${intro}<br><br>`;

            document.getElementById('currentVibeText').innerHTML =
                `Yıldızlar fısıldıyor: "<em>${loveSub} ${loveAct}</em>"`;

            document.getElementById('mysteryHookText').innerText = teaser;

            overlay.classList.remove('active');

            // Generate Random Letter Hook
            const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            const letterHook = document.getElementById('letterHookText');
            if (letterHook) letterHook.innerText = `{${randomLetter}} harfiyle başlayan biri senin hakkında konuşuyor.`;

            // Reset Speed
            if (window.Cosmos) window.Cosmos.setSpeed(0.2);

            switchStep(steps.s1, steps.t1);
            await Narrator.say(`Hmm... Bir ${signData.name}. Enerjin çok yoğun.`, "Devam Et");

        } catch (err) {
            console.error(err);
            overlay.classList.remove('active');
            // Fallback
            switchStep(steps.s1, steps.t1);
            await Narrator.say(`Hmm... Bir ${signData.name}. Enerjin çok yoğun.`, "Devam Et");
        }
    });

    document.getElementById('btn-to-step2').addEventListener('click', async () => {
        switchStep(steps.t1, steps.s2);
        await Narrator.say("Şimdi detaya inelim. Doğum haritanın tam koordinatları için saati bilmem gerek.", "Tamam");
    });

    // --- STEP 2: Advanced Info & API CALL ---
    // --- STEP 2: Advanced Info & PRE-API TEASER ---
    forms.advanced.addEventListener('submit', async (e) => {
        e.preventDefault();
        user.city = citySelect.value;
        user.district = districtSelect.value;
        user.birthTime = document.getElementById('birthTime').value;

        // Loading Screen (Ritual Overlay)
        const overlay = document.getElementById('ritual-overlay');
        overlay.classList.add('active');
        if (window.Cosmos) window.Cosmos.setSpeed(2.5); // WARP SPEED

        // Hide Button
        document.getElementById('btn-finalize').style.display = 'none';

        await Narrator.say("Doğum haritanın element dengesine bakıyorum...", "İncele");

        // API Call for Career/Teaser
        (async () => {
            try {
                const [resCareer, resTeaser] = await Promise.all([
                    fetch('/api/fortune/random?category=career'),
                    fetch('/api/fortune/random?category=teaser')
                ]);

                const career = (await resCareer.json()).content;
                const teaser = (await resTeaser.json()).content;

                // Wait for ritual
                await new Promise(r => setTimeout(r, 2500));

                // Populate Text
                document.getElementById('locationHookText').innerHTML =
                    `<strong>${user.city}</strong> koordinatlarında yıldızlar fısıldıyor: <br>"${career}"`;

                document.getElementById('finalCallText').innerText =
                    `Son Kehanet: ${teaser}`;

                overlay.classList.remove('active');
                if (window.Cosmos) window.Cosmos.setSpeed(0.2); // Normal Speed
                switchStep(steps.s2, steps.t2);
                await Narrator.say("İnanılmaz... Çok nadir bir dizilim görüyorum!", "Neymiş?");

            } catch (error) {
                console.error(error);
                overlay.classList.remove('active');
                // Fallback
                switchStep(steps.s2, steps.t2);
            }
        })();
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
        const userEmail = document.getElementById('userEmail').value;

        payBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> İşleminiz Onaylanıyor...';
        payBtn.disabled = true;

        // Fake Delay for Payment Processing
        await new Promise(r => setTimeout(r, 2000));

        await Narrator.say("Ödeme başarıyla alındı! Analiz sürecini başlattım.", "Harika");

        // IMMEDIATE SUCCESS SCREEN (Don't wait for API)
        switchStep(steps.pay, steps.succ);

        // Update Success Message for Email Flow
        document.querySelector('#step-success h2').innerText = "Siparişiniz Alındı!";
        document.querySelector('#step-success p').innerHTML =
            `Detaylı "Astra Kozmik Kitapçığınız" hazırlanıyor.<br>
            Tamamlandığında <strong>${userEmail}</strong> adresine gönderilecektir.<br>
            <span style="font-size: 0.9em; color: #666;">(Ortalama teslim süresi: 5-10 dakika)</span>`;

        const btnView = document.getElementById('btn-view-report');
        btnView.style.display = 'none'; // Hide initially
        btnView.innerText = "Raporunuz Hazır! Görüntüle";

        // Start Actual API Call in Background
        try {
            console.log("Background Job Started...");
            const result = await AstraAPI.generateReading(user); // This polls until finish

            // When finished:
            if (result) {
                user.apiResult = result;
                await renderFullReport(); // Render hidden report

                // Show Button if user is still here
                btnView.style.display = 'inline-block';
                btnView.classList.add('pulse-anim');

                document.querySelector('#step-success h2').innerText = "Raporunuz Hazır!";
                document.querySelector('#step-success p').innerText = "Yıldızlar analizinizi tamamladı. Aşağıdaki butona tıklayarak hemen görüntüleyebilirsiniz veya e-postanızı kontrol edebilirsiniz.";

                // Narrator.say("Müjde! Raporun beklenenden hızlı hazırlandı. Hemen inceleyebilirsin.", "Görüntüle");
            }

        } catch (error) {
            console.error("Background Job Failed:", error);
            // Silent fail - user expects email anyway
        }
    });

    document.getElementById('btn-view-report').addEventListener('click', async () => {
        switchStep(steps.succ, steps.report);
        await Narrator.say("İşte hayatının rehberi. Dikkatlice oku.", "Okumaya Başla");
    });

    // --- REPORT RENDERING (DYNAMIC) ---
    // --- REPORT RENDERING (SINGLE WALLPAPER LOGIC) ---
    // --- REPORT RENDERING (DYNAMIC BOOKLET) ---
    async function renderFullReport() {
        if (!user.apiResult) return;

        const data = user.apiResult;
        const contentDiv = document.getElementById('report-content');

        // Clear previous content
        contentDiv.innerHTML = '';
        contentDiv.classList.add('booklet-mode');

        let html = '';

        // 1. Booklet Header
        const title = data.booklet_title || `Kozmik Rehber: ${user.name}`;
        html += `
            <div class="booklet-header">
                <h1>${title}</h1>
                <p>Hazırlanan: <strong>${user.name}</strong> | ${new Date().toLocaleDateString('tr-TR')}</p>
            </div>
        `;

        // 2. Birth Chart & Intro
        const imgs = data.images || {};
        if (imgs.birth_chart) {
            html += `<div class="birth-chart-container"><img src="${imgs.birth_chart}" class="booklet-image" alt="Doğum Haritası"></div>`;
        }

        if (data.full_report && data.full_report.intro) {
            html += `<div class="booklet-chapter">
                <h2>${data.full_report.intro.title || "Giriş"}</h2>
                <div class="chapter-content"><p>${data.full_report.intro.content}</p></div>
            </div>`;
        }

        // 3. Pros & Cons (New Section)
        if (data.pros_cons) {
            html += `<div class="booklet-chapter">
                <h2>${data.pros_cons.title || 'Güçlü ve Gölge Yönler'}</h2>
                <div class="pros-cons-container">
                    <div class="pc-col pros">
                        <h3><i class="fa-solid fa-sun"></i> Güçlü Yönler</h3>
                        <ul>${data.pros_cons.pros.map(i => `<li>${i}</li>`).join('')}</ul>
                    </div>
                    <div class="pc-col cons">
                        <h3><i class="fa-solid fa-moon"></i> Gölge Yönler</h3>
                        <ul>${data.pros_cons.cons.map(i => `<li>${i}</li>`).join('')}</ul>
                    </div>
                </div>
                <div class="pc-analysis"><p>${data.pros_cons.analysis}</p></div>
            </div>`;
        }

        // 4. Personality Image
        if (imgs.personality) {
            html += `<img src="${imgs.personality}" class="booklet-image" alt="Ruhsal Portre">`;
        }

        // 5. Chapters (Iterate Array)
        if (data.full_report.chapters && Array.isArray(data.full_report.chapters)) {
            data.full_report.chapters.forEach((chap, index) => {
                html += `<div class="booklet-chapter">
                    <h2>${chap.title}</h2>
                    <div class="chapter-content"><p>${chap.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p></div>`;

                // Inject Images Contextually
                // Image indices might need adjustment based on chapter count
                if (imgs.love && (chap.title.includes('AŞK') || index === 3)) { // Index 3 is Ch4
                    html += `<img src="${imgs.love}" class="booklet-image" alt="Aşk" style="margin: 30px 0;">`;
                }
                if (imgs.career && (chap.title.includes('KARİYER') || index === 5)) { // Index 5 is Ch6
                    html += `<img src="${imgs.career}" class="booklet-image" alt="Kariyer" style="margin: 30px 0;">`;
                }
                if (imgs.destiny && (chap.title.includes('SATÜRN') || index === 4)) {
                    html += `<img src="${imgs.destiny}" class="booklet-image" alt="Kader" style="margin: 30px 0;">`;
                }
                // Add Spirit Image for Ritual
                if (imgs.spirit && (chap.title.includes('RİTÜEL') || index === 9)) {
                    html += `<img src="${imgs.spirit}" class="booklet-image" alt="Ritüel" style="margin: 30px 0;">`;
                }
                html += `</div>`;
            });
        }

        // 6. Astrocartography
        if (data.astrocartography) {
            html += `<div class="booklet-chapter">
                <h2>${data.astrocartography.title}</h2>
                <div class="astro-locations">
                    ${data.astrocartography.locations.map(loc => `
                        <div class="astro-loc-card">
                            <h4><i class="fa-solid fa-location-dot"></i> ${loc.city}</h4>
                            <span class="loc-purpose">${loc.purpose}</span>
                            <p>${loc.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }

        // 7. 12-Month Calendar
        if (data.calendar_12_months) {
            html += `<div class="booklet-chapter">
                <h2>12 Aylık Kozmik Takvim</h2>
                <div class="calendar-grid">
                    ${data.calendar_12_months.map(m => `
                        <div class="cal-card">
                            <div class="cal-header">${m.month}</div>
                            <div class="cal-theme">${m.theme}</div>
                            <p>${m.advice}</p>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }

        // 8. Numerology
        if (data.numerology) {
            html += `
            <div class="booklet-chapter">
                <h2>${data.numerology.title || "Numeroloji"}</h2>
                <div class="numerology-card">
                    <div class="num-display">${data.numerology.life_path_number}</div>
                    <div class="num-content">
                        <h3>Hayat Yolu Sayın</h3>
                        <p>${data.numerology.analysis}</p>
                    </div>
                </div>
            </div>`;
        }

        // 9. Download
        html += `
            <div class="report-actions" style="margin-top: 80px; text-align: center;">
                 <button class="btn-primary" onclick="window.print()">
                    <i class="fa-solid fa-file-pdf"></i> HAYAT KİTABINI İNDİR
                 </button>
            </div>
        `;

        contentDiv.innerHTML = html;
        console.log("Mega Booklet Rendered Successfully");
    }
    // updateWallpaper removed as images are now handled directly via backend URLs

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