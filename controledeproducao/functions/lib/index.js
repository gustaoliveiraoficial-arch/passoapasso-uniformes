"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onPedidoUpdate = void 0;
const admin = require("firebase-admin");
const firestore_1 = require("firebase-functions/v2/firestore");
const params_1 = require("firebase-functions/params");
const webpush = require("web-push");
admin.initializeApp();
const db = admin.firestore();
const VAPID_PUBLIC = (0, params_1.defineSecret)('VAPID_PUBLIC_KEY');
const VAPID_PRIVATE = (0, params_1.defineSecret)('VAPID_PRIVATE_KEY');
function formatarData(iso) {
    if (!iso)
        return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}
async function sendPushToAll(title, body, tag, vapidPublic, vapidPrivate) {
    webpush.setVapidDetails('mailto:contato@passoapassouniformes.com', vapidPublic, vapidPrivate);
    const subs = await db.collection('push_subscriptions').get();
    if (subs.empty)
        return;
    const payload = JSON.stringify({ title, body, tag, url: '/controledeproducao/' });
    const results = await Promise.allSettled(subs.docs.map(async (docSnap) => {
        const sub = docSnap.data();
        if (!sub.endpoint || !sub.keys)
            return;
        try {
            await webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload);
        }
        catch (err) {
            const e = err;
            if (e.statusCode === 410 || e.statusCode === 404) {
                await docSnap.ref.delete();
            }
        }
    }));
    console.log(`Push "${title}" → ${results.length} dispositivo(s). Tag: ${tag}`);
}
exports.onPedidoUpdate = (0, firestore_1.onDocumentUpdated)({
    document: 'pedidos/{pedidoId}',
    secrets: [VAPID_PUBLIC, VAPID_PRIVATE],
}, async (event) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const before = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before.data();
    const after = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after.data();
    if (!before || !after)
        return;
    const vapidPublic = VAPID_PUBLIC.value();
    const vapidPrivate = VAPID_PRIVATE.value();
    const nomeCliente = after.clienteType === 'empresa'
        ? (((_c = after.clienteEmpresa) === null || _c === void 0 ? void 0 : _c.razaoSocial) || 'Cliente').toUpperCase()
        : (((_d = after.clientePF) === null || _d === void 0 ? void 0 : _d.nomeCompleto) || 'Cliente').toUpperCase();
    const numeroPedido = after.numeroPedido || '';
    const qtd = after.quantidadeTotal || ((_e = after.pecas) === null || _e === void 0 ? void 0 : _e.length) || 0;
    // ── Mudança de status no Kanban ──
    if (before.statusProducao !== after.statusProducao) {
        const novoStatus = after.statusProducao;
        if (novoStatus === 'pronto') {
            await sendPushToAll('✅ Pedido Pronto para retirada!', `${nomeCliente}\nPedido nº ${numeroPedido} · ${qtd} peça${qtd !== 1 ? 's' : ''}`, 'pap-pronto', vapidPublic, vapidPrivate);
        }
        else if (novoStatus === 'em_atraso') {
            const novaData = formatarData(after.dataEntregaNovaProducao);
            const motivo = after.motivoAtraso ? `\nMotivo: ${after.motivoAtraso}` : '';
            await sendPushToAll('⚠️ Pedido marcado como Em Atraso', `${nomeCliente}\nPedido nº ${numeroPedido}${novaData ? ` · Nova entrega: ${novaData}` : ''}${motivo}`, 'pap-atraso', vapidPublic, vapidPrivate);
        }
        else if (novoStatus === 'em_producao') {
            await sendPushToAll('🔧 Pedido entrou em Produção', `${nomeCliente}\nPedido nº ${numeroPedido} · ${qtd} peça${qtd !== 1 ? 's' : ''}`, 'pap-em-producao', vapidPublic, vapidPrivate);
        }
        else if (novoStatus === 'em_conserto') {
            await sendPushToAll('🔩 Pedido foi para Conserto', `${nomeCliente}\nPedido nº ${numeroPedido}`, 'pap-conserto', vapidPublic, vapidPrivate);
        }
    }
    // ── Nova mensagem para Márcia ──
    const msgAntes = (_f = before.mensagensMarcia) !== null && _f !== void 0 ? _f : [];
    const msgDepois = (_g = after.mensagensMarcia) !== null && _g !== void 0 ? _g : [];
    if (msgDepois.length > msgAntes.length) {
        const novaMsg = msgDepois[msgDepois.length - 1];
        const textoResumido = (novaMsg === null || novaMsg === void 0 ? void 0 : novaMsg.texto)
            ? (novaMsg.texto.length > 80 ? novaMsg.texto.slice(0, 80) + '...' : novaMsg.texto)
            : '';
        await sendPushToAll('💬 Nova mensagem para Márcia', `${nomeCliente} · Pedido nº ${numeroPedido}\n"${textoResumido}"`, 'pap-msg-nova', vapidPublic, vapidPrivate);
    }
    // ── Márcia respondeu ──
    const respostasAntes = msgAntes.filter(m => m.respondidoEm).length;
    const respostasDepois = msgDepois.filter(m => m.respondidoEm).length;
    if (respostasDepois > respostasAntes) {
        const msgRespondida = msgDepois.find(m => { var _a; return m.respondidoEm && !((_a = msgAntes.find(a => a.id === m.id)) === null || _a === void 0 ? void 0 : _a.respondidoEm); });
        const respostaResumida = (msgRespondida === null || msgRespondida === void 0 ? void 0 : msgRespondida.resposta)
            ? (msgRespondida.resposta.length > 80 ? msgRespondida.resposta.slice(0, 80) + '...' : msgRespondida.resposta)
            : '';
        await sendPushToAll('✅ Márcia respondeu!', `${nomeCliente} · Pedido nº ${numeroPedido}\n"${respostaResumida}"`, 'pap-msg-resposta', vapidPublic, vapidPrivate);
    }
});
//# sourceMappingURL=index.js.map