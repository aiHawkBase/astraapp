// ULTRA DETAYLI ASTROLOJİ VERİTABANI
// "Cold Reading" teknikleri ve kombinasyonel metinler içerir.

const astroData = {
    signs: {
        koc: { name: "Koç", icon: "fa-solid fa-fire", element: "Ateş", dates: "21 Mart - 19 Nisan" },
        boga: { name: "Boğa", icon: "fa-solid fa-leaf", element: "Toprak", dates: "20 Nisan - 20 Mayıs" },
        ikizler: { name: "İkizler", icon: "fa-solid fa-wind", element: "Hava", dates: "21 Mayıs - 20 Haziran" },
        yengec: { name: "Yengeç", icon: "fa-solid fa-water", element: "Su", dates: "21 Haziran - 22 Temmuz" },
        aslan: { name: "Aslan", icon: "fa-solid fa-sun", element: "Ateş", dates: "23 Temmuz - 22 Ağustos" },
        basak: { name: "Başak", icon: "fa-solid fa-wheat-awn", element: "Toprak", dates: "23 Ağustos - 22 Eylül" },
        terazi: { name: "Terazi", icon: "fa-solid fa-scale-balanced", element: "Hava", dates: "23 Eylül - 22 Ekim" },
        akrep: { name: "Akrep", icon: "fa-solid fa-scorpion", element: "Su", dates: "23 Ekim - 21 Kasım" },
        yay: { name: "Yay", icon: "fa-solid fa-bow-arrow", element: "Ateş", dates: "22 Kasım - 21 Aralık" },
        oglak: { name: "Oğlak", icon: "fa-solid fa-mountain", element: "Toprak", dates: "22 Aralık - 19 Ocak" },
        kova: { name: "Kova", icon: "fa-solid fa-jug-detergent", element: "Hava", dates: "20 Ocak - 18 Şubat" },
        balik: { name: "Balık", icon: "fa-solid fa-fish", element: "Su", dates: "19 Şubat - 20 Mart" }
    },

    // KATEGORİ 1: İLK TEASER (Doğum Tarihi Girilince)
    // 3 Parçadan oluşur: [Derin Karakter] + [Şu Anki Ruh Hali] + [Gizemli Uyarı]
    
    deepCharacter: {
        koc: [
            "İçinizde sönmek bilmeyen bir fethetme arzusu var. İnsanlar sizi 'cesur' sanıyor ama aslında en büyük korkunuz durmak. Hareket etmediğiniz an yok olacağınızı hissediyorsunuz. Başkalarının 'imkansız' dediği şeyler, sizin için sadece 'henüz yapılmamış' işler.",
            "Liderlik sizin için bir seçim değil, bir refleks. Ancak bu güçlü kabuğun altında, sevdiklerini kaybetmekten ölesiye korkan ve aslında onayı çok önemseyen kırılgan bir çocuk saklı. Çoğu zaman kendi savaşınızı kendiniz vermeyi tercih ediyorsunuz çünkü 'yük olmak' kitabınızda yazmaz.",
            "Dünyaya bir savaşçı olarak geldiniz. Sizi en çok yoran şey dış engeller değil, kendi sabırsızlığınız. Zihniniz o kadar hızlı çalışıyor ki, etrafınızdaki insanların yavaşlığı sizi bazen deli ediyor."
        ],
        boga: [
            "Güven ve huzur... Sizin için bu iki kelime oksijen kadar önemli. Dışarıdan bakıldığında sarsılmaz bir kale gibisiniz, ancak iç dünyanızda değişim rüzgarları estiğinde fırtınalar kopuyor. Sadakat sizin için bir erdem değil, bir yaşam biçimi.",
            "Güzelliğe, dokuya, kokuya olan düşkünlüğünüz yüzeysel bir haz arayışı değil; ruhunuzun estetikle beslenmesi. İnatçı olduğunuz söylenir, oysa siz sadece ne istediğini çok iyi bilen bir istikrar abidesisiniz.",
            "Siz toprağın ta kendisisiniz. Bereketli, sabırlı ama öfkelendiğinde depremler yaratan. Maddi güvence arayışınız açgözlülükten değil, sevdiklerinize güvenli bir liman sağlama isteğinizden geliyor."
        ],
        ikizler: [
            "Zihniniz bir arı kovanı gibi; binlerce fikir aynı anda vızıldıyor. İnsanlar sizin 'kararsız' olduğunuzu düşünüyor, oysa siz sadece tüm olasılıkları aynı anda görüyorsunuz. Bu yetenek hem en büyük hediyeniz hem de lanetiniz.",
            "İletişim kurmadığınızda soluyorsunuz. Sizin için anlaşılmak, sevilmekten bile daha önemli olabilir. Çift ruhlu değilsiniz, sadece o kadar çok yönünüz var ki tek bir kalıba sığmıyorsunuz.",
            "Bilgiye olan açlığınız hiç bitmiyor. Her şeyi merak ediyorsunuz, her kapıyı aralamak istiyorsunuz. Ancak bu hız bazen ruhunuzu yoruyor ve 'gerçek benliğim hangisi?' sorusuyla baş başa kalıyorsunuz."
        ],
        yengec: [
            "Siz duyguların okyanusunda yüzmeyi bilen nadir ruhlardansınız. Kabuğunuz sert, çünkü içindeki inciyi korumak zorundasınız. Geçmişi asla unutmuyorsunuz; her anı, her koku, her ses zihninizde canlı bir film şeridi gibi.",
            "Anaçlığınız sadece çocuklara değil, dokunduğunuz her şeye karşı. Bir evi yuvaya dönüştüren sihirli bir dokunuşunuz var. Ancak bazen başkalarının acılarını sünger gibi emmek sizi tüketiyor.",
            "Ay tarafından yönetilmek demek, med-cezirleri ruhunda hissetmek demektir. Bir sabah dünyanın en neşeli insanı, akşamına en melankolik şairi olabilirsiniz. Sizi anlamak sabır ister."
        ],
        aslan: [
            "Siz bir kral veya kraliçe gibi yürüyorsunuz, ama tacınızın ağırlığını kimse görmüyor. Onaylanma ve takdir edilme ihtiyacınız egonuzdan değil, kalbinizin cömertliğini paylaşma arzunuzdan geliyor.",
            "Güneş sizin için parlıyor. Girdiğiniz ortamın enerjisini değiştirme gücüne sahipsiniz. Ancak en büyük korkunuz görmezden gelinmek. Sahne ışıkları söndüğünde hissettiğiniz yalnızlık çok derin olabiliyor.",
            "Yaratıcılık sizin damarlarınızda akıyor. Sıradanlık size göre değil. Sevdiğiniz zaman tüm kalbinizle, tüm varlığınızla seviyorsunuz. İhanet ise asla affedemeyeceğiniz tek günah."
        ],
        basak: [
            "Kaosun içindeki düzeni görebilen tek göz sizinki. Detaylar... Herkesin atladığı o küçücük detaylar sizin dünyanızı oluşturuyor. Mükemmeliyetçiliğiniz kendinizi yıpratıyor ama elinizden başka türlüsü gelmiyor.",
            "Hizmet etmek, iyileştirmek, düzeltmek... Ruhunuzun misyonu bu. Ancak bazen o kadar çok başkalarını düşünüyorsunuz ki, kendi ihtiyaç listenizi kaybettiniz. Zihniniz asla susmayan bir analiz makinesi.",
            "Eleştirel bakışınızın altında aslında dünyayı daha iyi bir yer yapma arzusu yatıyor. Kendinize karşı çok acımasızsınız. Biraz şefkat, özellikle kendinize, en çok ihtiyacınız olan ilaç."
        ],
        terazi: [
            "Hayatınızın gayesi denge. Ancak o dengeyi bulmak için ne kadar çok sallandığınızı kimse bilmiyor. Çatışmadan kaçınmak için bazen kendi doğrularınızdan bile vazgeçebiliyorsunuz.",
            "Güzellik ve uyum sizin için nefes almak gibi. Kaba ve çirkin ortamlarda fiziksel olarak hastalanıyorsunuz. İlişkiler sizin aynanız; kendinizi başkasının gözünden görmeye ihtiyaç duyuyorsunuz.",
            "Adalet duygunuz o kadar keskin ki, haksızlık karşısında sessiz kalamıyorsunuz. Kararsızlığınızın sebebi hata yapma korkusu değil, kimseyi kırmadan en doğru yolu bulma çabası."
        ],
        akrep: [
            "Siz buzdağı gibisiniz; görünen kısmınız sadece %10. Derinliklerinizde okyanus çukurları kadar karanlık ve gizemli sırlar var. İnsanlar gözlerinize bakmaya çekiniyor çünkü ruhlarını okuduğunuzu hissediyorlar.",
            "Dönüşüm sizin ikinci adınız. Küllerinden doğmak... Kaç kere yıkılıp yeniden inşa ettiniz kendinizi? Tutkularınız o kadar yoğun ki, bazen kendinizi bile yakıyorsunuz.",
            "Güven sizin için kazanılması en zor kale. Bir kere ihanete uğradığınızda o kapı sonsuza dek kapanır. Ama sevdiğinizde, ölümüne, tutkuyla ve sonsuz bir sadakatle seversiniz."
        ],
        yay: [
            "Siz bu dünyanın gezgini, ebedi öğrencisisiniz. Sınırlar sizi boğuyor. Fiziksel veya zihinsel olarak sürekli bir yolculuk halindesiniz. Okunuzu hep ufkun ötesine, imkansıza atıyorsunuz.",
            "İyimserliğiniz en büyük kalkanınız. En karanlık anlarda bile 'bunun da bir nedeni vardır' diyebilen felsefi bir yapınız var. Ancak bazen gerçeklerden kaçmak için bu iyimserliğin arkasına saklanıyorsunuz.",
            "Özgürlük... Sizin için hava ve su kadar hayati. Sizi kısıtlamaya çalışan her ilişkiyi, her işi terk edersiniz. Dürüstlüğünüz bazen patavatsızlık sınırında, ama asla yalan söylemezsiniz."
        ],
        oglak: [
            "Siz zamanın efendisisiniz. Gençken yaşlı bir ruh, yaşlandıkça gençleşen bir enerji... Zirveye tırmanmak sizin kaderiniz. Yavaş, emin adımlarla ve asla vazgeçmeden.",
            "Sorumluluk duygusu omuzlarınızda doğuştan bir pelerin. Duygularınızı göstermeyi zayıflık sayıyorsunuz ama o duvarların ardında çok derin seven, koruyucu bir kalp var.",
            "Başarı sizin için alkışlanmak değil, kalıcı bir şeyler inşa etmek. Melankoliye yatkınsınız çünkü hayatın zorluğunu herkesten daha net görüyorsunuz. Sizin saygınızı kazanmak, sevginizi kazanmaktan daha zor."
        ],
        kova: [
            "Gelecekten gelmiş gibisiniz. Zihniniz çağının ötesinde çalışıyor. Toplumun kuralları sizin için sadece öneri niteliğinde. 'Neden?' sorusunu sormaktan asla vazgeçmiyorsunuz.",
            "Bireyselliğinize çok düşkünsünüz ama paradoksal olarak en hümanist burçsunuz. Tüm insanlığı sevebilirsiniz ama tek bir insana bağlanmak sizi korkutabilir. Duyguları analiz etmeye çalışmak en büyük hatanız.",
            "Sıradanlık sizin kâbusunuz. Özgün, aykırı ve elektrik yüklüsünüz. Arkadaşlık sizin için aşktan daha kutsal olabilir. Zihinsel olarak uyarılmadığınız hiçbir yerde durmazsınız."
        ],
        balik: [
            "Siz rüyaların ve gerçeğin sınırında yaşıyorsunuz. Sezgileriniz o kadar güçlü ki, bazen neyin sizin hissiniz neyin başkasının duygusu olduğunu karıştırıyorsunuz. Evrenin tüm acısını kalbinizde hissetme yeteneğiniz var.",
            "Kaçış... Zorluklarla baş etmek yerine hayal dünyanıza kaçmak en büyük savunma mekanizmanız. Sanatsal, şiirsel ve spiritüel bir aurasınız var. Mantık sizi boğar, hisleriniz ise rehberinizdir.",
            "Sınır koymakta zorlanıyorsunuz. Merhametiniz bazen suiistimal ediliyor. 'Hayır' demeyi öğrendiğiniz gün, dünyanın en güçlü insanı olacaksınız. Siz okyanusun ta kendisisiniz; bazen dingin, bazen fırtınalı."
        ]
    },

    currentVibe: {
        fire: [ // Koç, Aslan, Yay
            "Şu an hayatında büyük bir temizlik dönemi. Sana yük olan insanları, eskimiş eşyaları, işe yaramayan düşünceleri tek tek atıyorsun.",
            "İçinde patlamaya hazır bir enerji var ama nereye kanalize edeceğini bilemiyorsun. Sanki bir şeylerin eli kulağında, büyük bir haber bekliyor gibisin.",
            "Son 3 haftadır uyku düzenin bozuk. Geceleri zihnin susmuyor. Geçmişte yaptığın bir hatayı sürekli başa sarıp izliyorsun."
        ],
        earth: [ // Boğa, Başak, Oğlak
            "Maddi konularda bir daralma hissi veya gelecek kaygısı şu an en baskın duygun. 'Yeterli miyim?' sorusu kafanı kurcalıyor.",
            "Bir süredir insanlardan uzaklaşmak, kendi kabuğuna çekilmek istiyorsun. Gürültü, kalabalık ve boş muhabbetler sana batıyor.",
            "Bedenin sinyal veriyor. Boyun, sırt veya mide bölgen stresin biriktiği yer. Biraz durup nefes alman gerek."
        ],
        air: [ // İkizler, Terazi, Kova
            "Telefonun elinden düşmüyor ama aradığın mesaj gelmiyor gibi. Bir belirsizlik seni içten içe kemiriyor. Arafta kalmaktan nefret ediyorsun.",
            "Zihnin aynı anda 5 farklı senaryo yazıyor. 'Ya şöyle olursa?' diye düşünmekten anın tadını kaçırıyorsun. Karar vermen gereken bir konu var ve sürekli erteliyorsun.",
            "Eski bir arkadaş veya sevgili rüyalarına veya aklına girmeye başladı. Bu bir tesadüf değil, kozmik bir hatırlatma."
        ],
        water: [ // Yengeç, Akrep, Balık
            "Sebepsiz bir ağlama isteği veya göğsünde bir ağırlık var. Sanki bir devrin sonuna gelmişsin gibi hissediyorsun. Veda etme zamanı yaklaşıyor.",
            "Sezgilerin çığlık atıyor. Biri sana yalan söylüyor veya bir gerçeği saklıyor ve sen bunu adın gibi biliyorsun. Yüzleşmek için doğru zamanı bekliyorsun.",
            "Rüyaların bu ara çok canlı. Evren sana uykunda mesaj gönderiyor. Sabah kalktığında hissettiğin o tuhaf duyguya odaklan."
        ]
    },

    mysteryHook: [
        "Ama dikkat et... Haritanda isminde 'A' veya 'E' harfi geçen biriyle ilgili karmik bir düğüm var. Bu kişi kaderini değiştirecek.",
        "Şu an farkında değilsin ama kapının hemen eşiğinde duran bir fırsat var. Tek yapman gereken bakış açını 180 derece değiştirmek.",
        "Gezegenlerin konumu, 2 hafta içinde eline geçecek bir kağıdın (belge, sözleşme veya mesaj) hayatında yeni bir sayfa açacağını fısıldıyor.",
        "Bir seçim yapmak üzeresin. Kalbin 'git' diyor, mantığın 'kal'. Yıldızlar ise üçüncü bir yolu işaret ediyor..."
    ],

    // KATEGORİ 2: ARA TEASER (Saat ve Şehir Girilince - Ödeme Öncesi)
    // Şehir ve Saate özel "Spesifik" korkutucu/heyecanlı yorum
    
    cityHooks: [
        "Doğum yerin ve saatinin kesişimine baktığımda, Yükselen hattının tam üzerinde Plütonik bir baskı görüyorum. Bu, hayatının ilk yıllarında yaşadığın o 'anlaşılamama' hissinin sebebini açıklıyor.",
        "Bu koordinatlar çok nadir bir açıya işaret ediyor. Kariyer evinde 'Kuzey Ay Düğümü' var. Yani sen, büyük kitlelere hitap etmek için doğmuşsun ama bir blokaj seni tutuyor.",
        "Girdiğin saat, doğum haritanın 12. evini (Bilinçaltı ve Gizli Düşmanlar) aktif ediyor. Arkandan çevrilen işleri hissetmemen imkansız. Ama asıl bomba 7. evinde...",
        "Enteresan... Bu şehir ve saat kombinasyonu, 'Geç Gelen Şans' açısına sahip. Hayatının ilk yarısı mücadeleyle geçmiş olabilir ama 30'lu yaşlardan sonra kader çarkı tersine dönüyor.",
        "Aşk evinde, tam da bu konumda bir 'Retro' gezegen var. Neden hep aynı tip insanları hayatına çektiğini hiç düşündün mü? Sorun sende değil, bu kozmik imzada."
    ],

    finalCallToAction: [
        "Bu blokajı nasıl kaldıracağını, önümüzdeki 12 ayda aşk hayatında yaşanacak o büyük tarihi ve finansal sıçrama günlerini görmek için tam analizi açmalısın.",
        "Haritanda saklı o 'Büyük Potansiyeli' açığa çıkarmak senin elinde. Yıldızlar yolu gösterir, yürümek sana kalmış. Raporunda tüm tarihler gizli.",
        "Ruh eşinin haritası ile seninki arasındaki o muazzam uyumu (veya uyumsuzluğu) kaçırmak istemezsin. Gerçekler raporda."
    ]
};

// Yardımcı Fonksiyon: Rasgele eleman seçici
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getZodiacSign(day, month) {
    // Önceki fonksiyonun aynısı
    if ((month == 1 && day <= 19) || (month == 12 && day >= 22)) return "oglak";
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "kova";
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "balik";
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "koc";
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "boga";
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "ikizler";
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "yengec";   if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "aslan";
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "basak";
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "terazi";    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "akrep";
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "yay";    return "koc";}