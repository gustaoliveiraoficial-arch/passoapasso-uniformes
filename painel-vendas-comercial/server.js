const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3030;
const DIR = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.mp3':  'audio/mpeg',
  '.wav':  'audio/wav',
};

http.createServer((req, res) => {
  let filePath = path.join(DIR, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`\n✅ Painel rodando em: http://localhost:${PORT}`);
  console.log('   Pressione Ctrl+C para parar.\n');

  // Abre o navegador automaticamente no Windows
  const { exec } = require('child_process');
  exec(`start http://localhost:${PORT}`);
});
