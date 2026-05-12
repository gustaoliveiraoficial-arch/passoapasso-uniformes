'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { buscarPedido } from '@/lib/firebase'
import type { Pedido } from '@/types/pedido'
import { TIPOS_ESTAMPA } from '@/types/pedido'
import { CATALOGO } from '@/lib/catalog'
import { formatarData, formatarMoeda } from '@/lib/utils'
import { ArrowLeft, Printer } from 'lucide-react'

export default function ClientePdfPage() {
  const { id } = useParams<{ id: string }>()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    buscarPedido(id).then(p => {
      setPedido(p)
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Carregando...
    </div>
  )
  if (!pedido) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Pedido não encontrado.
    </div>
  )

  const isEmpresa = pedido.clienteType === 'empresa'
  const empresa = pedido.clienteEmpresa
  const pf = pedido.clientePF

  const modeloLabel = CATALOGO[pedido.modelo]?.label || pedido.modelo
  const materialLabel = CATALOGO[pedido.modelo]?.materiais[pedido.material]?.label || pedido.material
  const cor = pedido.cor === 'Personalizada' ? pedido.corPersonalizada : pedido.cor
  const estampas = pedido.tiposEstampa?.map(t => TIPOS_ESTAMPA.find(e => e.value === t)?.label).filter(Boolean).join(', ') || '—'
  const detalhesAtivos = (['corpo', 'friso', 'punho', 'gola', 'manga', 'bolso'] as const).filter(d => pedido.detalhes?.[d])
  const totalPedido = pedido.pecas?.reduce((s, p) => s + p.precoUnitario, 0) ?? (pedido.precoUnitario * pedido.quantidadeTotal)

  const CATEGORIA_LABEL: Record<string, string> = { unissex: 'Unissex', babylook: 'Babylook', infantil: 'Infantil' }
  const resumo = (pedido.pecas || []).reduce<Record<string, number>>((acc, p) => {
    const k = `${CATEGORIA_LABEL[p.categoria] || p.categoria} ${p.tamanho}`
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

  return (
    <>
      {/* Barra de ações — só na tela */}
      <div className="no-print bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
        <Link href={`/pedido/${id}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-semibold">
          <ArrowLeft size={16} /> Voltar ao Pedido
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold text-sm transition"
        >
          <Printer size={16} /> Imprimir / Salvar PDF
        </button>
      </div>

      {/* Folha A4 */}
      <div className="cliente-folha bg-white mx-auto my-6 shadow-lg print:shadow-none print:my-0">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-orange-500 mb-6">
          <div className="flex items-center gap-3">
            <img src="/logo-pap.png" alt="Passo a Passo" style={{ height: 44 }} />
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Passo a Passo Uniformes</div>
              <div className="text-xs text-gray-400">Dados do Cliente</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">Pedido #{pedido.numeroPedido}</div>
            <div className="text-xs text-gray-500">Emitido em: {formatarData(new Date().toISOString().split('T')[0])}</div>
            <div className="text-xs text-red-600 font-bold">Entrega: {formatarData(pedido.dataEntregaPrevista)}</div>
          </div>
        </div>

        {/* ── DADOS DO CLIENTE ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
              {isEmpresa ? 'Dados da Empresa' : 'Dados do Cliente'}
            </h2>
          </div>

          {isEmpresa ? (
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Razão Social</p>
                <p className="text-sm font-bold text-gray-900">{empresa?.razaoSocial || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">CNPJ</p>
                <p className="text-sm font-semibold text-gray-800">{empresa?.cnpj || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Nome do Contato</p>
                <p className="text-sm font-semibold text-gray-800">{empresa?.contato || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Telefone</p>
                <p className="text-sm font-semibold text-gray-800">{empresa?.telefone || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">E-mail</p>
                <p className="text-sm font-semibold text-gray-800">{empresa?.email || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Endereço</p>
                <p className="text-sm font-semibold text-gray-800">{empresa?.endereco || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Cidade / Estado</p>
                <p className="text-sm font-semibold text-gray-800">{empresa?.cidade || '—'}{empresa?.estado ? ` / ${empresa.estado}` : ''}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">CEP</p>
                <p className="text-sm font-semibold text-gray-800">{empresa?.cep || '—'}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              <div className="col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Nome Completo</p>
                <p className="text-sm font-bold text-gray-900">{pf?.nomeCompleto || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">CPF</p>
                <p className="text-sm font-semibold text-gray-800">{pf?.cpf || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Telefone</p>
                <p className="text-sm font-semibold text-gray-800">{pf?.telefone || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">E-mail</p>
                <p className="text-sm font-semibold text-gray-800">{pf?.email || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Endereço</p>
                <p className="text-sm font-semibold text-gray-800">{pf?.endereco || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Cidade / Estado</p>
                <p className="text-sm font-semibold text-gray-800">{pf?.cidade || '—'}{pf?.estado ? ` / ${pf.estado}` : ''}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">CEP</p>
                <p className="text-sm font-semibold text-gray-800">{pf?.cep || '—'}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── DADOS DO PEDIDO ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Dados do Pedido</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Nº Pedido', value: pedido.numeroPedido },
              { label: 'Data do Pedido', value: formatarData(pedido.dataPedido) },
              { label: 'Entrega Prevista', value: formatarData(pedido.dataEntregaPrevista), destaque: true },
              { label: 'Vendedor', value: pedido.nomeVendedor },
              { label: 'Qtd. de Peças', value: `${pedido.quantidadeTotal} peças` },
              { label: 'Total', value: formatarMoeda(totalPedido), destaque: true },
            ].map(item => (
              <div key={item.label} className="border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">{item.label}</p>
                <p className={`text-sm font-bold ${item.destaque ? 'text-orange-600' : 'text-gray-900'}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRODUTO ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
            <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Produto</h2>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 border border-gray-200 rounded-xl p-4 bg-gray-50/50">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Modelo</p>
              <p className="text-sm font-bold text-gray-900">{modeloLabel}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Material</p>
              <p className="text-sm font-semibold text-gray-800">{materialLabel}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Cor</p>
              <p className="text-sm font-semibold text-gray-800">{cor}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Fornecedor</p>
              <p className="text-sm font-semibold text-gray-800">{pedido.fornecedor || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Tipo de Estampa</p>
              <p className="text-sm font-semibold text-gray-800">{estampas}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Preço Unitário Base</p>
              <p className="text-sm font-bold text-orange-600">{formatarMoeda(pedido.precoUnitario)}</p>
            </div>

            {/* Referências */}
            {(pedido.referenciaUnissex || pedido.referenciaBabylook || pedido.referenciaInfantil) && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Referências</p>
                <div className="flex gap-6 text-xs">
                  {pedido.referenciaUnissex && <span>Unissex: <strong>{pedido.referenciaUnissex}</strong></span>}
                  {pedido.referenciaBabylook && <span>Baby Look: <strong>{pedido.referenciaBabylook}</strong></span>}
                  {pedido.referenciaInfantil && <span>Infantil: <strong>{pedido.referenciaInfantil}</strong></span>}
                </div>
              </div>
            )}

            {/* Detalhes da peça */}
            {detalhesAtivos.length > 0 && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Detalhes da Peça</p>
                <div className="flex flex-wrap gap-2">
                  {detalhesAtivos.map(d => {
                    const desc = pedido.detalhes?.[`${d}Desc` as keyof typeof pedido.detalhes] as string
                    return (
                      <span key={d} className="px-2 py-0.5 bg-orange-50 border border-orange-200 rounded text-xs font-semibold text-orange-700">
                        {d.charAt(0).toUpperCase() + d.slice(1)}{desc ? `: ${desc}` : ''}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── TAMANHOS ── */}
        {Object.keys(resumo).length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Resumo de Tamanhos</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(resumo).map(([k, v]) => (
                <div key={k} className="px-3 py-1.5 bg-orange-500 text-white rounded text-xs font-bold">
                  {k}: {v} {v === 1 ? 'peça' : 'peças'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── NOMES/NÚMEROS ── */}
        {pedido.pecas?.some(p => p.nomeNaCamiseta || p.numeroNaCamiseta) && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">5</span>
              </div>
              <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Nomes / Números na Peça</h2>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="px-3 py-2 text-left font-bold">#</th>
                    <th className="px-3 py-2 text-left font-bold">Nome da Pessoa</th>
                    <th className="px-3 py-2 text-left font-bold">Categoria / Tam.</th>
                    <th className="px-3 py-2 text-left font-bold">Nome na Peça</th>
                    <th className="px-3 py-2 text-left font-bold">Nº na Peça</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.pecas.filter(p => p.nomeNaCamiseta || p.numeroNaCamiseta).map((p, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{p.pessoaNome || '—'}</td>
                      <td className="px-3 py-2">{CATEGORIA_LABEL[p.categoria]} {p.tamanho}</td>
                      <td className="px-3 py-2">{p.nomeNaCamiseta || '—'}</td>
                      <td className="px-3 py-2 font-bold text-orange-600">{p.numeroNaCamiseta || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div className="border-t border-gray-200 pt-4 flex items-end justify-between">
          <div className="text-xs text-gray-400">
            <p>Passo a Passo Uniformes — Sistema de Pedidos</p>
            <p>Documento gerado em: {new Date().toLocaleString('pt-BR')}</p>
          </div>
          <div className="text-xs text-gray-400 text-right">
            <p>Pedido #{pedido.numeroPedido}</p>
            <p>Vendedor: {pedido.nomeVendedor}</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: white; }
          .cliente-folha {
            margin: 0;
            box-shadow: none;
            width: 100%;
            max-width: 100%;
          }
        }
        .cliente-folha {
          max-width: 900px;
          padding: 32px 36px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
    </>
  )
}
