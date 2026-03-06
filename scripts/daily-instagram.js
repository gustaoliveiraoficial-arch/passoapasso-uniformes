/**
 * Rex — Daily Instagram Content Generator
 * Passo a Passo Uniformes
 * Roda automaticamente todo dia via GitHub Actions
 */

const https = require('https');
const nodemailer = require('nodemailer');

// ===========================
// CONFIGURAÇÃO DA EMPRESA
// ===========================
const EMPRESA = {
  nome: 'Passo a Passo Uniformes',
  cidade: 'Novo Hamburgo, RS',
  anos: '+30 anos',
  cor: '#C85A00',
  instagram: '@passoapassouniformes',
  whatsapp: '5551985600893',
  segmentos: ['formandos', 'academias', 'empresas', 'escolas', 'esportes', 'saude'],
  campanha_ativa: 'Desafio Formandos 2026 — prazo 31/03/2026. Premio: coquetel de salgados e refrigerante para a turma com mais curtidas.',
  posicionamento: 'Ha 30 anos vestindo quem faz o Vale dos Sinos acontecer.',
  diferenciais: [
    '+30 anos de experiencia',
    'Simulador de uniforme',
    'Pedido minimo: 10 pecas',
    'Atendimento atencioso e local',
    'Clientes: Beira Rio, Monaco Atacado, Ortobom'
  ]
};

// Pilares por dia da semana
const PILARES = {
  0: { nome: 'INSPIRACAO', foco: 'Frase motivacional ou reflexao sobre identidade e pertencimento' },
  1: { nome: 'PROVA SOCIAL', foco: 'Mostrar clientes, projetos entregues, depoimentos ou bastidores' },
  2: { nome: 'EDUCACAO', foco: 'Dicas sobre uniformes, tecidos, personalizacao, cuidados' },
  3: { nome: 'CAMPANHA', foco: 'Empurrar a campanha ativa com urgencia e CTA claro' },
  4: { nome: 'IDENTIDADE', foco: 'Historia da empresa, equipe, valores, bastidores da producao' },
  5: { nome: 'ENGAJAMENTO', foco: 'Pergunta, enquete ou interacao com a audiencia' },
  6: { nome: 'PRODUTO', foco: 'Destaque de modelo, segmento ou personalizacao especifica' }
};

// Dias em portugues
const DIAS_PT = ['domingo', 'segunda-feira', 'terca-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sabado'];
const MESES_PT = ['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

function getDataFormatada() {
  const hoje = new Date();
  const dia = hoje.getDate();
  const mes = MESES_PT[hoje.getMonth()];
  const ano = hoje.getFullYear();
  const diaSemana = DIAS_PT[hoje.getDay()];
  return { dia, mes, ano, diaSemana, dayIndex: hoje.getDay() };
}

// ===========================
// CHAMAR CLAUDE API
// ===========================
async function gerarConteudo(data, pilar) {
  const prompt = `Voce e Rex, o CEO Agent da ${EMPRESA.nome}, empresa com ${EMPRESA.anos} em ${EMPRESA.cidade}.

CONTEXTO DA EMPRESA:
- Posicionamento: "${EMPRESA.posicionamento}"
- Segmentos: ${EMPRESA.segmentos.join(', ')}
- Diferenciais: ${EMPRESA.diferenciais.join(', ')}
- Instagram: ${EMPRESA.instagram}
- Campanha ativa: ${EMPRESA.campanha_ativa}
- Tom de voz: direto, proximo, confiante, gaucho, sem jargoes

TAREFA:
Crie uma sugestao COMPLETA de conteudo para Instagram para hoje, ${data.diaSemana} ${data.dia} de ${data.mes} de ${data.ano}.

PILAR DO DIA: ${pilar.nome}
FOCO: ${pilar.foco}

Entregue EXATAMENTE neste formato:

---FORMATO---
PILAR: ${pilar.nome}
DATA: ${data.diaSemana}, ${data.dia}/${data.mes}

FORMATO RECOMENDADO: [Carrossel / Reels / Post unico]
HORARIO IDEAL: [horario]

ESTRUTURA DO CONTEUDO:
[Se carrossel: descreva cada slide com fundo, texto e layout]
[Se reels: roteiro segundo a segundo]
[Se post: descricao da imagem/arte]

LEGENDA COMPLETA (pronta para copiar):
[Legenda completa com emojis, texto, CTA e hashtags]

HASHTAGS:
[Lista de hashtags separadas]

DICA DO DIA:
[Uma dica estrategica curta sobre Instagram para este tipo de post]
---FIM---

Seja especifico, criativo e alinhado com a identidade da marca (laranja queimado, premium, local, 30 anos).`;

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.content[0].text);
        } catch (e) {
          reject(new Error('Erro ao parsear resposta da API: ' + data));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ===========================
// ENVIAR EMAIL
// ===========================
async function enviarEmail(conteudo, data) {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const assunto = `📱 Instagram — ${data.diaSemana} ${data.dia}/${data.mes} | ${EMPRESA.nome}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: 'Inter', Arial, sans-serif; background: #0A0A0A; color: #FFFFFF; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 32px 24px; }
  .header { background: #C85A00; border-radius: 12px 12px 0 0; padding: 24px 28px; }
  .header h1 { font-size: 20px; font-weight: 800; margin: 0; color: #fff; }
  .header p { font-size: 13px; color: rgba(255,255,255,0.8); margin: 4px 0 0; }
  .body { background: #111111; border-radius: 0 0 12px 12px; padding: 28px; }
  .content { background: #1A1A1A; border-radius: 8px; padding: 20px; font-size: 14px; line-height: 1.8; white-space: pre-wrap; color: #E0E0E0; border-left: 3px solid #C85A00; }
  .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #4A4A4A; }
  .badge { display: inline-block; background: rgba(200,90,0,0.2); border: 1px solid rgba(200,90,0,0.4); color: #E06A10; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>📱 Sugestão de Conteúdo — Instagram</h1>
    <p>${data.diaSemana.charAt(0).toUpperCase() + data.diaSemana.slice(1)}, ${data.dia} de ${data.mes} de ${data.ano} · ${EMPRESA.nome}</p>
  </div>
  <div class="body">
    <div class="badge">👔 REX — CEO AGENT</div>
    <div class="content">${conteudo}</div>
  </div>
  <div class="footer">
    Passo a Passo Uniformes · ${EMPRESA.cidade}<br/>
    Gerado automaticamente por Rex, CEO Agent · AIOS System
  </div>
</div>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"Rex | Passo a Passo" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: assunto,
    html
  });

  console.log(`✅ Email enviado: ${assunto}`);
}

// ===========================
// MAIN
// ===========================
async function main() {
  console.log('👔 Rex — Gerando conteúdo do dia...');

  const data = getDataFormatada();
  const pilar = PILARES[data.dayIndex];

  console.log(`📅 ${data.diaSemana}, ${data.dia}/${data.mes} | Pilar: ${pilar.nome}`);

  const conteudo = await gerarConteudo(data, pilar);
  console.log('✅ Conteúdo gerado');

  await enviarEmail(conteudo, data);
  console.log('📧 Email entregue com sucesso!');
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
