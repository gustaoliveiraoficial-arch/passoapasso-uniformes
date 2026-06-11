import { initializeApp, getApps } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
} from 'firebase/firestore/lite'
import { v4 as uuidv4 } from 'uuid'
import type { Pedido, StatusPedido, PieceEntry, ModeloPedido } from '@/types/pedido'
import { uploadParaCloudinary } from './cloudinary'

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

// Upload via Cloudinary (Firebase Storage não está ativo no plano atual)
export async function uploadParaStorage(
  file: File,
  pasta: 'layouts' | 'vetores' | 'artes-cliente' | 'rascunho-vendedor' | 'recibo-pagamento' | 'comprovante-retirada',
  pedidoId: string
): Promise<string> {
  return uploadParaCloudinary(file, pasta, pedidoId)
}

// PEDIDOS
export async function criarPedido(dados: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt' | 'clienteToken'>): Promise<string> {
  const clienteToken = uuidv4()
  const docRef = await addDoc(collection(db, 'pedidos'), {
    ...dados,
    clienteToken,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  return docRef.id
}

export async function atualizarPedido(id: string, dados: Partial<Pedido>): Promise<void> {
  const docRef = doc(db, 'pedidos', id)
  // Firestore rejeita valores undefined — remove recursivamente em objetos e arrays
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

export async function buscarPedido(id: string): Promise<Pedido | null> {
  const docRef = doc(db, 'pedidos', id)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Pedido
}

export async function buscarPedidoPorToken(token: string): Promise<Pedido | null> {
  const q = query(collection(db, 'pedidos'), where('clienteToken', '==', token))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const docSnap = snap.docs[0]
  return { id: docSnap.id, ...docSnap.data() } as Pedido
}

export async function listarPedidos(): Promise<Pedido[]> {
  const q = query(collection(db, 'pedidos'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Pedido))
}

export async function atualizarStatus(id: string, status: StatusPedido): Promise<void> {
  await atualizarPedido(id, { status })
}

export async function salvarTamanhos(id: string, pecas: PieceEntry[]): Promise<void> {
  await atualizarPedido(id, { pecas })
}

// STORAGE — Upload via Firebase Storage
export async function uploadArquivo(
  pedidoId: string,
  file: File,
  pasta: 'layouts' | 'vetores' | 'artes-cliente' | 'rascunho-vendedor' | 'recibo-pagamento' | 'comprovante-retirada'
): Promise<string> {
  return uploadParaStorage(file, pasta, pedidoId)
}

export async function deletarArquivo(_url: string): Promise<void> {
  // Remoção do Firestore é feita pelo chamador
}

// Salva pecas de um modelo específico (e também atualiza top-level pecas como todas concatenadas)
export async function salvarTamanhosModelo(pedidoId: string, modeloId: string, pecas: PieceEntry[]): Promise<void> {
  const pedido = await buscarPedido(pedidoId)
  if (!pedido) return
  if (pedido.modelos && pedido.modelos.length > 0) {
    const novoModelos = pedido.modelos.map(m => m.id === modeloId ? { ...m, pecas } : m)
    const todasPecas = novoModelos.flatMap(m => m.pecas || [])
    await atualizarPedido(pedidoId, { modelos: novoModelos, pecas: todasPecas })
  } else {
    await atualizarPedido(pedidoId, { pecas })
  }
}

// Atualiza campos de um modelo específico no array modelos[]
export async function atualizarModeloArquivos(
  pedidoId: string,
  modeloId: string,
  updates: Partial<Pick<ModeloPedido, 'layoutImages' | 'vetoresFiles' | 'estampaQuadros'>>
): Promise<void> {
  const pedido = await buscarPedido(pedidoId)
  if (!pedido || !pedido.modelos) return
  const novoModelos = pedido.modelos.map(m => m.id === modeloId ? { ...m, ...updates } : m)
  // Também atualiza top-level para compatibilidade com modelo[0]
  const primeiro = novoModelos[0]
  await atualizarPedido(pedidoId, {
    modelos: novoModelos,
    layoutImages: primeiro.layoutImages || [],
    vetoresFiles: primeiro.vetoresFiles || [],
    estampaQuadros: primeiro.estampaQuadros || [],
  })
}

export async function deletarPedido(id: string): Promise<void> {
  await deleteDoc(doc(db, 'pedidos', id))
}

export async function duplicarPedido(idOriginal: string): Promise<string> {
  const original = await buscarPedido(idOriginal)
  if (!original) throw new Error('Pedido não encontrado')

  const {
    id: _id,
    createdAt: _c,
    updatedAt: _u,
    clienteToken: _t,
    pecas: _p,
    layoutImages: _li,
    vetoresFiles: _vf,
    artesCliente: _ac,
    rascunhoVendedor: _rv,
    estampaQuadros: _eq,
    numeroPedidoSistema: _ns,
    ...dadosBase
  } = original

  return criarPedido({
    ...dadosBase,
    numeroPedido: `CÓPIA-${original.numeroPedido}`,
    status: 'dados',
    pecas: [],
    layoutImages: [],
    vetoresFiles: [],
    artesCliente: [],
    rascunhoVendedor: [],
  })
}
