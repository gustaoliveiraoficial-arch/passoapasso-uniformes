'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const BASE_PATH = '/formalizarpedido'

// Quando Apache serve este 404.html para rotas dinâmicas,
// usamos router.replace com o path relativo ao basePath.
export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    const fullPath = window.location.pathname
    // Remove o basePath para obter o path relativo que o router espera
    const path = fullPath.startsWith(BASE_PATH)
      ? fullPath.slice(BASE_PATH.length) || '/'
      : fullPath
    router.replace(path + window.location.search)
  }, [router])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, border: '4px solid #e9d5ff', borderTop: '4px solid #9333ea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#6b7280', fontSize: 14 }}>Carregando...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}
