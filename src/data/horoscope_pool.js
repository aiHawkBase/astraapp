const horoscopePool = {
    // Giriş Cümleleri (Genel Atmosfer)
    intros: [
        "Yıldızların bugünkü konumu, senin için karmaşık ama bir o kadar da aydınlatıcı enerjiler taşıyor.",
        "Gökyüzü bugün senin burcunda sıra dışı bir hareketlilik sergiliyor, hazırlıklı olmalısın.",
        "Bugün evrenin fısıltılarını duymak için biraz sessizliğe ihtiyacın olabilir, enerjiler çok yoğun.",
        "Mars ve Venüs'ün oluşturduğu açı, hayatında beklenmedik kapıların aralanmasına neden olabilir.",
        "Enerjin bugün biraz dalgalı olabilir ancak içgüdülerin her zamankinden daha keskin çalışıyor.",
        "Kader çarkı bugün senin lehine dönmeye başlıyor, ancak küçük detaylara dikkat etmen şart.",
        "Bugün hissedeceğin ani duygu değişimleri, aslında ruhsal bir temizliğin habercisi.",
        "Eski defterlerin açılacağı, ancak bu sefer kalıcı olarak kapanacağı bir gündesin.",
        "Güneş'in açısı, bugüne kadar görmezden geldiğin bir gerçeği yüzüne vurabilir.",
        "Bugün mantığınla duyguların arasında bir savaş çıkabilir; kazananı sen belirleyeceksin.",
        "Etrafındaki sis perdesi aralanıyor, artık kimin dost kimin oyuncu olduğunu daha net göreceksin.",
        "Bugün tesadüf diye bir şey olmadığını çok net anlayacağın olaylar zinciri yaşanabilir."
    ],

    // Aşk ve İlişkiler
    love: {
        subjects: [
            "Eski bir tanıdık", "Hiç beklemediğin bir yabancı", "Yakın çevrenden biri", "Partnerin", "Uzun süredir görmediğin biri",
            "Sosyal medyadan seni takip eden gizli biri", "İş veya okul ortamından biri", "Aile dostlarından biri", "Geçmişte kalbini kıran biri"
        ],
        actions: [
            "seninle derin bir konuşma yapmak isteyecek", "sana karşı olan hislerini itiraf edebilir", "bir konuda senden özür dilemeye hazırlanıyor",
            "seni şaşırtacak bir sürpriz planlıyor", "seninle ilgili kafasındaki soru işaretlerini giderecek", "seninle bir kahve içmek için fırsat kolluyor",
            "senin hakkında başkalarından bilgi toplamaya çalışıyor", "sana beklenmedik bir mesaj atabilir", "sana uzun zamandır söyleyemediği bir sırrı verecek"
        ],
        contexts: [
            "ve bu durum kalbini hızlandıracak.", "ancak sen buna hemen tepki vermemelisin.", "ve bu olay ilişkinizin seyrini değiştirecek.",
            "bu da sana geçmişte yaptığın bir hatayı hatırlatabilir.", "bunun sonucunda kendini çok daha özgür hissedeceksin.",
            "fakat senin aklın o sırada tamamen başka bir yerde olacak.", "ve bu durum seni tatlı bir ikilemde bırakacak.",
            "ancak bu adımın arkasındaki gerçek niyeti sorgulaman gerekebilir.", "ve bu, yeni bir başlangıcın ilk kıvılcımı olabilir."
        ]
    },

    // Kariyer ve Para
    career: [
        "İş hayatında otorite figürleriyle yapacağın bir görüşme, beklediğin o onayın gelmesini sağlayabilir.",
        "Finansal konularda risk alma isteğin artabilir, ancak bugün imza atmadan önce iki kez düşün.",
        "Yaratıcılığının tavan yaptığı bir gündesin, aklındaki projeyi hayata geçirmek için doğru zaman.",
        "Beklenmedik bir yerden eline geçecek küçük bir miktar para, moralini düzeltecek.",
        "Kariyerinde bir yön değişikliği düşünüyorsan, bugün alacağın bir işaret sana yolu gösterecek.",
        "Ofis ortamında veya iş çevrende dönen bir dedikoduya kulaklarını tıkamalısın, seni manipüle etmeye çalışabilirler.",
        "Yatırımlarını çeşitlendirmek için bir uzmandan tavsiye alman gereken bir döneme giriyorsun.",
        "Bugün atacağın bir e-posta veya yapacağın bir telefon görüşmesi, zincirleme bir başarı getirebilir.",
        "Ekip içinde liderliğini kanıtlaman gereken bir kriz anı yaşanabilir, soğukkanlı ol.",
        "Harcamaların konusunda ipin ucunu kaçırma eğilimindesin, bugün cüzdanını kapalı tut."
    ],

    // Ev Sistemleri (Lokasyon Bazlı Analizler)
    houses: {
        first: [ 
            "Doğum yerinin koordinatlarına göre Yükselen çizginiz kritik bir derecede. İnsanlar sizi dışarıdan sert görüyor ama...",
            "Ufuk çizgisi hesaplandığında, 1. evinizde Mars etkisi var. Bu, enerjinizin neden bazen kontrolsüzce taştığını açıklıyor.",
            "Şehir koordinatlarınız Yükselen burcunuzu sınırda bırakıyor. Bu da çift karakterli bir aura yaymanıza neden oluyor."
        ],
        seventh: [ 
            "Alçalan burcunuz (Descendant) tam olarak Plüton ile kavuşum yapıyor. İlişkilerde neden hep 'dönüştürücü' krizler yaşadığınız belli oldu.",
            "7. Ev çizgisi tam bu lokasyonda kırılıyor. Sizi tamamlayan kişi aslında sandığınız karakterde biri değil.",
            "Haritanın batı ufkunda görülen bir tıkanıklık, ikili ilişkilerde sürekli aynı döngüyü yaşamanıza sebep oluyor."
        ],
        tenth: [ 
            "MC (Tepe Noktası) hesaplaması şaşırtıcı. Kariyerinizde zirve yapacağınız yaş sandığınızdan çok daha yakın.",
            "Kuzey Düğümü 10. evinizi tarıyor. Toplum önündeki statünüz önümüzdeki 6 ay içinde kökten değişecek."
        ]
    },

    // Yükselen Burç Yorumları (Maske Benlik)
    rising: {
        "KOÇ": "Yükselen Koç ile dünyaya bir savaşçı maskesiyle bakıyorsunuz. İnsanlar ilk bakışta sizi cesur ve atılgan sanıyor, ama iç dünyanızda...",
        "BOĞA": "Yükselen Boğa size sarsılmaz bir güven veriyor. Ancak bu inatçı dış kabuk, değişim fırsatlarını kaçırmanıza neden olabilir.",
        "İKİZLER": "Yükselen İkizler sayesinde her ortama uyum sağlıyorsunuz. Ama bu bukalemun yapınız, insanların size güvenmesini zorlaştırıyor.",
        "YENGEÇ": "Yükselen Yengeç, sizi dışarıdan sert kabuklu ama içeriden yumuşak kılıyor. İnsanların enerjilerini sünger gibi çekiyorsunuz.",
        "ASLAN": "Yükselen Aslan ile odaya girdiğinizde tüm gözler size dönüyor. Ancak bu parlak ışık, bazen sevdiklerinizi gölgede bırakıyor.",
        "BAŞAK": "Yükselen Başak size kusursuz bir analiz yeteneği veriyor. Herkesin hatasını ilk bakışta görmeniz bir hediye mi yoksa lanet mi?",
        "TERAZİ": "Yükselen Terazi ile diplomatik ve çekicisiniz. Ancak 'hayır' diyememek, sizi toksik ilişkilerin mıknatısı yapıyor.",
        "AKREP": "Yükselen Akrep, bakışlarınıza delici bir güç veriyor. İnsanlar sizden çekiniyor ve sırlarını saklayamıyor.",
        "YAY": "Yükselen Yay size bitmek bilmeyen bir iyimserlik veriyor. Ancak ayaklarınızın yere basmaması, finansal fırsatları kaçırtabilir.",
        "OĞLAK": "Yükselen Oğlak ile doğuştan bir otoritesiniz. İnsanlar size saygı duyuyor ama araya koyduğunuz mesafe yalnızlığınıza sebep oluyor.",
        "KOVA": "Yükselen Kova sizi tahmin edilemez ve eksantrik kılıyor. Kuralları yıkmak için varsınız ama bazen kendi kurallarınıza takılıyorsunuz.",
        "BALIK": "Yükselen Balık ile bu dünyadan değilmiş gibi bir havanız var. Rüya aleminde yaşamak güzel, ama gerçekler kapıyı çalmak üzere."
    },

    // Kritik Bulgular
    criticalFindings: {
        letters: ["A", "S", "M", "K", "E", "Z", "B", "R", "D", "T", "L", "H"]
    },

    // 🔒 PREMIUM TEASERS (Psikolojik Satış Kancaları)
    cliffhangers: [
        "Haritanın 7. evinde beliren karanlık bir açı var, bu açı isminde {LETTER} harfi olan birinin senin hakkında yaptığı gizli bir planı işaret ediyor. Bu kişi...",
        "Gelecek 48 saat senin için hayati önem taşıyor çünkü finansal evinde bir kırılma yaşanmak üzere. Bunu engellemenin tek yolu...",
        "Aşk hayatında geçmişten gelen bir karmik borç bugün kapını çalacak. Eğer şu uyarıyı dikkate almazsan...",
        "Sağlık evinde Satürn'ün yaptığı baskı, ihmal ettiğin bir konuyu tekrar gündeme getirecek. Tam olarak şu tarihe dikkat etmelisin: ...",
        "İş yerinde veya kariyerinde senin arkandan çevrilen bir dolap var. Bunu yapan kişiyi aslında tanıyorsun, o kişi...",
        "Rüyaların sana bir mesaj vermeye çalışıyor. Dün gece gördüğün veya yakında göreceğin o sembolün gerçek anlamı...",
        "Yakın bir arkadaşın senin iyiliğin gibi görünen ama aslında sana zarar verecek bir tavsiyede bulunacak. O kişi..."
    ],

    // Sağlık ve Enerji
    health: [
        "Bugün özellikle boyun ve omuz bölgendeki gerginliklere dikkat etmelisin, stres burada birikiyor.",
        "Enerjin yüksek olsa da, ani hareketlerden kaçınman gereken bir gün.",
        "Uyku düzenindeki düzensizlik, gün içindeki odaklanma sorunlarının ana kaynağı olabilir.",
        "Su tüketimini artırman gereken bir gün, vücudun toksin atmaya çalışıyor.",
        "Bugün meditasyon veya kısa bir yürüyüş, zihnindeki sisi dağıtmak için mucizeler yaratabilir."
    ]
};

module.exports = horoscopePool;
