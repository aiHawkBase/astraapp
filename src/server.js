const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const FortuneEngine = require('./fortune_engine');

const PORT = 3000;
const engine = new FortuneEngine();

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let filePath = path.join(__dirname, '..', 'public', parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname);

    if (parsedUrl.pathname === '/api/fortune') {
        const sign = parsedUrl.query.sign || 'KOÇ';
        const name = parsedUrl.query.name || 'Misafir';
        const city = parsedUrl.query.city || '';
        const district = parsedUrl.query.district || '';
        const time = parsedUrl.query.time || '12:00'; // Yeni parametre
        
        const location = city && district ? `${city} / ${district}` : city;
        
        const fortuneData = engine.generateFortune(sign, name, location, time);
        
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(fortuneData));
        return;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 AstroInsight v4.0 (Rising Sign & Payments) Başlatıldı!`);
    console.log(`👉 http://localhost:${PORT}`);
});
