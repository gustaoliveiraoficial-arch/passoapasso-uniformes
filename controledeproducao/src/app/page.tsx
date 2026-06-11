'use client'

import { useEffect, useState } from 'react'
import {
  listarPedidosProducao,
  moverParaAtraso,
  moverParaPronto,
  moverParaEmProducao,
} from '@/lib/firebase'
import type { Pedido, StatusProducao } from '@/types/pedido'
import { RefreshCw, Package, Clock, CheckCircle, AlertTriangle, ChevronLeft, X, ExternalLink, Search } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const BASE_PEDIDOS = process.env.NEXT_PUBLIC_BASE_PEDIDOS_URL || 'https://passoapassouniformes.com/formalizarpedido'

type Col = { key: StatusProducao; label: string; headerBg: string; headerText: string; dot: string; icon: React.ReactNode }

const COLS: Col[] = [
  {
    key: 'em_producao',
    label: 'Em Produção',
    headerBg: 'bg-blue-100',
    headerText: 'text-blue-800',
    dot: 'bg-blue-500',
    icon: <Package size={15} />,
  },
  {
    key: 'em_atraso',
    label: 'Em Atraso',
    headerBg: 'bg-red-100',
    headerText: 'text-red-800',
    dot: 'bg-red-500',
    icon: <AlertTriangle size={15} />,
  },
  {
    key: 'pronto',
    label: 'Pedido Pronto',
    headerBg: 'bg-emerald-100',
    headerText: 'text-emerald-800',
    dot: 'bg-emerald-500',
    icon: <CheckCircle size={15} />,
  },
]

export default function ControleProducao() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [movendo, setMovendo] = useState<string | null>(null)

  // Modal atraso
  const [modalAtrasoId, setModalAtrasoId] = useState<string | null>(null)
  const [novaDataEntrega, setNovaDataEntrega] = useState('')
  const [motivoAtraso, setMotivoAtraso] = useState('')
  const [salvandoAtraso, setSalvandoAtraso] = useState(false)

  // Modal detalhe do pedido
  const [modalDetalhePedido, setModalDetalhePedido] = useState<Pedido | null>(null)

  // Busca
  const [busca, setBusca] = useState('')

  async function carregar() {
    setLoading(true)
    try {
      setPedidos(await listarPedidosProducao())
    } catch {
      toast.error('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  function nomeCliente(p: Pedido) {
    return p.clienteType === 'empresa'
      ? p.clienteEmpresa?.razaoSocial || '—'
      : p.clientePF?.nomeCompleto || '—'
  }

  function totalPecas(p: Pedido): number {
    if (p.modelos && p.modelos.length > 0) {
      return p.modelos.reduce((s, m) => s + (m.quantidadeTotal || m.pecas?.length || 0), 0)
    }
    return p.quantidadeTotal || p.pecas?.length || 0
  }

  function diasEmProducao(p: Pedido): number {
    const ref = p.dataEntradaProducao || p.createdAt
    const inicio = new Date(ref)
    inicio.setHours(0, 0, 0, 0)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    return Math.max(0, Math.floor((hoje.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)))
  }

  function formatarData(iso?: string) {
    if (!iso) return '—'
    const [y, m, d] = iso.split('-')
    return `${d}/${m}/${y}`
  }

  // Dias restantes até a entrega (negativo = atrasado)
  function diasParaEntrega(p: Pedido): number {
    const dataRef = (p.statusProducao === 'em_atraso' && p.dataEntregaNovaProducao)
      ? p.dataEntregaNovaProducao
      : p.dataEntregaPrevista
    if (!dataRef) return 999
    const entrega = new Date(dataRef)
    entrega.setHours(0, 0, 0, 0)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    return Math.floor((entrega.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
  }

  function filtrarPedidos(lista: Pedido[]): Pedido[] {
    if (!busca.trim()) return lista
    const q = busca.toLowerCase()
    return lista.filter(p =>
      nomeCliente(p).toLowerCase().includes(q) ||
      (p.numeroPedido || '').toLowerCase().includes(q) ||
      (p.numeroPedidoSistema || '').toLowerCase().includes(q)
    )
  }

  // Ordena: mais próximo de vencer (ou mais atrasado) primeiro
  function ordenarPorEntrega(lista: Pedido[]): Pedido[] {
    return [...lista].sort((a, b) => diasParaEntrega(a) - diasParaEntrega(b))
  }

  async function moverProEmProducao(p: Pedido) {
    setMovendo(p.id)
    try {
      await moverParaEmProducao(p.id)
      setPedidos(prev => prev.map(x =>
        x.id === p.id ? { ...x, statusProducao: 'em_producao', dataEntregaNovaProducao: undefined, motivoAtraso: undefined } : x
      ))
      toast.success('Movido para Em Produção')
    } catch {
      toast.error('Erro ao mover')
    } finally {
      setMovendo(null)
    }
  }

  async function abrirModalAtraso(id: string) {
    const p = pedidos.find(x => x.id === id)
    setNovaDataEntrega(p?.dataEntregaNovaProducao || p?.dataEntregaPrevista || '')
    setMotivoAtraso(p?.motivoAtraso || '')
    setModalAtrasoId(id)
  }

  async function confirmarAtraso() {
    if (!modalAtrasoId || !novaDataEntrega.trim()) {
      toast.error('Informe a nova data de entrega')
      return
    }
    setSalvandoAtraso(true)
    try {
      await moverParaAtraso(modalAtrasoId, novaDataEntrega, motivoAtraso)
      setPedidos(prev => prev.map(x =>
        x.id === modalAtrasoId
          ? { ...x, statusProducao: 'em_atraso', dataEntregaNovaProducao: novaDataEntrega, motivoAtraso }
          : x
      ))
      setModalAtrasoId(null)
      toast.success('Pedido marcado como Em Atraso')
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSalvandoAtraso(false)
    }
  }

  async function moverProPronto(p: Pedido) {
    setMovendo(p.id)
    try {
      await moverParaPronto(p.id)
      setPedidos(prev => prev.map(x =>
        x.id === p.id ? { ...x, statusProducao: 'pronto' } : x
      ))
      toast.success('Pedido marcado como Pronto!')
    } catch {
      toast.error('Erro ao mover')
    } finally {
      setMovendo(null)
    }
  }

  const cols = COLS.map(col => ({
    ...col,
    cards: ordenarPorEntrega(filtrarPedidos(pedidos.filter(p => p.statusProducao === col.key))),
    total: pedidos.filter(p => p.statusProducao === col.key).length,
  }))

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-shrink-0">
            <img src="/controledeproducao/logo-pap.png" alt="Passo a Passo" className="h-9 w-auto" />
            <div>
              <h1 className="text-base font-bold text-gray-900">Passo a Passo Uniformes</h1>
              <p className="text-xs text-gray-500">Controle de Produção</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Campo de busca */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar pedido, cliente ou nº sistema..."
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-64 bg-white"
              />
              {busca && (
                <button onClick={() => setBusca('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                {cols[0].total} em produção
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                {cols[1].total} em atraso
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                {cols[2].total} prontos
              </span>
            </div>
            <a
              href={BASE_PEDIDOS + '/'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition"
            >
              <ExternalLink size={12} />
              Formalização
            </a>
            <button
              onClick={carregar}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Atualizar
            </button>
          </div>
        </div>
      </header>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            Carregando pedidos...
          </div>
        ) : (
          <div className="flex gap-4 items-start min-w-[900px]">
            {cols.map((col) => (
              <div key={col.key} className="flex-1 min-w-[280px] flex flex-col gap-2">
                {/* Header coluna */}
                <div className={`${col.headerBg} rounded-xl px-4 py-3 flex items-center justify-between`}>
                  <div className={`flex items-center gap-2 font-bold text-sm ${col.headerText}`}>
                    {col.icon}
                    {col.label}
                  </div>
                  <span className={`${col.headerBg} border ${col.key === 'em_producao' ? 'border-blue-300' : col.key === 'em_atraso' ? 'border-red-300' : 'border-emerald-300'} text-xs font-bold px-2 py-0.5 rounded-full ${col.headerText}`}>
                    {busca ? `${col.cards.length}/${col.total}` : col.total}
                  </span>
                </div>

                {/* Cards */}
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
                    const dataExibir = col.key === 'em_atraso' && p.dataEntregaNovaProducao
                      ? p.dataEntregaNovaProducao
                      : p.dataEntregaPrevista
                    const diasRestantes = diasParaEntrega(p)
                    const entregaAtrasada = diasRestantes < 0
                    const entregaHoje = diasRestantes === 0
                    const entregaUrgente = diasRestantes > 0 && diasRestantes <= 3

                    return (
                      <div
                        key={p.id}
                        className={`bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-3 relative transition hover:shadow-md
                          ${col.key === 'em_atraso' ? 'border-red-200 bg-red-50/20' : ''}
                          ${col.key === 'pronto' ? 'border-emerald-200' : ''}`}
                      >
                        {/* Badge dias */}
                        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full
                          ${atrasado
                            ? 'bg-red-500 text-white animate-pulse'
                            : dias >= 3
                            ? 'bg-orange-400 text-white'
                            : 'bg-gray-100 text-gray-500'
                          }`}>
                          {atrasado && '⚠ '}{dias}d
                        </span>

                        {/* Cliente + número */}
                        <div>
                          <div className="font-bold text-gray-900 text-sm pr-12 leading-tight">
                            {nomeCliente(p)}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            Nº {p.numeroPedido}
                            {p.numeroPedidoSistema && (
                              <span className="ml-1 text-blue-600 font-semibold">· Sis: {p.numeroPedidoSistema}</span>
                            )}
                          </div>
                        </div>

                        {/* Infos */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-600">
                          <div>
                            <span className="text-gray-400">Vendedor:</span>{' '}
                            <span className="font-medium">{p.nomeVendedor}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Qtd:</span>{' '}
                            <span className="font-bold text-gray-800">{total} pç</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Pedido em:</span>{' '}
                            <span className="font-medium">{formatarData(p.dataPedido)}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">{col.key === 'em_atraso' ? 'Nova entrega:' : 'Entrega:'}</span>{' '}
                            <span className={`font-bold ${col.key === 'em_atraso' || entregaAtrasada ? 'text-red-600' : entregaUrgente ? 'text-orange-600' : 'text-gray-800'}`}>
                              {formatarData(dataExibir)}
                            </span>
                            <div className={`text-xs font-semibold mt-0.5 ${
                              entregaAtrasada ? 'text-red-600' :
                              entregaHoje ? 'text-orange-600' :
                              entregaUrgente ? 'text-orange-500' :
                              'text-gray-400'
                            }`}>
                              {entregaAtrasada
                                ? `⚠ ${Math.abs(diasRestantes)}d atrasado`
                                : entregaHoje
                                ? '🔴 Entrega hoje!'
                                : diasRestantes === 999
                                ? '—'
                                : `${diasRestantes}d para entregar`}
                            </div>
                          </div>
                        </div>

                        {/* Motivo atraso */}
                        {col.key === 'em_atraso' && p.motivoAtraso && (
                          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-700">
                            <span className="font-semibold">Motivo: </span>{p.motivoAtraso}
                          </div>
                        )}

                        {/* Ver pedido */}
                        <button
                          onClick={() => setModalDetalhePedido(p)}
                          className="text-xs text-blue-500 hover:text-blue-700 text-left -mt-1 underline underline-offset-2"
                        >
                          Ver detalhes
                        </button>

                        {/* Ações */}
                        <div className="flex flex-col gap-2 pt-1 border-t border-gray-100">
                          {col.key === 'em_producao' && (
                            <>
                              <button
                                onClick={() => abrirModalAtraso(p.id)}
                                disabled={movendo === p.id}
                                className="w-full py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition"
                              >
                                <AlertTriangle size={11} className="inline mr-1" />
                                Marcar Em Atraso
                              </button>
                              <button
                                onClick={() => moverProPronto(p)}
                                disabled={movendo === p.id}
                                className="w-full py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition"
                              >
                                <CheckCircle size={11} className="inline mr-1" />
                                Marcar Pronto
                              </button>
                            </>
                          )}

                          {col.key === 'em_atraso' && (
                            <>
                              <button
                                onClick={() => moverProEmProducao(p)}
                                disabled={movendo === p.id}
                                className="w-full py-1.5 rounded-lg text-xs font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                              >
                                <ChevronLeft size={11} className="inline mr-1" />
                                Voltar p/ Em Produção
                              </button>
                              <button
                                onClick={() => abrirModalAtraso(p.id)}
                                disabled={movendo === p.id}
                                className="w-full py-1.5 rounded-lg text-xs font-semibold border border-orange-200 text-orange-600 hover:bg-orange-50 transition"
                              >
                                <Clock size={11} className="inline mr-1" />
                                Editar Atraso
                              </button>
                              <button
                                onClick={() => moverProPronto(p)}
                                disabled={movendo === p.id}
                                className="w-full py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition"
                              >
                                <CheckCircle size={11} className="inline mr-1" />
                                Marcar Pronto
                              </button>
                            </>
                          )}

                          {col.key === 'pronto' && (
                            <button
                              onClick={() => moverProEmProducao(p)}
                              disabled={movendo === p.id}
                              className="w-full py-1.5 rounded-lg text-xs font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                            >
                              <ChevronLeft size={11} className="inline mr-1" />
                              Voltar p/ Em Produção
                            </button>
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

      {/* Modal: Marcar Em Atraso */}
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
              <button onClick={() => setModalAtrasoId(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nova Data de Entrega Prevista <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={novaDataEntrega}
                  onChange={e => setNovaDataEntrega(e.target.value)}
                  className="input-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Motivo do Atraso
                </label>
                <textarea
                  value={motivoAtraso}
                  onChange={e => setMotivoAtraso(e.target.value)}
                  placeholder="Ex: aguardando tecido, problema no fornecedor..."
                  rows={3}
                  className="input-base resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalAtrasoId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAtraso}
                disabled={salvandoAtraso || !novaDataEntrega}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold transition"
              >
                {salvandoAtraso ? 'Salvando...' : 'Confirmar Atraso'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detalhes do pedido */}
      {modalDetalhePedido && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Pedido {modalDetalhePedido.numeroPedido}</h2>
              <button onClick={() => setModalDetalhePedido(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Cliente */}
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

              {/* Infos do pedido */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Vendedor</p>
                  <p className="font-semibold text-gray-800">{modalDetalhePedido.nomeVendedor}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Nº Sistema</p>
                  <p className="font-semibold text-gray-800">{modalDetalhePedido.numeroPedidoSistema || '—'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Data do Pedido</p>
                  <p className="font-semibold text-gray-800">{formatarData(modalDetalhePedido.dataPedido)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Entrega Prevista</p>
                  <p className="font-semibold text-gray-800">{formatarData(modalDetalhePedido.dataEntregaPrevista)}</p>
                </div>
                {modalDetalhePedido.statusProducao === 'em_atraso' && modalDetalhePedido.dataEntregaNovaProducao && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3 col-span-2">
                    <p className="text-xs text-red-400 mb-1">Nova Data de Entrega</p>
                    <p className="font-bold text-red-700">{formatarData(modalDetalhePedido.dataEntregaNovaProducao)}</p>
                    {modalDetalhePedido.motivoAtraso && (
                      <p className="text-xs text-red-600 mt-1"><strong>Motivo:</strong> {modalDetalhePedido.motivoAtraso}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Modelos */}
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

              {/* Negociação */}
              {modalDetalhePedido.valorNegociacao !== undefined && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs text-blue-400 font-semibold uppercase tracking-wide mb-1">Negociação</p>
                  <p className="font-bold text-blue-800 text-sm">
                    {modalDetalhePedido.valorNegociacao >= 0 ? '+ R$' : '- R$'} {Math.abs(modalDetalhePedido.valorNegociacao).toFixed(2)}
                  </p>
                  {modalDetalhePedido.descricaoNegociacao && (
                    <p className="text-xs text-blue-600 mt-1">{modalDetalhePedido.descricaoNegociacao}</p>
                  )}
                </div>
              )}

              {/* Link para o pedido */}
              <a
                href={`${BASE_PEDIDOS}/pedido/${modalDetalhePedido.id}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition"
              >
                <ExternalLink size={14} />
                Abrir ficha completa do pedido
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
