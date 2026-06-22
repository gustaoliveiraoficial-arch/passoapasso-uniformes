import { initializeApp, getApps } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteField,
  getDocs,
  setDoc,
  query,
  orderBy,
  onSnapshot,
  arrayUnion,
} from 'firebase/firestore'
import type { Pedido, StatusProducao, MensagemMarcia } from '@/types/pedido'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

export { db }

export async function listarPedidosProducao(): Promise<Pedido[]> {
  const q = query(collection(db, 'pedidos'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  const todos = snap.docs.map(d => ({ id: d.id, ...d.data() } as Pedido))
  return todos.filter(p => {
    // Pedido já retirado pelo cliente → sai do kanban
    if (p.dataRetirada && p.statusProducao !== 'em_conserto') return false
    return (
      p.statusProducao === 'em_producao' ||
      p.statusProducao === 'em_atraso' ||
      p.statusProducao === 'pronto' ||
      p.statusProducao === 'em_conserto'
    )
  })
}

export async function atualizarProducao(id: string, dados: Partial<Pedido>): Promise<void> {
  const docRef = doc(db, 'pedidos', id)
  const limpar = (val: unknown): unknown => {
    if (Array.isArray(val)) return val.map(limpar)
    if (val !== null && typeof val === 'object') {
      return Object.fromEntries(
        Object.entries(val as Record<string, unknown>)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, limpar(v)])
      )
    }
    return val
  }
  await updateDoc(docRef, limpar({
    ...dados,
    updatedAt: new Date().toISOString(),
  }) as Record<string, unknown>)
}

export async function moverParaAtraso(
  id: string,
  dataEntregaNovaProducao: string,
  motivoAtraso: string
): Promise<void> {
  await atualizarProducao(id, {
    statusProducao: 'em_atraso',
    dataEntregaNovaProducao,
    motivoAtraso,
  })
}

export async function moverParaPronto(id: string): Promise<void> {
  await atualizarProducao(id, { statusProducao: 'pronto' })
}

export async function moverConsertoParaPronto(id: string): Promise<void> {
  // Remove statusProducao e dataRetirada para:
  // 1. Sumir do controledeproducao
  // 2. Voltar ao formalizarpedido com botão "Registrar Retirada"
  const docRef = doc(db, 'pedidos', id)
  await updateDoc(docRef, {
    statusProducao: deleteField(),
    dataRetirada: deleteField(),
    updatedAt: new Date().toISOString(),
  })
}

export async function moverParaEmProducao(id: string): Promise<void> {
  await atualizarProducao(id, {
    statusProducao: 'em_producao',
    dataEntregaNovaProducao: undefined,
    motivoAtraso: undefined,
  })
}

export async function enviarParaEntrega(id: string): Promise<void> {
  // Remove do controle de produção e manda para retirada no formalizarpedido
  await atualizarProducao(id, {
    status: 'retirada',
    statusProducao: undefined,
    dataEntregaNovaProducao: undefined,
    motivoAtraso: undefined,
  })
}

export async function enviarMensagemMarcia(pedidoId: string, mensagem: MensagemMarcia): Promise<void> {
  const docRef = doc(db, 'pedidos', pedidoId)
  await updateDoc(docRef, {
    mensagensMarcia: arrayUnion(mensagem),
    updatedAt: new Date().toISOString(),
  })
}

export async function responderMensagemMarcia(
  pedidoId: string,
  mensagemId: string,
  resposta: string,
  mensagensAtuais: MensagemMarcia[]
): Promise<void> {
  const docRef = doc(db, 'pedidos', pedidoId)
  const mensagensAtualizadas = mensagensAtuais.map(m =>
    m.id === mensagemId
      ? { ...m, resposta, respondidoEm: new Date().toISOString() }
      : m
  )
  await updateDoc(docRef, {
    mensagensMarcia: mensagensAtualizadas,
    updatedAt: new Date().toISOString(),
  })
}

// ── Listener em tempo real (onSnapshot) ──
export function criarListenerPedidos(callback: (pedidos: Pedido[]) => void): () => void {
  const q = query(collection(db, 'pedidos'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap => {
    const todos = snap.docs.map(d => ({ id: d.id, ...d.data() } as Pedido))
    const filtrados = todos.filter(p => {
      if (p.dataRetirada && p.statusProducao !== 'em_conserto') return false
      return (
        p.statusProducao === 'em_producao' ||
        p.statusProducao === 'em_atraso' ||
        p.statusProducao === 'pronto' ||
        p.statusProducao === 'em_conserto'
      )
    })
    callback(filtrados)
  })
}

// ── Salvar assinatura Web Push no Firestore ──
export async function savePushSubscription(
  deviceId: string,
  subscription: Record<string, unknown>
): Promise<void> {
  await setDoc(doc(db, 'push_subscriptions', deviceId), {
    ...subscription,
    updatedAt: new Date().toISOString(),
  })
}
