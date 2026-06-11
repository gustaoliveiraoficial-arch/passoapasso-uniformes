import fs from 'fs'

const base = 'C:/Users/gusta/OneDrive/Área de Trabalho/PassoaPasso/pedidos/out2'

// Only remaining placeholder files (pedido/html, pedido/txt, arquivos/html already uploaded)
const files = [
  ['arquivos/__placeholder__/index.txt', 'text/plain'],
  ['cliente-pdf/__placeholder__/index.html', 'text/html'],
  ['cliente-pdf/__placeholder__/index.txt', 'text/plain'],
  ['confirmacao/__placeholder__/index.html', 'text/html'],
  ['confirmacao/__placeholder__/index.txt', 'text/plain'],
  ['lista-tamanhos/__placeholder__/index.html', 'text/html'],
  ['lista-tamanhos/__placeholder__/index.txt', 'text/plain'],
  ['pedido-completo/__placeholder__/index.html', 'text/html'],
  ['pedido-completo/__placeholder__/index.txt', 'text/plain'],
  ['tamanhos/__placeholder__/index.html', 'text/html'],
  ['tamanhos/__placeholder__/index.txt', 'text/plain'],
]

const tasks = files.map(([relPath, mime]) => {
  const content = fs.readFileSync(`${base}/${relPath}`)
  return { path: relPath, mime, b64: content.toString('base64') }
})

const json = JSON.stringify(tasks)
const fnStr = `async () => {
  const tasks = ${json};
  const results = [];
  for (const t of tasks) {
    const r = await window._uploadFile(t.path, t.b64, t.mime);
    results.push(r);
  }
  return results.join('\\n');
}`

fs.writeFileSync('upload-placeholders-fn.js', fnStr)
console.log(`Placeholder function size: ${(fnStr.length / 1024).toFixed(1)} KB`)
