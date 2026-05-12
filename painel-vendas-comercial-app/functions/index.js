const functions = require('firebase-functions');
const admin     = require('firebase-admin');
admin.initializeApp();

// Dispara notificação push para todos os dispositivos quando uma venda for adicionada
exports.notifyNewSale = functions.database
  .ref('/salesboard/sales')
  .onUpdate(async (change) => {
    const before = change.before.val() || [];
    const after  = change.after.val()  || [];

    // Só notifica se o array cresceu (nova venda)
    if (after.length <= before.length) return null;

    const sale = after[0]; // salvarVenda() usa unshift — última venda fica na posição 0
    if (!sale) return null;

    const tipo  = sale.tipo === 'inteira' ? 'Venda Inteira' : 'Meia Venda';
    const valor = 'R$ ' + Number(sale.valor).toLocaleString('pt-BR', { minimumFractionDigits: 0 });
    const body  = `${sale.vendedor} — ${tipo} — ${valor}`;

    // Busca todos os tokens FCM registrados
    const tokensSnap = await admin.database().ref('/salesboard/fcmTokens').once('value');
    const tokensData = tokensSnap.val();
    if (!tokensData) return null;

    const tokens = Object.values(tokensData)
      .map(d => d.token)
      .filter(Boolean);

    if (!tokens.length) return null;

    // Envia para todos os dispositivos de uma vez
    const result = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title: '🏆 Nova Venda!', body },
      android: { notification: { sound: 'default', channelId: 'vendas' } },
      apns:    { payload: { aps: { sound: 'default' } } },
      webpush: { notification: { icon: '/icon-192.png', badge: '/icon-192.png', vibrate: [200,100,200] } }
    });

    // Remove tokens inválidos/expirados automaticamente
    const badTokenPaths = [];
    result.responses.forEach((r, i) => {
      if (!r.success && (r.error?.code === 'messaging/invalid-registration-token' ||
                         r.error?.code === 'messaging/registration-token-not-registered')) {
        const deviceId = Object.keys(tokensData)[i];
        if (deviceId) badTokenPaths.push(deviceId);
      }
    });
    if (badTokenPaths.length) {
      const updates = {};
      badTokenPaths.forEach(id => { updates[id] = null; });
      await admin.database().ref('/salesboard/fcmTokens').update(updates);
    }

    console.log(`[notifyNewSale] Enviado para ${tokens.length} dispositivos. Nova venda: ${body}`);
    return null;
  });
