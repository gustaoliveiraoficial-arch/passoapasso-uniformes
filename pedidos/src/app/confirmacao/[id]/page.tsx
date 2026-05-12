'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { buscarPedido } from '@/lib/firebase'
import type { Pedido, CategoriaSize } from '@/types/pedido'
import { TIPOS_ESTAMPA, TIPOS_ESTAMPA_QUADRO } from '@/types/pedido'
import { CATALOGO, COR_HEX } from '@/lib/catalog'
import { formatarData, formatarMoeda } from '@/lib/utils'
import toast from 'react-hot-toast'
import { ArrowLeft, Printer, Download } from 'lucide-react'

const CATEGORIA_LABEL: Record<CategoriaSize, string> = {
  unissex: 'UNISSEX',
  babylook: 'BABY LOOK',
  infantil: 'INFANTIL',
}

export default function Confirmacao() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    buscarPedido(id).then(p => {
      if (!p) { toast.error('Pedido não encontrado'); router.push('/'); return }
      setPedido(p)
      setLoading(false)
    })
  }, [id])

  function imprimir() {
    window.print()
  }

  function exportarPDF() {
    window.print()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Carregando...</div>
  if (!pedido) return null

  // Dados para o PDF
  const nomeCliente = pedido.clienteType === 'empresa'
    ? pedido.clienteEmpresa?.razaoSocial
    : pedido.clientePF?.nomeCompleto

  const telefone = pedido.clienteType === 'empresa'
    ? pedido.clienteEmpresa?.telefone
    : pedido.clientePF?.telefone

  const modeloLabel = CATALOGO[pedido.modelo]?.label || pedido.modelo
  const materialLabel = CATALOGO[pedido.modelo]?.materiais[pedido.material]?.label || pedido.material
  const corFinal = pedido.cor === 'Personalizada' ? pedido.corPersonalizada : pedido.cor
  const corHex = COR_HEX[pedido.cor] || '#E8500A'

  // Agrupa tamanhos por categoria
  const agrupado: Record<string, Record<string, number>> = { unissex: {}, babylook: {}, infantil: {} }
  pedido.pecas?.forEach(p => {
    if (!agrupado[p.categoria]) agrupado[p.categoria] = {}
    agrupado[p.categoria][p.tamanho] = (agrupado[p.categoria][p.tamanho] || 0) + 1
  })

  const detalhesAtivos = (['corpo', 'friso', 'punho', 'gola', 'manga', 'bolso'] as const).filter(d => pedido.detalhes?.[d])
  const estampas = pedido.tiposEstampa?.map(t => TIPOS_ESTAMPA.find(e => e.value === t)?.label).filter(Boolean).join(', ')

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar - não aparece no PDF */}
      <div className="no-print bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/pedido/${id}`} className="text-gray-500 hover:text-gray-700"><ArrowLeft size={20} /></Link>
            <h1 className="font-bold text-gray-900">Pedido #{pedido.numeroPedido} — Confirmação para Produção</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={imprimir} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              <Printer size={16} /> Imprimir
            </button>
            <button onClick={exportarPDF} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition">
              <Download size={16} /> Exportar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Prévia na tela com zoom reduzido para caber na viewport */}
      <div className="preview-wrapper flex justify-center py-8 px-4 overflow-x-auto">
        <div style={{ zoom: '80%' }}>
          <PedidoSheet pedido={pedido} nomeCliente={nomeCliente || ''} telefone={telefone || ''} modeloLabel={modeloLabel} materialLabel={materialLabel} corFinal={corFinal} corHex={corHex} agrupado={agrupado} detalhesAtivos={detalhesAtivos} estampas={estampas || ''} />
        </div>
      </div>
    </div>
  )
}

function PedidoSheet({
  pedido, nomeCliente, telefone, modeloLabel, materialLabel,
  corFinal, corHex, agrupado, detalhesAtivos, estampas
}: {
  pedido: Pedido
  nomeCliente: string
  telefone: string
  modeloLabel: string
  materialLabel: string
  corFinal: string
  corHex: string
  agrupado: Record<string, Record<string, number>>
  detalhesAtivos: string[]
  estampas: string
}) {
  const tamanhoOrdem = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG', '2', '4', '6', '8', '10', '14']
  const quadros = pedido.estampaQuadros ?? []
  const temQuadros = quadros.length > 0

  // Altura da faixa de quadros — 38% da folha quando existem quadros
  const alturaQuadros = '72mm'
  const alturaTop = temQuadros ? '110mm' : '190mm'

  return (
    <div
      className="print-sheet bg-white shadow-2xl"
      style={{
        width: '297mm', height: '210mm',
        padding: '8mm',
        display: 'flex', flexDirection: 'column', gap: '4mm',
        fontFamily: 'Inter, Arial, sans-serif', fontSize: '10pt',
        boxSizing: 'border-box', overflow: 'hidden'
      }}
    >
      {/* ══ LINHA SUPERIOR: Info (esquerda) + Layout (direita) ══ */}
      <div style={{ display: 'flex', gap: '6mm', height: alturaTop, flexShrink: 0 }}>

        {/* ── LADO ESQUERDO: informações do pedido ── */}
        <div style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column', gap: '3mm', overflow: 'hidden' }}>

          {/* Logo + Cabeçalho */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo-pap.png" alt="Passo a Passo Uniformes" style={{ height: 40, width: 'auto' }} />
            </div>
            <div style={{ textAlign: 'right', fontSize: 8 }}>
              <div>Pedido Nº: <span style={{ fontWeight: 700 }}>{pedido.numeroPedido}</span></div>
              <div style={{ marginTop: 2 }}>Vendedor: <strong>{pedido.nomeVendedor}</strong></div>
              <div style={{ marginTop: 2 }}>Data: {formatarData(pedido.dataPedido)}</div>
              <div style={{ marginTop: 2, color: '#DC2626', fontWeight: 700 }}>Entrega: {formatarData(pedido.dataEntregaPrevista)}</div>
            </div>
          </div>

          {/* Cliente */}
          <div style={{ borderTop: '2px solid #E8500A', paddingTop: '2.5mm' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>{nomeCliente}</div>
            {telefone && <div style={{ fontSize: 8, color: '#555', marginTop: 1 }}>Tel: {telefone}</div>}
          </div>

          {/* Modelo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 8, color: '#555' }}>MODELO:</span>
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>{modeloLabel}</span>
          </div>

          {/* Grade: Material / Referências / Detalhes / Fornecedor */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3mm', flex: 1 }}>
            <div>
              <div style={{ fontSize: 7.5, fontWeight: 700, color: '#E8500A', letterSpacing: 1, marginBottom: 2 }}>MATERIAL:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 11, height: 11, background: corHex, border: '1px solid #ccc', borderRadius: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 8, fontWeight: 600 }}>{materialLabel}</span>
              </div>
              {corFinal !== materialLabel && (
                <div style={{ fontSize: 7.5, color: '#666', marginTop: 2 }}>Cor: {corFinal}</div>
              )}
            </div>
            <div>
              <div style={{ fontSize: 7.5, fontWeight: 700, color: '#E8500A', letterSpacing: 1, marginBottom: 2 }}>REFERÊNCIAS:</div>
              <div style={{ fontSize: 7.5, lineHeight: 1.7 }}>
                <div>UNISSEX: <span style={{ fontWeight: 600 }}>{pedido.referenciaUnissex || '—'}</span></div>
                <div>BABY LOOK: <span style={{ fontWeight: 600 }}>{pedido.referenciaBabylook || '—'}</span></div>
                <div>INFANTIL: <span style={{ fontWeight: 600 }}>{pedido.referenciaInfantil || '—'}</span></div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 7.5, fontWeight: 700, color: '#E8500A', letterSpacing: 1, marginBottom: 2 }}>DETALHES:</div>
              {detalhesAtivos.length === 0 ? (
                <span style={{ fontSize: 7.5, color: '#999' }}>—</span>
              ) : (
                <div style={{ fontSize: 7.5, lineHeight: 1.8 }}>
                  {detalhesAtivos.map(d => {
                    const desc = pedido.detalhes?.[`${d}Desc` as keyof typeof pedido.detalhes] as string
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
              <div style={{ fontSize: 7.5, fontWeight: 700, color: '#E8500A', letterSpacing: 1, marginBottom: 2 }}>FORNECEDOR:</div>
              <span style={{ fontSize: 8, fontWeight: 600 }}>{pedido.fornecedor}</span>
              {estampas && <div style={{ fontSize: 7.5, color: '#555', marginTop: 2 }}>Estampa: {estampas}</div>}
            </div>
          </div>

          {/* Tamanhos */}
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, color: '#E8500A', letterSpacing: 1, marginBottom: 3 }}>TAMANHOS:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3mm' }}>
              {(['unissex', 'babylook', 'infantil'] as const).map(cat => {
                const dados = agrupado[cat] || {}
                const ordemFiltrada = Object.keys(dados).sort((a, b) => tamanhoOrdem.indexOf(a) - tamanhoOrdem.indexOf(b))
                if (ordemFiltrada.length === 0) return null
                return (
                  <div key={cat}>
                    <div style={{ fontWeight: 800, fontSize: 8, textTransform: 'uppercase', marginBottom: 2, borderBottom: '1px solid #eee', paddingBottom: 1 }}>
                      {CATEGORIA_LABEL[cat]}
                    </div>
                    {ordemFiltrada.map(tam => (
                      <div key={tam} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontWeight: 700, color: '#E8500A', lineHeight: 1.6 }}>
                        <span>{tam}</span><span>/ {dados[tam]}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Nomes/números individuais */}
          {pedido.pecas?.some(p => p.nomeNaCamiseta || p.numeroNaCamiseta) && (
            <div>
              <div style={{ fontSize: 7.5, fontWeight: 700, color: '#E8500A', letterSpacing: 1, marginBottom: 2 }}>NOMES / NÚMEROS:</div>
              <div style={{ fontSize: 7, lineHeight: 1.7, columns: 2, gap: '3mm' }}>
                {pedido.pecas.filter(p => p.nomeNaCamiseta || p.numeroNaCamiseta).map((p, i) => (
                  <div key={i}>
                    {p.pessoaNome && <span style={{ fontWeight: 600 }}>{p.pessoaNome}: </span>}
                    {p.nomeNaCamiseta && <span>{p.nomeNaCamiseta} </span>}
                    {p.numeroNaCamiseta && <span style={{ color: '#E8500A', fontWeight: 700 }}>#{p.numeroNaCamiseta}</span>}
                    <span style={{ color: '#999' }}> ({CATEGORIA_LABEL[p.categoria as CategoriaSize]} {p.tamanho})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total de peças */}
          <div style={{ marginTop: 'auto' }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#1a1a1a', letterSpacing: -1 }}>
              {pedido.quantidadeTotal} PEÇAS
            </span>
            <div style={{ fontSize: 8, color: '#555', marginTop: 1 }}>
              Unit.: {formatarMoeda(pedido.precoUnitario)} · Total: {formatarMoeda(pedido.pecas?.reduce((s, p) => s + p.precoUnitario, 0) || pedido.precoUnitario * pedido.quantidadeTotal)}
            </div>
          </div>
        </div>

        {/* ── LADO DIREITO: Layout image ── */}
        <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', position: 'relative' }}>
          {pedido.layoutImages?.[0] ? (
            <img
              src={pedido.layoutImages[0]}
              alt="Layout do pedido"
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }}
              crossOrigin="anonymous"
            />
          ) : (
            <div style={{ textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: 36, marginBottom: 6 }}>🖼️</div>
              <div style={{ fontSize: 9 }}>Sem layout importado</div>
            </div>
          )}
          {pedido.layoutImages?.length > 1 && (
            <div style={{ position: 'absolute', bottom: 4, right: 4, display: 'flex', gap: 3 }}>
              {pedido.layoutImages.slice(1, 4).map((url, i) => (
                <img key={i} src={url} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 3, border: '1px solid #ddd' }} crossOrigin="anonymous" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ LINHA INFERIOR: Quadros de Estampa ══ */}
      {temQuadros && (
        <div style={{ height: alturaQuadros, flexShrink: 0, borderTop: '2px solid #e5e7eb', paddingTop: '3mm' }}>
          <div style={{ display: 'flex', gap: '3mm', height: '100%' }}>
            {quadros.slice(0, 6).map((q, qi) => (
              <div key={q.id} style={{
                flex: 1,
                border: '1px solid #d1d5db',
                borderRadius: 5,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                background: 'white',
              }}>
                {/* Cabeçalho do quadro */}
                <div style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb', padding: '1.5mm 2mm', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 14, height: 14, background: '#E8500A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'white', fontWeight: 900, fontSize: 8 }}>{qi + 1}</span>
                  </div>
                  <span style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>{q.posicao}</span>
                </div>

                {/* Corpo: checkboxes + imagem */}
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                  {/* Checkboxes de tipo */}
                  <div style={{ flex: '0 0 52%', padding: '2mm', borderRight: '1px solid #f0f0f0' }}>
                    {TIPOS_ESTAMPA_QUADRO.map(tipo => {
                      const ativo = q.tiposEstampa.includes(tipo)
                      return (
                        <div key={tipo} style={{ display: 'flex', alignItems: 'flex-start', gap: 3, marginBottom: '1.2mm' }}>
                          <div style={{
                            width: 8, height: 8, border: '1px solid #555',
                            background: ativo ? '#333' : 'white',
                            borderRadius: 1, flexShrink: 0, marginTop: 1
                          }} />
                          <span style={{ fontSize: 6.5, lineHeight: 1.25, color: '#333', textTransform: 'uppercase', fontWeight: ativo ? 700 : 400 }}>{tipo}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Imagem da estampa */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2mm', background: '#fafafa' }}>
                    {q.imagem ? (
                      <img
                        src={q.imagem}
                        alt={`Estampa ${q.posicao}`}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#d1d5db' }}>
                        <div style={{ fontSize: 18 }}>🖼</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rodapé: cores */}
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
  )
}
