/**
 * Kommo Fix — PassoaPasso Uniformes
 * Correções:
 *  1. Enter envia mensagem (Shift+Enter = quebra de linha)
 *  2. Foco automático no campo após enviar
 *  3. Foco automático ao abrir uma conversa
 *  4. Força carregamento de imagens/avatares que não aparecem
 */

'use strict';

// ─── SELETORES (testados no Kommo / amoCRM) ───────────────────────────────────
const SELECTORS = {
  // Campo de digitação (pode ser textarea ou div contenteditable)
  inputs: [
    'textarea.chat-input__textarea',
    'textarea[class*="chat-input"]',
    'textarea[class*="message-input"]',
    'div[contenteditable="true"][class*="chat"]',
    'div[contenteditable="true"][class*="message"]',
    'div[contenteditable="true"][data-placeholder]',
    '.feed-compose__textarea',
    '.feed-compose-message__textarea',
    'textarea.feed-compose__textarea',
    '[class*="compose"] textarea',
    '[class*="compose"] [contenteditable]',
    '[class*="chatInput"] textarea',
    '[class*="chatInput"] [contenteditable]',
    '[class*="messageInput"] textarea',
    '[class*="messageInput"] [contenteditable]',
  ],
  // Botão de enviar
  sendBtns: [
    'button[class*="send"]',
    'button[class*="submit"]',
    'button[class*="Send"]',
    '[class*="chat-send"]',
    '[class*="chatSend"]',
    '[class*="messageSend"]',
    'button[data-id="send"]',
    'button[title*="enviar"]',
    'button[title*="Enviar"]',
    'button[title*="send"]',
    'button[title*="Send"]',
    '.feed-compose__send',
    '.feed-compose-message__send',
    '[class*="compose"] button[type="submit"]',
    '[class*="compose"] button:last-of-type',
  ],
  // Imagens de avatar / foto de cliente
  avatars: [
    'img[class*="avatar"]',
    'img[class*="contact-photo"]',
    'img[class*="contact_photo"]',
    'img[class*="client-photo"]',
    'img[src*="cloudfront"]',
    'img[src*="s3.amazonaws"]',
    'img[data-src]',
    'img[loading="lazy"]',
  ],
};

// ─── ESTADO ───────────────────────────────────────────────────────────────────
const patched = new WeakSet();
let lastInput = null;
let observer  = null;

// ─── LOG ──────────────────────────────────────────────────────────────────────
const log = (msg) => console.log(`%c[KommoFix] ${msg}`, 'color:#C85A00;font-weight:bold');

// ─── 1. ENCONTRAR CAMPO DE INPUT ──────────────────────────────────────────────
function findInput() {
  for (const sel of SELECTORS.inputs) {
    const el = document.querySelector(sel);
    if (el && isVisible(el)) return el;
  }
  return null;
}

// ─── 2. ENCONTRAR BOTÃO ENVIAR ────────────────────────────────────────────────
function findSendBtn(inputEl) {
  // Tenta encontrar o botão mais próximo do input
  if (inputEl) {
    const parent = inputEl.closest('[class*="compose"], [class*="chat-input"], [class*="chatInput"], [class*="feed-compose"], form');
    if (parent) {
      for (const sel of SELECTORS.sendBtns) {
        const btn = parent.querySelector(sel);
        if (btn) return btn;
      }
      // Último recurso: último botão dentro do container
      const btns = parent.querySelectorAll('button');
      if (btns.length) return btns[btns.length - 1];
    }
  }
  // Busca global
  for (const sel of SELECTORS.sendBtns) {
    const el = document.querySelector(sel);
    if (el && isVisible(el)) return el;
  }
  return null;
}

// ─── 3. VISÍVEL? ──────────────────────────────────────────────────────────────
function isVisible(el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

// ─── 4. OBTER TEXTO DO INPUT ──────────────────────────────────────────────────
function getInputText(el) {
  if (!el) return '';
  return el.tagName === 'TEXTAREA' || el.tagName === 'INPUT'
    ? el.value
    : el.innerText || el.textContent || '';
}

// ─── 5. ENVIAR MENSAGEM ───────────────────────────────────────────────────────
function sendMessage(inputEl) {
  const btn = findSendBtn(inputEl);
  if (!btn) {
    log('Botão de enviar não encontrado — tentando Enter nativo');
    // Dispara Enter nativo como fallback
    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
    inputEl.dispatchEvent(new KeyboardEvent('keyup',   { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
    return;
  }
  btn.click();
  log('Mensagem enviada via botão');
}

// ─── 6. REFOCAR O CAMPO APÓS ENVIAR ──────────────────────────────────────────
function refocusInput(inputEl) {
  if (!inputEl) return;
  // Aguarda o Kommo processar o envio antes de refocar
  setTimeout(() => {
    const fresh = findInput() || inputEl;
    if (fresh) {
      fresh.focus();
      // Move cursor para o final (contenteditable)
      if (fresh.tagName !== 'TEXTAREA' && fresh.tagName !== 'INPUT') {
        const range = document.createRange();
        const sel   = window.getSelection();
        range.selectNodeContents(fresh);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        const len = fresh.value ? fresh.value.length : 0;
        fresh.setSelectionRange(len, len);
      }
      log('Foco restaurado no campo');
    }
  }, 120);
}

// ─── 7. PATCH DE UM INPUT ESPECÍFICO ─────────────────────────────────────────
function patchInput(inputEl) {
  if (!inputEl || patched.has(inputEl)) return;
  patched.add(inputEl);
  lastInput = inputEl;

  inputEl.addEventListener('keydown', (e) => {
    // Enter sem Shift = enviar; Shift+Enter = quebra de linha (padrão)
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      const text = getInputText(inputEl).trim();
      if (!text) return; // Campo vazio → não envia

      e.preventDefault();
      e.stopPropagation();
      sendMessage(inputEl);
      refocusInput(inputEl);
    }
  }, true); // capture=true para interceptar antes do Kommo

  // Refocar ao clicar em qualquer área da conversa que não seja um input
  log(`Input patchado: ${inputEl.tagName}.${[...inputEl.classList].join('.')}`);
}

// ─── 8. CORRIGIR IMAGENS QUE NÃO CARREGAM ────────────────────────────────────
function fixImages() {
  // Força carregamento de imagens com data-src (lazy load travado)
  document.querySelectorAll('img[data-src]').forEach(img => {
    if (!img.src || img.src === window.location.href) {
      img.src = img.dataset.src;
    }
  });

  // Imagens com erro (broken) → tenta recarregar uma vez
  document.querySelectorAll('img').forEach(img => {
    if (img.naturalWidth === 0 && img.src && !img.dataset.retried) {
      img.dataset.retried = '1';
      const originalSrc = img.src;
      img.src = '';
      setTimeout(() => { img.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + '_fix=' + Date.now(); }, 200);
    }
  });

  // Desativa lazy loading para todos os avatares
  for (const sel of SELECTORS.avatars) {
    document.querySelectorAll(sel).forEach(img => {
      if (img.loading === 'lazy') {
        img.loading = 'eager';
        // Força reload se ainda não carregou
        if (img.naturalWidth === 0 && img.src) {
          const src = img.src;
          img.src = '';
          img.src = src;
        }
      }
    });
  }
}

// ─── 9. VARREDURA PRINCIPAL ───────────────────────────────────────────────────
function scan() {
  const inputEl = findInput();
  if (inputEl) {
    patchInput(inputEl);
    // Foca automaticamente se não há input ativo
    if (document.activeElement !== inputEl && !document.activeElement?.matches('input, textarea, [contenteditable]')) {
      inputEl.focus();
    }
  }
  fixImages();
}

// ─── 10. OBSERVER (SPA — detecta mudanças de rota e abertura de chat) ─────────
function startObserver() {
  if (observer) observer.disconnect();

  observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    for (const m of mutations) {
      // Ignora mudanças só de texto
      if (m.type === 'characterData') continue;
      // Qualquer nó adicionado pode ser o chat abrindo
      if (m.addedNodes.length > 0) { shouldScan = true; break; }
      // Atributos em img = possível avatar carregando
      if (m.type === 'attributes' && m.target.tagName === 'IMG') { shouldScan = true; break; }
    }
    if (shouldScan) {
      clearTimeout(startObserver._t);
      startObserver._t = setTimeout(scan, 150);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'data-src', 'class'],
  });

  log('Observer ativo');
}

// ─── 11. FOCO AO CLICAR EM QUALQUER ÁREA DO CHAT ─────────────────────────────
document.addEventListener('click', (e) => {
  // Se clicou em algo que não é um input/botão/link → refoca o campo
  const tag = e.target.tagName;
  if (!['INPUT', 'TEXTAREA', 'BUTTON', 'A', 'SELECT'].includes(tag) && !e.target.closest('[contenteditable]')) {
    const inputEl = findInput() || lastInput;
    if (inputEl && isVisible(inputEl)) {
      setTimeout(() => inputEl.focus(), 50);
    }
  }
}, false);

// ─── 12. INIT ─────────────────────────────────────────────────────────────────
function init() {
  log('Iniciado no Kommo');
  scan();
  startObserver();

  // Scan periódico leve como fallback (a cada 2s)
  setInterval(() => {
    const inputEl = findInput();
    if (inputEl && !patched.has(inputEl)) {
      log('Novo input detectado (intervalo)');
      patchInput(inputEl);
    }
    // Imagens a cada 5s
  }, 2000);

  setInterval(fixImages, 5000);
}

// Aguarda DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
