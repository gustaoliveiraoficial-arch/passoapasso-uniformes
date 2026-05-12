const axios = require('axios');

// URL base do webhook incoming do Bitrix24
// Formato: https://SEU_DOMINIO.bitrix24.com.br/rest/USER_ID/TOKEN/
function getWebhookBase() {
  const url = process.env.BITRIX24_WEBHOOK_URL;
  if (!url) throw new Error('BITRIX24_WEBHOOK_URL não configurado no .env');
  return url.endsWith('/') ? url : url + '/';
}

/**
 * Chama qualquer método da API REST do Bitrix24
 */
async function callBitrix(method, params = {}) {
  const url = `${getWebhookBase()}${method}.json`;
  const response = await axios.post(url, params);
  if (response.data.error) {
    throw new Error(`Bitrix24 error [${method}]: ${response.data.error} — ${response.data.error_description}`);
  }
  return response.data.result;
}

/**
 * Cria ou atualiza um contato no Bitrix24 CRM
 * Busca por email ou telefone primeiro para evitar duplicatas
 */
async function upsertContact(fields) {
  // Tenta buscar contato existente por email
  if (fields.EMAIL && fields.EMAIL[0] && fields.EMAIL[0].VALUE) {
    const existing = await callBitrix('crm.contact.list', {
      filter: { EMAIL: fields.EMAIL[0].VALUE },
      select: ['ID', 'NAME'],
    });
    if (existing && existing.length > 0) {
      const contactId = existing[0].ID;
      await callBitrix('crm.contact.update', { id: contactId, fields });
      return { id: contactId, updated: true };
    }
  }

  // Cria novo contato
  const id = await callBitrix('crm.contact.add', { fields });
  return { id, updated: false };
}

/**
 * Cria um negócio (deal) no Bitrix24 vinculado ao contato
 */
async function createDeal(fields) {
  const id = await callBitrix('crm.deal.add', { fields });
  return id;
}

/**
 * Adiciona o contato como participante do negócio
 */
async function linkContactToDeal(dealId, contactId) {
  await callBitrix('crm.deal.contact.add', {
    id: dealId,
    fields: { CONTACT_ID: contactId, IS_PRIMARY: 'Y' },
  });
}

/**
 * Adiciona uma atividade (comentário) ao negócio com dados completos do lead
 */
async function addDealComment(dealId, comment) {
  await callBitrix('crm.timeline.comment.add', {
    fields: {
      ENTITY_TYPE: 'deal',
      ENTITY_ID: dealId,
      COMMENT: comment,
    },
  });
}

module.exports = { callBitrix, upsertContact, createDeal, linkContactToDeal, addDealComment };
