import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import http from 'http'

const BUILD_DIR = 'C:/Users/gusta/OneDrive/Área de Trabalho/PassoaPasso/pedidos/out'
const REMOTE_BASE = '/public_html/formalizarpedido'
const LOCAL_PORT = 7791
const LOCAL_SERVER = `http://127.0.0.1:${LOCAL_PORT}`

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

function startLocalServer() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET')
      if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return }
      const filePath = path.join(BUILD_DIR, decodeURIComponent(req.url || '/'))
      try {
        const content = fs.readFileSync(filePath)
        res.writeHead(200)
        res.end(content)
      } catch {
        res.writeHead(404)
        res.end('not found')
      }
    })
    server.listen(LOCAL_PORT, '127.0.0.1', () => {
      console.log(`Local server: ${LOCAL_SERVER}`)
      resolve(server)
    })
  })
}

async function main() {
  const server = await startLocalServer()

  const browser = await chromium.launchPersistentContext(
    'C:/temp/playwright-hostinger-profile',
    { headless: false }
  )
  const page = browser.pages()[0] || await browser.newPage()

  console.log('Abrindo file manager...')
  await page.goto(
    'https://hpanel.hostinger.com/websites/passoapassouniformes.com/files/file-manager',
    { waitUntil: 'domcontentloaded', timeout: 30000 }
  )
  await page.waitForTimeout(5000)

  // Verificar se abriu nova aba
  let filePage = page
  for (const p of browser.pages()) {
    if (p.url().includes('hstgr.io') && p.url().includes('/files/')) {
      filePage = p
      break
    }
  }

  if (!filePage.url().includes('hstgr.io')) {
    console.log('Tentando clicar para abrir file manager...')
    try {
      const btns = await page.$$('button, a')
      for (const btn of btns) {
        const txt = await btn.textContent()
        if (txt && txt.includes('arquivo')) {
          await btn.click()
          await page.waitForTimeout(4000)
          break
        }
      }
      for (const p of browser.pages()) {
        if (p.url().includes('hstgr.io')) { filePage = p; break }
      }
    } catch (e) {
      console.log('Erro ao clicar:', e.message)
    }
  }

  await filePage.waitForTimeout(2000)
  const url = filePage.url()
  console.log('File manager URL:', url)

  const sessionMatch = url.match(/hstgr\.io\/([a-f0-9]+)\//)
  if (!sessionMatch) {
    console.error('SESSION não encontrada! Precisa estar logado no Hostinger.')
    await browser.close()
    server.close()
    return
  }

  const SESSION = sessionMatch[1]
  const TOKEN = await filePage.evaluate(() => document.cookie.split('auth=')[1]?.split(';')[0])
  console.log('SESSION:', SESSION)
  console.log('TOKEN:', TOKEN ? TOKEN.substring(0, 40) + '...' : 'NÃO ENCONTRADO')

  if (!TOKEN) {
    console.error('TOKEN não encontrado!')
    await browser.close()
    server.close()
    return
  }

  const files = getAllFiles(BUILD_DIR)
  console.log(`\nUpload de ${files.length} arquivos para ${REMOTE_BASE}...\n`)

  let ok = 0, fail = 0

  for (const relPath of files) {
    const encodedPath = relPath.split('/').map(s => encodeURIComponent(s)).join('/')
    const apiUrl = `https://srv1938-files.hstgr.io/${SESSION}/api/resources${REMOTE_BASE}/${encodedPath}?override=true`
    const localUrl = `${LOCAL_SERVER}/${encodedPath}`

    try {
      const result = await filePage.evaluate(async ({ localUrl, apiUrl, token }) => {
        try {
          const resp = await fetch(localUrl)
          if (!resp.ok) return { ok: false, code: resp.status, reason: 'local_fetch' }
          const blob = await resp.blob()
          const up = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'X-Auth': token },
            body: blob,
          })
          return { ok: up.ok, code: up.status }
        } catch (e) {
          return { ok: false, code: 0, reason: e.message }
        }
      }, { localUrl, apiUrl, token: TOKEN })

      if (result.ok) {
        console.log(`✓ ${result.code} ${relPath}`)
        ok++
      } else {
        console.log(`✗ ${result.code} ${relPath} (${result.reason || ''})`)
        fail++
      }
    } catch (e) {
      console.error(`ERRO ${relPath}: ${e.message}`)
      fail++
    }

    await filePage.waitForTimeout(60)
  }

  console.log(`\nConcluído! ✓ ${ok} enviados | ✗ ${fail} falhas`)
  await browser.close()
  server.close()
}

main().catch(console.error)
