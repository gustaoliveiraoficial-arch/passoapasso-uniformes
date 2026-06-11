/**
 * Passo a Passo — Servidor de Follow-up de Vendas
 *
 * O que faz:
 * 1. Serve vendas-followup.html e leads-data.json em http://localhost:3737
 * 2. Observa C:\Users\gusta\Downloads\orçamentos\ por novos PDFs
 * 3. Quando detecta novo PDF → chama Claude API para extrair dados
 * 4. Deduplica por telefone (mantém o mais recente)
 * 5. Atualiza leads-data.json e notifica o browser via SSE
 *
 * Uso:
 *   node serve-followup.mjs
 *
 * Variável de ambiente necessária:
 *   ANTHROPIC_API_KEY=sk-ant-...
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3737;
const PASTA_ORCAMENTOS = 'C:/Users/gusta/Downloads/orçamentos';
const LEADS_JSON = path.join(__dirname, 'leads-data.json');
const HTML_FILE = path.join(__dirname, 'vendas-followup.html');

// SSE clients conectados
const sseClients = new Set();

function broadcast(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try { res.write(msg); } catch {}
  }
}

// ─── Servidor HTTP ────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // CORS para requests locais
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // DELETE /lead/:id — remove lead do JSON
  if (req.method === 'DELETE' && url.pathname.startsWith('/lead/')) {
    const id = url.pathname.split('/lead/')[1];
    try {
      const db = JSON.parse(fs.readFileSync(LEADS_JSON, 'utf-8'));
      const antes = db.leads.length;
      db.leads = db.leads.filter(l => l.id !== id);
      if (db.leads.length < antes) {
        fs.writeFileSync(LEADS_JSON, JSON.stringify(db, null, 2), 'utf-8');
        broadcast('update', { mensagem: 'Lead removido', removido: id });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } else {
        res.writeHead(404); res.end(JSON.stringify({ error: 'Lead não encontrado' }));
      }
    } catch (e) {
      res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // SSE — stream de eventos ao vivo
  if (url.pathname === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.write('event: connected\ndata: {}\n\n');
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // leads-data.json
  if (url.pathname === '/leads-data.json') {
    try {
      const data = fs.readFileSync(LEADS_JSON, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch {
      res.writeHead(500); res.end('{"error":"leads-data.json not found"}');
    }
    return;
  }

  // vendas-followup.html (raiz)
  if (url.pathname === '/' || url.pathname === '/vendas-followup.html') {
    try {
      const html = fs.readFileSync(HTML_FILE, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch {
      res.writeHead(404); res.end('HTML not found');
    }
    return;
  }

  res.writeHead(404); res.end('Not found');
});

// ─── Extração via Claude API ──────────────────────────────────────────────────

async function extrairDadosPDF(pdfPath) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('⚠️  ANTHROPIC_API_KEY não definida — não é possível extrair PDF automaticamente.');
    return null;
  }

  console.log(`🔍 Extraindo dados de: ${path.basename(pdfPath)}`);

  const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

  const body = JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 }
        },
        {
          type: 'text',
          text: `Extraia os dados deste orçamento de uniformes e retorne APENAS um JSON válido (sem markdown, sem explicação) com esta estrutura exata:
{
  "nome": "nome do cliente",
  "empresa": "nome da empresa ou null",
  "telefone": "número limpo só dígitos com 55 no início (DDI Brazil) ou null se não encontrado",
  "valor": 0.00,
  "enviado": "DD/MM/YYYY",
  "vence": "DD/MM/YYYY",
  "obs": "observação relevante como quantidade ou evento, ou null"
}

Se o PDF estiver em branco ou não for um orçamento, retorne: {"erro": "PDF inválido"}`
        }
      ]
    }]
  });

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error(`❌ Claude API erro ${resp.status}:`, err);
      return null;
    }

    const result = await resp.json();
    const text = result.content?.[0]?.text?.trim();
    const data = JSON.parse(text);

    if (data.erro) { console.log(`⏭️  Pulando: ${data.erro}`); return null; }
    return data;
  } catch (e) {
    console.error('❌ Erro ao chamar Claude API:', e.message);
    return null;
  }
}

// ─── Deduplicação e merge ─────────────────────────────────────────────────────

function parseDate(str) {
  if (!str) return null;
  const [d, m, a] = str.split('/').map(Number);
  return new Date(a, m - 1, d);
}

function normalizarTelefone(tel) {
  if (!tel) return null;
  const n = String(tel).replace(/\D/g, '');
  if (n.length < 8) return null;
  if (n.startsWith('55') && n.length >= 12) return n;
  return '55' + n;
}

function adicionarLead(db, novoLead, arquivo) {
  const telefone = normalizarTelefone(novoLead.telefone);

  // Checa se arquivo já foi processado
  if (arquivo && db.leads.some(l => l.arquivo === arquivo)) {
    console.log(`⏭️  Arquivo já processado: ${arquivo}`);
    return false;
  }

  // Checa duplicata por telefone
  if (telefone) {
    const existente = db.leads.find(l => normalizarTelefone(l.telefone) === telefone);
    if (existente) {
      const dataExist = parseDate(existente.vence);
      const dataNova = parseDate(novoLead.vence);
      if (dataNova && dataExist && dataNova > dataExist) {
        console.log(`🔄 Atualizando lead existente (${existente.nome} → ${novoLead.nome}, tel ${telefone})`);
        Object.assign(existente, { ...novoLead, telefone, arquivo, id: existente.id });
        return true;
      } else {
        console.log(`⏭️  Lead duplicado mais antigo ignorado (${novoLead.nome}, tel ${telefone})`);
        return false;
      }
    }
  }

  // Novo lead
  const id = 'l' + String(Date.now()).slice(-6) + Math.random().toString(36).slice(2, 5);
  db.leads.push({ id, arquivo, ...novoLead, telefone });
  console.log(`✅ Novo lead adicionado: ${novoLead.nome} — R$ ${novoLead.valor}`);
  return true;
}

// ─── Watcher de pasta ─────────────────────────────────────────────────────────

async function processarNovoPDF(filePath) {
  // Espera 1s para o arquivo terminar de copiar
  await new Promise(r => setTimeout(r, 1000));

  const stats = fs.statSync(filePath);
  if (stats.size < 1000) { console.log(`⏭️  PDF muito pequeno (${stats.size}B), pulando`); return; }

  const dados = await extrairDadosPDF(filePath);
  if (!dados) return;

  const db = JSON.parse(fs.readFileSync(LEADS_JSON, 'utf-8'));
  const arquivo = path.basename(filePath);
  const atualizado = adicionarLead(db, dados, arquivo);

  if (atualizado) {
    fs.writeFileSync(LEADS_JSON, JSON.stringify(db, null, 2), 'utf-8');
    broadcast('update', { mensagem: `Novo lead adicionado: ${dados.nome}`, lead: dados });
    console.log(`💾 leads-data.json atualizado`);
  }
}

function iniciarWatcher() {
  if (!fs.existsSync(PASTA_ORCAMENTOS)) {
    console.log(`⚠️  Pasta não encontrada: ${PASTA_ORCAMENTOS}`);
    console.log('   Crie a pasta ou ajuste o caminho em serve-followup.mjs');
    return;
  }

  console.log(`👀 Observando: ${PASTA_ORCAMENTOS}`);

  const processados = new Set(
    fs.readdirSync(PASTA_ORCAMENTOS)
      .filter(f => f.toLowerCase().endsWith('.pdf'))
      .map(f => f)
  );

  fs.watch(PASTA_ORCAMENTOS, { persistent: true }, async (event, filename) => {
    if (!filename || !filename.toLowerCase().endsWith('.pdf')) return;
    if (processados.has(filename)) return;

    processados.add(filename);
    const fullPath = path.join(PASTA_ORCAMENTOS, filename);

    // Aguarda o arquivo existir (pode demorar um pouco após o evento)
    await new Promise(r => setTimeout(r, 500));
    if (!fs.existsSync(fullPath)) return;

    console.log(`\n📄 Novo PDF detectado: ${filename}`);
    await processarNovoPDF(fullPath);
  });
}

// ─── Inicialização ────────────────────────────────────────────────────────────

server.listen(PORT, () => {
  console.log('\n🚀 Passo a Passo — Servidor de Follow-up');
  console.log(`   Abra em: http://localhost:${PORT}`);
  console.log(`   Leads: ${LEADS_JSON}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('\n⚠️  DICA: Para extração automática de PDFs, defina:');
    console.log('   set ANTHROPIC_API_KEY=sk-ant-...');
    console.log('   Sem a chave, os novos PDFs serão ignorados.\n');
  }
  iniciarWatcher();
});

process.on('SIGINT', () => { console.log('\n👋 Encerrando servidor...'); process.exit(0); });
