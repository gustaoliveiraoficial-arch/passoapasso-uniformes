import fs from 'fs'
import path from 'path'

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9HQiIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTcyMzE5OTA2MyIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc3ODgyODA4OSwiaWF0IjoxNzc4ODA2NDg5fQ.idLuotAQfL2QceXDHMnrHX0JfhXe4Sc6mP5j2gPqxz4'
const SESSION = '62126b166d0f870f'
const BASE_LOCAL = 'C:/Users/gusta/OneDrive/Área de Trabalho/PassoaPasso/pedidos/out'
const BASE_REMOTE = '/public_html/formalizarpedido'

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const map = {
    '.html': 'text/html',
    '.txt': 'text/plain',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
  }
  return map[ext] || 'application/octet-stream'
}

function getAllFiles(dir, baseDir = dir) {
  const files = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir))
    } else {
      const relPath = fullPath.replace(baseDir + path.sep, '').replace(/\\/g, '/')
      files.push(relPath)
    }
  }
  return files
}

async function uploadFile(localRelPath, contentType) {
  const localPath = path.join(BASE_LOCAL, localRelPath)
  const content = fs.readFileSync(localPath)

  const remoteRelPath = localRelPath
    .split('/')
    .map(seg => encodeURIComponent(seg))
    .join('/')

  const url = `https://srv1938-files.hstgr.io/${SESSION}/api/resources${BASE_REMOTE}/${remoteRelPath}?override=true`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Auth': TOKEN,
      'Cookie': `auth=${TOKEN}`,
      'Content-Type': contentType,
      'Origin': 'https://srv1938-files.hstgr.io',
      'Referer': `https://srv1938-files.hstgr.io/${SESSION}/files/`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
    body: content,
  })

  const status = res.status
  if (status === 200 || status === 201 || status === 204) {
    console.log(`✓ ${status} ${localRelPath}`)
  } else {
    const body = await res.text()
    console.log(`✗ ${status} ${localRelPath}: ${body.substring(0, 100)}`)
  }
  return status
}

async function main() {
  const localDir = BASE_LOCAL.replace(/\//g, path.sep)
  const files = getAllFiles(localDir)
  console.log(`Uploading ${files.length} files to ${BASE_REMOTE}...\n`)

  let ok = 0, fail = 0
  for (const relPath of files) {
    const contentType = getContentType(relPath)
    try {
      const status = await uploadFile(relPath, contentType)
      if (status === 200 || status === 201 || status === 204) ok++
      else fail++
    } catch (e) {
      console.error(`FAILED: ${relPath} — ${e.message}`)
      fail++
    }
    await new Promise(r => setTimeout(r, 50))
  }

  console.log(`\nDone! ✓ ${ok} uploaded, ✗ ${fail} failed`)
}

main()
