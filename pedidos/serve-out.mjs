import http from 'http'
import fs from 'fs'
import path from 'path'

const DIR = 'C:/Users/gusta/OneDrive/Área de Trabalho/PassoaPasso/pedidos/out'
const PORT = 9876

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  const filePath = path.join(DIR, decodeURIComponent(req.url))
  try {
    const data = fs.readFileSync(filePath)
    res.writeHead(200)
    res.end(data)
  } catch (e) {
    res.writeHead(404)
    res.end('Not found: ' + req.url)
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Serving ${DIR} on http://127.0.0.1:${PORT}`)
})
