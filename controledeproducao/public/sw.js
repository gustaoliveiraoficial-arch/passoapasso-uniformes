// Service Worker — Controle de Produção Passo a Passo
const CACHE = 'pap-producao-v2'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(clients.claim()))

// ── Recebe push do servidor (Cloud Function) ──
self.addEventListener('push', e => {
  if (!e.data) return

  let data = {}
  try { data = e.data.json() } catch { data = { title: 'Passo a Passo', body: e.data.text() } }

  const title = data.title || 'Controle de Produção'
  const body  = data.body  || ''
  const tag   = data.tag   || 'pap-producao'
  const url   = data.url   || '/controledeproducao/'

  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon:   '/controledeproducao/logo-pap.png',
      badge:  '/controledeproducao/logo-pap.png',
      tag,
      renotify:            true,   // toca som/vibra mesmo se já existir notif com essa tag
      requireInteraction:  true,   // fica na tela até o usuário tocar
      silent:              false,  // ativa som do sistema
      vibrate: [300, 100, 300, 100, 600], // padrão: curto-curto-longo
      data: { url },
    })
  )
})

// ── Clique na notificação — abre o app ──
self.addEventListener('notificationclick', e => {
  e.notification.close()
  const url = e.notification.data?.url || '/controledeproducao/'
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes('/controledeproducao'))
      if (existing) return existing.focus()
      return clients.openWindow(url)
    })
  )
})
