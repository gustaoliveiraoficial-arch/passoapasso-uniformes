import * as admin from 'firebase-admin'
import { onDocumentUpdated } from 'firebase-functions/v2/firestore'
import { defineSecret } from 'firebase-functions/params'
import * as webpush from 'web-push'

admin.initializeApp()
const db = admin.firestore()

const VAPID_PUBLIC  = defineSecret('VAPID_PUBLIC_KEY')
const VAPID_PRIVATE = defineSecret('VAPID_PRIVATE_KEY')

interface MensagemMarcia {
  id: string
  texto: string
  respondidoEm?: string
  resposta?: string
}

interface PushSub {
  endpoint: string
  keys: { auth: string; p256dh: string }
}

function formatarData(iso?: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

async function sendPushToAll(
  title: string,
  body: string,
  tag: string,
  vapidPublic: string,
  vapidPrivate: string
): Promise<void> {
  webpush.setVapidDetails(
    'mailto:contato@passoapassouniformes.com',
    vapidPublic,
    vapidPrivate
  )

  const subs = await db.collection('push_subscriptions').get()
  if (subs.empty) return

  const payload = JSON.stringify({ title, body, tag, url: '/controledeproducao/' })

  const results = await Promise.allSettled(
    subs.docs.map(async docSnap => {
      const sub = docSnap.data() as PushSub
      if (!sub.endpoint || !sub.keys) return
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload
        )
      } catch (err: unknown) {
        const e = err as { statusCode?: number }
        if (e.statusCode === 410 || e.statusCode === 404) {
          await docSnap.ref.delete()
        }
      }
    })
  )

  console.log(`Push "${title}" → ${results.length} dispositivo(s). Tag: ${tag}`)
}

export const onPedidoUpdate = onDocumentUpdated(
  {
    document: 'pedidos/{pedidoId}',
    secrets: [VAPID_PUBLIC, VAPID_PRIVATE],
  },
  async event => {
    const before = event.data?.before.data()
    const after  = event.data?.after.data()
    if (!before || !after) return

    const vapidPublic  = VAPID_PUBLIC.value()
    const vapidPrivate = VAPID_PRIVATE.value()

    const nomeCliente: string =
      after.clienteType === 'empresa'
        ? (after.clienteEmpresa?.razaoSocial || 'Cliente').toUpperCase()
        : (after.clientePF?.nomeCompleto || 'Cliente').toUpperCase()

    const numeroPedido: string = after.numeroPedido || ''
    const qtd: number = after.quantidadeTotal || after.pecas?.length || 0

    // ── Mudança de status no Kanban ──
    if (before.statusProducao !== after.statusProducao) {
      const novoStatus: string = after.statusProducao

      if (novoStatus === 'pronto') {
        await sendPushToAll(
          '✅ Pedido Pronto para retirada!',
          `${nomeCliente}\nPedido nº ${numeroPedido} · ${qtd} peça${qtd !== 1 ? 's' : ''}`,
          'pap-pronto',
          vapidPublic,
          vapidPrivate
        )
      } else if (novoStatus === 'em_atraso') {
        const novaData = formatarData(after.dataEntregaNovaProducao)
        const motivo: string = after.motivoAtraso ? `\nMotivo: ${after.motivoAtraso}` : ''
        await sendPushToAll(
          '⚠️ Pedido marcado como Em Atraso',
          `${nomeCliente}\nPedido nº ${numeroPedido}${novaData ? ` · Nova entrega: ${novaData}` : ''}${motivo}`,
          'pap-atraso',
          vapidPublic,
          vapidPrivate
        )
      } else if (novoStatus === 'em_producao') {
        await sendPushToAll(
          '🔧 Pedido entrou em Produção',
          `${nomeCliente}\nPedido nº ${numeroPedido} · ${qtd} peça${qtd !== 1 ? 's' : ''}`,
          'pap-em-producao',
          vapidPublic,
          vapidPrivate
        )
      } else if (novoStatus === 'em_conserto') {
        await sendPushToAll(
          '🔩 Pedido foi para Conserto',
          `${nomeCliente}\nPedido nº ${numeroPedido}`,
          'pap-conserto',
          vapidPublic,
          vapidPrivate
        )
      }
    }

    // ── Nova mensagem para Márcia ──
    const msgAntes  = (before.mensagensMarcia as MensagemMarcia[] | undefined) ?? []
    const msgDepois = (after.mensagensMarcia  as MensagemMarcia[] | undefined) ?? []

    if (msgDepois.length > msgAntes.length) {
      const novaMsg = msgDepois[msgDepois.length - 1]
      const textoResumido = novaMsg?.texto
        ? (novaMsg.texto.length > 80 ? novaMsg.texto.slice(0, 80) + '...' : novaMsg.texto)
        : ''
      await sendPushToAll(
        '💬 Nova mensagem para Márcia',
        `${nomeCliente} · Pedido nº ${numeroPedido}\n"${textoResumido}"`,
        'pap-msg-nova',
        vapidPublic,
        vapidPrivate
      )
    }

    // ── Márcia respondeu ──
    const respostasAntes  = msgAntes.filter(m => m.respondidoEm).length
    const respostasDepois = msgDepois.filter(m => m.respondidoEm).length

    if (respostasDepois > respostasAntes) {
      const msgRespondida = msgDepois.find(
        m => m.respondidoEm && !msgAntes.find(a => a.id === m.id)?.respondidoEm
      )
      const respostaResumida = msgRespondida?.resposta
        ? (msgRespondida.resposta.length > 80 ? msgRespondida.resposta.slice(0, 80) + '...' : msgRespondida.resposta)
        : ''
      await sendPushToAll(
        '✅ Márcia respondeu!',
        `${nomeCliente} · Pedido nº ${numeroPedido}\n"${respostaResumida}"`,
        'pap-msg-resposta',
        vapidPublic,
        vapidPrivate
      )
    }
  }
)
