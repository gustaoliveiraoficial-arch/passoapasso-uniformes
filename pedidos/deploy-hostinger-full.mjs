import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'

const require = createRequire(import.meta.url)
const { chromium } = require('./node_modules/playwright')

const BUILD_DIR = 'C:/temp/pedidos-build'
const REMOTE_BASE = '/public_html/formalizarpedido'
const LOCAL_SERVER = 'http://127.0.0.1:7788'

function getContentType(filePath) {
  if (filePath.endsWith('.js')) return 'application/javascript'
  if (filePath.endsWith('.css')) return 'text/css'
  if (filePath.endsWith('.html')) return 'text/html'
  if (filePath.endsWith('.txt')) return 'text/plain'
  if (filePath.endsWith('.png')) return 'image/png'
  if (filePath.endsWith('.json')) return 'application/json'
  return 'text/plain'
}

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
  // Usa perfil temporário para não conflitar com Chrome aberto
  const TEMP_PROFILE = 'C:/temp/playwright-hostinger-profile'

  const context = await chromium.launchPersistentContext(TEMP_PROFILE, {
    headless: false,
    channel: 'chrome',
  })
  const page = context.pages()[0] || await context.newPage()

  console.log('Abrindo Hostinger...')
  await page.goto('https://hpanel.hostinger.com', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(2000)

  // Verificar se precisa fazer login
  const url = page.url()
  if (url.includes('login') || url.includes('auth.hostinger')) {
    console.log('\n⚠️  FAÇA LOGIN NO BROWSER QUE ABRIU e aguarde...')
    console.log('   Esperando até 2 minutos pelo login...')
    // Aguardar até chegar no hpanel
    await page.waitForURL('**/hpanel.hostinger.com/**', { timeout: 120000 })
    await page.waitForTimeout(2000)
    console.log('✓ Login detectado!')
  }

  console.log('Navegando para o gerenciador de arquivos...')
  await page.goto('https://hpanel.hostinger.com/websites/passoapassouniformes.com/file-manager', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(5000)

  // Capturar nova aba que pode ter aberto
  let filePage = page
  const allPages = context.pages()
  console.log(`Abas abertas: ${allPages.length}`)
  for (const p of allPages) {
    const u = p.url()
    if (u.includes('hstgr.io')) {
      filePage = p
      break
    }
  }

  // Se ainda não abriu a aba do file manager, aguardar nova aba
  if (!filePage.url().includes('hstgr.io')) {
    console.log('Aguardando aba do file manager abrir...')
    const newPage = await context.waitForEvent('page', { timeout: 30000 })
    await newPage.waitForTimeout(5000)
    filePage = newPage
  }

  const fileUrl = filePage.url()
  console.log('URL do file manager:', fileUrl)

  // Extrair SESSION
  const sessionMatch = fileUrl.match(/hstgr\.io\/([a-f0-9]+)/)
  if (!sessionMatch) {
    console.error('SESSION não encontrada! URL:', fileUrl)
    await context.close()
    return
  }
  const SESSION = sessionMatch[1]
  console.log('SESSION:', SESSION)

  // Pegar JWT
  const token = await filePage.evaluate(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const val = localStorage.getItem(localStorage.key(i))
      if (val && typeof val === 'string' && val.startsWith('eyJ')) return val
    }
    for (const c of document.cookie.split(';')) {
      const val = c.trim().split('=').slice(1).join('=')
      if (val && val.startsWith('eyJ')) return val
    }
    return null
  })

  if (!token) {
    console.error('JWT não encontrado!')
    await context.close()
    return
  }
  console.log('TOKEN ok:', token.substring(0, 50) + '...')

  // Garantir servidor local rodando
  try {
    const test = await filePage.evaluate(() => fetch('http://127.0.0.1:7788/index.html').then(r => r.status))
    console.log('Servidor local:', test)
  } catch {
    console.error('Servidor local não está rodando em 7788!')
    await context.close()
    return
  }

  const files = getAllFiles(BUILD_DIR)
  console.log(`\nUpload de ${files.length} arquivos...\n`)

  let ok = 0, fail = 0

  for (const relPath of files) {
    const contentType = getContentType(relPath)
    const encodedPath = relPath.split('/').map(seg => encodeURIComponent(seg)).join('/')
    const apiPath = `/${SESSION}/api/resources${REMOTE_BASE}/${encodedPath}?override=true`
    const localUrl = `${LOCAL_SERVER}/${encodedPath}`

    try {
      const result = await filePage.evaluate(async ({ localUrl, apiPath, token, contentType }) => {
        try {
          const resp = await fetch(localUrl)
          if (!resp.ok) return { status: 'fetch_fail', code: resp.status }
          const blob = await resp.blob()
          const uploadResp = await fetch(`https://srv1938-files.hstgr.io${apiPath}`, {
            method: 'POST',
            headers: { 'X-Auth': token, 'Content-Type': contentType },
            body: blob,
          })
          return { status: 'done', code: uploadResp.status }
        } catch (e) {
          return { status: 'error', msg: String(e) }
        }
      }, { localUrl, apiPath, token, contentType })

      const success = result.status === 'done' && result.code >= 200 && result.code < 300
      process.stdout.write(success ? `✓ ${relPath}\n` : `✗ ${result.status}:${result.code} ${relPath}\n`)
      if (success) ok++; else fail++
    } catch (e) {
      process.stdout.write(`ERRO ${relPath}: ${e.message}\n`)
      fail++
    }

    await filePage.waitForTimeout(80)
  }

  console.log(`\n✅ Deploy concluído! ✓ ${ok} ok | ✗ ${fail} falhos`)
  await context.close()
}

main().catch(e => { console.error(e); process.exit(1) })
