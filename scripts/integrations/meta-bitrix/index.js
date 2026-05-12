require('dotenv').config();
const express = require('express');
const { getLeadData, parseFieldData } = require('./meta-api');
const { upsertContact, createDeal, linkContactToDeal, addDealComment } = require('./bitrix-api');
const { normalizeFields, toContactFields, toDealFields } = require('./field-mapper');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;

// ─────────────────────────────────────────────
//  GET /webhook — verificação do webhook pela Meta
//  A Meta envia uma requisição GET quando você cadastra
//  a URL do webhook no painel de desenvolvedor.
// ─────────────────────────────────────────────
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[Meta Webhook] Verificado com sucesso.');
    return res.status(200).send(challenge);
  }

  console.warn('[Meta Webhook] Falha na verificação. Token inválido.');
  res.sendStatus(403);
});

// ─────────────────────────────────────────────
//  POST /webhook — recebe novos leads em tempo real
// ─────────────────────────────────────────────
app.post('/webhook', async (req, res) => {
  // Responde imediatamente para a Meta não reenviar
  res.sendStatus(200);

  const body = req.body;
  if (body.object !== 'page') return;

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field !== 'leadgen') continue;

      const leadgenId = change.value.leadgen_id;
      const pageId = change.value.page_id;

      console.log(`[Meta] Novo lead recebido: ${leadgenId} (page ${pageId})`);

      try {
        await processLead(leadgenId, change.value);
      } catch (err) {
        console.error(`[Erro] Falha ao processar lead ${leadgenId}:`, err.message);
      }
    }
  }
});

// ─────────────────────────────────────────────
//  POST /webhook/test — endpoint para testar sem Meta
//  Envie o corpo JSON de um lead para simular o fluxo
// ─────────────────────────────────────────────
app.post('/webhook/test', async (req, res) => {
  const { leadgen_id, ...rest } = req.body;
  if (!leadgen_id) return res.status(400).json({ error: 'Informe leadgen_id no body' });

  try {
    await processLead(leadgen_id, rest);
    res.json({ success: true, message: 'Lead processado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
//  GET /health — healthcheck para Railway/Render
// ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'meta-bitrix-integration', ts: new Date().toISOString() });
});

// ─────────────────────────────────────────────
//  Lógica principal: Meta → Bitrix24
// ─────────────────────────────────────────────
async function processLead(leadgenId, webhookValue = {}) {
  // 1. Busca dados completos do lead na API da Meta
  const leadData = await getLeadData(leadgenId, PAGE_ACCESS_TOKEN);

  // 2. Converte field_data em objeto
  const rawFields = parseFieldData(leadData.field_data);

  // 3. Normaliza nomes de campo (suporta PT e EN)
  const fields = normalizeFields(rawFields);

  // 4. Metadados do anúncio
  const leadMeta = {
    leadId: leadgenId,
    adId: leadData.ad_id || webhookValue.ad_id,
    adName: leadData.ad_name || webhookValue.ad_name,
    adsetId: leadData.adset_id,
    adsetName: leadData.adset_name,
    campaignId: leadData.campaign_id,
    campaignName: leadData.campaign_name,
    formId: leadData.form_id,
    createdTime: leadData.created_time,
  };

  console.log('[processLead] Campos recebidos:', fields);
  console.log('[processLead] Anúncio:', leadMeta.adName, '/', leadMeta.campaignName);

  // 5. Monta campos do contato e cria/atualiza no Bitrix24
  const contactFields = toContactFields(fields, leadMeta);
  const { id: contactId, updated } = await upsertContact(contactFields);
  console.log(`[Bitrix24] Contato ${updated ? 'atualizado' : 'criado'}: ID ${contactId}`);

  // 6. Cria negócio (deal) no Bitrix24
  const dealFields = toDealFields(fields, leadMeta);
  dealFields.CONTACT_ID = contactId;
  const dealId = await createDeal(dealFields);
  console.log(`[Bitrix24] Negócio criado: ID ${dealId}`);

  // 7. Vincula contato ao negócio
  await linkContactToDeal(dealId, contactId);

  // 8. Adiciona comentário com todos os dados do lead
  const comment = buildComment(fields, leadMeta, rawFields);
  await addDealComment(dealId, comment);

  console.log(`[OK] Lead ${leadgenId} → Contato ${contactId} + Negócio ${dealId} no Bitrix24`);
}

function buildComment(fields, leadMeta, rawFields) {
  const lines = [
    '📋 Lead recebido via Meta Ads',
    '',
    `📢 Campanha: ${leadMeta.campaignName || 'N/A'}`,
    `🎯 Conjunto: ${leadMeta.adsetName || 'N/A'}`,
    `📌 Anúncio: ${leadMeta.adName || 'N/A'}`,
    `🆔 Lead ID: ${leadMeta.leadId}`,
    `⏰ Data: ${leadMeta.createdTime ? new Date(leadMeta.createdTime * 1000).toLocaleString('pt-BR') : 'N/A'}`,
    '',
    '📝 Dados preenchidos no formulário:',
  ];

  for (const [key, value] of Object.entries(rawFields)) {
    if (value) lines.push(`  • ${key}: ${value}`);
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────
//  Start
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Meta→Bitrix24 Integration rodando na porta ${PORT}`);
  console.log(`   Webhook URL: http://seu-dominio.com/webhook`);
  console.log(`   Healthcheck: http://localhost:${PORT}/health\n`);

  if (!VERIFY_TOKEN) console.warn('⚠️  META_VERIFY_TOKEN não configurado!');
  if (!PAGE_ACCESS_TOKEN) console.warn('⚠️  META_PAGE_ACCESS_TOKEN não configurado!');
  if (!process.env.BITRIX24_WEBHOOK_URL) console.warn('⚠️  BITRIX24_WEBHOOK_URL não configurado!');
});

module.exports = app;
