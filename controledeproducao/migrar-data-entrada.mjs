// Migração: seta dataEntradaProducao nos pedidos que já têm statusProducao mas não têm dataEntradaProducao
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
  console.log('Buscando pedidos em produção sem dataEntradaProducao...')
  const q = query(collection(db, 'pedidos'), where('statusProducao', '==', 'em_producao'))
  const snap = await getDocs(q)

  const paraAtualizar = snap.docs.filter(d => !d.data().dataEntradaProducao)

  console.log(`Total em produção: ${snap.docs.length}`)
  console.log(`Sem dataEntradaProducao (a migrar): ${paraAtualizar.length}`)

  if (paraAtualizar.length === 0) {
    console.log('Nada a migrar.')
    process.exit(0)
  }

  // Usa hoje como data de entrada (é a melhor aproximação que temos)
  const hoje = new Date().toISOString()

  let ok = 0
  for (const docSnap of paraAtualizar) {
    const data = docSnap.data()
    await updateDoc(doc(db, 'pedidos', docSnap.id), {
      dataEntradaProducao: hoje,
    })
    console.log(`✓ ${data.numeroPedido || docSnap.id}`)
    ok++
  }

  console.log(`\nConcluído: ${ok} migrados.`)
  process.exit(0)
}

migrar().catch(e => { console.error(e); process.exit(1) })
