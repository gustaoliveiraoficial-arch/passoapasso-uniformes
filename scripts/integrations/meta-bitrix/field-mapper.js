/**
 * Mapeia os campos do Meta Lead Form para os campos do Bitrix24 CRM
 *
 * Suporta os nomes de campo padrão do Meta + nomes personalizados usados
 * nos formulários da Passo a Passo Uniformes.
 */

const FIELD_ALIASES = {
  // Nome
  full_name: 'nome',
  name: 'nome',
  nome: 'nome',
  first_name: 'primeiro_nome',
  last_name: 'sobrenome',
  // Contato
  email: 'email',
  e_mail: 'email',
  phone_number: 'telefone',
  phone: 'telefone',
  whatsapp: 'telefone',
  telefone: 'telefone',
  celular: 'telefone',
  // Escola/negócio
  escola: 'escola',
  school: 'escola',
  nome_da_escola: 'escola',
  serie: 'serie',
  turma: 'serie',
  // Tamanho da turma
  tamanho: 'tamanho_turma',
  tamanho_da_turma: 'tamanho_turma',
  numero_de_alunos: 'tamanho_turma',
  // Outros
  cidade: 'cidade',
  city: 'cidade',
  estado: 'estado',
  state: 'estado',
};

/**
 * Normaliza os fields do Meta para chaves padronizadas
 */
function normalizeFields(rawFields) {
  const normalized = {};
  for (const [key, value] of Object.entries(rawFields)) {
    const alias = FIELD_ALIASES[key] || key;
    normalized[alias] = value;
  }
  return normalized;
}

/**
 * Extrai primeiro e último nome de um nome completo
 */
function splitName(fullName = '') {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return { firstName, lastName };
}

/**
 * Converte campos normalizados em campos do Bitrix24 Contact
 */
function toContactFields(fields, leadMeta = {}) {
  const nome = fields.nome || `${fields.primeiro_nome || ''} ${fields.sobrenome || ''}`.trim();
  const { firstName, lastName } = splitName(nome);

  const contact = {
    NAME: firstName,
    LAST_NAME: lastName,
    SOURCE_ID: 'FB',          // Facebook como fonte
    SOURCE_DESCRIPTION: `Meta Ads | ${leadMeta.campaignName || 'Lead Form'} | ${leadMeta.adName || ''}`.trim(),
    COMMENTS: buildContactComments(fields, leadMeta),
  };

  if (fields.email) {
    contact.EMAIL = [{ VALUE: fields.email, VALUE_TYPE: 'WORK' }];
  }

  if (fields.telefone) {
    contact.PHONE = [{ VALUE: formatPhone(fields.telefone), VALUE_TYPE: 'MOBILE' }];
  }

  if (fields.cidade) contact.CITY = fields.cidade;
  if (fields.estado) contact.STATE = fields.estado;

  return contact;
}

/**
 * Converte campos normalizados em campos do Bitrix24 Deal
 */
function toDealFields(fields, leadMeta = {}) {
  const escola = fields.escola || '';
  const serie = fields.serie || '';
  const tamanho = fields.tamanho_turma || '';

  const title = buildDealTitle(fields, leadMeta);

  const deal = {
    TITLE: title,
    SOURCE_ID: 'FB',
    SOURCE_DESCRIPTION: `Anúncio: ${leadMeta.adName || ''} | Campanha: ${leadMeta.campaignName || ''}`.trim(),
    STAGE_ID: process.env.BITRIX24_DEAL_STAGE || 'NEW',
    CURRENCY_ID: 'BRL',
    COMMENTS: buildDealComments(fields, leadMeta),
  };

  // Estima número de alunos para preencher valor potencial do negócio
  const alunosEstimados = estimarAlunos(tamanho);
  if (alunosEstimados > 0) {
    deal.OPPORTUNITY = alunosEstimados * (parseFloat(process.env.TICKET_MEDIO_ALUNO) || 80);
  }

  return deal;
}

// ---------- helpers ----------

function buildDealTitle(fields, leadMeta) {
  const escola = fields.escola || '';
  const serie = fields.serie || '';
  const ad = leadMeta.adName || 'Lead Form';

  if (escola && serie) return `Uniforme ${serie} — ${escola}`;
  if (escola) return `Uniforme — ${escola}`;
  return `Novo Lead — ${ad}`;
}

function buildContactComments(fields, leadMeta) {
  const lines = ['=== Dados do Lead Meta Ads ==='];
  if (fields.escola) lines.push(`Escola: ${fields.escola}`);
  if (fields.serie) lines.push(`Série/Turma: ${fields.serie}`);
  if (fields.tamanho_turma) lines.push(`Tamanho da turma: ${fields.tamanho_turma}`);
  lines.push('');
  lines.push('=== Origem do Anúncio ===');
  if (leadMeta.campaignName) lines.push(`Campanha: ${leadMeta.campaignName}`);
  if (leadMeta.adsetName) lines.push(`Conjunto de anúncios: ${leadMeta.adsetName}`);
  if (leadMeta.adName) lines.push(`Anúncio: ${leadMeta.adName}`);
  if (leadMeta.leadId) lines.push(`Lead ID (Meta): ${leadMeta.leadId}`);
  if (leadMeta.createdTime) lines.push(`Data: ${new Date(leadMeta.createdTime * 1000).toLocaleString('pt-BR')}`);
  return lines.join('\n');
}

function buildDealComments(fields, leadMeta) {
  return buildContactComments(fields, leadMeta);
}

function formatPhone(phone = '') {
  // Remove tudo que não é dígito
  let digits = phone.replace(/\D/g, '');
  // Se não começa com 55, adiciona Brasil
  if (digits.length === 10 || digits.length === 11) digits = '55' + digits;
  return '+' + digits;
}

function estimarAlunos(tamanho = '') {
  const map = {
    '10-20': 15,
    '20-40': 30,
    '40-60': 50,
    '60-80': 70,
    '80+': 90,
    'menos de 20': 15,
    'acima de 80': 90,
  };
  const key = Object.keys(map).find(k => tamanho.toLowerCase().includes(k.toLowerCase()));
  return key ? map[key] : 0;
}

module.exports = { normalizeFields, toContactFields, toDealFields };
