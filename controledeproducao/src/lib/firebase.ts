import { initializeApp, getApps } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore/lite'
import type { Pedido, StatusProducao } from '@/types/pedido'

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
  return todos.filter(p =>
    (p.statusProducao === 'em_producao' || p.statusProducao === 'em_atraso' || p.statusProducao === 'pronto')
    && p.status !== 'retirada'
  )
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
