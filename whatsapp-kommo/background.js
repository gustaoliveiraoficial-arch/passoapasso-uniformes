// background.js v2 — proxy API Kommo + sync automático de leads/etapas

const WKB_CONFIG_KEY = 'wkb_config';
const WKB_CACHE_KEY  = 'wkb_cache';
const SYNC_ALARM     = 'wkb-sync';
const SYNC_INTERVAL  = 3; // minutos

// ─── Alarm setup ──────────────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(SYNC_ALARM, { periodInMinutes: SYNC_INTERVAL });
});
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.get(SYNC_ALARM, alarm => {
    if (!alarm) chrome.alarms.create(SYNC_ALARM, { periodInMinutes: SYNC_INTERVAL });
  });
});

chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name !== SYNC_ALARM) return;
  const cfg = await getConfig();
  if (!cfg?.subdomain) return;
  try { await runSync(cfg.subdomain); } catch (_) {}
});

// ─── Message handlers ─────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'KOMMO_API') {
    callKommo(msg).then(sendResponse).catch(err => sendResponse({ error: err.message }));
    return true;
  }
  if (msg.type === 'KOMMO_TEST') {
    testConnection(msg.subdomain).then(sendResponse).catch(err => sendResponse({ error: err.message }));
    return true;
  }
  if (msg.type === 'DETECT_SUBDOMAIN') {
    detectSubdomain().then(sendResponse).catch(() => sendResponse({ subdomain: null }));
    return true;
  }
  if (msg.type === 'SYNC_NOW') {
    const subdomain = msg.subdomain;
    if (!subdomain) { sendResponse({ error: 'no subdomain' }); return true; }
    runSync(subdomain)
      .then(data => sendResponse({ ok: true, leads: data.leads.length, stages: data.stages.length }))
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }
});

// ─── Config helper ────────────────────────────────────────────────────────────
async function getConfig() {
  return new Promise(resolve =>
    chrome.storage.local.get(WKB_CONFIG_KEY, d => resolve(d[WKB_CONFIG_KEY] || null))
  );
}

// ─── Sync completo ────────────────────────────────────────────────────────────
async function runSync(subdomain) {
  // Busca pipelines, leads e contatos em paralelo
  const [stagesResult, rawLeads, rawContacts] = await Promise.all([
    fetchPipelines(subdomain),
    fetchAllPages(subdomain, '/api/v4/leads', 'leads'),
    fetchAllPages(subdomain, '/api/v4/contacts?with=leads', 'contacts'),
  ]);

  // Mapeia lead_id → { contactName, phone } pelos contatos
  const contactByLeadId = {};
  for (const c of rawContacts) {
    const phone = extractPhone(c);
    for (const leadRef of (c._embedded?.leads || [])) {
      if (!contactByLeadId[leadRef.id]) {
        contactByLeadId[leadRef.id] = { contactName: c.name, phone };
      }
    }
  }

  // Enriquece leads com dados de contato
  const leads = rawLeads.map(l => ({
    id:          l.id,
    name:        l.name,
    contactName: contactByLeadId[l.id]?.contactName || null,
    phone:       contactByLeadId[l.id]?.phone || null,
    status_id:   l.status_id,
    pipeline_id: l.pipeline_id,
    price:       l.price || 0,
  }));

  const cache = { stages: stagesResult.stages, leads, syncedAt: Date.now() };
  await chrome.storage.local.set({ [WKB_CACHE_KEY]: cache });
  return cache;
}

// ─── Busca pipelines e etapas ─────────────────────────────────────────────────
async function fetchPipelines(subdomain) {
  const data = await callKommoRaw(subdomain, '/api/v4/leads/pipelines');
  const stages = [];
  for (const p of (data?._embedded?.pipelines || [])) {
    for (const s of (p._embedded?.statuses || [])) {
      if (s.type === 0 || !s.type) {
        stages.push({
          id:            s.id,
          name:          s.name,
          color:         s.color || '#888',
          pipeline_id:   p.id,
          pipeline_name: p.name,
        });
      }
    }
  }
  return { stages };
}

// ─── Paginação genérica ───────────────────────────────────────────────────────
async function fetchAllPages(subdomain, basePath, embedKey) {
  const items = [];
  let page = 1;
  const maxPages = 8; // máx 2000 itens por recurso

  while (page <= maxPages) {
    const sep  = basePath.includes('?') ? '&' : '?';
    const data = await callKommoRaw(subdomain, `${basePath}${sep}limit=250&page=${page}`);
    const batch = data?._embedded?.[embedKey] || [];
    if (!batch.length) break;
    items.push(...batch);
    if (batch.length < 250) break;
    page++;
  }
  return items;
}

// ─── Extrai telefone do contato ───────────────────────────────────────────────
function extractPhone(contact) {
  for (const f of (contact.custom_fields_values || [])) {
    if (f.field_code === 'PHONE') {
      const v = f.values?.[0]?.value;
      if (v) return v.replace(/\D/g, '');
    }
  }
  return null;
}

// ─── Kommo API helpers ────────────────────────────────────────────────────────
async function detectSubdomain() {
  const tabs = await chrome.tabs.query({ url: 'https://*.kommo.com/*' });
  for (const tab of tabs) {
    const m = tab.url?.match(/https?:\/\/([^.]+)\.kommo\.com/);
    if (m) return { subdomain: m[1] };
  }
  return { subdomain: null };
}

async function callKommoRaw(subdomain, endpoint) {
  const url = `https://${subdomain}.kommo.com${endpoint}`;
  const res = await fetch(url, { credentials: 'include' });
  if (res.status === 204) return {};
  const text = await res.text();
  if (!res.ok) throw new Error(`Kommo ${res.status}: ${text.slice(0, 200)}`);
  return JSON.parse(text);
}

async function callKommo({ endpoint, method = 'GET', body, subdomain }) {
  const url = `https://${subdomain}.kommo.com${endpoint}`;
  const headers = { 'Content-Type': 'application/json' };
  const res = await fetch(url, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return { ok: true };
  const text = await res.text();
  if (!res.ok) throw new Error(`Kommo ${res.status}: ${text.slice(0, 200)}`);
  try { return JSON.parse(text); } catch (_) { return { raw: text }; }
}

async function testConnection(subdomain) {
  const res = await fetch(`https://${subdomain}.kommo.com/api/v4/account`, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP ${res.status} — faça login no Kommo primeiro`);
  return res.json();
}
