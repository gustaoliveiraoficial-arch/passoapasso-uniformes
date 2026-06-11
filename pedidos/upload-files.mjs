import fs from 'fs'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9HQiIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTcyMzE5OTA2MyIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc3ODY5ODM5NywiaWF0IjoxNzc4Njc2Nzk3fQ.1IbwFMSVlY0tyG3J-s4KxqHirTDU6PGr3pGr1_tTUsM'
const SESSION = '64855dfaf4872198'
const BASE_LOCAL = 'C:/Users/gusta/OneDrive/Área de Trabalho/PassoaPasso/pedidos/out2'
const BASE_REMOTE = '/public_html/formalizarpedido'

const FILES = [
  // Placeholder index.html e index.txt para cada rota dinâmica
  ['pedido/__placeholder__/index.html', 'text/html'],
  ['pedido/__placeholder__/index.txt', 'text/plain'],
  ['arquivos/__placeholder__/index.html', 'text/html'],
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
  // JS chunks dos dynamic routes
  ['_next/static/chunks/app/pedido/[id]/page-9d2c7b7f32d05d5c.js', 'application/javascript'],
  ['_next/static/chunks/app/arquivos/[id]/page-9c1d50110724c5d1.js', 'application/javascript'],
  ['_next/static/chunks/app/cliente-pdf/[id]/page-6e4208b12cacf9ed.js', 'application/javascript'],
  ['_next/static/chunks/app/confirmacao/[id]/page-1fcfaaf2534c09e9.js', 'application/javascript'],
  ['_next/static/chunks/app/lista-tamanhos/[id]/page-c1659ec91cf9b252.js', 'application/javascript'],
  ['_next/static/chunks/app/pedido-completo/[id]/page-497c4b8f322e1e65.js', 'application/javascript'],
  ['_next/static/chunks/app/tamanhos/[token]/page-365897b77899bef9.js', 'application/javascript'],
]

function uploadFile(localRelPath, contentType) {
  return new Promise((resolve, reject) => {
    const localPath = `${BASE_LOCAL}/${localRelPath}`
    const content = fs.readFileSync(localPath)

    // Encode path segments but preserve slashes
    const remoteRelPath = localRelPath
      .split('/')
      .map(seg => encodeURIComponent(seg))
      .join('/')

    const apiPath = `/${SESSION}/api/resources${BASE_REMOTE}/${remoteRelPath}?override=true`

    const options = {
      hostname: 'srv1938-files.hstgr.io',
      port: 443,
      path: apiPath,
      method: 'POST',
      headers: {
        'X-Auth': TOKEN,
        'Cookie': `auth=${TOKEN}`,
        'Content-Type': contentType,
        'Content-Length': content.length,
      }
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 204) {
          console.log(`✓ ${res.statusCode} ${localRelPath}`)
          resolve(res.statusCode)
        } else {
          console.log(`✗ ${res.statusCode} ${localRelPath}: ${body.substring(0, 200)}`)
          resolve(res.statusCode) // resolve anyway to continue
        }
      })
    })

    req.on('error', (e) => {
      console.error(`ERROR ${localRelPath}: ${e.message}`)
      reject(e)
    })

    req.write(content)
    req.end()
  })
}

async function main() {
  console.log(`Uploading ${FILES.length} files...\n`)
  for (const [relPath, contentType] of FILES) {
    try {
      await uploadFile(relPath, contentType)
    } catch (e) {
      console.error(`FAILED: ${relPath}`)
    }
    // small delay to avoid hammering the server
    await new Promise(r => setTimeout(r, 200))
  }
  console.log('\nDone!')
}

main()
