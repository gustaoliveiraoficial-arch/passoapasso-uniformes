const WKB_KEY = 'wkb_config';
let allStages = [];
let savedFavorites = [];

// Carrega config salva
chrome.storage.local.get(WKB_KEY, (d) => {
  const c = d[WKB_KEY] || {};
  if (c.subdomain) document.getElementById('subdomain').value = c.subdomain;
  savedFavorites = c.favoriteStages || [];
});

// Salvar + testar
document.getElementById('btn-save').addEventListener('click', async () => {
  const subdomain = document.getElementById('subdomain').value.trim();
  if (!subdomain) { showStatus('Preencha o subdomínio.', 'error'); return; }

  showStatus('Testando conexão...', 'info');

  chrome.runtime.sendMessage({ type: 'KOMMO_TEST', subdomain }, (res) => {
    if (chrome.runtime.lastError || res?.error) {
      showStatus(`✗ ${res?.error || chrome.runtime.lastError?.message}`, 'error');
      return;
    }
    chrome.storage.local.get(WKB_KEY, (d) => {
      const prev = d[WKB_KEY] || {};
      chrome.storage.local.set({ [WKB_KEY]: { ...prev, subdomain } });
    });
    showStatus(`✓ Conectado: ${res.name || subdomain}`, 'ok');
  });
});

// Carregar etapas
document.getElementById('btn-load-stages').addEventListener('click', () => {
  const subdomain = document.getElementById('subdomain').value.trim();
  if (!subdomain) { showStatus('Salve o subdomínio primeiro.', 'error'); return; }

  const list = document.getElementById('stages-list');
  list.innerHTML = '<div style="color:#666;font-size:12px;padding:6px 0">Carregando...</div>';

  chrome.runtime.sendMessage(
    { type: 'KOMMO_API', endpoint: '/api/v4/leads/pipelines', method: 'GET', subdomain },
    (res) => {
      if (chrome.runtime.lastError || res?.error) {
        list.innerHTML = `<div style="color:#e74c3c;font-size:12px">${res?.error || 'Erro'}</div>`;
        return;
      }
      const pipelines = res?._embedded?.pipelines || [];
      allStages = [];
      pipelines.forEach(p => {
        (p._embedded?.statuses || [])
          .filter(s => s.type === 0 || !s.type)
          .forEach(s => allStages.push({ ...s, pipelineName: p.name }));
      });
      renderStagesList();
      document.getElementById('btn-save-stages').style.display = 'block';
    }
  );
});

function renderStagesList() {
  const list = document.getElementById('stages-list');
  list.innerHTML = allStages.map(s => `
    <label class="stage-item">
      <input type="checkbox" value="${s.id}" ${savedFavorites.includes(String(s.id)) ? 'checked' : ''} />
      <span class="stage-dot" style="background:${s.color || '#888'}"></span>
      <span class="stage-name">${s.name}</span>
      <span class="stage-pipeline">${s.pipelineName}</span>
    </label>
  `).join('');
}

document.getElementById('btn-save-stages').addEventListener('click', () => {
  const checked = [...document.querySelectorAll('#stages-list input:checked')].map(el => el.value);
  chrome.storage.local.get(WKB_KEY, (d) => {
    const prev = d[WKB_KEY] || {};
    chrome.storage.local.set({ [WKB_KEY]: { ...prev, favoriteStages: checked } });
    savedFavorites = checked;
    showStatus(`✓ ${checked.length} etapa(s) salvas.`, 'ok');
  });
});

function showStatus(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = type;
}

// ─── Sincronização ────────────────────────────────────────────────────────────
chrome.storage.local.get('wkb_cache', d => {
  const c   = d.wkb_cache;
  const el  = document.getElementById('sync-info');
  if (!c?.syncedAt) {
    el.textContent = 'Nunca sincronizado. Clique abaixo para iniciar.';
    return;
  }
  const t = new Date(c.syncedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  el.textContent = `Último sync: ${t} · ${c.leads?.length || 0} leads · ${c.stages?.length || 0} etapas`;
});

document.getElementById('btn-sync-now').addEventListener('click', () => {
  const info = document.getElementById('sync-info');
  info.textContent = 'Sincronizando...';

  chrome.storage.local.get('wkb_config', d => {
    const subdomain = d.wkb_config?.subdomain;
    if (!subdomain) { info.textContent = 'Configure o subdomínio primeiro.'; return; }

    chrome.runtime.sendMessage({ type: 'SYNC_NOW', subdomain }, res => {
      if (chrome.runtime.lastError || res?.error) {
        info.textContent = 'Erro: ' + (res?.error || chrome.runtime.lastError?.message);
        return;
      }
      info.textContent = `✓ ${res.leads} leads · ${res.stages} etapas sincronizados!`;
    });
  });
});
