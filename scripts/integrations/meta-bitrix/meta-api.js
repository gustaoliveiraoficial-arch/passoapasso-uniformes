const axios = require('axios');

const GRAPH_API_VERSION = 'v21.0';
const BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

/**
 * Busca os dados completos de um lead no Meta Graph API
 * @param {string} leadgenId - ID do lead retornado pelo webhook
 * @param {string} accessToken - Page Access Token da página do Facebook
 */
async function getLeadData(leadgenId, accessToken) {
  const url = `${BASE_URL}/${leadgenId}`;
  const response = await axios.get(url, {
    params: {
      access_token: accessToken,
      fields: 'id,created_time,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,form_id,field_data,retailer_item_id',
    },
  });
  return response.data;
}

/**
 * Busca informações do formulário de leads (campos e nome)
 * @param {string} formId - ID do formulário
 * @param {string} accessToken - Page Access Token
 */
async function getFormDetails(formId, accessToken) {
  const url = `${BASE_URL}/${formId}`;
  const response = await axios.get(url, {
    params: {
      access_token: accessToken,
      fields: 'id,name,questions',
    },
  });
  return response.data;
}

/**
 * Verifica o token de acesso e retorna informações da conta
 */
async function verifyAccessToken(accessToken) {
  const url = `${BASE_URL}/me`;
  const response = await axios.get(url, {
    params: { access_token: accessToken, fields: 'id,name' },
  });
  return response.data;
}

/**
 * Converte os field_data do Meta em um objeto chave-valor simples
 * Ex: [{name: "email", values: ["joao@gmail.com"]}] → {email: "joao@gmail.com"}
 */
function parseFieldData(fieldData) {
  const result = {};
  if (!Array.isArray(fieldData)) return result;
  for (const field of fieldData) {
    const key = (field.name || '').toLowerCase().replace(/\s+/g, '_');
    result[key] = Array.isArray(field.values) ? field.values[0] || '' : '';
  }
  return result;
}

module.exports = { getLeadData, getFormDetails, verifyAccessToken, parseFieldData };
