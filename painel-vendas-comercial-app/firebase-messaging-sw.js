// ============================================================
// Firebase Cloud Messaging — Service Worker Background
// Recebe notificações quando o app está fechado/em background
// ============================================================
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyCl2I6QimNLV21w3M48pRNovJ4q9uJUDqA",
  authDomain:        "painel-vendas-comercial.firebaseapp.com",
  databaseURL:       "https://painel-vendas-comercial-default-rtdb.firebaseio.com",
  projectId:         "painel-vendas-comercial",
  storageBucket:     "painel-vendas-comercial.firebasestorage.app",
  messagingSenderId: "132856951031",
  appId:             "1:132856951031:web:eb124ed7eeca36a3e9a3f2"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || '🏆 Nova Venda!';
  const body  = payload.notification?.body  || 'Uma nova venda foi registrada.';
  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    vibrate: [200, 100, 200],
    tag: 'nova-venda',
    renotify: true,
    data: { url: self.location.origin }
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/'));
});
