import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const BUILD_DIR = 'C:/temp/producao-build'
const REMOTE_BASE = '/public_html/controledeproducao'
const LOCAL_SERVER = 'http://127.0.0.1:7790'

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
  const browser = await chromium.launchPersistentContext(
    'C:/temp/playwright-hostinger-profile',
    { headless: false }
  )
  const page = browser.pages()[0] || await browser.newPage()

  // Abrir file manager para pegar nova sessão
  console.log('Abrindo file manager...')
  await page.goto('https://hpanel.hostinger.com/websites/passoapassouniformes.com/files/file-manager', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  })
  await page.waitForTimeout(4000)

  // Verificar se abriu nova aba
  let filePage = page
  const allPages = browser.pages()
  for (const p of allPages) {
    const url = p.url()
    if (url.includes('hstgr.io') && url.includes('/files/')) {
      filePage = p
      break
    }
  }

  // Se não achou, clicar para abrir
  if (!filePage.url().includes('hstgr.io')) {
    console.log('Clicando para abrir file manager...')
    try {
      await page.click('.hp-action-card__body', { timeout: 5000 })
      await page.waitForTimeout(3000)
      const newPages = browser.pages()
      for (const p of newPages) {
        if (p.url().includes('hstgr.io')) {
          filePage = p
          break
        }
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
    console.error('SESSION não encontrada! URL:', url)
    await browser.close()
    return
  }

  const SESSION = sessionMatch[1]
  const TOKEN = await filePage.evaluate(() => document.cookie.split('auth=')[1]?.split(';')[0])
  console.log('SESSION:', SESSION)
  console.log('TOKEN:', TOKEN ? TOKEN.substring(0, 30) + '...' : 'NOT FOUND')

  if (!TOKEN) {
    console.error('TOKEN não encontrado!')
    await browser.close()
    return
  }

  const files = getAllFiles(BUILD_DIR)
  console.log(`\nUploading ${files.length} files...\n`)

  let ok = 0, fail = 0

  for (const relPath of files) {
    const encodedPath = relPath.split('/').map(seg => encodeURIComponent(seg)).join('/')
    const apiUrl = `https://srv1938-files.hstgr.io/${SESSION}/api/resources${REMOTE_BASE}/${encodedPath}?override=true`
    const localUrl = `${LOCAL_SERVER}/${relPath}`

    try {
      const result = await filePage.evaluate(async ({ localUrl, apiUrl, token }) => {
        try {
          const resp = await fetch(localUrl)
          if (!resp.ok) return { status: 'fetch_err', code: resp.status }
          const blob = await resp.blob()
          const uploadResp = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'X-Auth': token },
            body: blob,
          })
          return { status: 'ok', code: uploadResp.status }
        } catch (e) {
          return { status: 'error', message: e.message }
        }
      }, { localUrl, apiUrl, token: TOKEN })

      if (result.status === 'ok' && result.code >= 200 && result.code < 300) {
        console.log(`✓ ${result.code} ${relPath}`)
        ok++
      } else {
        console.log(`✗ ${result.status}/${result.code} ${relPath}`)
        fail++
      }
    } catch (e) {
      console.error(`ERRO ${relPath}: ${e.message}`)
      fail++
    }

    await filePage.waitForTimeout(50)
  }

  console.log(`\nConcluído! ✓ ${ok} | ✗ ${fail}`)
  await browser.close()
}

main().catch(console.error)
