import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

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
  if (filePath.endsWith('.htaccess')) return 'text/plain'
  return 'application/octet-stream'
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
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  console.log('Abrindo Hostinger...')
  await page.goto('https://hpanel.hostinger.com', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  // Navegar para gerenciador de arquivos
  console.log('Navegando para gerenciador de arquivos...')
  await page.goto('https://hpanel.hostinger.com/websites/passoapassouniformes.com/file-manager', { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)

  // Verificar se abriu nova aba com o file manager
  let filePage = page
  const pages = context.pages()
  if (pages.length > 1) {
    filePage = pages[pages.length - 1]
  }

  // Esperar que o file manager carregue
  await filePage.waitForTimeout(5000)

  // Tentar clicar no botão do file manager se necessário
  const newPages = context.pages()
  if (newPages.length > pages.length) {
    filePage = newPages[newPages.length - 1]
  }

  await filePage.waitForTimeout(3000)

  // Pegar a URL atual e extrair SESSION
  const url = filePage.url()
  console.log('URL atual:', url)

  // Pegar o token do localStorage ou cookie
  const token = await filePage.evaluate(() => {
    // Tenta localStorage primeiro
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const val = localStorage.getItem(key)
      if (val && val.startsWith('eyJ')) return val
    }
    // Tenta cookies
    const cookies = document.cookie.split(';')
    for (const c of cookies) {
      const [k, v] = c.trim().split('=')
      if (v && v.startsWith('eyJ')) return v
    }
    return null
  })

  if (!token) {
    console.error('Token não encontrado! Verificando URL para SESSION...')
    // Tentar extrair session da URL
  }

  // Extrair SESSION da URL
  const sessionMatch = url.match(/hstgr\.io\/([a-f0-9]+)\//)
  if (!sessionMatch) {
    console.error('SESSION não encontrada na URL:', url)
    console.log('Por favor, navegue manualmente para o gerenciador de arquivos e pressione Enter...')
    await page.waitForTimeout(30000)
  }

  const SESSION = sessionMatch ? sessionMatch[1] : null
  console.log('SESSION:', SESSION)
  console.log('TOKEN:', token ? token.substring(0, 50) + '...' : 'não encontrado')

  if (!SESSION || !token) {
    console.error('Não foi possível obter SESSION ou TOKEN. Abortando.')
    await browser.close()
    return
  }

  // Obter lista de arquivos
  const files = getAllFiles(BUILD_DIR)
  console.log(`\nUpload de ${files.length} arquivos...\n`)

  let ok = 0, fail = 0

  for (const relPath of files) {
    const contentType = getContentType(relPath)
    // Encode path segments mas preserva barras
    const encodedPath = relPath.split('/').map(seg => encodeURIComponent(seg)).join('/')
    const apiPath = `/${SESSION}/api/resources${REMOTE_BASE}/${encodedPath}?override=true`
    const localUrl = `${LOCAL_SERVER}/${relPath.replace('[', '%5B').replace(']', '%5D')}`

    try {
      const result = await filePage.evaluate(async ({ localUrl, apiPath, token, contentType }) => {
        try {
          const resp = await fetch(localUrl)
          if (!resp.ok) return { status: 'fetch_error', code: resp.status }
          const blob = await resp.blob()

          const uploadResp = await fetch(`https://srv1938-files.hstgr.io${apiPath}`, {
            method: 'POST',
            headers: {
              'X-Auth': token,
              'Content-Type': contentType,
            },
            body: blob,
          })
          return { status: 'ok', code: uploadResp.status }
        } catch (e) {
          return { status: 'error', message: e.message }
        }
      }, { localUrl, apiPath, token, contentType })

      if (result.status === 'ok' && (result.code >= 200 && result.code < 300)) {
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

    await filePage.waitForTimeout(100)
  }

  console.log(`\nConcluído! ✓ ${ok} | ✗ ${fail}`)
  await browser.close()
}

main().catch(console.error)
