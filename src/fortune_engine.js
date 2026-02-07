const horoscopePool = require('./data/horoscope_pool');

class FortuneEngine {
    constructor() {
        this.data = horoscopePool;
        this.signs = ["KOÇ", "BOĞA", "İKİZLER", "YENGEÇ", "ASLAN", "BAŞAK", "TERAZİ", "AKREP", "YAY", "OĞLAK", "KOVA", "BALIK"];
    }

    getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    getCliffhangers(count = 3) {
        const selected = [];
        const pool = [...this.data.cliffhangers]; 
        for(let i=0; i<count; i++) {
            if(pool.length === 0) break;
            const randomIndex = Math.floor(Math.random() * pool.length);
            let sentence = pool[randomIndex];
            const letter = this.getRandom(this.data.criticalFindings.letters);
            sentence = sentence.replace('{LETTER}', letter);
            selected.push(sentence);
            pool.splice(randomIndex, 1);
        }
        return selected;
    }

    generateChartData() {
        const planets = [];
        const planetNames = ['Güneş', 'Ay', 'Merkür', 'Venüs', 'Mars', 'Jüpiter', 'Satürn', 'Uranüs', 'Neptün', 'Plüton'];
        for(let p of planetNames) {
            planets.push({
                name: p,
                angle: Math.floor(Math.random() * 360),
                radius: 40 + Math.random() * 40 
            });
        }
        return planets;
    }

    // Yükselen Burç Hesaplama (Simülasyon)
    calculateRisingSign(sunSignStr, birthTimeStr) {
        if (!birthTimeStr) return "BİLİNMEYEN";

        const sunSignIndex = this.signs.findIndex(s => s === sunSignStr.toUpperCase());
        if (sunSignIndex === -1) return "BİLİNMEYEN";

        // Saati parse et (00:00 - 23:59)
        const [hour, minute] = birthTimeStr.split(':').map(Number);
        
        // Varsayım: Güneş 06:00'da doğar ve Yükselen o an Güneş burcudur.
        // Her 2 saatte bir burç ileri gider.
        
        let hourDiff = hour - 6; 
        let signShift = Math.floor(hourDiff / 2);
        
        // Negatif saat farkı için (gece yarısından sabah 6'ya kadar)
        // Örn: 04:00 -> -2 saat -> -1 burç
        
        let risingIndex = (sunSignIndex + signShift) % 12;
        if (risingIndex < 0) risingIndex += 12;

        return this.signs[risingIndex];
    }

    generateFortune(sign, name = "Misafir", location = "", birthTime = "12:00") {
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        const locString = location ? location.toUpperCase() : "BİLİNMEYEN KONUM";
        const signUpper = sign.toUpperCase();

        // Yükselen Hesapla
        const risingSign = this.calculateRisingSign(signUpper, birthTime);
        const risingComment = this.data.rising[risingSign] || "Yükselen burcunuz hesaplanırken bir anomali oluştu.";

        // Aşama 1
        const intro = this.getRandom(this.data.intros);
        const loveSubject = this.getRandom(this.data.love.subjects);
        const loveAction = this.getRandom(this.data.love.actions);
        const loveContext = this.getRandom(this.data.love.contexts);
        
        // Aşama 2
        const career = this.getRandom(this.data.career);
        const house1 = this.getRandom(this.data.houses.first);
        const house7 = this.getRandom(this.data.houses.seventh);
        
        // Aşama 3
        const teasers = this.getCliffhangers(3);
        const chartData = this.generateChartData();

        return {
            meta: {
                user: formattedName,
                location: locString,
                sign: signUpper,
                rising: risingSign,
                time: birthTime
            },
            stage1: {
                title: "Genel Atmosfer",
                content: [
                    `Sayın **${formattedName}**, ${intro}`,
                    `**Aşk Enerjisi:** ${loveSubject}, ${loveAction} ${loveContext}`
                ]
            },
            stage2: {
                title: `${locString} Koordinat Analizi`,
                chartData: chartData,
                content: [
                    `**Yükselen Burcunuz: ${risingSign}**`,
                    `*${risingComment}*`,
                    `**1. Ev Analizi:** ${house1}`,
                    `**Kariyer:** ${career}`
                ]
            },
            stage3: {
                title: "🛑 72 SAATLİK KRİTİK UYARI",
                lockedItems: teasers
            }
        };
    }
}

module.exports = FortuneEngine;
