import http from 'http'
import fs from 'fs'
import path from 'path'

const DIR = 'C:/temp/producao-build'

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return }

  const relUrl = req.url || '/'
  const filePath = path.join(DIR, decodeURIComponent(relUrl))
  try {
    const content = fs.readFileSync(filePath)
    res.writeHead(200)
    res.end(content)
  } catch {
    res.writeHead(404)
    res.end('not found')
  }
})

server.listen(7789, '127.0.0.1', () => console.log('Serving on http://127.0.0.1:7789'))
