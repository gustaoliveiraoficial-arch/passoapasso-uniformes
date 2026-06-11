import fs from 'fs'

const base = 'C:/Users/gusta/OneDrive/Área de Trabalho/PassoaPasso/pedidos/out2'

const files = [
  // Remaining placeholders (pedido html/txt already done, arquivos html done)
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
  // JS chunks
  ['_next/static/chunks/app/pedido/[id]/page-9d2c7b7f32d05d5c.js', 'application/javascript'],
  ['_next/static/chunks/app/arquivos/[id]/page-9c1d50110724c5d1.js', 'application/javascript'],
  ['_next/static/chunks/app/cliente-pdf/[id]/page-6e4208b12cacf9ed.js', 'application/javascript'],
  ['_next/static/chunks/app/confirmacao/[id]/page-1fcfaaf2534c09e9.js', 'application/javascript'],
  ['_next/static/chunks/app/lista-tamanhos/[id]/page-c1659ec91cf9b252.js', 'application/javascript'],
  ['_next/static/chunks/app/pedido-completo/[id]/page-497c4b8f322e1e65.js', 'application/javascript'],
  ['_next/static/chunks/app/tamanhos/[token]/page-365897b77899bef9.js', 'application/javascript'],
]

const tasks = files.map(([relPath, mime]) => {
  const content = fs.readFileSync(`${base}/${relPath}`)
  const b64 = content.toString('base64')
  return { path: relPath, mime, b64 }
})

// Output as JS function string for browser_evaluate
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

// Write to file so we can check the size
fs.writeFileSync('upload-fn.js', fnStr)
console.log(`Function size: ${(fnStr.length / 1024).toFixed(1)} KB`)
console.log('Written to upload-fn.js')
