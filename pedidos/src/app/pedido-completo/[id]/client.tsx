'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { buscarPedido, atualizarPedido } from '@/lib/firebase'
import type { Pedido, CategoriaSize, ModeloPedido } from '@/types/pedido'
import { TIPOS_ESTAMPA, TIPOS_ESTAMPA_QUADRO } from '@/types/pedido'
import { CATALOGO, COR_HEX } from '@/lib/catalog'
import { formatarData, formatarMoeda, LOGO_URL } from '@/lib/utils'
import { ArrowLeft, Printer, CheckCircle, Trash2 } from 'lucide-react'

const CATEGORIA_LABEL_UP: Record<CategoriaSize, string> = {
  unissex: 'UNISSEX',
  babylook: 'BABY LOOK',
  feminino: 'FEMININO',
  masculino: 'MASCULINO',
  infantil: 'INFANTIL',
}
const CATEGORIA_LABEL: Record<string, string> = {
  unissex: 'Unissex',
  babylook: 'Babylook',
  infantil: 'Infantil',
}

export default function PedidoCompletoPage() {
  const { id: _paramId } = useParams<{ id: string }>()
  const id = typeof window !== 'undefined'
    ? (window.location.pathname.split('/').filter(Boolean).pop() ?? _paramId)
    : _paramId
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModalFormalizar, setShowModalFormalizar] = useState(false)
  const [numSistema, setNumSistema] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [showModalExcluirNum, setShowModalExcluirNum] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [observacao, setObservacao] = useState('')
  const [showObservacao, setShowObservacao] = useState(false)
  const [editandoObs, setEditandoObs] = useState(false)
  const [salvandoObs, setSalvandoObs] = useState(false)
  const [showRefs, setShowRefs] = useState(false)

  useEffect(() => {
    buscarPedido(id).then(p => {
      setPedido(p)
      setLoading(false)
      if (p?.observacao) {
        setObservacao(p.observacao)
        setShowObservacao(true)
      }
    })
  }, [id])

  // Auto-escala cada folha de produção para caber em 210mm sem overflow
  useEffect(() => {
    if (!pedido) return
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>('.print-sheet-content').forEach(inner => {
        const outer = inner.closest<HTMLElement>('.print-sheet-1')
        const wrapper = inner.closest<HTMLElement>('.no-zoom-print')
        if (!outer || !wrapper) return
        // Reset antes de medir
        inner.style.zoom = ''
        inner.style.width = ''
        inner.style.height = ''
        // Mede com zoom:1 no wrapper para ter dimensões reais de impressão
        const prevZoom = wrapper.style.zoom
        wrapper.style.zoom = '1'
        void outer.offsetHeight // forçar reflow
        const outerH = outer.clientHeight
        const innerH = inner.scrollHeight
        wrapper.style.zoom = prevZoom
        // Aplica zoom se o conteúdo ultrapassar a altura disponível
        if (innerH > outerH + 2 && outerH > 0) {
          const z = outerH / innerH
          inner.style.zoom = String(z)
          inner.style.width = `${100 / z}%`
          inner.style.height = `${100 / z}%`
        }
      })
    })
    return () => cancelAnimationFrame(raf)
  }, [pedido, showRefs, showObservacao])

  async function confirmarFormalizacao() {
    if (!pedido || !numSistema.trim()) return
    setSalvando(true)
    try {
      const num = numSistema.trim()
      await atualizarPedido(pedido.id, { status: 'formalizado', numeroPedidoSistema: num })
      setPedido(prev => prev ? { ...prev, status: 'formalizado', numeroPedidoSistema: num } : prev)
      setShowModalFormalizar(false)
      setNumSistema('')
    } catch {
      // silently ignore
    } finally {
      setSalvando(false)
    }
  }

  async function salvarObservacao() {
    if (!pedido) return
    setSalvandoObs(true)
    try {
      await atualizarPedido(pedido.id, { observacao })
    } finally {
      setSalvandoObs(false)
      setEditandoObs(false)
    }
  }

  async function excluirNumeroDeSistema() {
    if (!pedido) return
    setExcluindo(true)
    try {
      await atualizarPedido(pedido.id, { status: 'confirmacao', numeroPedidoSistema: '' })
      setPedido(prev => prev ? { ...prev, status: 'confirmacao', numeroPedidoSistema: '' } : prev)
      setShowModalExcluirNum(false)
    } finally {
      setExcluindo(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Carregando...</div>
  )
  if (!pedido) return null

  const nomeCliente = pedido.clienteType === 'empresa'
    ? pedido.clienteEmpresa?.razaoSocial
    : pedido.clientePF?.nomeCompleto

  const telefone = pedido.clienteType === 'empresa'
    ? pedido.clienteEmpresa?.telefone
    : pedido.clientePF?.telefone

  const tamanhoOrdem = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG', '2', '4', '6', '8', '10', '14']
  const isEmpresa = pedido.clienteType === 'empresa'
  const empresa = pedido.clienteEmpresa
  const pf = pedido.clientePF

  // Normaliza: multi-modelo ou legado como array
  const modelosParaRender: ModeloPedido[] = (pedido.modelos && pedido.modelos.length > 0)
    ? pedido.modelos
    : [{
        id: 'legacy',
        modelo: pedido.modelo,
        material: pedido.material,
        cor: pedido.cor,
        corPersonalizada: pedido.corPersonalizada,
        fornecedor: pedido.fornecedor,
        detalhes: pedido.detalhes,
        tiposEstampa: pedido.tiposEstampa || [],
        precoUnitario: pedido.precoUnitario,
        quantidadeTotal: pedido.quantidadeTotal,
        referenciaUnissex: pedido.referenciaUnissex,
        referenciaBabylook: pedido.referenciaBabylook,
        referenciaInfantil: pedido.referenciaInfantil,
        mensagemMockup: pedido.mensagemMockup,
        pecas: pedido.pecas ?? [],
        layoutImages: pedido.layoutImages ?? [],
        vetoresFiles: pedido.vetoresFiles ?? [],
        estampaQuadros: pedido.estampaQuadros ?? [],
      }]

  // Resumo geral de tamanhos para Sheet 2 (todos os modelos)
  const todasPecas = modelosParaRender.flatMap(m => m.pecas ?? [])
  const resumoGeral = todasPecas.reduce<Record<string, number>>((acc, p) => {
    const k = `${CATEGORIA_LABEL[p.categoria] || p.categoria} ${p.tamanho}`
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})
  const totalPedido = todasPecas.length > 0
    ? todasPecas.reduce((s, p) => s + (p.precoUnitario || 0), 0)
    : modelosParaRender.reduce((s, m) => s + (m.precoUnitario || 0) * (m.quantidadeTotal || 0), 0)
  const totalPecas = todasPecas.length > 0
    ? todasPecas.length
    : modelosParaRender.reduce((s, m) => s + (m.quantidadeTotal || 0), 0)
  const temNomes = todasPecas.some(p => p.nomeNaCamiseta || p.numeroNaCamiseta)

  return (
    <>
      {/* Toolbar — some na impressão */}
      <div className="no-print bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between gap-3">
        <Link href={`/pedido/${id}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-semibold">
          <ArrowLeft size={16} /> Voltar ao Pedido
        </Link>
        <div className="flex items-center gap-2">
          {pedido?.numeroPedidoSistema && (
            <button
              onClick={() => setShowModalExcluirNum(true)}
              className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 px-3 py-2 rounded-lg font-semibold text-sm transition"
              title="Excluir número do sistema"
            >
              <Trash2 size={14} /> Excluir Nº Sistema
            </button>
          )}
          {pedido?.status === 'formalizado' && pedido?.numeroPedidoSistema ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-4 py-2 rounded-lg">
              <CheckCircle size={16} className="text-emerald-600" />
              <span className="text-emerald-700 font-bold text-sm">Formalizado — Nº Sistema: {pedido.numeroPedidoSistema}</span>
            </div>
          ) : (
            <button
              onClick={() => setShowModalFormalizar(true)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition"
            >
              <CheckCircle size={16} /> Pedido Formalizado
            </button>
          )}
          <button
            onClick={() => setShowRefs(s => !s)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm border transition ${
              showRefs
                ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
            }`}
            title="Mostrar/ocultar bloco de referências na folha de produção"
          >
            {showRefs ? '📋 Ocultar Referências' : '📋 Mostrar Referências'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition"
          >
            <Printer size={16} /> Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      <div className="preview-wrapper py-8 px-4 bg-gray-100 print:bg-white print:p-0">

        {/* ═══════════════════════════════════════════
            FOLHA(S) 1 — PRODUÇÃO — uma por modelo
        ═══════════════════════════════════════════ */}
        {modelosParaRender.map((m, mi) => {
          const ml = CATALOGO[m.modelo]?.label || m.modelo
          const matl = CATALOGO[m.modelo]?.materiais[m.material]?.label || m.material
          const cf = m.cor === 'Personalizada' ? m.corPersonalizada : m.cor
          const ch = COR_HEX[m.cor] || '#E8500A'
          const est = m.tiposEstampa?.map(t => TIPOS_ESTAMPA.find(e => e.value === t)?.label).filter(Boolean).join(', ') || '—'
          const det = (['corpo', 'friso', 'punho', 'gola', 'manga', 'bolso'] as const).filter(d => m.detalhes?.[d])
          const agr: Record<string, Record<string, number>> = {}
          ;(m.pecas ?? []).forEach(p => {
            if (!agr[p.categoria]) agr[p.categoria] = {}
            agr[p.categoria][p.tamanho] = (agr[p.categoria][p.tamanho] || 0) + 1
          })
          const qs = m.estampaQuadros ?? []
          const layouts = m.layoutImages ?? []
          // Tamanho dinâmico dos quadros de estampa para caber em 1 página
          const qCount = qs.length
          const qWidth = qCount <= 2 ? '53mm' : qCount <= 4 ? '46mm' : qCount <= 6 ? '34mm' : '26mm'
          const qImgSize = qCount <= 2 ? '30mm' : qCount <= 4 ? '24mm' : qCount <= 6 ? '16mm' : '12mm'
          return (
            <div key={m.id} style={{ zoom: '80%' }} className="no-zoom-print mb-8 print:mb-0">
              <div
                className="print-sheet-1 bg-white shadow-2xl"
                style={{
                  width: '297mm', height: '210mm',
                  overflow: 'hidden',
                  fontFamily: 'Inter, Arial, sans-serif', fontSize: '10pt',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  className="print-sheet-content"
                  style={{
                    height: '100%',
                    padding: '8mm',
                    display: 'flex', flexDirection: 'column', gap: '3mm',
                    boxSizing: 'border-box',
                  }}
                >
                {/* Badge multi-modelo */}
                {modelosParaRender.length > 1 && (
                  <div style={{ background: '#1a1a1a', color: 'white', padding: '3px 12px', borderRadius: 5, fontSize: 10, fontWeight: 800, alignSelf: 'flex-start' }}>
                    MODELO {mi + 1}/{modelosParaRender.length} — {ml.toUpperCase()}
                  </div>
                )}

                {/* ── Linha superior: Info + Layout ── */}
                <div style={{ display: 'flex', gap: '6mm', flex: 1, minHeight: 0 }}>

                  {/* Lado esquerdo */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5mm' }}>

                    {/* Logo + Cabeçalho */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4mm' }}>
                      <img src={LOGO_URL} alt="Passo a Passo Uniformes" style={{ height: 38, width: 'auto', flexShrink: 0 }} />
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        {pedido.numeroPedidoSistema ? (
                          <div style={{ background: '#E8500A', color: 'white', padding: '5px 18px', borderRadius: 6, fontSize: 16, fontWeight: 900, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                            Nº SISTEMA: {pedido.numeroPedidoSistema}
                          </div>
                        ) : <div />}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <div style={{ fontSize: 9, lineHeight: 1.5 }}>
                          <div>Pedido Nº: <span style={{ fontWeight: 800 }}>{pedido.numeroPedido}</span></div>
                          <div>Vendedor: <strong>{pedido.nomeVendedor}</strong></div>
                        </div>
                        <div style={{ background: '#1a1a1a', color: 'white', padding: '3px 10px', borderRadius: 5, fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>
                          DATA: {formatarData(pedido.dataPedido)}
                        </div>
                        <div style={{ background: '#DC2626', color: 'white', padding: '4px 10px', borderRadius: 5, fontSize: 13, fontWeight: 900, whiteSpace: 'nowrap', letterSpacing: 0.3 }}>
                          ENTREGA: {formatarData(pedido.dataEntregaPrevista)}
                        </div>
                      </div>
                    </div>

                    {/* Cliente */}
                    <div style={{ borderTop: '2px solid #E8500A', paddingTop: '1.5mm' }}>
                      <div style={{ fontSize: 8, fontWeight: 700, color: '#E8500A', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 1 }}>
                        {isEmpresa ? 'Nome da Empresa' : 'Nome do Cliente'}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1 }}>{nomeCliente}</div>
                      {telefone && <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>Tel: {telefone}</div>}
                    </div>

                    {/* Modelo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: '#555' }}>MODELO:</span>
                      <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>{ml}</span>
                    </div>

                    {/* Grade info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2mm', flex: 1 }}>
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#E8500A', letterSpacing: 1, marginBottom: 2 }}>MATERIAL / COR:</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 22, height: 22, background: ch, border: '2px solid #555', borderRadius: 3, flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.2 }}>{matl}</div>
                            {cf !== matl && (
                              <div style={{ fontSize: 10, fontWeight: 700, color: '#374151', lineHeight: 1.2 }}>{cf}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      {showRefs && (
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: '#E8500A', letterSpacing: 1, marginBottom: 1 }}>REFERÊNCIAS:</div>
                          <div style={{ fontSize: 9, lineHeight: 1.4 }}>
                            {m.tipoReferencia === 'masculino_feminino' ? (
                              <>
                                <div>MASCULINO: <span style={{ fontWeight: 600 }}>{m.referenciaUnissex || '—'}</span></div>
                                <div>FEMININO: <span style={{ fontWeight: 600 }}>{m.referenciaBabylook || '—'}</span></div>
                              </>
                            ) : (
                              <>
                                <div>UNISSEX: <span style={{ fontWeight: 600 }}>{m.referenciaUnissex || '—'}</span></div>
                                <div>BABY LOOK: <span style={{ fontWeight: 600 }}>{m.referenciaBabylook || '—'}</span></div>
                                <div>INFANTIL: <span style={{ fontWeight: 600 }}>{m.referenciaInfantil || '—'}</span></div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#E8500A', letterSpacing: 1, marginBottom: 1 }}>DETALHES:</div>
                        {det.length === 0 ? (
                          <span style={{ fontSize: 9, color: '#999' }}>—</span>
                        ) : (
                          <div style={{ fontSize: 9, lineHeight: 1.4 }}>
                            {det.map(d => {
                              const desc = m.detalhes?.[`${d}Desc` as keyof typeof m.detalhes] as string
                              return (
                                <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                  <div style={{ width: 8, height: 8, background: '#E8500A', borderRadius: 1, flexShrink: 0 }} />
                                  <span style={{ textTransform: 'uppercase' }}>{d}{desc ? `: ${desc}` : ''}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#E8500A', letterSpacing: 1, marginBottom: 1 }}>FORNECEDOR:</div>
                        <span style={{ fontSize: 10, fontWeight: 600 }}>{m.fornecedor}</span>
                        {est && <div style={{ fontSize: 9, color: '#555', marginTop: 1 }}>Estampa: {est}</div>}
                      </div>
                    </div>

                    {/* Tamanhos */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#E8500A', letterSpacing: 1, marginBottom: 2 }}>TAMANHOS:</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5mm' }}>
                        {(['unissex', 'babylook', 'feminino', 'masculino', 'infantil'] as const).map(cat => {
                          const dados = agr[cat] || {}
                          const ordemFiltrada = Object.keys(dados).sort((a, b) => tamanhoOrdem.indexOf(a) - tamanhoOrdem.indexOf(b))
                          if (ordemFiltrada.length === 0) return null
                          return (
                            <div key={cat}>
                              <div style={{ fontWeight: 800, fontSize: 10, textTransform: 'uppercase', marginBottom: 1, borderBottom: '1px solid #eee', paddingBottom: 1 }}>
                                {CATEGORIA_LABEL_UP[cat]}
                              </div>
                              {ordemFiltrada.map(tam => (
                                <div key={tam} style={{ fontSize: 12, fontWeight: 700, color: '#E8500A', lineHeight: 1.25 }}>
                                  {tam}/{dados[tam]}
                                </div>
                              ))}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Total + Observação (apenas no primeiro modelo) */}
                    <div style={{ marginTop: 'auto' }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', letterSpacing: -1 }}>
                        {m.quantidadeTotal} PEÇAS
                      </span>

                      {mi === 0 && (
                        <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1.5px solid #e5e7eb' }}>
                          <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: showObservacao ? 4 : 0 }}>
                            <span style={{ fontSize: 9, fontWeight: 700, color: '#E8500A', letterSpacing: 1 }}>OBSERVAÇÃO:</span>
                            <button
                              onClick={() => { setShowObservacao(s => !s); if (showObservacao) setEditandoObs(false) }}
                              style={{ fontSize: 8, padding: '2px 7px', borderRadius: 3, background: showObservacao ? '#fef3c7' : '#f3f4f6', border: `1px solid ${showObservacao ? '#f59e0b' : '#d1d5db'}`, cursor: 'pointer', fontWeight: 700, color: showObservacao ? '#92400e' : '#6b7280' }}
                            >
                              {showObservacao ? '× Sem observação' : '+ Adicionar observação'}
                            </button>
                          </div>
                          {showObservacao && editandoObs && (
                            <div className="no-print">
                              <textarea value={observacao} onChange={e => setObservacao(e.target.value)} rows={3} autoFocus
                                placeholder="Digite a observação do pedido..."
                                style={{ width: '100%', fontSize: 9, padding: '4px 6px', border: '2px solid #E8500A', borderRadius: 4, resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                              />
                              <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
                                <button onClick={salvarObservacao} disabled={salvandoObs}
                                  style={{ fontSize: 8, padding: '3px 10px', background: '#E8500A', color: 'white', borderRadius: 3, border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                                  {salvandoObs ? 'Salvando...' : '✓ Salvar'}
                                </button>
                                <button onClick={() => setEditandoObs(false)}
                                  style={{ fontSize: 8, padding: '3px 8px', background: '#f3f4f6', borderRadius: 3, border: '1px solid #d1d5db', cursor: 'pointer' }}>
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          )}
                          {showObservacao && !editandoObs && (
                            <div onClick={() => setEditandoObs(true)}
                              style={{ background: '#fef3c7', border: '2.5px solid #f59e0b', borderRadius: 5, padding: '5px 9px', cursor: 'pointer', minHeight: 28 }}
                              title="Clique para editar">
                              {observacao ? (
                                <div style={{ fontSize: 9.5, fontWeight: 800, color: '#92400e', lineHeight: 1.4, whiteSpace: 'pre-wrap', letterSpacing: 0.2 }}>⚠ {observacao}</div>
                              ) : (
                                <div className="no-print" style={{ fontSize: 8, color: '#d97706', fontStyle: 'italic' }}>Clique para digitar a observação...</div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lado direito — Layout + Quadros de estampa */}
                  <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', gap: '2mm', minHeight: 0 }}>

                    {/* Foto do layout */}
                    <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', position: 'relative', minHeight: 0 }}>
                      {layouts[0] ? (
                        <img src={layouts[0]} alt="Layout do pedido"
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} crossOrigin="anonymous" />
                      ) : (
                        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                          <div style={{ fontSize: 36, marginBottom: 6 }}>🖼️</div>
                          <div style={{ fontSize: 9 }}>Sem layout importado</div>
                        </div>
                      )}
                      {layouts.length > 1 && (
                        <div style={{ position: 'absolute', bottom: 4, right: 4, display: 'flex', gap: 3 }}>
                          {layouts.slice(1, 4).map((url, i) => (
                            <img key={i} src={url} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 3, border: '1px solid #ddd' }} crossOrigin="anonymous" />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quadros de estampa */}
                    {qs.length > 0 && (
                      <div style={{ flexShrink: 0 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm' }}>
                          {qs.map((q, qi) => (
                            <div key={q.id} style={{ width: qWidth, border: '1px solid #d1d5db', borderRadius: 5, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'white', flexShrink: 0 }}>
                              <div style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb', padding: '1.5mm 2mm', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 14, height: 14, background: '#E8500A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <span style={{ color: 'white', fontWeight: 900, fontSize: 8 }}>{qi + 1}</span>
                                </div>
                                <span style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>{q.posicao}</span>
                              </div>
                              <div style={{ display: 'flex', overflow: 'hidden' }}>
                                <div style={{ padding: '2mm', borderRight: '1px solid #f0f0f0', minWidth: 0, flex: 1 }}>
                                  {TIPOS_ESTAMPA_QUADRO.map(tipo => {
                                    const ativo = q.tiposEstampa.includes(tipo)
                                    return (
                                      <div key={tipo} style={{ display: 'flex', alignItems: 'flex-start', gap: 3, marginBottom: '1.2mm' }}>
                                        <div style={{ width: 8, height: 8, border: '1px solid #555', background: ativo ? '#333' : 'white', borderRadius: 1, flexShrink: 0, marginTop: 1 }} />
                                        <span style={{ fontSize: 6.5, lineHeight: 1.25, color: '#333', textTransform: 'uppercase', fontWeight: ativo ? 700 : 400 }}>{tipo}</span>
                                      </div>
                                    )
                                  })}
                                </div>
                                <div style={{ width: qImgSize, height: qImgSize, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', padding: '1.5mm' }}>
                                  {q.imagem ? (
                                    <img src={q.imagem} alt={`Estampa ${q.posicao}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} crossOrigin="anonymous" />
                                  ) : (
                                    <div style={{ textAlign: 'center', color: '#d1d5db' }}><div style={{ fontSize: 18 }}>🖼</div></div>
                                  )}
                                </div>
                              </div>
                              <div style={{ borderTop: '1px solid #e5e7eb', padding: '1.5mm 2mm', background: '#fafafa' }}>
                                <span style={{ fontSize: 6.5, fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>
                                  CORES: {q.descricaoCores ? q.descricaoCores.toUpperCase() : '—'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              </div>{/* /print-sheet-content */}
            </div>
          )
        })}

        {/* ═══════════════════════════════════════════
            FOLHA 2 — DADOS DO CLIENTE (landscape A4)
        ═══════════════════════════════════════════ */}
        <div style={{ zoom: '80%' }} className="no-zoom-print">
          <div
            className="print-sheet-2 bg-white shadow-2xl"
            style={{
              width: '297mm', minHeight: '210mm',
              padding: '8mm',
              fontFamily: 'Inter, Arial, sans-serif', fontSize: '9pt',
              boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', gap: '3mm',
            }}
          >
            {/* Cabeçalho */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '2px solid #E8500A', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={LOGO_URL} alt="Passo a Passo" style={{ height: 36 }} />
                <div>
                  <div style={{ fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#6b7280' }}>Passo a Passo Uniformes</div>
                  <div style={{ fontSize: 7.5, color: '#9ca3af' }}>Dados do Cliente</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 7.5 }}>
                <div style={{ fontWeight: 700, fontSize: 12 }}>Pedido #{pedido.numeroPedido}</div>
                <div style={{ color: '#6b7280', marginTop: 2 }}>Emitido em: {formatarData(new Date().toISOString().split('T')[0])}</div>
                <div style={{ color: '#DC2626', fontWeight: 700, marginTop: 2 }}>Entrega: {formatarData(pedido.dataEntregaPrevista)}</div>
              </div>
            </div>

            {/* Corpo: duas colunas */}
            <div style={{ display: 'flex', gap: '6mm', flex: '1 0 auto' }}>

              {/* ── Coluna esquerda 60%: todos os dados ── */}
              <div style={{ flex: '0 0 58%', display: 'flex', flexDirection: 'column' }}>

                {/* Dados do cliente */}
                <SectionTitle num={1} label={isEmpresa ? 'Dados da Empresa' : 'Dados do Cliente'} />
                <InfoGrid>
                  {isEmpresa ? (
                    <>
                      <InfoRow label="Razão Social" value={empresa?.razaoSocial} bold span2 />
                      <InfoRow label="CNPJ" value={empresa?.cnpj} />
                      <InfoRow label="Nome do Contato" value={empresa?.contato} />
                      <InfoRow label="Telefone" value={empresa?.telefone} />
                      <InfoRow label="E-mail" value={empresa?.email} />
                      <InfoRow label="Endereço" value={empresa?.endereco} span2 />
                      <InfoRow label="Cidade / Estado" value={[empresa?.cidade, empresa?.estado].filter(Boolean).join(' / ')} />
                      <InfoRow label="CEP" value={empresa?.cep} />
                    </>
                  ) : (
                    <>
                      <InfoRow label="Nome Completo" value={pf?.nomeCompleto} bold span2 />
                      <InfoRow label="CPF" value={pf?.cpf} />
                      <InfoRow label="Telefone" value={pf?.telefone} />
                      <InfoRow label="E-mail" value={pf?.email} span2 />
                      <InfoRow label="Endereço" value={pf?.endereco} span2 />
                      <InfoRow label="Cidade / Estado" value={[pf?.cidade, pf?.estado].filter(Boolean).join(' / ')} />
                      <InfoRow label="CEP" value={pf?.cep} />
                    </>
                  )}
                </InfoGrid>

                {/* Dados do pedido */}
                <SectionTitle num={2} label="Dados do Pedido" />
                <InfoGrid>
                  <InfoRow label="Nº Pedido" value={pedido.numeroPedido} bold />
                  <InfoRow label="Data do Pedido" value={formatarData(pedido.dataPedido)} />
                  <InfoRow label="Entrega Prevista" value={formatarData(pedido.dataEntregaPrevista)} bold orange />
                  <InfoRow label="Vendedor" value={pedido.nomeVendedor} />
                  <InfoRow label="Qtd. de Peças" value={`${totalPecas} peças`} />
                  <InfoRow label="Total" value={formatarMoeda(totalPedido)} bold orange />
                </InfoGrid>

                {/* Produto(s) */}
                <SectionTitle num={3} label={modelosParaRender.length > 1 ? `Produtos (${modelosParaRender.length} modelos)` : 'Produto'} />
                {modelosParaRender.map((m, mi) => {
                  const mLabel = CATALOGO[m.modelo]?.label || m.modelo
                  const matLabel = CATALOGO[m.modelo]?.materiais[m.material]?.label || m.material
                  const cFinal = m.cor === 'Personalizada' ? m.corPersonalizada : m.cor
                  const estStr = m.tiposEstampa?.map(t => TIPOS_ESTAMPA.find(e => e.value === t)?.label).filter(Boolean).join(', ') || '—'
                  const detAtivos = (['corpo', 'friso', 'punho', 'gola', 'manga', 'bolso'] as const).filter(d => m.detalhes?.[d])
                  return (
                    <div key={m.id} style={{ marginBottom: 8 }}>
                      {modelosParaRender.length > 1 && (
                        <div style={{ fontSize: 8, fontWeight: 800, color: 'white', background: '#1a1a1a', padding: '1px 8px', borderRadius: 3, display: 'inline-block', marginBottom: 4 }}>
                          MODELO {mi + 1}: {mLabel.toUpperCase()}
                        </div>
                      )}
                      <InfoGrid>
                        <InfoRow label="Modelo" value={mLabel} bold />
                        <InfoRow label="Material / Cor" value={`${matLabel} — ${cFinal}`} />
                        <InfoRow label="Fornecedor" value={m.fornecedor} />
                        <InfoRow label="Tipo de Estampa" value={estStr} />
                        <InfoRow label="Preço Unit. Base" value={formatarMoeda(m.precoUnitario)} bold orange />
                        <InfoRow label="Qtd. Modelo" value={`${(m.pecas ?? []).length || m.quantidadeTotal || 0} peças`} />
                        {(m.referenciaUnissex || m.referenciaBabylook || m.referenciaInfantil) && (
                          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 14, fontSize: 9, marginTop: 2 }}>
                            {m.referenciaUnissex && <span>Unissex: <strong>{m.referenciaUnissex}</strong></span>}
                            {m.referenciaBabylook && <span>Baby Look: <strong>{m.referenciaBabylook}</strong></span>}
                            {m.referenciaInfantil && <span>Infantil: <strong>{m.referenciaInfantil}</strong></span>}
                          </div>
                        )}
                        {detAtivos.length > 0 && (
                          <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 3 }}>
                            {detAtivos.map(d => {
                              const desc = m.detalhes?.[`${d}Desc` as keyof typeof m.detalhes] as string
                              return (
                                <span key={d} style={{ padding: '1px 7px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 4, fontSize: 9, fontWeight: 600, color: '#c2410c' }}>
                                  {d.charAt(0).toUpperCase() + d.slice(1)}{desc ? `: ${desc}` : ''}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </InfoGrid>
                    </div>
                  )
                })}

                {/* Tamanhos */}
                {Object.keys(resumoGeral).length > 0 && (
                  <>
                    <SectionTitle num={4} label="Resumo de Tamanhos (Geral)" />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                      {Object.entries(resumoGeral).map(([k, v]) => (
                        <div key={k} style={{ padding: '3px 8px', background: '#E8500A', color: 'white', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>
                          {k}: {v} {v === 1 ? 'peça' : 'peças'}
                        </div>
                      ))}
                    </div>
                  </>
                )}

              </div>

              {/* ── Coluna direita 40%: Comprovante de pagamento ── */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderLeft: '2px solid #f0f0f0', paddingLeft: '5mm' }}>
                <div style={{ fontSize: 7.5, fontWeight: 800, color: '#E8500A', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                  Comprovante de Pagamento
                </div>
                {pedido.descricaoPagamento && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '6px 10px', marginBottom: 8, fontSize: 8.5, color: '#14532d', lineHeight: 1.5 }}>
                    {pedido.descricaoPagamento}
                  </div>
                )}
                {(pedido.recibosPagamento?.length ?? 0) > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {pedido.recibosPagamento!.map((url, i) => {
                      const isPdf = url.includes('/raw/') || url.toLowerCase().endsWith('.pdf')
                      return isPdf ? (
                        <div key={i} style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '20px 0', minHeight: 80 }}>
                          <span style={{ fontSize: 40 }}>📄</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626' }}>PDF — Comprovante {i + 1}</span>
                        </div>
                      ) : (
                        <img key={i} src={url} alt={`Recibo ${i + 1}`} crossOrigin="anonymous"
                          style={{ width: '100%', maxHeight: '140mm', objectFit: 'contain', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                      )
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e5e7eb', borderRadius: 8, color: '#9ca3af', flexDirection: 'column', gap: 10, padding: '30px 0' }}>
                    <span style={{ fontSize: 40 }}>💳</span>
                    <span style={{ fontSize: 9 }}>Sem comprovante</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rodapé */}
            <div style={{ paddingTop: 8, borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#9ca3af', flexShrink: 0 }}>
              <div>
                <p style={{ margin: 0 }}>Passo a Passo Uniformes — Sistema de Pedidos</p>
                <p style={{ margin: 0 }}>Documento gerado em: {new Date().toLocaleString('pt-BR')}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0 }}>Pedido #{pedido.numeroPedido}</p>
                <p style={{ margin: 0 }}>Vendedor: {pedido.nomeVendedor}</p>
              </div>
            </div>
          </div>
        </div>
        {/* ═══════════════════════════════════════════
            FOLHA 3 — NOMES / NÚMEROS (landscape A4)
        ═══════════════════════════════════════════ */}
        {temNomes && (() => {
          const nomesPers = todasPecas.filter(p => p.nomeNaCamiseta || p.numeroNaCamiseta)
          const total3 = nomesPers.length
          const colunas = total3 <= 12 ? 3 : total3 <= 24 ? 4 : total3 <= 40 ? 5 : 6
          const fontNome = total3 <= 12 ? 15 : total3 <= 24 ? 13 : total3 <= 40 ? 11 : 10
          const fontNum  = total3 <= 12 ? 16 : total3 <= 24 ? 14 : total3 <= 40 ? 12 : 11
          const fontSub  = total3 <= 12 ? 8  : total3 <= 24 ? 7.5 : 7
          const padCard  = total3 <= 24 ? '3mm 3mm' : '2mm 2.5mm'
          const modelosLabel = modelosParaRender.length > 1
            ? `${modelosParaRender.length} modelos`
            : (CATALOGO[modelosParaRender[0]?.modelo]?.label || modelosParaRender[0]?.modelo || '')

          return (
            <div style={{ zoom: '80%' }} className="no-zoom-print mt-8 print:mt-0">
              <div
                className="print-sheet-3 bg-white shadow-2xl"
                style={{
                  width: '297mm', minHeight: '210mm',
                  padding: '7mm 8mm',
                  fontFamily: 'Inter, Arial, sans-serif',
                  boxSizing: 'border-box',
                  display: 'flex', flexDirection: 'column', gap: '3mm',
                }}
              >
                {/* Cabeçalho */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '2px solid #E8500A', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src={LOGO_URL} alt="Passo a Passo" style={{ height: 30 }} />
                    <div>
                      <div style={{ fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#6b7280' }}>Passo a Passo Uniformes</div>
                      <div style={{ fontSize: 7, color: '#9ca3af' }}>Nomes e Números nas Peças</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#1a1a1a' }}>{nomeCliente}</div>
                    <div style={{ fontSize: 9, color: '#6b7280' }}>{modelosLabel} · {total3} peças personalizadas</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 7 }}>
                    <div style={{ fontWeight: 700, fontSize: 11 }}>Pedido #{pedido.numeroPedido}</div>
                    <div style={{ color: '#6b7280', marginTop: 2 }}>Vendedor: {pedido.nomeVendedor}</div>
                    <div style={{ color: '#DC2626', fontWeight: 700, marginTop: 2 }}>Entrega: {formatarData(pedido.dataEntregaPrevista)}</div>
                  </div>
                </div>

                {/* Grid de nomes */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${colunas}, 1fr)`,
                  gap: '2mm',
                  alignContent: 'start',
                }}>
                  {nomesPers.map((p, i) => (
                    <div key={i} style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: 5,
                      padding: padCard,
                      borderLeft: '3px solid #E8500A',
                      background: i % 2 === 0 ? 'white' : '#fafafa',
                    }}>
                      {p.pessoaNome && (
                        <div style={{ fontSize: fontSub, color: '#9ca3af', fontWeight: 600, lineHeight: 1.1, marginBottom: 1 }}>{p.pessoaNome}</div>
                      )}
                      {p.nomeNaCamiseta && (
                        <div style={{ fontSize: fontNome, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1 }}>{p.nomeNaCamiseta}</div>
                      )}
                      {p.numeroNaCamiseta && (
                        <div style={{ fontSize: fontNum, fontWeight: 900, color: '#E8500A', lineHeight: 1.1 }}>#{p.numeroNaCamiseta}</div>
                      )}
                      <div style={{ fontSize: fontSub - 0.5, color: '#6b7280', lineHeight: 1.1, marginTop: 1 }}>
                        {CATEGORIA_LABEL_UP[p.categoria as CategoriaSize]} · {p.tamanho}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rodapé */}
                <div style={{ paddingTop: 5, borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', fontSize: 7, color: '#9ca3af', flexShrink: 0 }}>
                  <p style={{ margin: 0 }}>Passo a Passo Uniformes — Lista de Nomes e Números · Pedido #{pedido.numeroPedido}</p>
                  <p style={{ margin: 0 }}>Gerado em: {new Date().toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </div>
          )
        })()}

      </div>

      {/* Modal formalizar */}
      {showModalFormalizar && (
        <div className="no-print fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Formalizar Pedido</h2>
                <p className="text-xs text-gray-500">Informe o número gerado no sistema interno</p>
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
              className="w-full border-2 border-gray-300 focus:border-emerald-400 rounded-lg px-3 py-2.5 text-xl font-bold text-center focus:outline-none mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowModalFormalizar(false); setNumSistema('') }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarFormalizacao}
                disabled={!numSistema.trim() || salvando}
                className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold transition disabled:opacity-40"
              >
                {salvando ? 'Salvando...' : '✓ Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalExcluirNum && (
        <div className="no-print fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Excluir Número do Sistema</h2>
                <p className="text-xs text-gray-500">O pedido voltará para o status <strong>Confirmação</strong></p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-5 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              Tem certeza que deseja remover o <strong>Nº {pedido.numeroPedidoSistema}</strong> e desformalizar este pedido?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowModalExcluirNum(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={excluirNumeroDeSistema}
                disabled={excluindo}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition disabled:opacity-40"
              >
                {excluindo ? 'Removendo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .no-zoom-print { zoom: 1 !important; }
          body { margin: 0; background: white; }
          .preview-wrapper { padding: 0 !important; background: white !important; }
          .print-sheet-1 {
            box-shadow: none !important;
            margin-bottom: 0 !important;
            page-break-after: always;
            break-after: always;
            page-break-inside: avoid;
            break-inside: avoid;
            overflow: hidden !important;
          }
          .print-sheet-2 {
            box-shadow: none !important;
            page-break-before: always;
            page-break-after: always;
          }
          .print-sheet-3 {
            box-shadow: none !important;
            page-break-before: always;
          }
        }
        @page {
          margin: 0;
          size: A4 landscape;
        }
      `}</style>
    </>
  )
}

function SectionTitle({ num, label }: { num: number; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, marginTop: 2, flexShrink: 0 }}>
      <div style={{ width: 16, height: 16, background: '#E8500A', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ color: 'white', fontSize: 8, fontWeight: 700 }}>{num}</span>
      </div>
      <h2 style={{ fontWeight: 700, fontSize: 9.5, textTransform: 'uppercase', letterSpacing: 0.8, color: '#111827', margin: 0 }}>{label}</h2>
    </div>
  )
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 18px', border: '1px solid #e5e7eb', borderRadius: 6, padding: '7px 11px', background: '#fafafa', marginBottom: 9, flexShrink: 0 }}>
      {children}
    </div>
  )
}

function InfoRow({ label, value, bold, orange, span2 }: { label: string; value?: string | null; bold?: boolean; orange?: boolean; span2?: boolean }) {
  return (
    <div style={{ gridColumn: span2 ? '1 / -1' : undefined }}>
      <p style={{ fontSize: 7.5, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, margin: 0 }}>{label}</p>
      <p style={{ fontSize: 10.5, color: orange ? '#E8500A' : '#111827', fontWeight: bold ? 700 : 500, margin: '1px 0 0' }}>{value || '—'}</p>
    </div>
  )
}
