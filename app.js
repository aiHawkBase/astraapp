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
                    "intro": "Kullanıcıya özel yazılmış, en az 1000 kelimelik, ruhsal potansiyelini ve bu raporun önemini anlatan destansı bir giriş.",
                    "chapter_1_identity": "GÜNEŞ BURCU VE KOZMİK KİMLİK: (En az 1500 kelime) Kişinin özü, yaşam amacı, babasıyla ilişkisi, parladığı alanlar, gölge yönleri ve mitolojik arketipleri.",
                    "chapter_2_mask": "YÜKSELEN BURCU VE SOSYAL MASKE: (En az 1500 kelime) Dış dünyaya gösterdiği yüz, fiziksel özellikleri, ilk izlenimi, çocukluk travmaları ve başkalarının onu nasıl algıladığı.",
                    "chapter_3_emotion": "AY BURCU VE DUYGUSAL DÜNYA: (En az 1500 kelime) Bilinçaltı, annesiyle ilişkisi, duygusal ihtiyaçları, korkuları, güvende hissetme yolları ve ruhsal kökleri.",
                    "chapter_4_love": "AŞK, İLİŞKİLER VE CİNSELLİK: (En az 1500 kelime) Venüs ve Mars analizi, aşk dili, ideal partneri, ilişkilerde yaptığı hatalar, cinsel enerjisi ve karmik eşleşmeleri.",
                    "chapter_5_karma": "SATÜRN, KARMA VE ÖNCEKİ YAŞAMLAR: (En az 1500 kelime) Karmik borçlar, yaşam sınavları, korkuları ve ruhsal büyüme planı.",
                    "chapter_6_career": "KARİYER, FİNANS VE BAŞARI: (En az 1500 kelime) Mesleki yetenekleri, zenginlik potansiyeli, finansal şansı ve ideal kariyer yolu.",
                    "chapter_7_numerology": "NUMEROLOJİ VE KADER SAYISI: (En az 1000 kelime) Hayat Yolu Numarasının derin analizi ve yaşam misyonu.",
                    "chapter_8_forecast_q1": "GELECEK PROJEKSİYONU (İLK 3 AY): (En az 1000 kelime) Önümüzdeki 3 ay için ay ay detaylı öngörüler.",
                    "chapter_9_forecast_q2": "GELECEK PROJEKSİYONU (SONRAKİ 3 AY): (En az 1000 kelime) Sonraki 3 ay için ay ay detaylı öngörüler.",
                    "chapter_10_ritual": "KİŞİSEL GÜÇ RİTÜELİ: (En az 800 kelime) Kullanıcıya özel, uygulanabilir ve dönüştürücü bir ritüel."
                },
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
                // 1. Job Oluştur (API'ye Gönder)
                const res = await fetch('/api/generate-reading', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt })
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
        const userEmail = document.getElementById('userEmail').value;

        payBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> İşleminiz Onaylanıyor...';
        payBtn.disabled = true;

        // Fake Delay for Payment Processing
        await new Promise(r => setTimeout(r, 2000));

        Mascot.say("Ödeme başarıyla alındı! Analiz sürecini başlattım.", 3000);

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

                Mascot.say("Müjde! Raporun beklenenden hızlı hazırlandı. Hemen inceleyebilirsin.");
            }

        } catch (error) {
            console.error("Background Job Failed:", error);
            // Silent fail - user expects email anyway
        }
    });

    document.getElementById('btn-view-report').addEventListener('click', () => {
        switchStep(steps.succ, steps.report);
        Mascot.say("İşte hayatının rehberi. Dikkatlice oku.");
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

        // 1. Booklet Header
        const title = data.booklet_title || `Kozmik Rehber: ${user.name}`;
        let html = `
            <div class="booklet-header">
                <h1>${title}</h1>
                <p>Hazırlanan: <strong>${user.name}</strong> | ${new Date().toLocaleDateString('tr-TR')}</p>
            </div>
        `;

        // 2. Cover Image
        if (data.images && data.images.cover) {
            html += `<img src="${data.images.cover}" class="booklet-image" alt="Kozmik Kapak">`;
        } else if (data.image_prompts && data.image_prompts[0]) {
            // Fallback for old API response
            html += `<div class="alert-box">Görsel yükleniyor...</div>`;
        }

        // 3. Chapters
        if (data.chapters && Array.isArray(data.chapters)) {
            data.chapters.forEach((chap, index) => {
                html += `<div class="booklet-chapter">
                    <h2>${chap.title}</h2>
                    <div class="chapter-content"><p>${chap.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p></div>`;

                // Inject Love Image
                if (data.images?.love && (chap.title.includes('Aşk') || chap.title.includes('İlişki') || index === 2)) {
                    html += `<img src="${data.images.love}" class="booklet-image" alt="Aşk ve İlişkiler">`;
                }

                // Inject Career Image
                if (data.images?.career && (chap.title.includes('Kariyer') || chap.title.includes('Para') || index === 4)) {
                    html += `<img src="${data.images.career}" class="booklet-image" alt="Kariyer ve Başarı">`;
                }

                html += `</div>`;
            });
        } else if (data.full_report) {
            // FALLBACK for Mock Data or Old Structure
            const r = data.full_report;
            html += `<div class="booklet-chapter"><h2>Giriş</h2><p>${r.intro}</p></div>`;
            html += `<div class="booklet-chapter"><h2>Kimlik</h2><p>${r.chapter_1_identity}</p></div>`;
            html += `<div class="booklet-chapter"><h2>Aşk</h2><p>${r.chapter_4_love}</p></div>`;
            html += `<div class="booklet-chapter"><h2>Kariyer</h2><p>${r.chapter_6_career}</p></div>`;
        }

        // 4. Numerology
        if (data.numerology) {
            html += `
            <div class="booklet-chapter">
                <h2>Numeroloji & Kader Yolu</h2>
                <div class="numerology-card">
                    <div class="num-display">${data.numerology.life_path_number}</div>
                    <div class="num-content">
                        <h3>Hayat Yolu Sayın</h3>
                        <p>${data.numerology.analysis}</p>
                    </div>
                </div>
            </div>`;
        }

        // 5. Download Action
        html += `
            <div class="report-actions" style="margin-top: 60px; text-align: center;">
                 <button class="btn-primary" onclick="window.print()">
                    <i class="fa-solid fa-file-pdf"></i> Kitapçığı PDF Olarak İndir
                 </button>
            </div>
        `;

        contentDiv.innerHTML = html;
        console.log("Booklet Rendered Successfully");
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