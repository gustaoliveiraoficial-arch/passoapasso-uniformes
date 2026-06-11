// ===== KOMMO CHAT PRO v4 — Colunas Externas =====

const KCP_KEY      = 'kcp_settings';
const KCP_COLS_KEY = 'kcp_custom_cols';
const IS_IFRAME    = window !== window.top;
const OVERDUE_HOURS = 10;

const SEL = {
  chatInput: '.control-contenteditable__area.feed-compose__message',
  allCards:  '.pipeline_leads__item',
};

// Colunas gerenciadas pela extensão (sem tocar no CRM)
const CUSTOM_COLS = [
  { id: 'pix',      label: '💰 PIX',      color: '#27ae60', desc: 'Aguardando pagamento' },
  { id: 'problema', label: '⚠️ Problema',  color: '#e74c3c', desc: 'Com problemas'        },
  { id: 'esboco',   label: '✏️ Esboço',   color: '#8e44ad', desc: 'Esboço a criar'       },
];

const defaults = { focusMode: true, shortcuts: true };
let settings = { ...defaults };
let customCols = { pix: [], problema: [], esboco: [] };

// ─── Boot ─────────────────────────────────────────────────────────────────────
chrome.storage.local.get([KCP_KEY, KCP_COLS_KEY], (data) => {
  if (data[KCP_KEY])      settings   = { ...defaults, ...data[KCP_KEY] };
  if (data[KCP_COLS_KEY]) customCols = data[KCP_COLS_KEY];
  IS_IFRAME ? initIframeMode() : init();
});

// ─── Modo iframe ───────────────────────────────────────────────────────────────
function initIframeMode() {
  document.body.classList.add('kcp-iframe-mode', 'kcp-focus-mode');
  initEnterToSend();
  initAutoFocusIframe();
  watchNavigationIframe();
}

function initAutoFocusIframe() {
  const focusInput = () => {
    const input = document.querySelector(SEL.chatInput);
    if (!input) return false;
    input.focus();
    try {
      const range = document.createRange(), sel = window.getSelection();
      range.selectNodeContents(input); range.collapse(false);
      sel.removeAllRanges(); sel.addRange(range);
    } catch (_) {}
    return true;
  };

  // Tenta imediatamente, depois a cada 300ms até conseguir (máx 5s)
  let tries = 0;
  const interval = setInterval(() => {
    if (focusInput() || ++tries > 16) clearInterval(interval);
  }, 300);

  // Re-foca quando o DOM muda (ex: navegação entre leads)
  new MutationObserver(() => { if (document.querySelector(SEL.chatInput)) focusInput(); })
    .observe(document.body, { childList: true, subtree: true });

  // Re-foca ao clicar em item da lista de conversas
  document.addEventListener('click', e => {
    if (e.target.closest('.notification__item, .notification-inner, [class*="conversation"]'))
      setTimeout(focusInput, 500);
  });
}

// ─── Init normal ───────────────────────────────────────────────────────────────
function init() {
  applyModes();
  injectToolbar();
  initEnterToSend();
  initAutoFocus();
  initKanban();
  if (settings.shortcuts) initShortcuts();
  watchNavigation();
}

function saveSettings() { chrome.storage.local.set({ [KCP_KEY]: settings }); }
function saveCols()      { chrome.storage.local.set({ [KCP_COLS_KEY]: customCols }); }
function applyModes()    { document.body.classList.toggle('kcp-focus-mode', settings.focusMode); }

// ─── Enter para enviar ─────────────────────────────────────────────────────────
function initEnterToSend() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.metaKey) return;
    const active = document.activeElement;
    if (!active) return;
    const ok = active.contentEditable === 'true' &&
      (active.matches(SEL.chatInput) || !!active.closest('.js-control-contenteditable-amojo'));
    if (!ok || !(active.textContent || '').trim()) return;
    e.preventDefault();
    e.stopPropagation();
    active.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
    active.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter', code: 'Enter', keyCode: 13, ctrlKey: true, bubbles: true, cancelable: true
    }));
  }, true);
}

// ─── Auto-foco ────────────────────────────────────────────────────────────────
function initAutoFocus() {
  const tryFocus = () => {
    if (!location.pathname.includes('/chats/') && !location.pathname.includes('/leads/detail/')) return;
    const input = document.querySelector(SEL.chatInput);
    if (input && document.activeElement !== input) {
      setTimeout(() => {
        input.focus();
        const range = document.createRange(), sel = window.getSelection();
        range.selectNodeContents(input); range.collapse(false);
        sel.removeAllRanges(); sel.addRange(range);
      }, 300);
    }
  };
  new MutationObserver(() => { if (document.querySelector(SEL.chatInput)) tryFocus(); })
    .observe(document.body, { childList: true, subtree: true });
  document.addEventListener('click', e => {
    if (e.target.closest('.notification__item, .notification-inner')) setTimeout(tryFocus, 600);
  });
  tryFocus();
}

// ─── Kanban ────────────────────────────────────────────────────────────────────
function initKanban() {
  if (!location.pathname.includes('/leads/pipeline') &&
      !location.pathname.includes('/leads/list')) return;

  injectOverlayContainer();
  waitForPipeline(() => {
    attachCardButtons();
    renderCustomColumns();
  });

  // Re-attach em cards novos
  new MutationObserver(() => {
    attachCardButtons();
    refreshOverdueBadges();
  }).observe(document.body, { childList: true, subtree: true });

  // Refresh overdue a cada 5 min
  setInterval(refreshOverdueBadges, 5 * 60 * 1000);
}

function waitForPipeline(cb) {
  if (document.querySelector('.pipeline_status')) { cb(); return; }
  const obs = new MutationObserver(() => {
    if (document.querySelector('.pipeline_status')) { obs.disconnect(); cb(); }
  });
  obs.observe(document.body, { childList: true, subtree: true });
}

// ─── Botão 💬 em todos os cards ───────────────────────────────────────────────
function attachCardButtons() {
  document.querySelectorAll(`${SEL.allCards}:not([data-kcp-bound])`).forEach(card => {
    card.setAttribute('data-kcp-bound', '1');
    if (card.querySelector('.kcp-chat-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'kcp-chat-btn';
    btn.title = 'Abrir chat rápido';
    btn.innerHTML = '💬';
    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const isUnsorted = card.classList.contains('pipeline-unsorted__item');
      if (isUnsorted) {
        const link = card.querySelector('a.js-navigate-link, a[href*="/chats/"]');
        if (link) openChatOverlayByUrl(link.getAttribute('href'), card);
      } else {
        openChatOverlay(card.dataset.id, card);
      }
    });
    card.appendChild(btn);
  });
}

// ─── Colunas externas ─────────────────────────────────────────────────────────
function renderCustomColumns() {
  // Remover colunas anteriores
  document.querySelectorAll('.kcp-custom-col').forEach(el => el.remove());

  // Encontrar container do pipeline
  const container = document.querySelector('.pipeline_status')?.parentElement;
  if (!container) return;

  CUSTOM_COLS.forEach(colDef => {
    const leads = customCols[colDef.id] || [];
    const col = document.createElement('div');
    col.className = 'kcp-custom-col';
    col.dataset.colId = colDef.id;

    col.innerHTML = `
      <div class="kcp-custom-col__head" style="border-top:3px solid ${colDef.color}">
        <span class="kcp-custom-col__title">${colDef.label}</span>
        <span class="kcp-custom-col__count" style="background:${colDef.color}">${leads.length}</span>
      </div>
      <div class="kcp-custom-col__body">
        ${leads.length === 0
          ? `<div class="kcp-custom-col__empty">Nenhum lead</div>`
          : leads.map(lead => buildCustomCard(lead)).join('')
        }
      </div>
    `;
    container.appendChild(col);

    // Chat buttons
    col.querySelectorAll('.kcp-cc-chat').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const leadId  = btn.dataset.leadId;
        const chatUrl = btn.dataset.chatUrl;
        const name    = btn.dataset.name;
        openChatOverlayDirect(leadId, chatUrl, name);
      });
    });

    // Remove buttons
    col.querySelectorAll('.kcp-cc-remove').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        removeFromCustomCol(btn.dataset.leadId, colDef.id);
      });
    });
  });
}

function buildCustomCard(lead) {
  const hoursAgo = (Date.now() - lead.addedAt) / 3600000;
  const overdue  = hoursAgo >= OVERDUE_HOURS;
  const timeStr  = formatTimeAgo(lead.addedAt);
  return `
    <div class="kcp-custom-card${overdue ? ' kcp-overdue' : ''}">
      ${overdue ? `<div class="kcp-overdue-badge">⏰ ${Math.round(hoursAgo)}h</div>` : ''}
      <div class="kcp-cc-name">${escHtml(lead.name)}</div>
      <div class="kcp-cc-footer">
        <span class="kcp-cc-time">${timeStr}</span>
        <div style="display:flex;gap:3px">
          <button class="kcp-cc-chat"
            data-lead-id="${lead.leadId}"
            data-chat-url="${escHtml(lead.chatUrl)}"
            data-name="${escHtml(lead.name)}"
            title="Abrir chat">💬</button>
          <button class="kcp-cc-remove" data-lead-id="${lead.leadId}" title="Remover">✕</button>
        </div>
      </div>
    </div>
  `;
}

function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatTimeAgo(ts) {
  const h = Math.floor((Date.now() - ts) / 3600000);
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 60) return `${m}min`;
  if (h < 24) return `${h}h`;
  return `${Math.floor(h/24)}d`;
}

function refreshOverdueBadges() {
  document.querySelectorAll('.kcp-custom-card').forEach(card => {
    const name = card.querySelector('.kcp-cc-name')?.textContent || '';
    // Re-render só o badge — encontrar o lead pelo nome
    const colEl = card.closest('.kcp-custom-col');
    if (!colEl) return;
    const colId = colEl.dataset.colId;
    const lead  = (customCols[colId] || []).find(l => l.name === name);
    if (!lead) return;
    const h = (Date.now() - lead.addedAt) / 3600000;
    card.classList.toggle('kcp-overdue', h >= OVERDUE_HOURS);
    card.querySelector('.kcp-overdue-badge')?.remove();
    if (h >= OVERDUE_HOURS) {
      const badge = document.createElement('div');
      badge.className = 'kcp-overdue-badge';
      badge.textContent = `⏰ ${Math.round(h)}h`;
      card.prepend(badge);
    }
  });
}

// ─── Adicionar lead à coluna externa ──────────────────────────────────────────
async function addToCustomCol(leadId, colId, btn) {
  const colDef   = CUSTOM_COLS.find(c => c.id === colId);
  const original = btn.textContent;
  btn.textContent = '⏳'; btn.disabled = true;

  // Nome do lead
  const card  = document.querySelector(`#pipeline_item_${leadId}`);
  const name  = card?.querySelector('.pipeline_leads__linked-entities, .pipeline_leads__name')
    ?.textContent?.trim().split('\n')[0] || `Lead #${leadId}`;
  const chatUrl = findChatUrlForLead(leadId) || `/leads/detail/${leadId}`;

  // Remover de outras colunas
  CUSTOM_COLS.forEach(c => {
    customCols[c.id] = (customCols[c.id] || []).filter(l => l.leadId !== leadId);
  });
  // Adicionar
  customCols[colId] = [{ leadId, name, addedAt: Date.now(), chatUrl }, ...(customCols[colId] || [])];
  saveCols();

  renderCustomColumns();

  btn.textContent = '✓'; btn.style.background = colDef.color;
  setTimeout(() => { btn.textContent = original; btn.disabled = false; btn.style.background = ''; }, 2000);

  // Scroll para a coluna
  setTimeout(() => {
    document.querySelector(`[data-col-id="${colId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, 300);
}

function removeFromCustomCol(leadId, colId) {
  customCols[colId] = (customCols[colId] || []).filter(l => l.leadId !== leadId);
  saveCols();
  renderCustomColumns();
}

// ─── Overlay de chat ──────────────────────────────────────────────────────────
function injectOverlayContainer() {
  if (document.getElementById('kcp-overlay')) return;

  const stageBtns = CUSTOM_COLS.map(c =>
    `<button class="kcp-stage-btn" data-col-id="${c.id}" style="--btn-color:${c.color}" title="${c.desc}">${c.label}</button>`
  ).join('');

  const overlay = document.createElement('div');
  overlay.id = 'kcp-overlay';
  overlay.innerHTML = `
    <div id="kcp-overlay-backdrop"></div>
    <div id="kcp-overlay-panel">
      <div id="kcp-overlay-header">
        <span id="kcp-overlay-title">💬 Chat</span>
        <div id="kcp-overlay-actions">
          ${stageBtns}
          <button id="kcp-overlay-new-tab" title="Abrir em nova aba">↗</button>
          <button id="kcp-overlay-close" title="Fechar (Esc)">✕</button>
        </div>
      </div>
      <div id="kcp-overlay-body">
        <div id="kcp-overlay-loading"><div class="kcp-spinner"></div><span>Carregando...</span></div>
        <iframe id="kcp-overlay-iframe" src="" allowfullscreen></iframe>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('kcp-overlay-close').addEventListener('click', closeOverlay);
  document.getElementById('kcp-overlay-backdrop').addEventListener('click', closeOverlay);
  document.getElementById('kcp-overlay-new-tab').addEventListener('click', () => {
    const src = document.getElementById('kcp-overlay-iframe').src;
    if (src) window.open(src, '_blank');
  });
  overlay.querySelectorAll('.kcp-stage-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const leadId = overlay.dataset.currentLeadId;
      if (leadId) addToCustomCol(leadId, btn.dataset.colId, btn);
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('kcp-open')) { e.preventDefault(); closeOverlay(); }
  });
}

function openChatOverlay(leadId, card) {
  if (!leadId) return;
  const overlay = document.getElementById('kcp-overlay');
  if (!overlay) return;
  overlay.dataset.currentLeadId = leadId;
  resetStageBtns(overlay);
  const name = card?.querySelector('.pipeline_leads__linked-entities, .pipeline_leads__name')
    ?.textContent?.trim().split('\n')[0] || `Lead #${leadId}`;
  document.getElementById('kcp-overlay-title').textContent = `💬 ${name}`;
  showOverlayWithUrl(findChatUrlForLead(leadId) || `/leads/detail/${leadId}`);
}

function openChatOverlayByUrl(chatUrl, card) {
  const overlay = document.getElementById('kcp-overlay');
  if (!overlay) return;
  const m = chatUrl?.match(/leads\/detail\/(\d+)/);
  overlay.dataset.currentLeadId = m ? m[1] : '';
  resetStageBtns(overlay);
  const name = card?.querySelector(
    '.pipeline-unsorted__item-from, .pipeline-unsorted__item-title, .pipeline_leads__linked-entities'
  )?.textContent?.trim().split('\n')[0] || 'Lead de entrada';
  document.getElementById('kcp-overlay-title').textContent = `💬 ${name}`;
  showOverlayWithUrl(chatUrl);
}

function openChatOverlayDirect(leadId, chatUrl, name) {
  if (!document.getElementById('kcp-overlay')) injectOverlayContainer();
  const overlay = document.getElementById('kcp-overlay');
  if (!overlay) { window.open(chatUrl || `/leads/detail/${leadId}`, '_blank'); return; }
  overlay.dataset.currentLeadId = leadId;
  resetStageBtns(overlay);
  document.getElementById('kcp-overlay-title').textContent = `💬 ${name}`;
  // Se a chatUrl for só /leads/detail, tenta enriquecer com URL de chat
  const url = (!chatUrl || chatUrl === `/leads/detail/${leadId}`)
    ? (findChatUrlForLead(leadId) || `/leads/detail/${leadId}`)
    : chatUrl;
  showOverlayWithUrl(url);
}

function resetStageBtns(overlay) {
  overlay.querySelectorAll('.kcp-stage-btn').forEach(b => {
    const c = CUSTOM_COLS.find(x => x.id === b.dataset.colId);
    if (c) { b.textContent = c.label; b.disabled = false; b.style.background = ''; }
  });
}

function showOverlayWithUrl(url) {
  const overlay = document.getElementById('kcp-overlay');
  const iframe  = document.getElementById('kcp-overlay-iframe');
  const loading = document.getElementById('kcp-overlay-loading');
  iframe.style.display = 'none'; loading.style.display = 'flex';
  overlay.classList.add('kcp-open');
  iframe.onload = () => { loading.style.display = 'none'; iframe.style.display = 'block'; };
  iframe.src = url;
}

function closeOverlay() {
  const overlay = document.getElementById('kcp-overlay');
  if (!overlay) return;
  overlay.classList.remove('kcp-open');
  setTimeout(() => { const f = document.getElementById('kcp-overlay-iframe'); if (f) f.src = ''; }, 300);
}

function findChatUrlForLead(leadId) {
  for (const link of document.querySelectorAll(`a[href*="leads/detail/${leadId}"]`)) {
    const m = link.href.match(/\/chats\/(\d+)\//);
    if (m) return `/chats/${m[1]}/leads/detail/${leadId}`;
  }
  return null;
}

// ─── Toolbar flutuante ────────────────────────────────────────────────────────
function injectToolbar() {
  if (document.getElementById('kcp-toolbar')) return;

  const stageBtns = CUSTOM_COLS.map(c =>
    `<button class="kcp-toolbar-stage" data-col-id="${c.id}" style="background:${c.color}" title="${c.desc}">${c.label}</button>`
  ).join('');

  const toolbar = document.createElement('div');
  toolbar.id = 'kcp-toolbar';
  toolbar.innerHTML = `
    <span id="kcp-drag-handle" title="Mover barra">⠿</span>
    <button id="kcp-btn-focus" title="Modo Chat (Alt+C)">💬</button>
    <button id="kcp-btn-close" title="Fechar conversa (Alt+F)">✅</button>
    <button id="kcp-btn-hold" title="Colocar em espera (Alt+E)">⏸</button>
    <span style="width:1px;height:18px;background:#333;margin:0 4px;display:inline-block"></span>
    ${stageBtns}
    <span style="width:1px;height:18px;background:#333;margin:0 4px;display:inline-block"></span>
    <button id="kcp-btn-panel" title="Ver colunas" style="font-size:12px;font-weight:700;width:auto;padding:0 8px;">📋 Listas</button>
  `;
  document.body.appendChild(toolbar);
  initToolbarDrag(toolbar);

  document.getElementById('kcp-btn-focus').addEventListener('click', toggleFocusMode);
  document.getElementById('kcp-btn-close').addEventListener('click', () => findBtnByText('Fechar conversa')?.click());
  document.getElementById('kcp-btn-hold').addEventListener('click',  () => findBtnByText('Colocar em espera')?.click());
  document.getElementById('kcp-btn-panel').addEventListener('click', toggleColPanel);

  toolbar.querySelectorAll('.kcp-toolbar-stage').forEach(btn => {
    btn.addEventListener('click', async () => {
      const leadId = getLeadIdFromUrl();
      if (!leadId) return;
      await addToCustomCol(leadId, btn.dataset.colId, btn);
    });
  });

  injectColPanel();
  injectOverlayContainer();
  updateToolbarState();
}

// ─── Painel de colunas ────────────────────────────────────────────────────────
function injectColPanel() {
  if (document.getElementById('kcp-col-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'kcp-col-panel';
  document.body.appendChild(panel);
  renderColPanel();
}

function renderColPanel() {
  const panel = document.getElementById('kcp-col-panel');
  if (!panel) return;

  const total = CUSTOM_COLS.reduce((n, c) => n + (customCols[c.id] || []).length, 0);
  document.getElementById('kcp-btn-panel') &&
    (document.getElementById('kcp-btn-panel').textContent = `📋 Listas${total ? ` (${total})` : ''}`);

  panel.innerHTML = `
    <div id="kcp-col-panel-header">
      <span style="font-weight:700;font-size:13px;">📋 Minhas Listas</span>
      <button id="kcp-col-panel-close">✕</button>
    </div>
    <div id="kcp-col-panel-tabs">
      ${CUSTOM_COLS.map((c, i) => `
        <button class="kcp-col-tab${i === 0 ? ' kcp-col-tab-active' : ''}"
          data-tab="${c.id}" style="--tab-color:${c.color}">
          ${c.label}
          <span class="kcp-col-tab-count">${(customCols[c.id] || []).length}</span>
        </button>
      `).join('')}
    </div>
    <div id="kcp-col-panel-body">
      ${CUSTOM_COLS.map((c, i) => `
        <div class="kcp-col-panel-section${i === 0 ? ' kcp-col-section-active' : ''}" data-section="${c.id}">
          ${(customCols[c.id] || []).length === 0
            ? `<div class="kcp-col-panel-empty">Nenhum lead nesta lista</div>`
            : (customCols[c.id] || []).map(lead => buildPanelCard(lead, c.id)).join('')
          }
        </div>
      `).join('')}
    </div>
  `;

  panel.querySelector('#kcp-col-panel-close').addEventListener('click', () => {
    panel.classList.remove('kcp-col-panel-open');
    document.getElementById('kcp-btn-panel')?.classList.remove('kcp-active');
  });

  panel.querySelectorAll('.kcp-col-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      panel.querySelectorAll('.kcp-col-tab').forEach(t => t.classList.remove('kcp-col-tab-active'));
      panel.querySelectorAll('.kcp-col-panel-section').forEach(s => s.classList.remove('kcp-col-section-active'));
      tab.classList.add('kcp-col-tab-active');
      panel.querySelector(`[data-section="${tab.dataset.tab}"]`)?.classList.add('kcp-col-section-active');
    });
  });

  panel.querySelectorAll('.kcp-panel-chat').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openChatOverlayDirect(btn.dataset.leadId, btn.dataset.chatUrl, btn.dataset.name);
    });
  });

  panel.querySelectorAll('.kcp-panel-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      removeFromCustomCol(btn.dataset.leadId, btn.dataset.colId);
      renderColPanel();
    });
  });
}

function buildPanelCard(lead, colId) {
  const hoursAgo = (Date.now() - lead.addedAt) / 3600000;
  const overdue  = hoursAgo >= OVERDUE_HOURS;
  const timeStr  = formatTimeAgo(lead.addedAt);
  return `
    <div class="kcp-panel-card${overdue ? ' kcp-overdue' : ''}">
      ${overdue ? `<span class="kcp-overdue-badge" style="position:static;display:inline-block;margin-bottom:4px;">⏰ ${Math.round(hoursAgo)}h sem resposta</span>` : ''}
      <div class="kcp-panel-card-name">${escHtml(lead.name)}</div>
      <div class="kcp-panel-card-footer">
        <span class="kcp-cc-time">há ${timeStr}</span>
        <div style="display:flex;gap:4px">
          <button class="kcp-panel-chat" data-lead-id="${lead.leadId}" data-chat-url="${escHtml(lead.chatUrl)}" data-name="${escHtml(lead.name)}" title="Abrir chat">💬 Chat</button>
          <button class="kcp-panel-remove" data-lead-id="${lead.leadId}" data-col-id="${colId}" title="Remover">✕</button>
        </div>
      </div>
    </div>
  `;
}

function toggleColPanel() {
  if (!document.getElementById('kcp-col-panel')) injectColPanel();
  renderColPanel();
  const panel = document.getElementById('kcp-col-panel');
  const isOpen = panel.classList.toggle('kcp-col-panel-open');
  document.getElementById('kcp-btn-panel')?.classList.toggle('kcp-active', isOpen);
}

function initToolbarDrag(toolbar) {
  const KCP_POS_KEY = 'kcp_toolbar_pos';

  // Restaurar posição salva
  chrome.storage.local.get(KCP_POS_KEY, (data) => {
    const pos = data[KCP_POS_KEY];
    if (pos) applyToolbarPos(toolbar, pos.x, pos.y);
  });

  const handle = document.getElementById('kcp-drag-handle');
  let dragging = false, ox = 0, oy = 0;

  handle.addEventListener('mousedown', e => {
    e.preventDefault();
    dragging = true;
    const rect = toolbar.getBoundingClientRect();
    ox = e.clientX - rect.left;
    oy = e.clientY - rect.top;
    toolbar.style.transition = 'none';
    toolbar.style.borderRadius = '8px';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    let x = e.clientX - ox;
    let y = e.clientY - oy;
    const rect = toolbar.getBoundingClientRect();
    x = Math.max(0, Math.min(window.innerWidth  - rect.width,  x));
    y = Math.max(0, Math.min(window.innerHeight - rect.height, y));
    applyToolbarPos(toolbar, x, y);
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    toolbar.style.transition = '';
    document.body.style.userSelect = '';
    const rect = toolbar.getBoundingClientRect();
    chrome.storage.local.set({ [KCP_POS_KEY]: { x: rect.left, y: rect.top } });
    repositionPanel();
  });
}

function applyToolbarPos(toolbar, x, y) {
  toolbar.style.bottom = 'auto';
  toolbar.style.right  = 'auto';
  toolbar.style.left   = x + 'px';
  toolbar.style.top    = y + 'px';
}

function repositionPanel() {
  const panel   = document.getElementById('kcp-col-panel');
  const toolbar = document.getElementById('kcp-toolbar');
  if (!panel || !toolbar) return;
  const tr = toolbar.getBoundingClientRect();
  panel.style.bottom = 'auto';
  panel.style.right  = 'auto';
  panel.style.left   = Math.max(0, Math.min(window.innerWidth - 360, tr.left)) + 'px';
  panel.style.top    = Math.max(0, tr.top - panel.offsetHeight - 4) + 'px';
}

function getLeadIdFromUrl() {
  const m = location.pathname.match(/\/(?:leads\/detail|chats\/\d+\/leads\/detail)\/(\d+)/);
  return m ? m[1] : null;
}

function updateToolbarState() {
  const btn = document.getElementById('kcp-btn-focus');
  if (btn) btn.classList.toggle('kcp-active', settings.focusMode);
}

function toggleFocusMode() {
  settings.focusMode = !settings.focusMode;
  saveSettings(); applyModes(); updateToolbarState();
}

function findBtnByText(text) {
  return Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.trim().includes(text));
}

function focusInputChat() {
  const input = document.querySelector(SEL.chatInput);
  if (input) { input.focus(); input.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
}

// ─── Atalhos de teclado ───────────────────────────────────────────────────────
function initShortcuts() {
  document.addEventListener('keydown', e => {
    if (!e.altKey) return;
    switch (e.key.toLowerCase()) {
      case 'c': e.preventDefault(); toggleFocusMode(); break;
      case 'f': e.preventDefault(); findBtnByText('Fechar conversa')?.click(); break;
      case 'e': e.preventDefault(); findBtnByText('Colocar em espera')?.click(); break;
      case 'r': e.preventDefault(); focusInputChat(); break;
      case 'arrowdown': e.preventDefault(); navigateConversation(1); break;
      case 'arrowup':   e.preventDefault(); navigateConversation(-1); break;
    }
  });
}

function navigateConversation(dir) {
  const items = Array.from(document.querySelectorAll('.notification__item'));
  const sel   = document.querySelector('.notification-inner_selected');
  const idx   = sel ? items.indexOf(sel) : -1;
  items[Math.max(0, Math.min(items.length - 1, idx + dir))]
    ?.querySelector('a, [class*="navigate-link"]')?.click();
}

// ─── SPA watch ────────────────────────────────────────────────────────────────
function watchNavigation() {
  let last = location.href;
  new MutationObserver(() => {
    if (location.href !== last) {
      last = location.href;
      setTimeout(() => { applyModes(); if (!document.getElementById('kcp-toolbar')) injectToolbar(); initKanban(); }, 600);
    }
  }).observe(document.body, { childList: true, subtree: true });
}

function watchNavigationIframe() {
  let last = location.href;
  new MutationObserver(() => {
    if (location.href !== last) { last = location.href; setTimeout(initAutoFocus, 500); }
  }).observe(document.body, { childList: true, subtree: true });
}

// ─── Popup messages ───────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'GET_SETTINGS') sendResponse({ settings });
  if (msg.type === 'SET_SETTINGS') {
    settings = { ...settings, ...msg.settings };
    saveSettings(); applyModes(); updateToolbarState();
    sendResponse({ ok: true });
  }
});
