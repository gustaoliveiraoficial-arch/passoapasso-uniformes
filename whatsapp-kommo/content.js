// ===== WhatsApp Kommo Bridge v2 — Passo a Passo =====

// ─── State ────────────────────────────────────────────────────────────────────
const WKB_KEY       = 'wkb_config';
const WKB_CACHE_KEY = 'wkb_cache';

let cfg             = { subdomain: '', favoriteStages: [] };
let leadsCache      = null; // { stages, leads, syncedAt }
let activeTabStageId = null;
let panelMode       = 'search'; // 'search' | 'kanban'
let _wkbInited      = false;   // guard contra dupla inicialização

// Cache de fotos de perfil: telefone normalizado → URL da img
const photoCache    = new Map();

// ─── Boot ─────────────────────────────────────────────────────────────────────
chrome.storage.local.get([WKB_KEY, WKB_CACHE_KEY], d => {
  if (d[WKB_KEY])       cfg        = { ...cfg, ...d[WKB_KEY] };
  if (d[WKB_CACHE_KEY]) leadsCache = d[WKB_CACHE_KEY];

  if (!cfg.subdomain) {
    chrome.runtime.sendMessage({ type: 'DETECT_SUBDOMAIN' }, res => {
      if (res?.subdomain) {
        cfg.subdomain = res.subdomain;
        chrome.storage.local.set({ [WKB_KEY]: { ...cfg } });
      }
      waitForWhatsApp();
    });
  } else {
    waitForWhatsApp();
  }
});

// ─── Aguarda o WhatsApp Web carregar ─────────────────────────────────────────
function waitForWhatsApp() {
  // Se já carregou, inicia imediatamente sem observar
  if (document.querySelector('#side, #app')) { init(); return; }

  const obs = new MutationObserver(() => {
    if (document.querySelector('[data-testid="chatlist-header"], #side, #app')) {
      obs.disconnect();
      init();
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });
}

function init() {
  if (_wkbInited) return; // impede dupla inicialização
  _wkbInited = true;
  injectToggleBtn();
  injectPanel();
  watchConversation();
  initUnreadHighlight();
  initTabBar();
  triggerInitialSync();
}

// ─── Listener de mudanças no storage ─────────────────────────────────────────
chrome.storage.onChanged.addListener(changes => {
  if (changes[WKB_KEY]) cfg = { ...cfg, ...changes[WKB_KEY].newValue };

  if (changes[WKB_CACHE_KEY]?.newValue) {
    leadsCache = changes[WKB_CACHE_KEY].newValue;
    renderTabBar();

    // Atualiza kanban se estiver aberto
    if (panelMode === 'kanban' && document.getElementById('wkb-panel')?.classList.contains('wkb-open')) {
      renderKanban();
    }
    // Re-renderiza overlay de etapa ativa
    if (activeTabStageId) showStageView(activeTabStageId);
  }
});

function triggerInitialSync() {
  if (!cfg.subdomain) return;
  const age = leadsCache ? (Date.now() - (leadsCache.syncedAt || 0)) : Infinity;
  if (age > 5 * 60 * 1000) {
    chrome.runtime.sendMessage({ type: 'SYNC_NOW', subdomain: cfg.subdomain });
  }
}

// ─── Botão flutuante ──────────────────────────────────────────────────────────
function injectToggleBtn() {
  if (document.getElementById('wkb-toggle')) return;
  const btn = document.createElement('div');
  btn.id = 'wkb-toggle';
  btn.title = 'Kommo CRM';
  btn.innerHTML = `<span>K</span>`;
  btn.addEventListener('click', togglePanel);
  document.body.appendChild(btn);
}

// ─── Painel lateral ───────────────────────────────────────────────────────────
function injectPanel() {
  if (document.getElementById('wkb-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'wkb-panel';
  panel.innerHTML = `
    <div id="wkb-panel-header">
      <span>⚡ Kommo Bridge</span>
      <div style="display:flex;gap:6px;align-items:center">
        <button id="wkb-btn-kanban" title="Kanban">⊞</button>
        <button id="wkb-btn-refresh" title="Atualizar">↻</button>
        <button id="wkb-btn-close" title="Fechar">✕</button>
      </div>
    </div>
    <div id="wkb-panel-body">
      <div class="wkb-hint">Abra uma conversa para buscar o lead no Kommo.</div>
    </div>
  `;
  document.body.appendChild(panel);

  document.getElementById('wkb-btn-close').addEventListener('click', () => {
    panel.classList.remove('wkb-open');
    document.getElementById('wkb-toggle').classList.remove('wkb-active');
  });

  document.getElementById('wkb-btn-refresh').addEventListener('click', () => {
    if (panelMode === 'kanban') {
      setBody('<div class="wkb-loading"><div class="wkb-spinner"></div>Sincronizando...</div>');
      chrome.runtime.sendMessage({ type: 'SYNC_NOW', subdomain: cfg.subdomain }, () => renderKanban());
    } else {
      searchContact();
    }
  });

  document.getElementById('wkb-btn-kanban').addEventListener('click', toggleKanbanMode);
}

function togglePanel() {
  const panel  = document.getElementById('wkb-panel');
  const toggle = document.getElementById('wkb-toggle');
  const isOpen = panel.classList.toggle('wkb-open');
  toggle.classList.toggle('wkb-active', isOpen);
  if (isOpen) {
    if (panelMode === 'kanban') renderKanban();
    else searchContact();
  }
}

// ─── Toggle Kanban / Search mode ──────────────────────────────────────────────
function toggleKanbanMode() {
  const panel = document.getElementById('wkb-panel');
  const btn   = document.getElementById('wkb-btn-kanban');

  if (panelMode === 'search') {
    panelMode = 'kanban';
    panel.classList.add('wkb-panel-wide');
    btn.textContent = '☰';
    btn.title = 'Modo busca';
    btn.classList.add('wkb-active-btn');
    if (!panel.classList.contains('wkb-open')) {
      panel.classList.add('wkb-open');
      document.getElementById('wkb-toggle').classList.add('wkb-active');
    }
    renderKanban();
  } else {
    panelMode = 'search';
    panel.classList.remove('wkb-panel-wide');
    btn.textContent = '⊞';
    btn.title = 'Kanban';
    btn.classList.remove('wkb-active-btn');
    setBody('<div class="wkb-hint">Abra uma conversa para buscar o lead no Kommo.</div>');
  }
}

// ─── SELECT DE ETAPAS (injetado no #side do WhatsApp) ────────────────────────
function initTabBar() {
  const tryInject = () => {
    const side = document.querySelector('#side');
    if (!side) return false;
    if (!document.getElementById('wkb-stage-bar')) {
      const wrapper = document.createElement('div');
      wrapper.id = 'wkb-stage-bar';
      wrapper.innerHTML = `
        <select id="wkb-stage-select">
          <option value="">📋 Todos os chats</option>
        </select>
      `;
      // Insere ANTES do último filho (lista de chats)
      const lastChild = side.lastElementChild;
      if (lastChild) side.insertBefore(wrapper, lastChild);
      else side.appendChild(wrapper);

      document.getElementById('wkb-stage-select').addEventListener('change', e => {
        const val = e.target.value;
        selectTab(val ? parseInt(val) : null);
      });
    }
    renderTabBar();
    return true;
  };

  if (!tryInject()) {
    const obs = new MutationObserver(() => {
      if (tryInject()) obs.disconnect();
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // Vigia re-renders do WhatsApp que removem o select
  new MutationObserver(() => {
    if (!document.getElementById('wkb-stage-bar')) {
      setTimeout(tryInject, 150);
    }
  }).observe(document.body, { childList: true, subtree: true });
}

function renderTabBar() {
  const sel = document.getElementById('wkb-stage-select');
  if (!sel) return;

  // Rebuild options mantendo "Todos" fixo
  while (sel.options.length > 1) sel.remove(1);

  if (!leadsCache?.stages?.length) {
    sel.options[0].textContent = '⟳ Sincronizando...';
    return;
  }
  sel.options[0].textContent = '📋 Todos os chats';

  const { stages, leads } = leadsCache;
  const countByStage = {};
  leads.forEach(l => { countByStage[l.status_id] = (countByStage[l.status_id] || 0) + 1; });

  const favIds = (cfg.favoriteStages || []).map(String);
  const visibleStages = favIds.length > 0
    ? stages.filter(s => favIds.includes(String(s.id)))
    : stages;

  visibleStages.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    const count = countByStage[s.id] || 0;
    opt.textContent = `● ${s.name}${count ? ` (${count})` : ''}`;
    sel.appendChild(opt);
  });

  // Restaura seleção ativa
  sel.value = activeTabStageId ? String(activeTabStageId) : '';

  // Borda colorida conforme etapa selecionada
  applySelectColor(sel);
}

function applySelectColor(sel) {
  if (!sel) return;
  if (activeTabStageId && leadsCache?.stages) {
    const stage = leadsCache.stages.find(s => s.id === activeTabStageId);
    if (stage?.color) {
      sel.style.borderColor = stage.color;
      sel.style.boxShadow = `0 0 0 2px ${stage.color}33`;
      return;
    }
  }
  sel.style.borderColor = '';
  sel.style.boxShadow = '';
}

function selectTab(stageId) {
  activeTabStageId = stageId;
  const sel = document.getElementById('wkb-stage-select');
  if (sel) {
    sel.value = stageId ? String(stageId) : '';
    applySelectColor(sel);
  }
  if (!stageId) {
    hideStageView();
  } else {
    showStageView(stageId);
  }
}

// ─── Stage View (overlay position:fixed sobre a lista de chats) ───────────────
function showStageView(stageId) {
  hideStageView();

  const side   = document.querySelector('#side');
  const tabBar = document.getElementById('wkb-stage-bar');
  if (!side) return;

  const overlay = document.createElement('div');
  overlay.id = 'wkb-stage-view';

  if (!leadsCache) {
    overlay.innerHTML = `<div class="wkb-sv-loading"><div class="wkb-spinner"></div>Aguardando sync...</div>`;
  } else {
    const { stages, leads } = leadsCache;
    const stage      = stages.find(s => s.id === stageId);
    const stageLeads = leads.filter(l => l.status_id === stageId);
    const stageColor = stage?.color || '#888';
    const stageRgb   = hexToRgb(stageColor) || '136,136,136';

    overlay.innerHTML = `
      <div class="wkb-sv-header" style="border-bottom:3px solid ${stageColor}">
        <span class="wkb-tab-dot" style="background:${stageColor}"></span>
        <span>${escHtml(stage?.name || 'Etapa')}</span>
        <span class="wkb-sv-count">${stageLeads.length} lead${stageLeads.length !== 1 ? 's' : ''}</span>
      </div>
      ${!stageLeads.length
        ? `<div class="wkb-sv-empty">
             <div style="font-size:28px;margin-bottom:6px">📭</div>
             Nenhum lead nesta etapa
           </div>`
        : `<div class="wkb-sv-list">
            ${stageLeads.map(lead => {
              const hasUnread    = lead.phone ? hasUnreadForPhone(lead.phone) : false;
              const cleanPhone   = (lead.phone || '').replace(/\D/g,'');
              const photo        = cleanPhone ? photoCache.get(cleanPhone) : null;
              const initials     = (lead.contactName || lead.name || '?')[0].toUpperCase();
              const avatarClr    = nameToColor(lead.contactName || lead.name || '');
              const highlightStyle = hasUnread
                ? `background:rgba(${stageRgb},0.13);border-left:3px solid rgba(${stageRgb},0.8);`
                : '';
              return `
              <div class="wkb-sv-item" style="${highlightStyle}" data-lead="${lead.id}">
                ${photo
                  ? `<img class="wkb-sv-avatar wkb-sv-avatar-img" src="${photo}" alt="${initials}" />`
                  : `<div class="wkb-sv-avatar" style="background:${avatarClr}">${initials}</div>`}
                <div class="wkb-sv-body">
                  <div class="wkb-sv-name">${escHtml(lead.contactName || lead.name)}</div>
                  <div class="wkb-sv-sub">
                    ${lead.name && lead.name !== lead.contactName ? `<span>${escHtml(lead.name)}</span>` : ''}
                    ${lead.price ? `<span class="wkb-sv-price">R$ ${Number(lead.price).toLocaleString('pt-BR')}</span>` : ''}
                    ${lead.phone
                      ? `<span class="wkb-sv-phone">${formatPhone(lead.phone)}</span>`
                      : `<span class="wkb-sv-nophone">sem número</span>`}
                    ${hasUnread ? `<span style="font-size:10px;font-weight:700;color:rgb(${stageRgb})">● sem resposta</span>` : ''}
                  </div>
                </div>
                <div class="wkb-sv-actions">
                  ${lead.phone
                    ? `<button class="wkb-sv-btn-chat" data-phone="${lead.phone}" title="Abrir conversa">💬</button>`
                    : ''}
                  <a class="wkb-sv-btn-link"
                     href="https://${cfg.subdomain}.kommo.com/leads/detail/${lead.id}"
                     target="_blank" title="Abrir no Kommo">↗</a>
                </div>
              </div>`;
            }).join('')}
           </div>`
      }
    `;

    overlay.querySelectorAll('.wkb-sv-btn-chat').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        openWhatsAppChat(btn.dataset.phone);
      });
    });
  }

  // Posiciona o overlay sobre a área de chat (abaixo da tab bar)
  positionOverlay(overlay, side, tabBar);
  document.body.appendChild(overlay);

  // ResizeObserver para reposicionar ao redimensionar janela
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => positionOverlay(overlay, side, document.getElementById('wkb-stage-bar')));
    ro.observe(side);
    overlay._ro = ro;
  }
}

function positionOverlay(overlay, side, tabBar) {
  const sideRect = side.getBoundingClientRect();
  // Usa o bottom real da tab bar como topo do overlay
  const tabBottom = tabBar ? tabBar.getBoundingClientRect().bottom : sideRect.top;
  Object.assign(overlay.style, {
    position:      'fixed',
    top:           `${tabBottom}px`,
    left:          `${sideRect.left}px`,
    width:         `${sideRect.width}px`,
    height:        `${sideRect.bottom - tabBottom}px`,
    zIndex:        '9500',
    display:       'flex',
    flexDirection: 'column',
    overflowY:     'auto',
    background:    '#f0f2f5',
  });
}

function hideStageView() {
  const overlay = document.getElementById('wkb-stage-view');
  if (overlay) {
    overlay._ro?.disconnect();
    overlay.remove();
  }
}

// ─── Abre chat pelo número ────────────────────────────────────────────────────
function openWhatsAppChat(phone) {
  const clean = phone.replace(/\D/g, '');
  hideStageView();
  selectTab(null);

  // 1. Tenta clicar no item do chat na lista (virtual scroll — se visível no DOM)
  const variants = phoneVariants(clean);
  for (const v of variants) {
    const chatEl = document.querySelector(`[data-id*="${v}@c.us"]`);
    if (chatEl) {
      const clickable =
        chatEl.closest('[data-testid="cell-frame-container"]') ||
        chatEl.closest('[role="listitem"]') ||
        chatEl;
      clickable.click();
      return;
    }
  }

  // 2. Abre via campo de pesquisa do WhatsApp (mesma aba, sem recarregar)
  openChatViaSearch(clean);
}

async function openChatViaSearch(phone) {
  // Localiza o campo de pesquisa já visível no painel lateral
  let searchInput =
    document.querySelector('[data-testid="search-input"] input') ||
    document.querySelector('[data-testid="search-input"]') ||
    document.querySelector('#side input[type="text"]') ||
    document.querySelector('#side [contenteditable="true"][data-tab]');

  // Se não encontrar, tenta clicar no botão de pesquisa primeiro
  if (!searchInput) {
    const searchBtn =
      document.querySelector('[data-testid="chat-list-search-container"]') ||
      document.querySelector('[data-icon="search"]')?.closest('button,[role="button"]') ||
      document.querySelector('button[aria-label*="Pesquis"]');
    if (searchBtn) {
      searchBtn.click();
      await new Promise(r => setTimeout(r, 300));
      searchInput =
        document.querySelector('[data-testid="search-input"] input') ||
        document.querySelector('[data-testid="search-input"]') ||
        document.querySelector('#side input[type="text"]') ||
        document.querySelector('#side [contenteditable="true"][data-tab]');
    }
  }

  if (searchInput) {
    searchInput.focus();
    // Insere número usando API nativa (compatível com React)
    if (searchInput.isContentEditable) {
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, phone);
    } else {
      const proto = Object.getPrototypeOf(searchInput);
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      if (setter) setter.call(searchInput, phone);
    }
    searchInput.dispatchEvent(new InputEvent('input', { bubbles: true, data: phone }));

    // Aguarda resultados e clica no primeiro
    await new Promise(r => setTimeout(r, 700));
    const first = document.querySelector('[data-testid="cell-frame-container"]');
    if (first) {
      first.click();
      // Limpa pesquisa após abrir
      setTimeout(() => {
        const x = document.querySelector('[data-testid="search-back-btn"]') ||
                  document.querySelector('[data-icon="x-alt"]')?.closest('button');
        if (x) x.click();
      }, 200);
      return;
    }

    // Não encontrou — limpa pesquisa
    const x = document.querySelector('[data-testid="search-back-btn"]') ||
              document.querySelector('[data-icon="x-alt"]')?.closest('button');
    if (x) x.click();
  }

  // Fallback final: URL mesma aba (WhatsApp Web trata como rota interna)
  window.location.assign(`https://web.whatsapp.com/send?phone=${phone}&app_absent=0`);
}

// ─── KANBAN VIEW (dentro do painel lateral) ───────────────────────────────────
function renderKanban() {
  if (panelMode !== 'kanban') return;
  const body = document.getElementById('wkb-panel-body');
  if (!body) return;

  if (!cfg.subdomain) {
    body.innerHTML = `<div class="wkb-hint">Configure o subdomínio Kommo no popup da extensão.</div>`;
    return;
  }

  if (!leadsCache?.stages?.length) {
    body.innerHTML = `<div class="wkb-loading"><div class="wkb-spinner"></div>Sincronizando com Kommo...</div>`;
    chrome.runtime.sendMessage({ type: 'SYNC_NOW', subdomain: cfg.subdomain });
    return;
  }

  const { leads, syncedAt } = leadsCache;

  // Deduplica etapas por id (evita repetição caso o cache tenha duplicatas)
  const stagesMap = new Map();
  leadsCache.stages.forEach(s => { if (!stagesMap.has(s.id)) stagesMap.set(s.id, s); });
  const stages = [...stagesMap.values()];

  // Agrupa leads por etapa
  const byStage = {};
  stages.forEach(s => { byStage[s.id] = []; });
  leads.forEach(l => {
    if (byStage[l.status_id] !== undefined) byStage[l.status_id].push(l);
    else byStage[l.status_id] = [l];
  });

  const syncLabel = syncedAt ? timeSince(syncedAt) : 'nunca';

  body.innerHTML = `
    <div class="wkb-kanban-meta">
      Sync: ${syncLabel} · ${leads.length} leads
      <button id="wkb-kanban-sync-btn" class="wkb-kanban-sync-btn" title="Sincronizar agora">↻</button>
    </div>
    <div class="wkb-kanban-board">
      ${stages.map(s => {
        const stageLeads = byStage[s.id] || [];
        const stageRgb   = hexToRgb(s.color) || '136,136,136';
        return `
          <div class="wkb-kanban-col">
            <div class="wkb-kanban-col-header" style="border-top:3px solid ${s.color}">
              <span class="wkb-tab-dot" style="background:${s.color}"></span>
              <span class="wkb-kanban-col-name">${escHtml(s.name)}</span>
              <span class="wkb-kanban-count">${stageLeads.length}</span>
            </div>
            <div class="wkb-kanban-cards">
              ${stageLeads.map(l => {
                const cleanPhone = (l.phone || '').replace(/\D/g,'');
                const photo      = cleanPhone ? photoCache.get(cleanPhone) : null;
                const initials   = (l.contactName || l.name || '?').slice(0,2).toUpperCase();
                const avatarClr  = nameToColor(l.contactName || l.name || '');
                const hasUnread  = cleanPhone ? hasUnreadForPhone(cleanPhone) : false;
                const cardStyle  = hasUnread
                  ? `border-left:3px solid ${s.color};background:rgba(${stageRgb},0.07);`
                  : '';
                return `
                <div class="wkb-kanban-card" style="${cardStyle}">
                  <div class="wkb-kc-header">
                    ${photo
                      ? `<img class="wkb-kc-avatar" src="${photo}" alt="${initials}" />`
                      : `<div class="wkb-kc-avatar" style="background:${avatarClr}">${initials}</div>`}
                    <div class="wkb-kc-info">
                      <div class="wkb-kc-name">${escHtml(l.contactName || l.name)}</div>
                      ${l.name && l.name !== l.contactName
                        ? `<div class="wkb-kc-lead">${escHtml(l.name)}</div>`
                        : ''}
                    </div>
                    ${hasUnread
                      ? `<span class="wkb-kc-unread-dot" style="background:${s.color}" title="Não respondido"></span>`
                      : ''}
                  </div>
                  ${l.price
                    ? `<div class="wkb-kc-price">R$ ${Number(l.price).toLocaleString('pt-BR')}</div>`
                    : ''}
                  <div class="wkb-kc-actions">
                    ${l.phone
                      ? `<button class="wkb-kc-chat" data-phone="${l.phone}" title="Abrir chat">💬 Chat</button>`
                      : ''}
                    <a class="wkb-kc-link"
                       href="https://${cfg.subdomain}.kommo.com/leads/detail/${l.id}"
                       target="_blank" title="Abrir no Kommo">↗</a>
                  </div>
                </div>`;
              }).join('')}
              ${!stageLeads.length ? `<div class="wkb-kc-empty">Vazio</div>` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  document.getElementById('wkb-kanban-sync-btn')?.addEventListener('click', () => {
    setBody('<div class="wkb-loading"><div class="wkb-spinner"></div>Sincronizando...</div>');
    chrome.runtime.sendMessage({ type: 'SYNC_NOW', subdomain: cfg.subdomain }, () => renderKanban());
  });

  body.querySelectorAll('.wkb-kc-chat').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const panel = document.getElementById('wkb-panel');
      panel.classList.remove('wkb-open');
      document.getElementById('wkb-toggle').classList.remove('wkb-active');
      openWhatsAppChat(btn.dataset.phone);
    });
  });
}

function timeSince(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)   return 'agora';
  if (s < 3600) return `há ${Math.floor(s / 60)}min`;
  return `há ${Math.floor(s / 3600)}h`;
}

// ─── Detecta conversa atual ───────────────────────────────────────────────────
function watchConversation() {
  let lastTitle = '';
  new MutationObserver(() => {
    const title = getChatTitle();
    if (title && title !== lastTitle) {
      lastTitle = title;
      if (document.getElementById('wkb-panel')?.classList.contains('wkb-open') && panelMode === 'search') {
        searchContact();
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
}

function getChatTitle() {
  return (
    document.querySelector('[data-testid="conversation-info-header-chat-title"]')?.textContent?.trim() ||
    document.querySelector('header [title]')?.getAttribute('title') ||
    ''
  );
}

function getCurrentPhone() {
  const trySelected = () => {
    const sels = [
      '[aria-selected="true"]',
      '[data-testid="cell-frame-container"][tabindex="0"]',
      '.copyable-area [aria-selected="true"]',
    ];
    for (const s of sels) {
      const el = document.querySelector(s);
      if (!el) continue;
      let cur = el;
      for (let i = 0; i < 6; i++) {
        if (cur?.dataset?.id?.includes('@c.us'))
          return cleanPhone(cur.dataset.id.replace('@c.us', ''));
        cur = cur?.parentElement;
      }
    }
    return null;
  };

  const tryDataIds = () => {
    for (const el of document.querySelectorAll('[data-id]')) {
      const id = el.dataset.id || '';
      const m  = id.match(/_?(\d{10,15})@c\.us/);
      if (m) return cleanPhone(m[1]);
    }
    return null;
  };

  const tryTitle = () => {
    const candidates = [
      document.querySelector('[data-testid="conversation-info-header-chat-title"]'),
      document.querySelector('header [title]'),
      document.querySelector('[data-testid="conversation-info-header"] span'),
      document.querySelector('header span[dir="auto"]'),
    ];
    for (const el of candidates) {
      const txt = el?.textContent?.trim() || el?.getAttribute('title') || '';
      if (/^\+?[\d\s\-().]{8,}$/.test(txt)) return cleanPhone(txt);
    }
    return null;
  };

  const trySubtitle = () => {
    const sub = document.querySelector(
      '[data-testid="conversation-info-header"] [data-testid="subtitle-text"], ' +
      'header [data-testid="subtitle"]'
    );
    const txt = sub?.textContent?.trim() || '';
    if (/^\+?[\d\s\-().]{8,}$/.test(txt)) return cleanPhone(txt);
    return null;
  };

  return trySelected() || tryDataIds() || tryTitle() || trySubtitle() || null;
}

function cleanPhone(raw) {
  return raw.replace(/\D/g, '');
}

// ─── Busca contato no Kommo (search mode) ────────────────────────────────────
async function searchContact() {
  if (panelMode !== 'search') return;

  if (!cfg.subdomain) {
    setBody(`
      <div class="wkb-warn" style="margin-bottom:10px">⚙️ Configure seu subdomínio Kommo:</div>
      <div style="display:flex;gap:6px;margin-bottom:6px">
        <input id="wkb-sub-input" type="text" placeholder="passoapassouniformes2025"
          style="flex:1;background:#16213e;border:1px solid #444;border-radius:6px;color:#eee;padding:7px 10px;font-size:12px;outline:none" />
        <button id="wkb-sub-save"
          style="background:#e44d26;color:#fff;border:none;border-radius:6px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap">
          Salvar
        </button>
      </div>
      <div class="wkb-hint" style="color:#666;font-size:10px">Ex: passoapassouniformes2025 (sem .kommo.com)</div>
    `);
    const input = document.getElementById('wkb-sub-input');
    const btn   = document.getElementById('wkb-sub-save');
    const save  = () => {
      const val = input.value.trim().replace(/\.kommo\.com.*/, '');
      if (!val) return;
      cfg.subdomain = val;
      chrome.storage.local.set({ [WKB_KEY]: { ...cfg } });
      triggerInitialSync();
      searchContact();
    };
    btn.addEventListener('click', save);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
    input.focus();
    return;
  }

  const phone = getCurrentPhone();
  if (!phone) {
    const title = getChatTitle();
    setBody(`
      <div class="wkb-warn" style="margin-bottom:8px">
        ${title ? `"${title}" é grupo ou número não detectado.` : 'Abra uma conversa individual.'}
      </div>
      <div class="wkb-hint" style="color:#888;font-size:11px;margin-bottom:8px">Busca manual pelo número:</div>
      <div class="wkb-manual">
        <input id="wkb-manual-input" type="text" placeholder="55519XXXXXXXX" />
        <button id="wkb-manual-search">Buscar</button>
      </div>
    `);
    const run = () => {
      const val = document.getElementById('wkb-manual-input')?.value.trim();
      if (val) searchByPhone(cleanPhone(val));
    };
    document.getElementById('wkb-manual-search').addEventListener('click', run);
    document.getElementById('wkb-manual-input').addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    document.getElementById('wkb-manual-input').focus();
    return;
  }

  searchByPhone(phone);
}

async function searchByPhone(phone) {
  setBody(`<div class="wkb-loading"><div class="wkb-spinner"></div>Buscando ${formatPhone(phone)}...</div>`);

  const variants = phoneVariants(phone);
  let leads = [];

  for (const v of variants) {
    try {
      const data = await kommoApi(`/api/v4/contacts?query=${encodeURIComponent(v)}&with=leads`);
      const contacts = data?._embedded?.contacts || [];
      for (const c of contacts) {
        for (const ref of (c._embedded?.leads || [])) {
          try {
            const lead = await kommoApi(`/api/v4/leads/${ref.id}`);
            leads.push({ ...lead, _contactName: c.name });
          } catch (_) {}
        }
      }
      if (leads.length) break;
    } catch (_) {}
  }

  if (!leads.length) {
    setBody(`
      <div class="wkb-phone-badge">📱 ${formatPhone(phone)}</div>
      <div class="wkb-empty">Nenhum lead encontrado no Kommo.</div>
      <a class="wkb-action-link" href="https://${cfg.subdomain}.kommo.com/leads/add" target="_blank">+ Criar lead no Kommo</a>
    `);
    return;
  }

  renderLeads(leads, phone);
}

function renderLeads(leads, phone) {
  const html = `
    <div class="wkb-phone-badge">📱 ${formatPhone(phone)}</div>
    <div class="wkb-leads-list">
      ${leads.map(l => `
        <div class="wkb-lead-card" id="wkb-lead-${l.id}">
          <div class="wkb-lead-top">
            <div>
              <div class="wkb-lead-name">${escHtml(l.name)}</div>
              <div id="wkb-current-stage-${l.id}" class="wkb-current-stage">
                <span class="wkb-stage-dot" id="wkb-dot-${l.id}"></span>
                <span id="wkb-stage-label-${l.id}" style="color:#aaa;font-size:10px">Carregando...</span>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
              ${l.price ? `<span class="wkb-price">R$ ${Number(l.price).toLocaleString('pt-BR')}</span>` : ''}
              <a class="wkb-kommo-link" href="https://${cfg.subdomain}.kommo.com/leads/detail/${l.id}" target="_blank">↗ Abrir</a>
            </div>
          </div>
          <div id="wkb-stages-${l.id}" class="wkb-stages-area">
            <div class="wkb-loading-sm">Carregando etapas...</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  setBody(html);
  leads.forEach(l => loadStages(l));
}

async function loadStages(lead) {
  const area = document.getElementById(`wkb-stages-${lead.id}`);
  if (!area) return;

  try {
    // Tenta usar cache local primeiro
    let allStages = leadsCache?.stages?.filter(s => s.pipeline_id === lead.pipeline_id);

    if (!allStages?.length) {
      const data = await kommoApi(`/api/v4/leads/pipelines/${lead.pipeline_id}`);
      allStages = (data?._embedded?.statuses || []).filter(s => s.type === 0 || !s.type);
    }

    const currentStage = allStages.find(s => s.id === lead.status_id);
    const dotEl   = document.getElementById(`wkb-dot-${lead.id}`);
    const labelEl = document.getElementById(`wkb-stage-label-${lead.id}`);
    if (currentStage && dotEl && labelEl) {
      dotEl.style.background = currentStage.color || '#888';
      labelEl.textContent    = currentStage.name;
      labelEl.style.color    = '#ccc';
    }

    const favIds = (cfg.favoriteStages || []).map(String);
    const toShow = favIds.length > 0
      ? allStages.filter(s => favIds.includes(String(s.id)))
      : allStages;

    if (!toShow.length) {
      area.innerHTML = `<div class="wkb-hint-sm">Configure etapas favoritas no popup.</div>`;
      return;
    }

    area.innerHTML = `
      <label class="wkb-stages-label">Mover para:</label>
      <select id="wkb-select-${lead.id}" class="wkb-select">
        <option value="">— Escolha a etapa —</option>
        ${toShow.map(s => `
          <option value="${s.id}" data-color="${s.color || '#888'}"
            ${lead.status_id === s.id ? 'selected disabled' : ''}>
            ${lead.status_id === s.id ? '📍 ' : ''}${escHtml(s.name)}
          </option>
        `).join('')}
      </select>
      <div id="wkb-move-status-${lead.id}" class="wkb-move-status"></div>
    `;

    const sel      = document.getElementById(`wkb-select-${lead.id}`);
    const statusEl = document.getElementById(`wkb-move-status-${lead.id}`);

    sel.addEventListener('change', async () => {
      const stageId = sel.value;
      if (!stageId) return;
      sel.disabled = true;
      statusEl.textContent = '⏳ Movendo...';
      statusEl.style.color = '#aaa';
      try {
        await kommoApi('/api/v4/leads', 'PATCH', [{
          id:          parseInt(lead.id),
          status_id:   parseInt(stageId),
          pipeline_id: parseInt(lead.pipeline_id),
        }]);
        const moved = allStages.find(s => String(s.id) === stageId);
        if (moved) {
          const dot = document.getElementById(`wkb-dot-${lead.id}`);
          const lbl = document.getElementById(`wkb-stage-label-${lead.id}`);
          if (dot) dot.style.background = moved.color || '#888';
          if (lbl) lbl.textContent = moved.name;
          [...sel.options].forEach(o => {
            o.disabled = String(o.value) === stageId || o.value === '';
            if (String(o.value) === stageId) o.text = `📍 ${moved.name}`;
          });
          sel.value = stageId;
          // Atualiza cache local para refletir na tab bar sem aguardar sync
          if (leadsCache?.leads) {
            const cl = leadsCache.leads.find(x => x.id === lead.id);
            if (cl) {
              cl.status_id = parseInt(stageId);
              renderTabBar();
              if (activeTabStageId) showStageView(activeTabStageId);
            }
          }
        }
        statusEl.textContent = '✓ Movido!';
        statusEl.style.color = '#4caf50';
        setTimeout(() => { statusEl.textContent = ''; }, 2500);
      } catch (e) {
        statusEl.textContent = '✗ Erro: ' + e.message;
        statusEl.style.color = '#e74c3c';
      }
      sel.disabled = false;
    });
  } catch (_) {
    area.innerHTML = `<div class="wkb-hint-sm">Erro ao carregar etapas.</div>`;
  }
}

// ─── Destaque por cor de etapa: mensagens não respondidas ────────────────────
const pendingReply   = new Set();
// Cache phone → boolean para persistir estado mesmo quando item sai do DOM (virtual scroll)
const pendingByPhone = new Map();

function initUnreadHighlight() {
  const scan = () => {
    document.querySelectorAll('[data-testid="cell-frame-container"]').forEach(item => {
      // Detecta badge de mensagem não lida/não respondida com múltiplos seletores
      const badge = item.querySelector(
        '[data-testid="icon-unread-count"], ' +
        '[data-testid="icon-muted-unread-count"], ' +
        'span[data-testid="unread-count"], ' +
        '[aria-label*="não lida"], ' +
        '[aria-label*="unread"], ' +
        '[data-icon="pending-outgoing-badge"]'
      );
      const title = getItemTitle(item);
      if (!title) return;
      if (badge) pendingReply.add(title);

      const isPending = pendingReply.has(title);

      const phone = getPhoneFromChatItem(item);

      if (isPending) {
        // Salva no cache por telefone (persiste quando item sai do DOM pelo virtual scroll)
        if (phone) pendingByPhone.set(phone.replace(/\D/g,''), true);

        const color = getStageColorForPhone(phone);
        // Usa cor da etapa do Kommo; fallback azul se contato não está no CRM
        const rgb   = color ? (hexToRgb(color) || '30,100,220') : '30,100,220';

        item.style.setProperty('--wkb-stage-rgb', rgb);
        item.classList.add('wkb-stage-highlight');
        // Override inline !important para sobrescrever estilos do WhatsApp Web
        item.style.setProperty('background-color', `rgba(${rgb}, 0.15)`, 'important');
        item.style.setProperty('border-left', `3px solid rgba(${rgb}, 0.75)`, 'important');
        item.style.setProperty('box-sizing', 'border-box', 'important');
      } else {
        // Marca como respondido no cache
        if (phone) pendingByPhone.set(phone.replace(/\D/g,''), false);

        item.classList.remove('wkb-stage-highlight');
        item.style.removeProperty('--wkb-stage-rgb');
        item.style.removeProperty('background-color');
        item.style.removeProperty('border-left');
        item.style.removeProperty('box-sizing');
      }
    });
  };

  new MutationObserver(() => { scan(); buildPhotoCache(); })
    .observe(document.body, { childList: true, subtree: true });
  setInterval(() => { scan(); buildPhotoCache(); }, 3000);
  scan();
  buildPhotoCache();

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const input = e.target;
      if (
        input?.contentEditable === 'true' ||
        input?.matches('[data-testid="conversation-compose-box-input"]')
      ) {
        if ((input.textContent || '').trim()) setTimeout(() => removeHighlightForCurrent(), 200);
      }
    }
  }, true);

  document.addEventListener('click', e => {
    if (e.target.closest('[data-testid="compose-btn-send"]')) {
      setTimeout(() => removeHighlightForCurrent(), 200);
    }
  });
}

function removeHighlightForCurrent() {
  const title = getChatTitle();
  if (!title || !pendingReply.has(title)) return;
  pendingReply.delete(title);
  document.querySelectorAll('.wkb-stage-highlight').forEach(item => {
    if (getItemTitle(item) === title) {
      item.classList.remove('wkb-stage-highlight');
      item.style.removeProperty('--wkb-stage-rgb');
      item.style.removeProperty('background-color');
      item.style.removeProperty('border-left');
      item.style.removeProperty('box-sizing');
    }
  });
}

// Verifica se um telefone tem mensagem não respondida
// Usa cache pendingByPhone (funciona com virtual scroll — item pode não estar no DOM)
function hasUnreadForPhone(phone) {
  if (!phone) return false;
  const clean = phone.replace(/\D/g, '');

  // 1. Consulta cache (preenchido pelo scan do MutationObserver)
  if (pendingByPhone.get(clean) === true) return true;
  for (const v of phoneVariants(clean)) {
    if (pendingByPhone.get(v) === true) return true;
  }

  // 2. Consulta DOM (itens atualmente visíveis no viewport)
  for (const v of phoneVariants(clean)) {
    for (const el of document.querySelectorAll(`[data-id*="${v}@c.us"]`)) {
      const container = el.closest('[data-testid="cell-frame-container"]') || el;
      if (container.querySelector(
        '[data-testid="icon-unread-count"], [data-testid="icon-muted-unread-count"], ' +
        'span[data-testid="unread-count"]'
      )) return true;
    }
  }
  return false;
}

// Extrai número de telefone de um item da lista de chats via data-id
function getPhoneFromChatItem(item) {
  if (!item) return null;
  const check = (id) => {
    const m = (id || '').match(/_?(\d{10,15})@c\.us/);
    return m ? m[1] : null;
  };
  // 1. Verifica o próprio elemento
  let p = check(item.dataset?.id);
  if (p) return p;
  // 2. Sobe na árvore DOM (até 6 níveis — o data-id pode estar num ancestral)
  let el = item.parentElement;
  for (let i = 0; i < 6; i++) {
    if (!el) break;
    p = check(el.dataset?.id);
    if (p) return p;
    el = el.parentElement;
  }
  // 3. Desce nos filhos
  for (const child of item.querySelectorAll('[data-id]')) {
    p = check(child.dataset?.id);
    if (p) return p;
  }
  return null;
}

// Retorna a cor (#hex) da etapa do lead no Kommo para um dado telefone
function getStageColorForPhone(phone) {
  if (!phone || !leadsCache?.leads?.length) return null;
  const cp = phone.replace(/\D/g, '');
  const lead = leadsCache.leads.find(l => {
    if (!l.phone) return false;
    const lp = l.phone.replace(/\D/g, '');
    return lp === cp || lp.endsWith(cp) || cp.endsWith(lp);
  });
  if (!lead) return null;
  return leadsCache.stages?.find(s => s.id === lead.status_id)?.color || null;
}

// Converte #rrggbb → "r,g,b"
function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}` : null;
}

function getItemTitle(item) {
  return (
    item.querySelector('[data-testid="cell-frame-title"] span')?.textContent?.trim() ||
    item.querySelector('[data-testid="cell-frame-title"]')?.textContent?.trim() ||
    item.querySelector('span[title]')?.getAttribute('title')?.trim() ||
    null
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Extrai fotos de perfil dos itens visíveis no WhatsApp (virtual scroll)
function buildPhotoCache() {
  document.querySelectorAll('[data-testid="cell-frame-container"]').forEach(item => {
    const phone = getPhoneFromChatItem(item);
    if (!phone) return;
    const img = item.querySelector('img[src]');
    if (img?.src && !img.src.startsWith('data:') && img.src !== '') {
      photoCache.set(phone.replace(/\D/g,''), img.src);
    }
  });
}

// Gera cor consistente a partir do nome (evita sempre cinza)
function nameToColor(name) {
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (name.charCodeAt(i) + ((h << 5) - h)) | 0;
  return `hsl(${Math.abs(h) % 360},60%,48%)`;
}

function phoneVariants(phone) {
  const d = phone.replace(/\D/g, '');
  const set = new Set([d]);
  if (d.length === 11) { set.add(`55${d}`); set.add(`+55${d}`); }
  if (d.length === 13 && d.startsWith('55')) { set.add(d.slice(2)); set.add(`+${d}`); }
  if (d.length === 12 && d.startsWith('55')) { set.add(d.slice(2)); set.add(`+${d}`); }
  return [...set];
}

function formatPhone(d) {
  const n = d.replace(/\D/g, '');
  if (n.length === 13) return `+${n.slice(0,2)} (${n.slice(2,4)}) ${n.slice(4,9)}-${n.slice(9)}`;
  if (n.length === 12) return `+${n.slice(0,2)} (${n.slice(2,4)}) ${n.slice(4,8)}-${n.slice(8)}`;
  if (n.length === 11) return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`;
  return d;
}

function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function setBody(html) {
  const el = document.getElementById('wkb-panel-body');
  if (el) el.innerHTML = html;
}

function kommoApi(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'KOMMO_API', endpoint, method, body, subdomain: cfg.subdomain },
      res => {
        if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
        if (res?.error) return reject(new Error(res.error));
        resolve(res);
      }
    );
  });
}
