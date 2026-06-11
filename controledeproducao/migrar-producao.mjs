// Migração: seta statusProducao = 'em_producao' em todos os pedidos formalizados que ainda não têm statusProducao
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: 'AIzaSyA8EiDjTF2cP7qSR2I2yfCpQPJCbgKRS9U',
  authDomain: 'pap-pedidos.firebaseapp.com',
  projectId: 'pap-pedidos',
  storageBucket: 'pap-pedidos.firebasestorage.app',
  messagingSenderId: '679874242664',
  appId: '1:679874242664:web:962988e7960053ad43f3dd',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function migrar() {
  console.log('Buscando pedidos formalizados...')
  const q = query(collection(db, 'pedidos'), where('status', '==', 'formalizado'))
  const snap = await getDocs(q)

  const paraAtualizar = snap.docs.filter(d => {
    const data = d.data()
    return !data.statusProducao // só os que ainda não têm statusProducao
  })

  console.log(`Total formalizados: ${snap.docs.length}`)
  console.log(`Sem statusProducao (a migrar): ${paraAtualizar.length}`)

  if (paraAtualizar.length === 0) {
    console.log('Nada a migrar.')
    process.exit(0)
  }

  let ok = 0
  let erro = 0
  for (const docSnap of paraAtualizar) {
    const data = docSnap.data()
    try {
      await updateDoc(doc(db, 'pedidos', docSnap.id), {
        statusProducao: 'em_producao',
        updatedAt: new Date().toISOString(),
      })
      console.log(`✓ ${data.numeroPedido || docSnap.id}`)
      ok++
    } catch (e) {
      console.error(`✗ ${data.numeroPedido || docSnap.id}: ${e.message}`)
      erro++
    }
  }

  console.log(`\nConcluído: ${ok} migrados, ${erro} erros.`)
  process.exit(0)
}

migrar().catch(e => {
  console.error('Erro fatal:', e)
  process.exit(1)
})
