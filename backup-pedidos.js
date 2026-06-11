/**
 * backup-pedidos.js
 * Exporta todos os pedidos do Firestore para um arquivo JSON com data/hora.
 * Mantém os últimos 30 backups e deleta os mais antigos automaticamente.
 *
 * Como usar:
 *   node backup-pedidos.js
 *
 * Para agendar (Windows Task Scheduler):
 *   Programa: node
 *   Argumentos: "C:\Users\gusta\OneDrive\Área de Trabalho\PassoaPasso\backup-pedidos.js"
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECT_ID = 'pap-pedidos';
const API_KEY = 'AIzaSyA8EiDjTF2cP7qSR2I2yfCpQPJCbgKRS9U';
const BACKUP_DIR = path.join(__dirname, 'backups-pedidos');
const MAX_BACKUPS = 30;

// Garante que a pasta de backups existe
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON inválido: ' + data.slice(0, 200))); }
      });
    }).on('error', reject);
  });
}

async function buscarTodosPedidos() {
  const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/pedidos`;
  let allDocs = [];
  let pageToken = null;

  do {
    const url = `${BASE}?key=${API_KEY}&pageSize=300${pageToken ? '&pageToken=' + pageToken : ''}`;
    const data = await httpsGet(url);

    if (!data.documents) break;

    // Converte formato Firestore → JSON simples
    for (const doc of data.documents) {
      const id = doc.name.split('/').pop();
      const fields = doc.fields || {};
      const pedido = { id };
      for (const [key, val] of Object.entries(fields)) {
        pedido[key] = converterFirestoreValor(val);
      }
      allDocs.push(pedido);
    }

    pageToken = data.nextPageToken || null;
  } while (pageToken);

  return allDocs;
}

function converterFirestoreValor(val) {
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.integerValue !== undefined) return parseInt(val.integerValue);
  if (val.doubleValue !== undefined) return parseFloat(val.doubleValue);
  if (val.booleanValue !== undefined) return val.booleanValue;
  if (val.nullValue !== undefined) return null;
  if (val.timestampValue !== undefined) return val.timestampValue;
  if (val.arrayValue !== undefined) {
    return (val.arrayValue.values || []).map(converterFirestoreValor);
  }
  if (val.mapValue !== undefined) {
    const obj = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      obj[k] = converterFirestoreValor(v);
    }
    return obj;
  }
  return null;
}

function limparBackupsAntigos() {
  const arquivos = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('pedidos-') && f.endsWith('.json'))
    .map(f => ({ nome: f, caminho: path.join(BACKUP_DIR, f), mtime: fs.statSync(path.join(BACKUP_DIR, f)).mtime }))
    .sort((a, b) => b.mtime - a.mtime);

  if (arquivos.length > MAX_BACKUPS) {
    const paraRemover = arquivos.slice(MAX_BACKUPS);
    for (const f of paraRemover) {
      fs.unlinkSync(f.caminho);
      console.log('  Removido backup antigo:', f.nome);
    }
  }
}

async function main() {
  const agora = new Date();
  const timestamp = agora.toISOString().replace(/:/g, '-').replace('T', '_').slice(0, 19);
  const nomeArquivo = `pedidos-${timestamp}.json`;
  const caminhoArquivo = path.join(BACKUP_DIR, nomeArquivo);

  console.log(`\n=== Backup Pedidos — ${agora.toLocaleString('pt-BR')} ===`);
  console.log('Buscando pedidos...');

  const pedidos = await buscarTodosPedidos();
  console.log(`Total encontrado: ${pedidos.length} pedidos`);

  const conteudo = JSON.stringify({
    exportadoEm: agora.toISOString(),
    totalPedidos: pedidos.length,
    pedidos,
  }, null, 2);

  fs.writeFileSync(caminhoArquivo, conteudo, 'utf8');

  const tamanhoKB = Math.round(fs.statSync(caminhoArquivo).size / 1024);
  console.log(`Backup salvo: ${nomeArquivo} (${tamanhoKB} KB)`);
  console.log(`Pasta: ${BACKUP_DIR}`);

  limparBackupsAntigos();
  console.log('Concluído.\n');
}

main().catch(err => {
  console.error('ERRO no backup:', err.message);
  process.exit(1);
});
