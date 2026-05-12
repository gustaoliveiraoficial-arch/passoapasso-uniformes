// ============================================================
// SalesBoard Pro — Service Worker Unificado v11
// ============================================================
const CACHE_VERSION = 'sb-v11';

// Estes arquivos NUNCA são cacheados — sempre buscados do servidor
const NEVER_CACHE = [
  '/', '/index.html',
  '/firebase-config.js', '/firebase-messaging-sw.js'
];

// Estes arquivos são cacheados (mudam raramente)
const STATIC_ASSETS = ['/manifest.json', '/icon-192.svg', '/icon-512.svg'];

// ---- INSTALL: pre-cache apenas assets estáticos ----
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(c =>
      c.addAll(STATIC_ASSETS).catch(() => Promise.resolve())
    )
  );
  self.skipWaiting(); // ativa imediatamente
});

// ---- ACTIVATE: limpa caches antigos ----
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // controla todas as abas imediatamente
});

// ---- FETCH ----
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = e.request.url;
  let pathname = '';
  try { pathname = new URL(url).pathname; } catch(err) { return; }

  // 1. Firebase APIs e CDN — deixa o browser buscar direto (sem interceptar)
  if (url.includes('firebaseio.com') || url.includes('googleapis.com') ||
      url.includes('gstatic.com') || url.includes('firebase')) {
    return;
  }

  // 2. index.html e firebase-config.js — sempre network-first, sem cache
  if (NEVER_CACHE.includes(pathname)) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .catch(() => {
          // Fallback para cache APENAS se offline (melhor que tela em branco)
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 3. Assets estáticos — network-first com cache fallback
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// ---- PUSH: recebe notificações push ----
self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch (err) {}

  const title = data.notification?.title || data.title || '🏆 SalesBoard';
  const body  = data.notification?.body  || data.body  || 'Nova venda registrada!';
  const icon  = data.notification?.icon  || '/icon-192.svg';
  const url   = data.notification?.click_action || data.url || '/';

  e.waitUntil(
    self.registration.showNotification(title, {
      body, icon,
      badge: '/icon-192.svg',
      vibrate: [200, 100, 200],
      tag: 'salesboard-notif',
      renotify: true,
      data: { url }
    })
  );
});

// ---- NOTIFICATION CLICK ----
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url === url && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ---- MESSAGE: comunicação com a página principal ----
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (e.data?.type === 'NOTIFY') {
    const { title, body, url } = e.data;
    self.registration.showNotification(title || '🏆 SalesBoard', {
      body: body || 'Nova venda registrada!',
      icon: '/icon-192.svg',
      badge: '/icon-192.svg',
      vibrate: [200, 100, 200],
      tag: 'salesboard-notif',
      renotify: true,
      data: { url: url || '/' }
    });
  }
});
