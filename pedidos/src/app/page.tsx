'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { listarPedidos, atualizarPedido, deletarPedido, uploadArquivo, limparStatusProducao } from '@/lib/firebase'
import type { Pedido } from '@/types/pedido'
import { formatarData, gerarLinkCliente, gerarLinkArteFinalista, LOGO_URL } from '@/lib/utils'
import {
  PlusCircle, RefreshCw, ExternalLink, Printer, ChevronRight, ChevronLeft,
  Copy, Search, Trash2, Pencil, Bell, Upload, X, Package, Calendar, Wrench,
} from 'lucide-react'
import toast from 'react-hot-toast'

type KanbanStatus = 'dados' | 'tamanhos' | 'arquivos' | 'pagamento' | 'confirmacao' | 'formalizado' | 'retirada'

const COLS: {
  key: KanbanStatus
  label: string
  headerBg: string
  headerText: string
  dot: string
}[] = [
  { key: 'dados',       label: '1. Dados',        headerBg: 'bg-yellow-100',  headerText: 'text-yellow-800',  dot: 'bg-yellow-400'  },
  { key: 'tamanhos',    label: '2. Tamanhos',      headerBg: 'bg-blue-100',    headerText: 'text-blue-800',    dot: 'bg-blue-400'    },
  { key: 'arquivos',    label: '3. Arquivos',      headerBg: 'bg-purple-100',  headerText: 'text-purple-800',  dot: 'bg-purple-400'  },
  { key: 'pagamento',   label: '4. Pagamento',     headerBg: 'bg-teal-100',    headerText: 'text-teal-800',    dot: 'bg-teal-400'    },
  { key: 'confirmacao', label: '5. Confirmação',   headerBg: 'bg-orange-100',  headerText: 'text-orange-800',  dot: 'bg-orange-400'  },
  { key: 'formalizado', label: '✓ Formalizado',    headerBg: 'bg-emerald-100', headerText: 'text-emerald-800', dot: 'bg-emerald-500' },
  { key: 'retirada',    label: '📦 Retirada',       headerBg: 'bg-indigo-100',  headerText: 'text-indigo-800',  dot: 'bg-indigo-500'  },
]

const NEXT_STATUS: Partial<Record<KanbanStatus, KanbanStatus>> = {
  dados: 'tamanhos',
  tamanhos: 'arquivos',
  arquivos: 'pagamento',
  pagamento: 'confirmacao',
  formalizado: 'retirada',
}

const CACHE_KEY = 'pap-pedidos-cache'

function lerCache(): Pedido[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function salvarCache(dados: Pedido[]) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(dados)) } catch {}
}

export default function Dashboard() {
  const [pedidos, setPedidos] = useState<Pedido[]>(() => lerCache())
  const [loading, setLoading] = useState(() => lerCache().length === 0)
  const [busca, setBusca] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [avancandoId, setAvancandoId] = useState<string | null>(null)

  // Modal formalizar / editar nº sistema
  const [formalizandoId, setFormalizandoId] = useState<string | null>(null)
  const [formalizandoModo, setFormalizandoModo] = useState<'novo' | 'editar'>('novo')
  const [numSistema, setNumSistema] = useState('')
  const [salvando, setSalvando] = useState(false)

  // Modal alerta termos após formalização
  const [mostrarAlertaTermos, setMostrarAlertaTermos] = useState(false)

  // Modal excluir
  const [deletandoId, setDeletandoId] = useState<string | null>(null)
  const [confirmandoDelete, setConfirmandoDelete] = useState(false)

  // Modal retirada
  const [retiradaId, setRetiradaId] = useState<string | null>(null)
  const [retiradaObs, setRetiradaObs] = useState('')
  const [retiradaImagens, setRetiradaImagens] = useState<string[]>([])
  const [retiradaStatusPagamento, setRetiradaStatusPagamento] = useState<'pago' | 'falta_pagamento' | null>(null)
  const [uploadandoRetirada, setUploadandoRetirada] = useState(false)
  const [salvandoRetirada, setSalvandoRetirada] = useState(false)
  const retiradaFileRef = useRef<HTMLInputElement>(null)

  // Modal conserto
  const [consertoId, setConsertoId] = useState<string | null>(null)
  const [consertoDescricao, setConsertoDescricao] = useState('')
  const [consertoResponsavel, setConsertoResponsavel] = useState<'nos' | 'cliente'>('nos')
  const [consertoFoto, setConsertoFoto] = useState<string | null>(null)
  const [uploadandoConsertoFoto, setUploadandoConsertoFoto] = useState(false)
  const [salvandoConserto, setSalvandoConserto] = useState(false)
  const consertoFotoRef = useRef<HTMLInputElement>(null)

  // Notificações
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false)

  // ── Contador de formalização ──
  const alertaDisparadoRef = useRef(false)
  const hojeStr = new Date().toISOString().split('T')[0]
  const ACKS_KEY = `pap-atrasados-acks-${hojeStr}`

  // IDs de pedidos atrasados já confirmados hoje
  const [acksAtrasados, setAcksAtrasados] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const saved = JSON.parse(localStorage.getItem(ACKS_KEY) || '[]')
      return new Set(saved)
    } catch { return new Set() }
  })

  function confirmarAtrasado(id: string) {
    setAcksAtrasados(prev => {
      const next = new Set(prev)
      next.add(id)
      try { localStorage.setItem(ACKS_KEY, JSON.stringify(Array.from(next))) } catch {}
      return next
    })
  }

  function diasFormalizando(p: Pedido): number {
    if (!p.dataPedido) return 0
    const inicio = new Date(p.dataPedido)
    inicio.setHours(0, 0, 0, 0)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    return Math.floor((hoje.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
  }

  function tocarAlarme() {
    try {
      const ctx = new AudioContext()
      const tocar = (freq: number, inicio: number, dur: number) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        gain.gain.setValueAtTime(0, ctx.currentTime + inicio)
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + inicio + 0.01)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + inicio + dur)
        osc.start(ctx.currentTime + inicio)
        osc.stop(ctx.currentTime + inicio + dur + 0.05)
      }
      tocar(880,  0,    0.18)
      tocar(880,  0.25, 0.18)
      tocar(1046, 0.5,  0.35)
    } catch { /* browser bloqueou AudioContext */ }
  }

  // Dispara alarme UMA vez por sessão apenas para pedidos não confirmados
  useEffect(() => {
    if (alertaDisparadoRef.current || pedidos.length === 0) return
    const naoConfirmados = pedidos.filter(p =>
      p.status !== 'formalizado' &&
      p.status !== 'retirada' &&
      diasFormalizando(p) >= 4 &&
      !acksAtrasados.has(p.id)
    )
    if (naoConfirmados.length > 0) {
      alertaDisparadoRef.current = true
      tocarAlarme()
    }
  }, [pedidos])

  async function carregar(mostrarLoading = false) {
    if (mostrarLoading || pedidos.length === 0) setLoading(true)
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 12000)
      )
      const dados = await Promise.race([listarPedidos(), timeout])
      setPedidos(dados)
      salvarCache(dados)
    } catch {
      toast.error('Erro ao carregar pedidos. Verifique a conexão.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
    const iv = setInterval(() => carregar(), 60000)
    return () => clearInterval(iv)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const nomeCliente = (p: Pedido) =>
    p.clienteType === 'empresa'
      ? p.clienteEmpresa?.razaoSocial || '—'
      : p.clientePF?.nomeCompleto || '—'

  // Pedidos vencendo em 7 dias (ignora formalizado e retirada)
  const pedidosVencendo = pedidos.filter(p => {
    if (p.status === 'formalizado' || p.status === 'retirada') return false
    if (!p.dataEntregaPrevista) return false
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const em7dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000)
    const entrega = new Date(p.dataEntregaPrevista)
    return entrega <= em7dias
  })

  // Pedidos atrasados (4+ dias) não confirmados
  const atrasadosNaoConfirmados = pedidos.filter(p =>
    p.status !== 'formalizado' &&
    p.status !== 'retirada' &&
    diasFormalizando(p) >= 4 &&
    !acksAtrasados.has(p.id)
  )

  const totalNotificacoes = pedidosVencendo.length + atrasadosNaoConfirmados.length

  async function avancar(p: Pedido) {
    const next = NEXT_STATUS[p.status as KanbanStatus]
    if (!next) return
    setAvancandoId(p.id)
    try {
      await atualizarPedido(p.id, { status: next })
      setPedidos(prev => prev.map(x => x.id === p.id ? { ...x, status: next } : x))
      toast.success(`Movido para "${COLS.find(c => c.key === next)?.label}"`)
    } catch {
      toast.error('Erro ao avançar status')
    } finally {
      setAvancandoId(null)
    }
  }

  async function voltarConfirmacao(p: Pedido) {
    setAvancandoId(p.id)
    try {
      await atualizarPedido(p.id, { status: 'confirmacao', numeroPedidoSistema: undefined, statusProducao: undefined })
      setPedidos(prev => prev.map(x =>
        x.id === p.id ? { ...x, status: 'confirmacao', numeroPedidoSistema: undefined, statusProducao: undefined } : x
      ))
      toast.success('Pedido voltou para Confirmação')
    } catch {
      toast.error('Erro ao reverter status')
    } finally {
      setAvancandoId(null)
    }
  }

  function abrirFormalizar(p: Pedido) {
    setFormalizandoId(p.id)
    if (p.numeroPedidoSistema) {
      setFormalizandoModo('editar')
      setNumSistema(p.numeroPedidoSistema)
    } else {
      setFormalizandoModo('novo')
      setNumSistema('')
    }
  }

  async function confirmarFormalizacao() {
    if (!formalizandoId || !numSistema.trim()) return
    setSalvando(true)
    try {
      const num = numSistema.trim()
      const atualizacaoFormalizar = formalizandoModo === 'novo'
        ? { status: 'formalizado' as const, numeroPedidoSistema: num, statusProducao: 'em_producao' as const, dataEntradaProducao: new Date().toISOString() }
        : { status: 'formalizado' as const, numeroPedidoSistema: num }
      await atualizarPedido(formalizandoId, atualizacaoFormalizar)
      setPedidos(prev => prev.map(x =>
        x.id === formalizandoId ? { ...x, ...atualizacaoFormalizar } : x
      ))
      setFormalizandoId(null)
      setNumSistema('')
      if (formalizandoModo === 'novo') {
        setMostrarAlertaTermos(true)
        toast.success('Pedido formalizado!')
      } else {
        toast.success('Número atualizado!')
      }
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSalvando(false)
    }
  }

  async function confirmarDelete() {
    if (!deletandoId) return
    setConfirmandoDelete(true)
    try {
      await deletarPedido(deletandoId)
      setPedidos(prev => prev.filter(x => x.id !== deletandoId))
      toast.success('Pedido excluído.')
      setDeletandoId(null)
    } catch {
      toast.error('Erro ao excluir pedido')
    } finally {
      setConfirmandoDelete(false)
    }
  }

  function copiar(texto: string, label: string) {
    navigator.clipboard.writeText(texto)
    toast.success(`${label} copiado!`)
  }

  // ── Retirada ──
  function abrirRetirada(p: Pedido) {
    setRetiradaId(p.id)
    setRetiradaObs(p.observacaoRetirada || '')
    setRetiradaImagens(p.comprovanteRetirada || [])
    setRetiradaStatusPagamento(p.statusPagamentoFinal ?? null)
  }

  async function handleUploadRetirada(file: File) {
    if (!retiradaId) return
    setUploadandoRetirada(true)
    try {
      const url = await uploadArquivo(retiradaId, file, 'comprovante-retirada')
      setRetiradaImagens(prev => [...prev, url])
      toast.success('Comprovante adicionado!')
    } catch {
      toast.error('Erro ao fazer upload')
    } finally {
      setUploadandoRetirada(false)
    }
  }

  async function handlePasteRetirada(e: React.ClipboardEvent) {
    const items = Array.from(e.clipboardData.items)
    const imgItem = items.find(i => i.type.startsWith('image/'))
    if (imgItem) {
      const file = imgItem.getAsFile()
      if (file) await handleUploadRetirada(file)
    }
  }

  async function confirmarRetirada() {
    if (!retiradaId) return
    setSalvandoRetirada(true)
    try {
      const dataRetirada = pedidoRetirada?.dataRetirada || new Date().toISOString()
      const update: Partial<import('@/types/pedido').Pedido> = {
        dataRetirada,
        comprovanteRetirada: retiradaImagens,
        observacaoRetirada: retiradaObs,
      }
      if (retiradaStatusPagamento) update.statusPagamentoFinal = retiradaStatusPagamento
      await atualizarPedido(retiradaId, update)
      await limparStatusProducao(retiradaId)
      setPedidos(prev => prev.map(x =>
        x.id === retiradaId
          ? { ...x, ...update }
          : x
      ))
      toast.success('Retirada registrada! 📦')
      setRetiradaId(null)
    } catch {
      toast.error('Erro ao registrar retirada')
    } finally {
      setSalvandoRetirada(false)
    }
  }

  async function handleUploadConsertoFoto(file: File) {
    if (!consertoId) return
    setUploadandoConsertoFoto(true)
    try {
      const url = await uploadArquivo(consertoId, file, 'conserto')
      setConsertoFoto(url)
      toast.success('Foto adicionada!')
    } catch {
      toast.error('Erro ao fazer upload da foto')
    } finally {
      setUploadandoConsertoFoto(false)
    }
  }

  async function confirmarConserto() {
    if (!consertoId || !consertoDescricao.trim()) return
    setSalvandoConserto(true)
    try {
      const conserto = {
        descricao: consertoDescricao.trim(),
        responsavel: consertoResponsavel,
        foto: consertoFoto || undefined,
        dataEnvio: new Date().toISOString(),
      }
      await atualizarPedido(consertoId, { statusProducao: 'em_conserto', conserto })
      setPedidos(prev => prev.map(x => x.id === consertoId ? { ...x, statusProducao: 'em_conserto', conserto } : x))
      toast.success('Pedido enviado para conserto! 🔧')
      setConsertoId(null)
      setConsertoDescricao('')
      setConsertoResponsavel('nos')
      setConsertoFoto(null)
    } catch {
      toast.error('Erro ao enviar para conserto')
    } finally {
      setSalvandoConserto(false)
    }
  }

  const filtered = pedidos.filter(p => {
    if (busca) {
      const q = busca.toLowerCase()
      const match =
        nomeCliente(p).toLowerCase().includes(q) ||
        p.numeroPedido.toLowerCase().includes(q) ||
        p.nomeVendedor.toLowerCase().includes(q) ||
        (p.numeroPedidoSistema?.toLowerCase().includes(q) ?? false)
      if (!match) return false
    }
    if (dataInicio) {
      const inicio = new Date(dataInicio + 'T00:00:00')
      if (new Date(p.dataPedido) < inicio) return false
    }
    if (dataFim) {
      const fim = new Date(dataFim + 'T23:59:59')
      if (new Date(p.dataPedido) > fim) return false
    }
    return true
  })
  const filtroPeriodoAtivo = !!(dataInicio || dataFim)

  const pedidoParaDelete = pedidos.find(p => p.id === deletandoId)
  const pedidoRetirada = pedidos.find(p => p.id === retiradaId)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-shrink-0">
            <img src={LOGO_URL} alt="Passo a Passo Uniformes" className="h-9 w-auto" />
            <div>
              <h1 className="text-base font-bold text-gray-900">Passo a Passo Uniformes</h1>
              <p className="text-xs text-gray-500">Kanban de Pedidos</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            {/* Contadores por coluna */}
            <div className="hidden sm:flex items-center gap-1 mr-2">
              {COLS.map(col => {
                const count = pedidos.filter(p => p.status === col.key).length
                return count > 0 ? (
                  <span key={col.key} className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.headerBg} ${col.headerText}`}>
                    {count}
                  </span>
                ) : null
              })}
            </div>

            {/* Sino de notificações */}
            <div className="relative">
              <button
                onClick={() => setMostrarNotificacoes(v => !v)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition border ${
                  totalNotificacoes > 0
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                    : 'border-gray-300 text-gray-400 hover:bg-gray-50'
                }`}
                title="Notificações"
              >
                <Bell size={15} className={totalNotificacoes > 0 ? 'animate-pulse' : ''} />
                {totalNotificacoes > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                    {totalNotificacoes}
                  </span>
                )}
              </button>

              {mostrarNotificacoes && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
                    <span className="font-bold text-gray-700 text-sm">Notificações</span>
                    <button onClick={() => setMostrarNotificacoes(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={14} />
                    </button>
                  </div>

                  {/* Seção: Formalização atrasada */}
                  {atrasadosNaoConfirmados.length > 0 && (
                    <>
                      <div className="bg-orange-50 border-b border-orange-100 px-4 py-2">
                        <span className="font-bold text-orange-700 text-xs">⚠ Formalização Atrasada ({atrasadosNaoConfirmados.length})</span>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {atrasadosNaoConfirmados.map(p => (
                          <div
                            key={p.id}
                            className="flex items-start gap-3 px-4 py-3 border-b border-orange-50 bg-orange-50/40"
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 flex-col">
                              <span className="text-orange-600 font-bold text-xs leading-none">{diasFormalizando(p)}d</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-800 text-xs truncate">{nomeCliente(p)}</div>
                              <div className="text-gray-500 text-xs">{p.numeroPedido} · {p.nomeVendedor}</div>
                              <div className="text-orange-600 font-bold text-xs mt-0.5">
                                {diasFormalizando(p)} dias aguardando formalização
                              </div>
                            </div>
                            <button
                              onClick={() => confirmarAtrasado(p.id)}
                              className="flex-shrink-0 mt-1 px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition"
                              title="Marcar como visto"
                            >
                              ✓ Ciente
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Seção: Entrega próxima */}
                  <div className="bg-red-50 border-b border-red-100 px-4 py-2">
                    <span className="font-bold text-red-700 text-xs">⏰ Entrega em até 7 dias</span>
                  </div>
                  {pedidosVencendo.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-sm">Nenhum pedido vencendo em breve.</div>
                  ) : (
                    <div className="max-h-48 overflow-y-auto">
                      {pedidosVencendo.map(p => (
                        <a
                          key={p.id}
                          href={`/formalizarpedido/pedido/${p.id}/`}
                          onClick={() => setMostrarNotificacoes(false)}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bell size={13} className="text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-800 text-xs truncate">{nomeCliente(p)}</div>
                            <div className="text-gray-500 text-xs">{p.numeroPedido} · {p.nomeVendedor}</div>
                            <div className="text-red-600 font-bold text-xs mt-0.5">📅 {formatarData(p.dataEntregaPrevista)}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Filtro de período */}
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs ${filtroPeriodoAtivo ? 'border-orange-300 bg-orange-50' : 'border-gray-300 bg-white'}`}>
              <Calendar size={12} className={filtroPeriodoAtivo ? 'text-orange-500' : 'text-gray-400'} />
              <input
                type="date"
                value={dataInicio}
                onChange={e => setDataInicio(e.target.value)}
                className="bg-transparent text-gray-700 focus:outline-none w-[108px] text-xs"
                title="Data inicial"
              />
              <span className="text-gray-400">—</span>
              <input
                type="date"
                value={dataFim}
                onChange={e => setDataFim(e.target.value)}
                className="bg-transparent text-gray-700 focus:outline-none w-[108px] text-xs"
                title="Data final"
              />
              {filtroPeriodoAtivo && (
                <button
                  onClick={() => { setDataInicio(''); setDataFim('') }}
                  className="text-orange-400 hover:text-orange-600 ml-0.5"
                  title="Limpar filtro"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cliente, pedido ou Nº sistema..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-52"
              />
            </div>
            <button
              onClick={() => carregar(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Atualizar
            </button>
            <Link
              href="/novo-pedido"
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg font-semibold text-sm transition"
            >
              <PlusCircle size={15} />
              Novo Pedido
            </Link>
          </div>
        </div>
      </header>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto p-4" style={{ minHeight: 0 }}>
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            Carregando pedidos...
          </div>
        ) : (
          <div className="flex gap-3 h-full" style={{ minWidth: 'max-content' }}>
            {COLS.map(col => {
              const cardsBase = filtered.filter(p => p.status === col.key)
              const cards = col.key === 'formalizado'
                ? [...cardsBase].sort((a, b) => {
                    const peso = (p: Pedido) => p.statusProducao === 'pronto' ? 0 : p.statusProducao === 'em_atraso' ? 1 : 2
                    return peso(a) - peso(b)
                  })
                : cardsBase
              return (
                <div
                  key={col.key}
                  className="w-72 flex flex-col rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white"
                  style={{ minHeight: '300px', maxHeight: 'calc(100vh - 90px)' }}
                >
                  {/* Cabeçalho da coluna */}
                  <div className={`${col.headerBg} px-3 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-gray-200`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.dot} flex-shrink-0`} />
                      <span className={`font-bold text-sm ${col.headerText}`}>{col.label}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white bg-opacity-70 ${col.headerText}`}>
                      {cards.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2 bg-gray-50">
                    {cards.length === 0 ? (
                      <div className="text-center text-gray-300 text-xs py-10">Nenhum pedido</div>
                    ) : (
                      cards.map(p => {
                        const numModelos = p.modelos?.length ?? 0
                        const isEntregue = col.key === 'retirada' && !!p.dataRetirada && p.statusProducao !== 'em_conserto'
                        return (
                          <div
                            key={p.id}
                            className={`border rounded-lg p-3 shadow-sm hover:shadow transition ${
                              isEntregue
                                ? 'bg-blue-500 border-blue-400'
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            {/* Número + badges de status + lixeira */}
                            <div className="flex items-start justify-between mb-1.5 gap-1">
                              <span className={`font-mono font-bold text-xs ${isEntregue ? 'text-white' : 'text-gray-800'}`}>{p.numeroPedido}</span>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {/* Badge contador de dias para formalizar */}
                                {col.key !== 'formalizado' && col.key !== 'retirada' && (() => {
                                  const dias = diasFormalizando(p)
                                  const atrasado = dias >= 4
                                  return (
                                    <span
                                      title={`${dias} dia${dias !== 1 ? 's' : ''} aguardando formalização`}
                                      className={`flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded font-bold ${
                                        atrasado
                                          ? 'bg-red-500 text-white animate-pulse'
                                          : dias >= 2
                                          ? 'bg-orange-400 text-white'
                                          : 'bg-gray-200 text-gray-600'
                                      }`}
                                    >
                                      {atrasado && '⚠ '}{dias}d
                                    </span>
                                  )
                                })()}
                                {col.key === 'formalizado' && p.numeroPedidoSistema && (
                                  <span className="bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                                    #{p.numeroPedidoSistema}
                                  </span>
                                )}
                                {col.key === 'retirada' && p.statusProducao === 'em_conserto' && (
                                  <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                                    🔧 Em Conserto
                                  </span>
                                )}
                                {col.key === 'retirada' && p.dataRetirada && p.statusProducao !== 'em_conserto' && (
                                  <span className="bg-indigo-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                                    ✓ Retirado
                                  </span>
                                )}
                                <button
                                  onClick={() => setDeletandoId(p.id)}
                                  className={`transition p-0.5 rounded ${isEntregue ? 'text-white/60 hover:text-red-300' : 'text-gray-300 hover:text-red-500'}`}
                                  title="Excluir pedido"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>

                            {/* Cliente */}
                            <div className={`font-semibold text-xs mb-0.5 truncate ${isEntregue ? 'text-white' : 'text-gray-900'}`} title={nomeCliente(p)}>
                              {nomeCliente(p)}
                            </div>

                            {/* Vendedor + modelo */}
                            <div className={`text-xs mb-0.5 truncate ${isEntregue ? 'text-blue-100' : 'text-gray-500'}`}>
                              {p.nomeVendedor} · {numModelos > 0
                                ? `${numModelos} modelo${numModelos > 1 ? 's' : ''}`
                                : (p.modelo || '').replace(/_/g, ' ')}
                            </div>

                            {/* Peças + data */}
                            <div className="flex items-center justify-between text-xs mb-2.5">
                              <span className={isEntregue ? 'text-blue-100' : 'text-gray-600'}>
                                <b className={isEntregue ? 'text-white' : 'text-gray-800'}>{p.quantidadeTotal}</b> peças
                              </span>
                              <span className={`font-semibold ${isEntregue ? 'text-blue-100' : 'text-red-600'}`}>
                                {formatarData(p.dataEntregaPrevista)}
                              </span>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {numModelos > 1 && (
                                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${isEntregue ? 'bg-white/20 text-white border border-white/30' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                                  📋 {numModelos} modelos
                                </span>
                              )}
                              {(p.layoutImages?.length ?? 0) > 0 && (
                                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${isEntregue ? 'bg-white/20 text-white border border-white/30' : 'bg-purple-100 text-purple-700 border border-purple-200'}`}>
                                  🎨 Layout ({p.layoutImages!.length})
                                </span>
                              )}
                              {p.observacao && (
                                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${isEntregue ? 'bg-white/20 text-white border border-white/30' : 'bg-amber-100 text-amber-700 border border-amber-200'}`} title={p.observacao}>
                                  📋 Obs.
                                </span>
                              )}
                              {p.valorNegociacao ? (
                                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${isEntregue ? 'bg-white/20 text-white border border-white/30' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                                  💰 R$ {p.valorNegociacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              ) : null}
                              {col.key === 'retirada' && p.dataRetirada && (
                                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${isEntregue ? 'bg-white/20 text-white border border-white/30' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'}`}>
                                  📅 {new Date(p.dataRetirada).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                              {col.key === 'retirada' && p.statusPagamentoFinal === 'pago' && (
                                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${isEntregue ? 'bg-white/20 text-white border border-white/30' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                                  ✓ Pago
                                </span>
                              )}
                              {col.key === 'retirada' && p.statusPagamentoFinal === 'falta_pagamento' && (
                                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${isEntregue ? 'bg-white/20 text-white border border-white/30' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                  ⚠ Falta Pgto
                                </span>
                              )}
                            </div>

                            {/* Ações */}
                            <div className="flex flex-wrap gap-1">
                              <a
                                href={`/formalizarpedido/pedido/${p.id}/`}
                                className="flex items-center gap-0.5 text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 px-2 py-1 rounded font-semibold transition"
                              >
                                <ExternalLink size={10} /> Abrir
                              </a>

                              {col.key === 'confirmacao' && (
                                <>
                                  <a
                                    href={`/formalizarpedido/pedido-completo/${p.id}/`}
                                    className="flex items-center gap-0.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold transition"
                                  >
                                    <Printer size={10} /> Imprimir
                                  </a>
                                  <button
                                    onClick={() => abrirFormalizar(p)}
                                    className="flex items-center gap-0.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded font-bold transition ml-auto"
                                  >
                                    ✓ Formalizar
                                  </button>
                                </>
                              )}

                              {col.key === 'formalizado' && (
                                <>
                                  {/* Status de produção */}
                                  <div className={`w-full text-xs px-2 py-1.5 rounded-lg font-semibold flex items-center gap-1 ${
                                    p.statusProducao === 'pronto'
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : p.statusProducao === 'em_atraso'
                                      ? 'bg-red-100 text-red-700'
                                      : p.statusProducao === 'em_producao'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-gray-100 text-gray-500'
                                  }`}>
                                    {p.statusProducao === 'pronto'
                                      ? '✓ Pronto — liberado para retirada'
                                      : p.statusProducao === 'em_atraso'
                                      ? `⚠ Em Atraso${p.dataEntregaNovaProducao ? ` · Nova entrega: ${formatarData(p.dataEntregaNovaProducao)}` : ''}`
                                      : p.statusProducao === 'em_producao'
                                      ? '🔧 Em Produção'
                                      : '— Aguardando produção'}
                                  </div>
                                  <button
                                    onClick={() => abrirFormalizar(p)}
                                    className="flex items-center gap-0.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold transition"
                                    title="Editar número do sistema"
                                  >
                                    <Pencil size={10} /> Editar Nº
                                  </button>
                                  <button
                                    onClick={() => voltarConfirmacao(p)}
                                    disabled={avancandoId === p.id}
                                    className="flex items-center gap-0.5 text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 px-2 py-1 rounded font-semibold transition disabled:opacity-40"
                                    title="Voltar para Confirmação"
                                  >
                                    <ChevronLeft size={10} /> Confirmação
                                  </button>
                                  <button
                                    onClick={() => avancar(p)}
                                    disabled={avancandoId === p.id || p.statusProducao !== 'pronto'}
                                    className={`flex items-center gap-0.5 text-xs px-2 py-1 rounded font-bold transition ml-auto ${
                                      p.statusProducao === 'pronto'
                                        ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                    title={p.statusProducao !== 'pronto' ? 'Aguardando pedido ficar pronto na produção' : 'Mover para Retirada'}
                                  >
                                    {avancandoId === p.id ? '...' : <><Package size={10} /> Retirada</>}
                                  </button>
                                </>
                              )}

                              {col.key === 'retirada' && (
                                <div className="flex gap-1 ml-auto">
                                  <button
                                    onClick={() => abrirRetirada(p)}
                                    className={`flex items-center gap-0.5 text-xs px-2 py-1 rounded font-bold transition ${
                                      p.dataRetirada
                                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                                    }`}
                                  >
                                    <Package size={10} />
                                    {p.dataRetirada ? 'Ver / Editar' : 'Registrar Retirada'}
                                  </button>
                                  {p.dataRetirada && (
                                    <button
                                      onClick={() => { setConsertoId(p.id); setConsertoDescricao(p.conserto?.descricao || ''); setConsertoResponsavel(p.conserto?.responsavel || 'nos'); setConsertoFoto(p.conserto?.foto || null) }}
                                      className="flex items-center gap-0.5 text-xs px-2 py-1 rounded font-bold transition bg-orange-100 hover:bg-orange-200 text-orange-700"
                                    >
                                      <Wrench size={10} /> Conserto
                                    </button>
                                  )}
                                </div>
                              )}

                              {NEXT_STATUS[col.key] && col.key !== 'confirmacao' && col.key !== 'formalizado' && col.key !== 'retirada' && (
                                <button
                                  onClick={() => avancar(p)}
                                  disabled={avancandoId === p.id}
                                  className="flex items-center gap-0.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold transition disabled:opacity-40 ml-auto"
                                >
                                  {avancandoId === p.id ? '...' : <><ChevronRight size={10} /> Avançar</>}
                                </button>
                              )}
                            </div>

                            {/* Links de cópia */}
                            {col.key !== 'dados' && col.key !== 'formalizado' && col.key !== 'retirada' && (
                              <div className={`flex gap-3 mt-2 pt-1.5 border-t ${isEntregue ? 'border-white/20' : 'border-gray-100'}`}>
                                <button
                                  onClick={() => copiar(gerarLinkCliente(p.clienteToken), 'Link do cliente')}
                                  className="flex items-center gap-0.5 text-xs text-blue-500 hover:text-blue-700 transition"
                                >
                                  <Copy size={9} /> Tamanhos
                                </button>
                                <button
                                  onClick={() => copiar(gerarLinkArteFinalista(p.id), 'Link arte-finalista')}
                                  className="flex items-center gap-0.5 text-xs text-purple-500 hover:text-purple-700 transition"
                                >
                                  <Copy size={9} /> Arte
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Modal formalizar / editar nº sistema ── */}
      {formalizandoId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${formalizandoModo === 'editar' ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                {formalizandoModo === 'editar'
                  ? <Pencil size={18} className="text-blue-600" />
                  : <span className="text-emerald-600 text-lg font-bold">✓</span>
                }
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {formalizandoModo === 'editar' ? 'Editar Nº do Sistema' : 'Formalizar Pedido'}
                </h2>
                <p className="text-xs text-gray-500">
                  {formalizandoModo === 'editar' ? 'Atualize o número do pedido no sistema interno' : 'Informe o número gerado no sistema interno'}
                </p>
              </div>
            </div>

            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Nº do Pedido no Sistema
            </label>
            <input
              type="text"
              value={numSistema}
              onChange={e => setNumSistema(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirmarFormalizacao()}
              placeholder="Ex: 12345"
              className="w-full border-2 border-gray-300 focus:border-emerald-400 rounded-lg px-3 py-2.5 text-lg font-bold text-center focus:outline-none mb-4"
              autoFocus
            />

            <div className="flex gap-2">
              <button
                onClick={() => { setFormalizandoId(null); setNumSistema('') }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarFormalizacao}
                disabled={!numSistema.trim() || salvando}
                className={`flex-1 px-4 py-2 text-white rounded-lg text-sm font-bold transition disabled:opacity-40 ${formalizandoModo === 'editar' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
              >
                {salvando ? 'Salvando...' : formalizandoModo === 'editar' ? 'Salvar' : '✓ Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal alerta: enviar termos ao cliente ── */}
      {mostrarAlertaTermos && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📄</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Enviar Termos ao Cliente</h2>
            <p className="text-sm text-gray-600 mb-2">
              Não se esqueça de <strong>enviar os Termos de Serviço</strong> para o cliente!
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Confirme que os termos foram enviados para prosseguir.
            </p>
            <button
              onClick={() => setMostrarAlertaTermos(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-base transition"
            >
              ✓ OK, já enviei os termos
            </button>
          </div>
        </div>
      )}

      {/* ── Modal Retirada ── */}
      {retiradaId && pedidoRetirada && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md my-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package size={18} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900">Registrar Retirada</h2>
                <p className="text-xs text-gray-500">{pedidoRetirada.numeroPedido} · {nomeCliente(pedidoRetirada)}</p>
              </div>
              <button onClick={() => setRetiradaId(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {/* Resumo completo do pedido */}
            <div className="bg-indigo-50 rounded-xl p-3 mb-4 text-xs space-y-1.5">
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-1">Resumo do Pedido</p>
              <div className="flex justify-between">
                <span className="text-gray-500">Vendedor</span>
                <span className="font-semibold">{pedidoRetirada.nomeVendedor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Entrega prevista</span>
                <span className="font-semibold">{formatarData(pedidoRetirada.dataEntregaPrevista)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Quantidade</span>
                <span className="font-semibold">{pedidoRetirada.quantidadeTotal} peças</span>
              </div>
              {(pedidoRetirada.modelos?.length ?? 0) > 1 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Modelos</span>
                  <span className="font-semibold">{pedidoRetirada.modelos!.map(m => m.modelo).join(', ')}</span>
                </div>
              )}
              {pedidoRetirada.valorNegociacao ? (
                <div className="flex justify-between">
                  <span className="text-gray-500">Valor negociado</span>
                  <span className="font-bold text-green-700">{pedidoRetirada.valorNegociacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              ) : null}
              {pedidoRetirada.numeroPedidoSistema && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Nº sistema</span>
                  <span className="font-semibold">#{pedidoRetirada.numeroPedidoSistema}</span>
                </div>
              )}
              {pedidoRetirada.dataRetirada && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Retirada em</span>
                  <span className="font-bold text-indigo-700">{new Date(pedidoRetirada.dataRetirada).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>

            {/* Situação do pagamento (recibos do pedido) */}
            {(pedidoRetirada.recibosPagamento?.length || pedidoRetirada.descricaoPagamento) ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-xs space-y-2">
                <p className="text-xs font-bold text-green-700 uppercase tracking-wide">Pagamento Registrado</p>
                {pedidoRetirada.descricaoPagamento && (
                  <p className="text-gray-700 whitespace-pre-wrap">{pedidoRetirada.descricaoPagamento}</p>
                )}
                {(pedidoRetirada.recibosPagamento?.length ?? 0) > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {pedidoRetirada.recibosPagamento!.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" title={`Ver recibo ${i + 1}`}>
                        <img src={url} alt={`Recibo ${i + 1}`} className="w-14 h-14 object-cover rounded-lg border-2 border-green-300 hover:border-green-500 transition cursor-pointer" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-700 font-semibold">
                ⚠ Nenhum recibo de pagamento registrado no pedido
              </div>
            )}

            {/* Upload comprovante de retirada */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Comprovante da Retirada
              </label>
              <div
                className="border-2 border-dashed border-indigo-200 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-400 transition bg-indigo-50"
                onPaste={handlePasteRetirada}
                onClick={() => retiradaFileRef.current?.click()}
              >
                <Upload size={20} className="mx-auto text-indigo-400 mb-1.5" />
                <p className="text-xs text-gray-500">
                  {uploadandoRetirada ? 'Enviando...' : 'Clique para selecionar ou cole (Ctrl+V) uma imagem'}
                </p>
              </div>
              <input
                ref={retiradaFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleUploadRetirada(file)
                  e.target.value = ''
                }}
              />
              {retiradaImagens.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {retiradaImagens.map((url, i) => (
                    <div key={i} className="relative group">
                      <a href={url} target="_blank" rel="noopener noreferrer" title="Ver em nova guia">
                        <img src={url} alt={`Comprovante ${i + 1}`} className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:border-indigo-400 transition cursor-pointer" />
                      </a>
                      <button
                        onClick={() => setRetiradaImagens(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs leading-none hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Observação da retirada */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Observação da Retirada
              </label>
              <textarea
                className="w-full border border-gray-300 focus:border-indigo-400 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none"
                rows={2}
                value={retiradaObs}
                onChange={e => setRetiradaObs(e.target.value)}
                placeholder="Ex: Pagou saldo em dinheiro, retirou pessoalmente..."
              />
            </div>

            {/* Status de pagamento final */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Situação do Pagamento
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRetiradaStatusPagamento(retiradaStatusPagamento === 'pago' ? null : 'pago')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition ${
                    retiradaStatusPagamento === 'pago'
                      ? 'bg-green-500 text-white border-green-500'
                      : 'border-gray-300 text-gray-600 bg-white hover:border-green-400'
                  }`}
                >
                  ✓ Pago
                </button>
                <button
                  type="button"
                  onClick={() => setRetiradaStatusPagamento(retiradaStatusPagamento === 'falta_pagamento' ? null : 'falta_pagamento')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition ${
                    retiradaStatusPagamento === 'falta_pagamento'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-gray-300 text-gray-600 bg-white hover:border-red-400'
                  }`}
                >
                  ⚠ Falta Pagamento
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRetiradaId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarRetirada}
                disabled={salvandoRetirada}
                className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold transition disabled:opacity-40"
              >
                {salvandoRetirada ? 'Salvando...' : '📦 Confirmar Retirada'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Conserto ── */}
      {consertoId && (() => {
        const p = pedidos.find(x => x.id === consertoId)
        return (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md my-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Wrench size={18} className="text-orange-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Enviar para Conserto</h2>
                  <p className="text-xs text-gray-500">{p?.numeroPedido} · {p ? (p.clientePF?.nomeCompleto || p.clienteEmpresa?.razaoSocial || '—') : ''}</p>
                </div>
                <button onClick={() => setConsertoId(null)} className="ml-auto text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>

              {/* Descrição */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  O que precisa ser consertado? <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border border-gray-300 focus:border-orange-400 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none"
                  rows={3}
                  value={consertoDescricao}
                  onChange={e => setConsertoDescricao(e.target.value)}
                  placeholder="Descreva o problema e o que precisa ser feito..."
                />
              </div>

              {/* Responsável */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Responsável pelo erro
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConsertoResponsavel('nos')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition ${
                      consertoResponsavel === 'nos'
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'border-gray-300 text-gray-600 bg-white hover:border-orange-400'
                    }`}
                  >
                    Nosso erro
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsertoResponsavel('cliente')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition ${
                      consertoResponsavel === 'cliente'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 text-gray-600 bg-white hover:border-blue-400'
                    }`}
                  >
                    Erro do cliente
                  </button>
                </div>
              </div>

              {/* Foto (opcional) */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Foto do erro <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                {consertoFoto ? (
                  <div className="relative inline-block">
                    <a href={consertoFoto} target="_blank" rel="noopener noreferrer">
                      <img src={consertoFoto} alt="Foto do erro" className="w-28 h-28 object-cover rounded-xl border border-gray-200 hover:opacity-80 transition cursor-pointer" />
                    </a>
                    <button
                      onClick={() => setConsertoFoto(null)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >×</button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-orange-200 rounded-xl p-4 text-center cursor-pointer hover:border-orange-400 transition bg-orange-50"
                    onClick={() => consertoFotoRef.current?.click()}
                  >
                    {uploadandoConsertoFoto ? (
                      <p className="text-xs text-orange-500 font-medium">Enviando...</p>
                    ) : (
                      <>
                        <Upload size={20} className="mx-auto text-orange-400 mb-1.5" />
                        <p className="text-xs text-gray-500">Clique para adicionar foto</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={consertoFotoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async e => {
                    const file = e.target.files?.[0]
                    if (file) await handleUploadConsertoFoto(file)
                    e.target.value = ''
                  }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setConsertoId(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarConserto}
                  disabled={salvandoConserto || !consertoDescricao.trim()}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition disabled:opacity-40"
                >
                  {salvandoConserto ? 'Enviando...' : '🔧 Enviar para Conserto'}
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Modal confirmar exclusão ── */}
      {deletandoId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Excluir Pedido</h2>
                <p className="text-xs text-gray-500">Esta ação é irreversível</p>
              </div>
            </div>

            {pedidoParaDelete && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                <div className="font-bold text-gray-800">{pedidoParaDelete.numeroPedido}</div>
                <div className="text-gray-600 text-xs mt-0.5">{nomeCliente(pedidoParaDelete)}</div>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-4">
              Tem certeza que deseja excluir este pedido? Todos os dados serão perdidos permanentemente.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setDeletandoId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDelete}
                disabled={confirmandoDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition disabled:opacity-40"
              >
                {confirmandoDelete ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
