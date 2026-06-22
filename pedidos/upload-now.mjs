import fs from 'fs'
import path from 'path'

const BUILD_DIR = 'C:/temp/pedidos-build'
const REMOTE_BASE = '/public_html/formalizarpedido'
const SESSION = '8b74494a3a85a680'
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9HQiIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTcyMzE5OTA2MyIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4MTczMTQzNiwiaWF0IjoxNzgxNzA5ODM2fQ.XH_Zoe6_lao-M-WzEv7CZjXbJEQQ-3HtcmSc3B4_1cg'

function getAllFiles(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllFiles(full, rel))
    } else {
      files.push(rel)
    }
  }
  return files
}

async function main() {
  const files = getAllFiles(BUILD_DIR)
  console.log(`Upload de ${files.length} arquivos para ${REMOTE_BASE}...\n`)

  let ok = 0, fail = 0

  for (const relPath of files) {
    const encodedPath = relPath.split('/').map(s => encodeURIComponent(s)).join('/')
    const apiUrl = `https://srv1938-files.hstgr.io/${SESSION}/api/resources${REMOTE_BASE}/${encodedPath}?override=true`
    const fullPath = path.join(BUILD_DIR, relPath)

    try {
      const content = fs.readFileSync(fullPath)
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'X-Auth': TOKEN },
        body: content,
      })
      if (res.ok) {
        console.log(`✓ ${res.status} ${relPath}`)
        ok++
      } else {
        const txt = await res.text().catch(() => '')
        console.log(`✗ ${res.status} ${relPath} ${txt.slice(0, 80)}`)
        fail++
      }
    } catch (e) {
      console.error(`ERRO ${relPath}: ${e.message}`)
      fail++
    }
  }

  console.log(`\nConcluído! ✓ ${ok} enviados | ✗ ${fail} falhas`)
}

main().catch(console.error)
