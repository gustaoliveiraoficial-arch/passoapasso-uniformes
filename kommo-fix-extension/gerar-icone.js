// Gera icon.png via Canvas (Node.js com canvas, ou rodar no browser)
// Como alternativa simples, usamos um SVG convertido para PNG via sharp ou jimp

const fs = require('fs');
const path = require('path');

// SVG do ícone
const svg = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="24" fill="#C85A00"/>
  <text x="64" y="88" font-size="72" text-anchor="middle" font-family="sans-serif">🔧</text>
</svg>`;

// Salva o SVG como fallback
fs.writeFileSync(path.join(__dirname, 'icon.svg'), svg);

console.log('SVG gerado. Use um conversor online SVG→PNG se necessário.');
console.log('Ou use a extensão sem ícone — funciona normalmente.');
