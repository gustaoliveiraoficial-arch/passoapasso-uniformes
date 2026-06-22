'use client'

import { useEffect, useRef, useState } from 'react'
import {
  criarListenerPedidos,
  moverParaAtraso,
  moverParaPronto,
  moverConsertoParaPronto,
  moverParaEmProducao,
  enviarMensagemMarcia,
  responderMensagemMarcia,
} from '@/lib/firebase'
import { subscribeWebPush } from '@/lib/push'

// Tipo do evento de instalação PWA
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
import type { Pedido, StatusProducao, MensagemMarcia } from '@/types/pedido'
import {
  RefreshCw, Package, Clock, CheckCircle, AlertTriangle,
  ChevronLeft, X, ExternalLink, Search, MessageCircle, Bell, Send,
  Plane, Wrench, Maximize, Minimize,
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const BASE_PEDIDOS = process.env.NEXT_PUBLIC_BASE_PEDIDOS_URL || 'https://passoapassouniformes.com/formalizarpedido'

type Col = { key: StatusProducao; label: string; headerBg: string; headerText: string; dot: string; icon: React.ReactNode }

const COLS: Col[] = [
  { key: 'em_producao', label: 'Em Produção', headerBg: 'bg-blue-100', headerText: 'text-blue-800', dot: 'bg-blue-500', icon: <Package size={15} /> },
  { key: 'em_atraso', label: 'Em Atraso', headerBg: 'bg-red-100', headerText: 'text-red-800', dot: 'bg-red-500', icon: <AlertTriangle size={15} /> },
  { key: 'pronto', label: 'Pedido Pronto', headerBg: 'bg-emerald-100', headerText: 'text-emerald-800', dot: 'bg-emerald-500', icon: <CheckCircle size={15} /> },
  { key: 'em_conserto', label: 'Em Conserto', headerBg: 'bg-orange-100', headerText: 'text-orange-800', dot: 'bg-orange-500', icon: <Wrench size={15} /> },
]

// ── Notificação nativa (service worker) ──
async function mostrarNotificacao(titulo: string, corpo: string, tag = 'pap-msg') {
  if (typeof window === 'undefined') return
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready
      reg.showNotification(titulo, {
        body: corpo,
        icon: '/controledeproducao/logo-pap.png',
        badge: '/controledeproducao/logo-pap.png',
        tag,
        renotify: true,
      } as NotificationOptions)
    } else {
      new Notification(titulo, { body: corpo, icon: '/controledeproducao/logo-pap.png' })
    }
  } catch { /* sem suporte */ }
}

// ── Sons via Web Audio API ──
function playSound(tipo: 'mensagem' | 'resposta') {
  try {
    const ctx = new AudioContext()
    const notas = tipo === 'mensagem' ? [660, 880] : [880, 660]
    notas.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = ctx.currentTime + i * 0.18
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.25, t + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
      osc.start(t); osc.stop(t + 0.3)
    })
  } catch { /* navegador bloqueou AudioContext */ }
}

export default function ControleProducao() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [movendo, setMovendo] = useState<string | null>(null)
  const [busca, setBusca] = useState('')

  // Modal atraso
  const [modalAtrasoId, setModalAtrasoId] = useState<string | null>(null)
  const [novaDataEntrega, setNovaDataEntrega] = useState('')
  const [motivoAtraso, setMotivoAtraso] = useState('')
  const [salvandoAtraso, setSalvandoAtraso] = useState(false)

  // Modal detalhe
  const [modalDetalhePedido, setModalDetalhePedido] = useState<Pedido | null>(null)

  // Painel aeroporto
  const [visaoAeroporto, setVisaoAeroporto] = useState(false)

  // Modal falar com Márcia
  const [modalMarciaId, setModalMarciaId] = useState<string | null>(null)
  const [mensagemMarcia, setMensagemMarcia] = useState('')
  const [novaDataMarcia, setNovaDataMarcia] = useState('')
  const [enviandoMarcia, setEnviandoMarcia] = useState(false)

  // Painel notificações Márcia
  const [painelMarcia, setPainelMarcia] = useState(false)
  const [respostaTexto, setRespostaTexto] = useState<Record<string, string>>({})
  const [salvandoResposta, setSalvandoResposta] = useState<string | null>(null)

  // Mobile: aba ativa no kanban
  const [activeCol, setActiveCol] = useState<StatusProducao>('em_producao')

  // Notificações
  const [notifPermission, setNotifPermission] = useState<string>('default')
  const [notifBannerDismissed, setNotifBannerDismissed] = useState(false)

  // PWA Install prompt
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installDismissed, setInstallDismissed] = useState(false)

  // Rastrear estado anterior p/ detectar novidades e tocar som
  const pedidosRef = useRef<Pedido[]>([])
  // IDs atualizados recentemente (para piscar no painel aeroporto)
  const [recentlyUpdatedIds, setRecentlyUpdatedIds] = useState<Set<string>>(new Set())
  // Ref do scroll do painel aeroporto
  const aeroportoScrollRef = useRef<HTMLDivElement>(null)

  // ── Helpers ──
  function nomeCliente(p: Pedido) {
    return p.clienteType === 'empresa' ? (p.clienteEmpresa?.razaoSocial || '—') : (p.clientePF?.nomeCompleto || '—')
  }
  function totalPecas(p: Pedido): number {
    if (p.modelos && p.modelos.length > 0) return p.modelos.reduce((s, m) => s + (m.quantidadeTotal || m.pecas?.length || 0), 0)
    return p.quantidadeTotal || p.pecas?.length || 0
  }
  function diasEmProducao(p: Pedido): number {
    const ref = p.dataEntradaProducao || p.createdAt
    const inicio = new Date(ref); inicio.setHours(0, 0, 0, 0)
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
    return Math.max(0, Math.floor((hoje.getTime() - inicio.getTime()) / 86400000))
  }
  function formatarData(iso?: string) {
    if (!iso) return '—'
    const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}`
  }
  function diasParaEntrega(p: Pedido): number {
    const dataRef = (p.statusProducao === 'em_atraso' && p.dataEntregaNovaProducao) ? p.dataEntregaNovaProducao : p.dataEntregaPrevista
    if (!dataRef) return 999
    const entrega = new Date(dataRef); entrega.setHours(0, 0, 0, 0)
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
    return Math.floor((entrega.getTime() - hoje.getTime()) / 86400000)
  }
  function filtrarPedidos(lista: Pedido[]): Pedido[] {
    if (!busca.trim()) return lista
    const q = busca.toLowerCase()
    return lista.filter(p =>
      nomeCliente(p).toLowerCase().includes(q) ||
      String(p.numeroPedido || '').toLowerCase().includes(q) ||
      String(p.numeroPedidoSistema || '').toLowerCase().includes(q)
    )
  }
  function ordenarPorEntrega(lista: Pedido[]): Pedido[] {
    return [...lista].sort((a, b) => diasParaEntrega(a) - diasParaEntrega(b))
  }

  // Mensagens sem resposta (para o badge da Márcia)
  function mensagensPendentes(lista: Pedido[]): { pedido: Pedido; msg: MensagemMarcia }[] {
    const resultado: { pedido: Pedido; msg: MensagemMarcia }[] = []
    lista.forEach(p => {
      (p.mensagensMarcia || []).forEach(m => {
        if (!m.respondidoEm) resultado.push({ pedido: p, msg: m })
      })
    })
    return resultado
  }

  // ── Listener em tempo real (onSnapshot) ──
  const primeiraCargatRef = useRef(true)

  useEffect(() => {
    setLoading(true)
    const unsubscribe = criarListenerPedidos(novos => {
      const anteriores = pedidosRef.current
      const inicial = primeiraCargatRef.current
      primeiraCargatRef.current = false

      if (!inicial && anteriores.length > 0) {
        // Detectar nova mensagem para Márcia
        novos.forEach(p => {
          const ant = anteriores.find(x => x.id === p.id)
          const msgNovos = (p.mensagensMarcia || []).length
          const msgAnt = (ant?.mensagensMarcia || []).length
          if (msgNovos > msgAnt) {
            playSound('mensagem')
            mostrarNotificacao(
              'Nova mensagem para Márcia 🔔',
              `${p.clienteType === 'empresa' ? p.clienteEmpresa?.razaoSocial : p.clientePF?.nomeCompleto} · Pedido nº ${p.numeroPedido}`,
              'pap-msg-nova'
            )
          }
        })
        // Detectar nova resposta da Márcia
        novos.forEach(p => {
          const ant = anteriores.find(x => x.id === p.id)
          ;(p.mensagensMarcia || []).forEach(m => {
            if (m.respondidoEm) {
              const antMsg = (ant?.mensagensMarcia || []).find(x => x.id === m.id)
              if (!antMsg?.respondidoEm) {
                playSound('resposta')
                mostrarNotificacao(
                  'Márcia respondeu ✅',
                  `${p.clienteType === 'empresa' ? p.clienteEmpresa?.razaoSocial : p.clientePF?.nomeCompleto} · Pedido nº ${p.numeroPedido}`,
                  'pap-msg-resposta'
                )
              }
            }
          })
        })
        // Detectar mudança de status para piscar no painel aeroporto
        const atualizados = novos.filter(n => {
          const ant = anteriores.find(x => x.id === n.id)
          return !ant || n.updatedAt > (ant.updatedAt || '')
        })
        if (atualizados.length > 0) {
          const ids = atualizados.map(p => p.id)
          setRecentlyUpdatedIds(prev => new Set([...Array.from(prev), ...ids]))
          setTimeout(() => {
            setRecentlyUpdatedIds(prev => {
              const next = new Set(Array.from(prev))
              ids.forEach(id => next.delete(id))
              return next
            })
          }, 20000)
        }
      }

      pedidosRef.current = novos
      setPedidos(novos)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // ── PWA install prompt ──
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Ler permissão atual de notificação
  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission)
    }
  }, [])

  async function pedirPermissaoNotificacao() {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    setNotifPermission(perm)
    if (perm === 'granted') {
      toast.success('Notificações ativadas! 🔔')
      mostrarNotificacao('Notificações ativadas!', 'Você receberá alertas mesmo com o app fechado.')
      // Registra Web Push para notificações em segundo plano
      subscribeWebPush()
    }
  }

  async function instalarApp() {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstallPrompt(null)
  }

  // ── Paginação painel aeroporto (10 faixas por vez, troca a cada 20s) ──
  const [aeroportoPage, setAeroportoPage] = useState(0)
  const [aeroportoFade, setAeroportoFade] = useState(true)
  const ROWS_PER_PAGE = 14

  useEffect(() => {
    if (!visaoAeroporto) { setAeroportoPage(0); return }
    const iv = setInterval(() => {
      setAeroportoFade(false)
      setTimeout(() => {
        setAeroportoPage(prev => {
          const total = pedidos.length
          const maxPage = Math.max(0, Math.ceil(total / ROWS_PER_PAGE) - 1)
          return prev >= maxPage ? 0 : prev + 1
        })
        setAeroportoFade(true)
      }, 300)
    }, 20000)
    return () => clearInterval(iv)
  }, [visaoAeroporto, pedidos.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Ações Kanban ──
  async function moverProEmProducao(p: Pedido) {
    setMovendo(p.id)
    try {
      await moverParaEmProducao(p.id)
      setPedidos(prev => prev.map(x => x.id === p.id ? { ...x, statusProducao: 'em_producao', dataEntregaNovaProducao: undefined, motivoAtraso: undefined } : x))
      toast.success('Movido para Em Produção')
    } catch { toast.error('Erro ao mover') }
    finally { setMovendo(null) }
  }

  async function abrirModalAtraso(id: string) {
    const p = pedidos.find(x => x.id === id)
    setNovaDataEntrega(p?.dataEntregaNovaProducao || p?.dataEntregaPrevista || '')
    setMotivoAtraso(p?.motivoAtraso || '')
    setModalAtrasoId(id)
  }

  async function confirmarAtraso() {
    if (!modalAtrasoId || !novaDataEntrega.trim()) { toast.error('Informe a nova data de entrega'); return }
    setSalvandoAtraso(true)
    try {
      await moverParaAtraso(modalAtrasoId, novaDataEntrega, motivoAtraso)
      setPedidos(prev => prev.map(x => x.id === modalAtrasoId ? { ...x, statusProducao: 'em_atraso', dataEntregaNovaProducao: novaDataEntrega, motivoAtraso } : x))
      setModalAtrasoId(null)
      toast.success('Pedido marcado como Em Atraso')
    } catch { toast.error('Erro ao salvar') }
    finally { setSalvandoAtraso(false) }
  }

  async function moverProPronto(p: Pedido) {
    setMovendo(p.id)
    try {
      await moverParaPronto(p.id)
      setPedidos(prev => prev.map(x => x.id === p.id ? { ...x, statusProducao: 'pronto' } : x))
      toast.success('Pedido marcado como Pronto!')
    } catch { toast.error('Erro ao mover') }
    finally { setMovendo(null) }
  }

  async function moverConsertoProPronto(p: Pedido) {
    setMovendo(p.id)
    try {
      await moverConsertoParaPronto(p.id)
      // Remove do kanban de produção (dataRetirada limpo, volta para retirada no formalizarpedido)
      setPedidos(prev => prev.filter(x => x.id !== p.id))
      toast.success('Pronto! Pedido liberado para nova retirada.')
    } catch { toast.error('Erro ao mover') }
    finally { setMovendo(null) }
  }

  // ── Falar com Márcia ──
  async function enviarParaMarcia() {
    if (!modalMarciaId || !mensagemMarcia.trim()) { toast.error('Digite uma mensagem'); return }
    setEnviandoMarcia(true)
    try {
      const nova: MensagemMarcia = {
        id: Date.now().toString(),
        texto: mensagemMarcia.trim(),
        ...(novaDataMarcia ? { novaDataSolicitada: novaDataMarcia } : {}),
        criadoEm: new Date().toISOString(),
      }
      await enviarMensagemMarcia(modalMarciaId, nova)
      setPedidos(prev => prev.map(p =>
        p.id === modalMarciaId
          ? { ...p, mensagensMarcia: [...(p.mensagensMarcia || []), nova] }
          : p
      ))
      playSound('mensagem')
      toast.success('Mensagem enviada para Márcia!')
      setModalMarciaId(null)
      setMensagemMarcia('')
      setNovaDataMarcia('')
    } catch { toast.error('Erro ao enviar mensagem') }
    finally { setEnviandoMarcia(false) }
  }

  // ── Resposta da Márcia ──
  async function salvarRespostaMarcia(pedidoId: string, mensagemId: string) {
    const texto = respostaTexto[mensagemId]?.trim()
    if (!texto) { toast.error('Digite uma resposta'); return }
    setSalvandoResposta(mensagemId)
    try {
      const pedido = pedidos.find(p => p.id === pedidoId)!
      await responderMensagemMarcia(pedidoId, mensagemId, texto, pedido.mensagensMarcia || [])
      setPedidos(prev => prev.map(p =>
        p.id === pedidoId
          ? {
              ...p,
              mensagensMarcia: (p.mensagensMarcia || []).map(m =>
                m.id === mensagemId ? { ...m, resposta: texto, respondidoEm: new Date().toISOString() } : m
              )
            }
          : p
      ))
      playSound('resposta')
      toast.success('Resposta enviada!')
      setRespostaTexto(prev => { const n = { ...prev }; delete n[mensagemId]; return n })
    } catch { toast.error('Erro ao responder') }
    finally { setSalvandoResposta(null) }
  }

  const cols = COLS.map(col => ({
    ...col,
    cards: ordenarPorEntrega(filtrarPedidos(pedidos.filter(p => p.statusProducao === col.key))),
    total: pedidos.filter(p => p.statusProducao === col.key).length,
  }))

  const pendentes = mensagensPendentes(pedidos)

  // ── Painel aeroporto: todos pedidos ordenados por updatedAt desc ──
  const pedidosAeroporto = [...pedidos].sort((a, b) => {
    // Prioridade: 1=em_atraso, 2=pronto, 3=em_producao, 4=em_conserto
    const prioridade = (p: Pedido) => {
      if (p.statusProducao === 'em_atraso') return 1
      if (p.statusProducao === 'pronto') return 2
      if (p.statusProducao === 'em_producao') return 3
      return 4
    }
    const pa = prioridade(a), pb = prioridade(b)
    if (pa !== pb) return pa - pb
    // Dentro da mesma prioridade: datas mais atrasadas primeiro
    return diasParaEntrega(a) - diasParaEntrega(b)
  })

  const statusLabel: Record<string, string> = {
    em_producao: '🔧 EM PRODUÇÃO',
    em_atraso: '⚠ EM ATRASO',
    pronto: '✓ PRONTO',
    em_conserto: '🔩 EM CONSERTO',
  }
  const statusColor: Record<string, string> = {
    em_producao: 'text-blue-300',
    em_atraso: 'text-red-400',
    pronto: 'text-emerald-400',
  }

  const modalMarciaData = modalMarciaId ? pedidos.find(p => p.id === modalMarciaId) : null

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo + título */}
          <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
            <img src="/controledeproducao/logo-pap.png" alt="Passo a Passo" className="h-8 w-auto flex-shrink-0" />
            <div className="hidden sm:block min-w-0">
              <h1 className="text-sm font-bold text-gray-900 leading-tight">Passo a Passo Uniformes</h1>
              <p className="text-xs text-gray-500">Controle de Produção</p>
            </div>
          </div>

          {/* Busca — ocupa espaço no mobile */}
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar pedido..."
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full bg-white"
            />
            {busca && (
              <button onClick={() => setBusca('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Ações direita */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Resumo — só desktop */}
            <div className="hidden md:flex items-center gap-3 text-xs text-gray-500 mr-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />{cols[0].total}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />{cols[1].total}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />{cols[2].total}</span>
            </div>

            {/* Painel aeroporto — só desktop */}
            <button onClick={() => setVisaoAeroporto(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50 transition font-semibold">
              <Plane size={13} />Painel
            </button>

            {/* Bell Márcia — só desktop (mobile tem tab) */}
            <button onClick={() => setPainelMarcia(true)}
              className="hidden md:flex relative items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50 transition font-semibold">
              <Bell size={13} />Márcia
              {pendentes.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-0.5 animate-pulse">
                  {pendentes.length}
                </span>
              )}
            </button>

            <a href={BASE_PEDIDOS + '/'} target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition">
              <ExternalLink size={12} />Formalização
            </a>

            <button onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      {/* Banner instalar PWA */}
      {installPrompt && !installDismissed && (
        <div className="bg-indigo-50 border-b border-indigo-200 px-4 py-2.5 flex items-center gap-3">
          <span className="text-lg flex-shrink-0">📲</span>
          <span className="text-xs text-indigo-700 flex-1">Instale o app na tela inicial para acesso rápido</span>
          <button onClick={instalarApp}
            className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-full transition flex-shrink-0">
            Instalar
          </button>
          <button onClick={() => setInstallDismissed(true)} className="text-indigo-400 hover:text-indigo-600 flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Banner para ativar notificações */}
      {notifPermission === 'default' && !notifBannerDismissed && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2.5 flex items-center gap-3">
          <Bell size={14} className="text-blue-600 flex-shrink-0" />
          <span className="text-xs text-blue-700 flex-1">Ative as notificações para receber alertas mesmo com o app fechado</span>
          <button onClick={pedirPermissaoNotificacao}
            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full transition">
            Ativar
          </button>
          <button onClick={() => setNotifBannerDismissed(true)} className="text-blue-400 hover:text-blue-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── KANBAN DESKTOP ── */}
      <div className="hidden md:flex flex-1 overflow-x-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center w-full h-64 text-gray-400 text-sm">Carregando pedidos...</div>
        ) : (
          <div className="flex gap-4 items-start min-w-[900px] w-full">
            {cols.map((col) => (
              <div key={col.key} className="flex-1 min-w-[280px] flex flex-col gap-2">
                <div className={`${col.headerBg} rounded-xl px-4 py-3 flex items-center justify-between`}>
                  <div className={`flex items-center gap-2 font-bold text-sm ${col.headerText}`}>
                    {col.icon}{col.label}
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.headerText} ${col.headerBg} border ${col.key === 'em_producao' ? 'border-blue-300' : col.key === 'em_atraso' ? 'border-red-300' : col.key === 'em_conserto' ? 'border-orange-300' : 'border-emerald-300'}`}>
                    {busca ? `${col.cards.length}/${col.total}` : col.total}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {col.cards.length === 0 && (
                    <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-400 text-xs">
                      Nenhum pedido aqui
                    </div>
                  )}

                  {col.cards.map(p => {
                    const dias = diasEmProducao(p)
                    const atrasado = col.key !== 'pronto' && dias >= 5
                    const total = totalPecas(p)
                    const dataExibir = col.key === 'em_atraso' && p.dataEntregaNovaProducao ? p.dataEntregaNovaProducao : p.dataEntregaPrevista
                    const diasRestantes = diasParaEntrega(p)
                    const entregaAtrasada = diasRestantes < 0
                    const entregaHoje = diasRestantes === 0
                    const entregaUrgente = diasRestantes > 0 && diasRestantes <= 3

                    const msgs = p.mensagensMarcia || []
                    const temPendente = msgs.some(m => !m.respondidoEm)
                    const temResposta = msgs.some(m => !!m.respondidoEm)
                    const ultimaResposta = msgs.filter(m => m.respondidoEm).sort((a, b) => (b.respondidoEm || '').localeCompare(a.respondidoEm || ''))[0]

                    return (
                      <div
                        key={p.id}
                        className={`bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-3 relative transition hover:shadow-md
                          ${col.key === 'em_atraso' ? 'border-red-200 bg-red-50/20' : ''}
                          ${col.key === 'pronto' ? 'border-emerald-200' : ''}
                          ${col.key === 'em_conserto' ? 'border-orange-200 bg-orange-50/20' : ''}`}
                      >
                        {/* Badge dias */}
                        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full
                          ${atrasado ? 'bg-red-500 text-white animate-pulse' : dias >= 3 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          {atrasado && '⚠ '}{dias}d
                        </span>

                        {/* Nome + número */}
                        <div>
                          <div className="font-bold text-gray-900 text-sm pr-12 leading-tight">{nomeCliente(p)}</div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            Nº {p.numeroPedido}
                            {p.numeroPedidoSistema && <span className="ml-1 text-blue-600 font-semibold">· Sis: {p.numeroPedidoSistema}</span>}
                          </div>
                        </div>

                        {/* Infos */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-600">
                          <div><span className="text-gray-400">Vendedor:</span> <span className="font-medium">{p.nomeVendedor}</span></div>
                          <div><span className="text-gray-400">Qtd:</span> <span className="font-bold text-gray-800">{total} pç</span></div>
                          <div><span className="text-gray-400">Pedido em:</span> <span className="font-medium">{formatarData(p.dataPedido)}</span></div>
                          <div>
                            <span className="text-gray-400">{col.key === 'em_atraso' ? 'Nova entrega:' : 'Entrega:'}</span>{' '}
                            <span className={`font-bold ${col.key === 'em_atraso' || entregaAtrasada ? 'text-red-600' : entregaUrgente ? 'text-orange-600' : 'text-gray-800'}`}>
                              {formatarData(dataExibir)}
                            </span>
                            <div className={`text-xs font-semibold mt-0.5 ${entregaAtrasada ? 'text-red-600' : entregaHoje ? 'text-orange-600' : entregaUrgente ? 'text-orange-500' : 'text-gray-400'}`}>
                              {entregaAtrasada ? `⚠ ${Math.abs(diasRestantes)}d atrasado` : entregaHoje ? '🔴 Entrega hoje!' : diasRestantes === 999 ? '—' : `${diasRestantes}d para entregar`}
                            </div>
                          </div>
                        </div>

                        {/* Motivo atraso */}
                        {col.key === 'em_atraso' && p.motivoAtraso && (
                          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-700">
                            <span className="font-semibold">Motivo: </span>{p.motivoAtraso}
                          </div>
                        )}

                        {/* Dados conserto */}
                        {col.key === 'em_conserto' && p.conserto && (
                          <div className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-2 text-xs text-orange-800 flex flex-col gap-1.5">
                            <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full w-fit text-xs ${p.conserto.responsavel === 'nos' ? 'bg-orange-200 text-orange-800' : 'bg-blue-100 text-blue-700'}`}>
                              {p.conserto.responsavel === 'nos' ? '⚠ Nosso erro' : '👤 Erro do cliente'}
                            </span>
                            <span>{p.conserto.descricao}</span>
                            {p.conserto.foto && (
                              <a href={p.conserto.foto} target="_blank" rel="noopener noreferrer" className="mt-0.5">
                                <img src={p.conserto.foto} alt="Foto do erro" className="w-20 h-20 object-cover rounded-lg border border-orange-200 hover:opacity-80 transition cursor-pointer" />
                              </a>
                            )}
                          </div>
                        )}

                        {/* Status Márcia */}
                        {temPendente && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-xs text-amber-700 font-semibold flex items-center gap-1.5">
                            <MessageCircle size={11} /> Aguardando resposta da Márcia
                          </div>
                        )}
                        {!temPendente && temResposta && ultimaResposta && (
                          <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-xs text-green-700 flex flex-col gap-0.5">
                            <span className="font-semibold flex items-center gap-1"><CheckCircle size={11} /> Márcia respondeu</span>
                            <span className="text-gray-600 line-clamp-2">{ultimaResposta.resposta}</span>
                          </div>
                        )}

                        {/* Ver detalhes */}
                        <button onClick={() => setModalDetalhePedido(p)} className="text-xs text-blue-500 hover:text-blue-700 text-left -mt-1 underline underline-offset-2">
                          Ver detalhes
                        </button>

                        {/* Ações */}
                        <div className="flex flex-col gap-2 pt-1 border-t border-gray-100">
                          {/* Botão Falar com Márcia */}
                          <button
                            onClick={() => { setModalMarciaId(p.id); setMensagemMarcia(''); setNovaDataMarcia('') }}
                            className="w-full py-1.5 rounded-lg text-xs font-semibold border border-purple-200 text-purple-700 hover:bg-purple-50 transition flex items-center justify-center gap-1"
                          >
                            <MessageCircle size={11} /> Falar com Márcia
                          </button>

                          {col.key === 'em_producao' && (
                            <>
                              <button onClick={() => abrirModalAtraso(p.id)} disabled={movendo === p.id}
                                className="w-full py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition">
                                <AlertTriangle size={11} className="inline mr-1" />Marcar Em Atraso
                              </button>
                              <button onClick={() => moverProPronto(p)} disabled={movendo === p.id}
                                className="w-full py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition">
                                <CheckCircle size={11} className="inline mr-1" />Marcar Pronto
                              </button>
                            </>
                          )}

                          {col.key === 'em_atraso' && (
                            <>
                              <button onClick={() => moverProEmProducao(p)} disabled={movendo === p.id}
                                className="w-full py-1.5 rounded-lg text-xs font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition">
                                <ChevronLeft size={11} className="inline mr-1" />Voltar p/ Em Produção
                              </button>
                              <button onClick={() => abrirModalAtraso(p.id)} disabled={movendo === p.id}
                                className="w-full py-1.5 rounded-lg text-xs font-semibold border border-orange-200 text-orange-600 hover:bg-orange-50 transition">
                                <Clock size={11} className="inline mr-1" />Editar Atraso
                              </button>
                              <button onClick={() => moverProPronto(p)} disabled={movendo === p.id}
                                className="w-full py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition">
                                <CheckCircle size={11} className="inline mr-1" />Marcar Pronto
                              </button>
                            </>
                          )}

                          {col.key === 'pronto' && (
                            <button onClick={() => moverProEmProducao(p)} disabled={movendo === p.id}
                              className="w-full py-1.5 rounded-lg text-xs font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition">
                              <ChevronLeft size={11} className="inline mr-1" />Voltar p/ Em Produção
                            </button>
                          )}

                          {col.key === 'em_conserto' && (
                            <>
                              <button onClick={() => moverProEmProducao(p)} disabled={movendo === p.id}
                                className="w-full py-1.5 rounded-lg text-xs font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition">
                                <ChevronLeft size={11} className="inline mr-1" />Voltar p/ Em Produção
                              </button>
                              <button onClick={() => moverConsertoProPronto(p)} disabled={movendo === p.id}
                                className="w-full py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition">
                                <CheckCircle size={11} className="inline mr-1" />Pronto — Liberar Retirada
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── KANBAN MOBILE ── */}
      <div className="md:hidden flex flex-col flex-1 pb-20">
        {/* Abas de coluna */}
        <div className="bg-white border-b border-gray-200 flex overflow-x-auto flex-shrink-0 sticky top-0 z-10">
          {cols.map(col => (
            <button
              key={col.key}
              onClick={() => setActiveCol(col.key)}
              className={`flex-1 flex flex-col items-center py-2 px-1 text-xs font-semibold border-b-2 transition relative min-w-[70px]
                ${activeCol === col.key
                  ? col.key === 'em_producao' ? 'border-blue-500 text-blue-600'
                    : col.key === 'em_atraso' ? 'border-red-500 text-red-600'
                    : col.key === 'pronto' ? 'border-emerald-500 text-emerald-600'
                    : 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-400'}`}
            >
              <span className="mb-0.5">{col.icon}</span>
              <span className="leading-tight text-center">{col.label}</span>
              {col.total > 0 && (
                <span className={`absolute top-1 right-1 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center
                  ${col.key === 'em_atraso' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {col.total}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Cards da coluna ativa */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Carregando...</div>
          ) : cols.find(c => c.key === activeCol)?.cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm gap-2">
              <CheckCircle size={32} className="text-gray-200" />
              Nenhum pedido aqui
            </div>
          ) : cols.find(c => c.key === activeCol)?.cards.map(p => {
            const col = cols.find(c => c.key === activeCol)!
            const dias = diasEmProducao(p)
            const atrasado = col.key !== 'pronto' && dias >= 5
            const total = totalPecas(p)
            const dataExibir = col.key === 'em_atraso' && p.dataEntregaNovaProducao ? p.dataEntregaNovaProducao : p.dataEntregaPrevista
            const diasRestantes = diasParaEntrega(p)
            const entregaAtrasada = diasRestantes < 0
            const entregaHoje = diasRestantes === 0
            const entregaUrgente = diasRestantes > 0 && diasRestantes <= 3
            const msgs = p.mensagensMarcia || []
            const temPendente = msgs.some(m => !m.respondidoEm)
            const temResposta = msgs.some(m => !!m.respondidoEm)
            const ultimaResposta = msgs.filter(m => m.respondidoEm).sort((a, b) => (b.respondidoEm || '').localeCompare(a.respondidoEm || ''))[0]
            return (
              <div key={p.id} className={`bg-white rounded-2xl border shadow-sm p-4 flex flex-col gap-3 relative
                ${col.key === 'em_atraso' ? 'border-red-200 bg-red-50/20' : ''}
                ${col.key === 'pronto' ? 'border-emerald-200' : ''}
                ${col.key === 'em_conserto' ? 'border-orange-200 bg-orange-50/20' : ''}`}>
                {/* Badge dias */}
                <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full
                  ${atrasado ? 'bg-red-500 text-white animate-pulse' : dias >= 3 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {atrasado && '⚠ '}{dias}d
                </span>
                {/* Nome + número */}
                <div className="pr-14">
                  <div className="font-bold text-gray-900 text-base leading-tight">{p.clienteType === 'empresa' ? p.clienteEmpresa?.razaoSocial : p.clientePF?.nomeCompleto}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Nº {p.numeroPedido}
                    {p.numeroPedidoSistema && <span className="ml-1 text-blue-600 font-semibold">· Sis: {p.numeroPedidoSistema}</span>}
                  </div>
                </div>
                {/* Infos */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm text-gray-600">
                  <div><span className="text-gray-400 text-xs">Vendedor:</span><br/><span className="font-medium">{p.nomeVendedor}</span></div>
                  <div><span className="text-gray-400 text-xs">Qtd:</span><br/><span className="font-bold text-gray-800">{total} peças</span></div>
                  <div><span className="text-gray-400 text-xs">Pedido em:</span><br/><span className="font-medium">{formatarData(p.dataPedido)}</span></div>
                  <div>
                    <span className="text-gray-400 text-xs">{col.key === 'em_atraso' ? 'Nova entrega:' : 'Entrega:'}</span><br/>
                    <span className={`font-bold ${col.key === 'em_atraso' || entregaAtrasada ? 'text-red-600' : entregaUrgente ? 'text-orange-600' : 'text-gray-800'}`}>
                      {formatarData(dataExibir)}
                    </span>
                    <div className={`text-xs font-semibold ${entregaAtrasada ? 'text-red-600' : entregaHoje ? 'text-orange-600' : entregaUrgente ? 'text-orange-500' : 'text-gray-400'}`}>
                      {entregaAtrasada ? `⚠ ${Math.abs(diasRestantes)}d atrasado` : entregaHoje ? '🔴 Entrega hoje!' : diasRestantes === 999 ? '—' : `${diasRestantes}d para entregar`}
                    </div>
                  </div>
                </div>
                {/* Motivo atraso */}
                {col.key === 'em_atraso' && p.motivoAtraso && (
                  <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-sm text-red-700">
                    <span className="font-semibold">Motivo: </span>{p.motivoAtraso}
                  </div>
                )}
                {/* Status Márcia */}
                {temPendente && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-sm text-amber-700 font-semibold flex items-center gap-1.5">
                    <MessageCircle size={13} /> Aguardando resposta da Márcia
                  </div>
                )}
                {!temPendente && temResposta && ultimaResposta && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-sm text-green-700 flex flex-col gap-0.5">
                    <span className="font-semibold flex items-center gap-1"><CheckCircle size={12} /> Márcia respondeu</span>
                    <span className="text-gray-600 line-clamp-2">{ultimaResposta.resposta}</span>
                  </div>
                )}
                {/* Ações */}
                <div className="flex flex-col gap-2 pt-1 border-t border-gray-100">
                  <button onClick={() => { setModalMarciaId(p.id); setMensagemMarcia(''); setNovaDataMarcia('') }}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold border border-purple-200 text-purple-700 hover:bg-purple-50 transition flex items-center justify-center gap-2">
                    <MessageCircle size={14} /> Falar com Márcia
                  </button>
                  {col.key === 'em_producao' && (
                    <>
                      <button onClick={() => abrirModalAtraso(p.id)} disabled={movendo === p.id}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition">
                        <AlertTriangle size={13} className="inline mr-1.5" />Marcar Em Atraso
                      </button>
                      <button onClick={() => moverProPronto(p)} disabled={movendo === p.id}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition">
                        <CheckCircle size={13} className="inline mr-1.5" />Marcar Pronto
                      </button>
                    </>
                  )}
                  {col.key === 'em_atraso' && (
                    <>
                      <button onClick={() => moverProEmProducao(p)} disabled={movendo === p.id}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition">
                        <ChevronLeft size={13} className="inline mr-1.5" />Voltar p/ Em Produção
                      </button>
                      <button onClick={() => abrirModalAtraso(p.id)} disabled={movendo === p.id}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold border border-orange-200 text-orange-600 hover:bg-orange-50 transition">
                        <Clock size={13} className="inline mr-1.5" />Editar Atraso
                      </button>
                      <button onClick={() => moverProPronto(p)} disabled={movendo === p.id}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition">
                        <CheckCircle size={13} className="inline mr-1.5" />Marcar Pronto
                      </button>
                    </>
                  )}
                  {col.key === 'pronto' && (
                    <button onClick={() => moverProEmProducao(p)} disabled={movendo === p.id}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition">
                      <ChevronLeft size={13} className="inline mr-1.5" />Voltar p/ Em Produção
                    </button>
                  )}
                  {col.key === 'em_conserto' && (
                    <>
                      <button onClick={() => moverProEmProducao(p)} disabled={movendo === p.id}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition">
                        <ChevronLeft size={13} className="inline mr-1.5" />Voltar p/ Em Produção
                      </button>
                      <button onClick={() => moverConsertoProPronto(p)} disabled={movendo === p.id}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition">
                        <CheckCircle size={13} className="inline mr-1.5" />Pronto — Liberar Retirada
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── BARRA DE NAVEGAÇÃO INFERIOR (mobile) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 flex safe-area-bottom">
        {/* Painel aeroporto */}
        <button onClick={() => setVisaoAeroporto(true)}
          className="flex-1 flex flex-col items-center gap-0.5 py-3 text-xs text-gray-400 font-medium">
          <Plane size={18} />
          <span>Painel</span>
        </button>
        {/* Notificações Márcia */}
        <button onClick={() => setPainelMarcia(true)}
          className="flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium relative text-purple-600">
          <Bell size={18} />
          <span>Márcia</span>
          {pendentes.length > 0 && (
            <span className="absolute top-1.5 right-3 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 animate-pulse">
              {pendentes.length}
            </span>
          )}
        </button>
        {/* Notif permission */}
        {notifPermission !== 'granted' && (
          <button onClick={pedirPermissaoNotificacao}
            className="flex-1 flex flex-col items-center gap-0.5 py-3 text-xs text-blue-500 font-medium">
            <Bell size={18} className="text-blue-500" />
            <span>Alertas</span>
          </button>
        )}
        {/* Instalar PWA */}
        {installPrompt && !installDismissed && (
          <button onClick={instalarApp}
            className="flex-1 flex flex-col items-center gap-0.5 py-3 text-xs text-indigo-500 font-medium">
            <span className="text-lg leading-none">📲</span>
            <span>Instalar</span>
          </button>
        )}
        {/* Link formalização */}
        <a href={BASE_PEDIDOS + '/'} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center gap-0.5 py-3 text-xs text-gray-400 font-medium">
          <ExternalLink size={18} />
          <span>Pedidos</span>
        </a>
      </nav>

      {/* ══════════════════════════════════════════
          PAINEL AEROPORTO
      ══════════════════════════════════════════ */}
      {visaoAeroporto && (
        <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col overflow-hidden">
          {/* Header aeroporto */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Plane size={20} className="text-yellow-400" />
              <span className="text-white font-bold text-lg tracking-widest uppercase">Produção — Passo a Passo</span>
              <span className="text-gray-500 text-sm ml-2 font-mono">{new Date().toLocaleTimeString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />{cols[0].total} produção</span>
                <span className="flex items-center gap-1.5 text-red-400"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />{cols[1].total} atraso</span>
                <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />{cols[2].total} prontos</span>
              </div>
              <button
                onClick={() => {
                  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {})
                  else document.exitFullscreen().catch(() => {})
                }}
                className="text-gray-400 hover:text-white transition"
                title="Tela cheia"
              >
                {document.fullscreenElement ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
              <button onClick={() => { setVisaoAeroporto(false); document.exitFullscreen().catch(() => {}) }} className="text-gray-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Tabela estilo painel */}
          <div className="flex-1 overflow-hidden">
            {/* Cabeçalho colunas */}
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1.5fr_1.5fr_1.5fr] gap-0 border-b border-gray-700 px-6 py-2 text-xs text-gray-500 uppercase tracking-widest font-mono sticky top-0 bg-gray-950">
              <span>Cliente</span>
              <span>Pedido</span>
              <span>Qtd</span>
              <span>Vendedor</span>
              <span>Entrega</span>
              <span>Status</span>
              <span>Márcia</span>
            </div>

            <div className={`transition-opacity duration-300 ${aeroportoFade ? 'opacity-100' : 'opacity-0'}`}>
            {pedidosAeroporto.slice(aeroportoPage * ROWS_PER_PAGE, (aeroportoPage + 1) * ROWS_PER_PAGE).map((p, idx) => {
              const diasRestantes = diasParaEntrega(p)
              const atrasado = diasRestantes < 0
              const hoje = diasRestantes === 0
              const urgente = diasRestantes > 0 && diasRestantes <= 3
              const msgs = p.mensagensMarcia || []
              const temPendente = msgs.some(m => !m.respondidoEm)
              const temResposta = !temPendente && msgs.some(m => !!m.respondidoEm)

              const dataExibir = p.statusProducao === 'em_atraso' && p.dataEntregaNovaProducao
                ? p.dataEntregaNovaProducao : p.dataEntregaPrevista

              return (
                <div
                  key={p.id}
                  className={`grid grid-cols-[2fr_2fr_1fr_1fr_1.5fr_1.5fr_1.5fr] gap-0 px-6 py-3 border-b border-gray-800/60 font-mono text-sm transition-all
                    ${recentlyUpdatedIds.has(p.id) ? 'animate-pulse bg-yellow-400/10 border-l-2 border-l-yellow-400' : ''}
                    ${atrasado ? 'bg-red-950/30' : hoje ? 'bg-orange-950/30' : ''}
                    hover:bg-gray-800/40`}
                >
                  <span className="text-white font-semibold truncate pr-2">{nomeCliente(p)}</span>
                  <span className="text-gray-300 truncate pr-2">
                    {p.numeroPedido}
                    {p.numeroPedidoSistema && <span className="text-blue-400 ml-1">#{p.numeroPedidoSistema}</span>}
                  </span>
                  <span className="text-gray-300">{totalPecas(p)} pç</span>
                  <span className="text-gray-400 truncate">{p.nomeVendedor}</span>
                  <span className={`font-bold ${atrasado ? 'text-red-400' : hoje ? 'text-orange-400' : urgente ? 'text-yellow-400' : 'text-gray-300'}`}>
                    {formatarData(dataExibir)}
                    {atrasado && <span className="text-red-500 text-xs ml-1">⚠{Math.abs(diasRestantes)}d</span>}
                    {hoje && <span className="text-orange-400 text-xs ml-1">HOJE</span>}
                    {urgente && !hoje && <span className="text-yellow-400 text-xs ml-1">{diasRestantes}d</span>}
                  </span>
                  <span className={`font-bold text-xs ${statusColor[p.statusProducao || ''] || 'text-gray-500'}`}>
                    {statusLabel[p.statusProducao || ''] || '—'}
                  </span>
                  <span className="text-xs">
                    {temPendente && <span className="text-amber-400 font-semibold">⏳ Aguardando</span>}
                    {temResposta && <span className="text-emerald-400 font-semibold">✓ Respondeu</span>}
                    {!temPendente && !temResposta && <span className="text-gray-600">—</span>}
                  </span>
                </div>
              )
            })}
            </div>
          </div>

          {/* Rodapé aeroporto */}
          <div className="border-t border-gray-800 px-6 py-2 text-xs text-gray-600 font-mono flex items-center justify-between">
            <span>
              Página {aeroportoPage + 1} / {Math.max(1, Math.ceil(pedidosAeroporto.length / ROWS_PER_PAGE))} · troca a cada 20s · atualização em tempo real
            </span>
            <span>{pedidosAeroporto.length} pedidos em produção</span>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          PAINEL NOTIFICAÇÕES MÁRCIA
      ══════════════════════════════════════════ */}
      {painelMarcia && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-end p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Bell size={17} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Painel da Márcia</h2>
                  <p className="text-xs text-gray-500">{pendentes.length} mensagem{pendentes.length !== 1 ? 'ns' : ''} aguardando resposta</p>
                </div>
              </div>
              <button onClick={() => setPainelMarcia(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {pendentes.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">
                  <CheckCircle size={32} className="mx-auto mb-2 text-emerald-300" />
                  Nenhuma mensagem pendente!
                </div>
              )}

              {pedidos.map(p => {
                const msgs = p.mensagensMarcia || []
                if (msgs.length === 0) return null
                return (
                  <div key={p.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{nomeCliente(p)}</span>
                        <span className="text-xs text-gray-400 ml-2">Nº {p.numeroPedido}</span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.statusProducao === 'pronto' ? 'bg-emerald-100 text-emerald-700' :
                        p.statusProducao === 'em_atraso' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {statusLabel[p.statusProducao || ''] || '—'}
                      </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {msgs.map(m => (
                        <div key={m.id} className="p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="flex-1">
                              <p className="text-xs text-gray-400 mb-1">{new Date(m.criadoEm).toLocaleString('pt-BR')} {m.novaDataSolicitada && <span className="text-orange-600 font-semibold ml-1">· Nova data pedida: {formatarData(m.novaDataSolicitada)}</span>}</p>
                              <p className="text-sm text-gray-800 bg-gray-50 rounded-lg px-3 py-2">{m.texto}</p>
                            </div>
                          </div>

                          {m.respondidoEm ? (
                            <div className="mt-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                              <p className="text-xs text-green-600 font-semibold mb-0.5">Márcia respondeu · {new Date(m.respondidoEm).toLocaleString('pt-BR')}</p>
                              <p className="text-sm text-green-800">{m.resposta}</p>
                            </div>
                          ) : (
                            <div className="mt-2 flex gap-2">
                              <input
                                type="text"
                                value={respostaTexto[m.id] || ''}
                                onChange={e => setRespostaTexto(prev => ({ ...prev, [m.id]: e.target.value }))}
                                onKeyDown={e => { if (e.key === 'Enter') salvarRespostaMarcia(p.id, m.id) }}
                                placeholder="Resposta da Márcia..."
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                              />
                              <button
                                onClick={() => salvarRespostaMarcia(p.id, m.id)}
                                disabled={salvandoResposta === m.id}
                                className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
                              >
                                <Send size={12} />
                                {salvandoResposta === m.id ? '...' : 'Enviar'}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL FALAR COM MÁRCIA
      ══════════════════════════════════════════ */}
      {modalMarciaId && modalMarciaData && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle size={18} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900">Falar com Márcia</h2>
                <p className="text-xs text-gray-500">{nomeCliente(modalMarciaData)} · Nº {modalMarciaData.numeroPedido}</p>
              </div>
              <button onClick={() => setModalMarciaId(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            {/* Histórico de mensagens */}
            {(modalMarciaData.mensagensMarcia || []).length > 0 && (
              <div className="mb-4 flex flex-col gap-2 max-h-48 overflow-y-auto">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Histórico</p>
                {(modalMarciaData.mensagensMarcia || []).map(m => (
                  <div key={m.id} className="text-xs bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-gray-400 mb-0.5">{new Date(m.criadoEm).toLocaleString('pt-BR')}</p>
                    <p className="text-gray-700">{m.texto}</p>
                    {m.resposta && (
                      <p className="text-green-700 mt-1 font-semibold">↩ Márcia: {m.resposta}</p>
                    )}
                    {!m.resposta && (
                      <p className="text-amber-600 mt-1">⏳ Aguardando resposta...</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Mensagem para Márcia</label>
                <textarea
                  value={mensagemMarcia}
                  onChange={e => setMensagemMarcia(e.target.value)}
                  placeholder="Ex: Qual a situação deste pedido? Tem previsão de conclusão?"
                  rows={3}
                  className="w-full border border-gray-300 focus:border-purple-400 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Solicitar nova data de entrega (opcional)</label>
                <input
                  type="date"
                  value={novaDataMarcia}
                  onChange={e => setNovaDataMarcia(e.target.value)}
                  className="w-full border border-gray-300 focus:border-purple-400 rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setModalMarciaId(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button
                onClick={enviarParaMarcia}
                disabled={enviandoMarcia || !mensagemMarcia.trim()}
                className="flex-1 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
              >
                <Send size={14} />
                {enviandoMarcia ? 'Enviando...' : 'Enviar para Márcia'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL ATRASO
      ══════════════════════════════════════════ */}
      {modalAtrasoId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={18} className="text-red-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Marcar Em Atraso</h2>
                  <p className="text-xs text-gray-500">Informe a nova data e o motivo</p>
                </div>
              </div>
              <button onClick={() => setModalAtrasoId(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nova Data de Entrega Prevista <span className="text-red-500">*</span></label>
                <input type="date" value={novaDataEntrega} onChange={e => setNovaDataEntrega(e.target.value)} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Motivo do Atraso</label>
                <textarea value={motivoAtraso} onChange={e => setMotivoAtraso(e.target.value)} placeholder="Ex: aguardando tecido, problema no fornecedor..." rows={3} className="input-base resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalAtrasoId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={confirmarAtraso} disabled={salvandoAtraso || !novaDataEntrega} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold transition">
                {salvandoAtraso ? 'Salvando...' : 'Confirmar Atraso'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL DETALHES
      ══════════════════════════════════════════ */}
      {modalDetalhePedido && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Pedido {modalDetalhePedido.numeroPedido}</h2>
              <button onClick={() => setModalDetalhePedido(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Cliente</p>
                <p className="font-bold text-gray-900">{nomeCliente(modalDetalhePedido)}</p>
                {modalDetalhePedido.clienteType === 'empresa' && modalDetalhePedido.clienteEmpresa && (
                  <>
                    <p className="text-xs text-gray-500 mt-0.5">CNPJ: {modalDetalhePedido.clienteEmpresa.cnpj}</p>
                    <p className="text-xs text-gray-500">{modalDetalhePedido.clienteEmpresa.telefone} · {modalDetalhePedido.clienteEmpresa.email}</p>
                    <p className="text-xs text-gray-500">{modalDetalhePedido.clienteEmpresa.cidade}/{modalDetalhePedido.clienteEmpresa.estado}</p>
                  </>
                )}
                {modalDetalhePedido.clienteType === 'pessoa_fisica' && modalDetalhePedido.clientePF && (
                  <>
                    <p className="text-xs text-gray-500 mt-0.5">{modalDetalhePedido.clientePF.telefone} · {modalDetalhePedido.clientePF.email}</p>
                    <p className="text-xs text-gray-500">{modalDetalhePedido.clientePF.cidade}/{modalDetalhePedido.clientePF.estado}</p>
                  </>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Vendedor</p><p className="font-semibold text-gray-800">{modalDetalhePedido.nomeVendedor}</p></div>
                <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Nº Sistema</p><p className="font-semibold text-gray-800">{modalDetalhePedido.numeroPedidoSistema || '—'}</p></div>
                <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Data do Pedido</p><p className="font-semibold text-gray-800">{formatarData(modalDetalhePedido.dataPedido)}</p></div>
                <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Entrega Prevista</p><p className="font-semibold text-gray-800">{formatarData(modalDetalhePedido.dataEntregaPrevista)}</p></div>
                {modalDetalhePedido.statusProducao === 'em_atraso' && modalDetalhePedido.dataEntregaNovaProducao && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3 col-span-2">
                    <p className="text-xs text-red-400 mb-1">Nova Data de Entrega</p>
                    <p className="font-bold text-red-700">{formatarData(modalDetalhePedido.dataEntregaNovaProducao)}</p>
                    {modalDetalhePedido.motivoAtraso && <p className="text-xs text-red-600 mt-1"><strong>Motivo:</strong> {modalDetalhePedido.motivoAtraso}</p>}
                  </div>
                )}
              </div>
              {modalDetalhePedido.modelos && modalDetalhePedido.modelos.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Modelos</p>
                  <div className="flex flex-col gap-2">
                    {modalDetalhePedido.modelos.map((m, i) => (
                      <div key={m.id} className="bg-gray-50 rounded-xl p-3">
                        <p className="font-semibold text-gray-800 text-sm">Modelo {i + 1}: {m.modelo}</p>
                        <p className="text-xs text-gray-500">Cor: {m.cor} · {m.quantidadeTotal || m.pecas?.length || 0} peças</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {modalDetalhePedido.valorNegociacao !== undefined && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs text-blue-400 font-semibold uppercase tracking-wide mb-1">Negociação</p>
                  <p className="font-bold text-blue-800 text-sm">{modalDetalhePedido.valorNegociacao >= 0 ? '+ R$' : '- R$'} {Math.abs(modalDetalhePedido.valorNegociacao).toFixed(2)}</p>
                  {modalDetalhePedido.descricaoNegociacao && <p className="text-xs text-blue-600 mt-1">{modalDetalhePedido.descricaoNegociacao}</p>}
                </div>
              )}
              <a
                href={`${BASE_PEDIDOS}/pedido/${modalDetalhePedido.id}/`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition"
              >
                <ExternalLink size={14} />Abrir ficha completa do pedido
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
