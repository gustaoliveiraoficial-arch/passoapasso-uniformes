'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { buscarPedido } from '@/lib/firebase'
import type { Pedido } from '@/types/pedido'
import { CATALOGO } from '@/lib/catalog'
import { formatarData, formatarMoeda } from '@/lib/utils'
import { Printer, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const CATEGORIA_LABEL: Record<string, string> = {
  unissex: 'Unissex',
  babylook: 'Babylook',
  infantil: 'Infantil',
}

export default function ListaTamanhosPage() {
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

  const nomeCliente = pedido.clienteType === 'empresa'
    ? pedido.clienteEmpresa?.razaoSocial || '—'
    : pedido.clientePF?.nomeCompleto || '—'

  const modeloLabel = CATALOGO[pedido.modelo]?.label || pedido.modelo
  const materialLabel = CATALOGO[pedido.modelo]?.materiais[pedido.material]?.label || pedido.material
  const cor = pedido.cor === 'Personalizada' ? pedido.corPersonalizada : pedido.cor

  const pecas = pedido.pecas || []
  const total = pecas.reduce((s, p) => s + p.precoUnitario, 0)

  // Resumo por tamanho
  const resumo = pecas.reduce<Record<string, number>>((acc, p) => {
    const k = `${CATEGORIA_LABEL[p.categoria] || p.categoria} ${p.tamanho}`
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

  return (
    <>
      {/* Barra de ações — só na tela, some na impressão */}
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
      <div className="lista-folha bg-white mx-auto my-6 shadow-lg print:shadow-none print:my-0">

        {/* Cabeçalho */}
        <div className="lista-header flex items-center justify-between pb-4 border-b-2 border-orange-500 mb-5">
          <div className="flex items-center gap-3">
            <img src="/logo-pap.png" alt="Passo a Passo" style={{ height: 44 }} />
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Passo a Passo Uniformes</div>
              <div className="text-xs text-gray-400">Lista de Tamanhos</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">Pedido #{pedido.numeroPedido}</div>
            <div className="text-xs text-gray-500">Emitido em: {formatarData(new Date().toISOString().split('T')[0])}</div>
          </div>
        </div>

        {/* Info do pedido */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="col-span-2">
            <div className="lista-info-box">
              <p className="lista-info-label">Cliente</p>
              <p className="lista-info-value font-bold">{nomeCliente}</p>
              {pedido.clienteType === 'empresa' && pedido.clienteEmpresa?.contato && (
                <p className="lista-info-sub">Contato: {pedido.clienteEmpresa.contato}</p>
              )}
            </div>
          </div>
          <div>
            <div className="lista-info-box">
              <p className="lista-info-label">Vendedor</p>
              <p className="lista-info-value">{pedido.nomeVendedor}</p>
            </div>
          </div>
          <div>
            <div className="lista-info-box">
              <p className="lista-info-label">Produto</p>
              <p className="lista-info-value font-bold">{modeloLabel}</p>
              <p className="lista-info-sub">{materialLabel}</p>
            </div>
          </div>
          <div>
            <div className="lista-info-box">
              <p className="lista-info-label">Cor</p>
              <p className="lista-info-value">{cor}</p>
            </div>
          </div>
          <div>
            <div className="lista-info-box">
              <p className="lista-info-label">Entrega Prevista</p>
              <p className="lista-info-value text-red-600 font-bold">{formatarData(pedido.dataEntregaPrevista)}</p>
            </div>
          </div>
          <div>
            <div className="lista-info-box">
              <p className="lista-info-label">Qtd. Total</p>
              <p className="lista-info-value font-bold">{pedido.quantidadeTotal} peças</p>
            </div>
          </div>
          <div>
            <div className="lista-info-box">
              <p className="lista-info-label">Preço Base Unit.</p>
              <p className="lista-info-value font-bold text-orange-600">{formatarMoeda(pedido.precoUnitario)}</p>
            </div>
          </div>
          <div>
            <div className="lista-info-box bg-orange-50 border-orange-200">
              <p className="lista-info-label text-orange-700">Total do Pedido</p>
              <p className="lista-info-value text-xl font-bold text-orange-600">{formatarMoeda(total)}</p>
            </div>
          </div>
        </div>

        {/* Aviso XG */}
        {pecas.some(p => ['XG', 'XXG', 'XXXG'].includes(p.tamanho)) && (
          <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 font-semibold">
            ⚠️ Peças nos tamanhos XG, XXG e XXXG têm acréscimo de 30% no preço unitário.
          </div>
        )}
        {pecas.some(p => p.categoria === 'infantil') && (
          <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800 font-semibold">
            ℹ️ Peças infantis têm desconto de R$5,00 no preço unitário.
          </div>
        )}

        {/* Tabela de tamanhos */}
        <table className="lista-tabela w-full mb-5">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="lista-th text-center w-10">#</th>
              <th className="lista-th">Nome da Pessoa</th>
              <th className="lista-th">Nome na Peça</th>
              <th className="lista-th">Nº na Peça</th>
              <th className="lista-th">Categoria</th>
              <th className="lista-th text-center">Tamanho</th>
              <th className="lista-th text-right">Valor Unit.</th>
            </tr>
          </thead>
          <tbody>
            {pecas.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400 text-sm">
                  Nenhuma peça com tamanho preenchido.
                </td>
              </tr>
            ) : (
              pecas.map((peca, idx) => (
                <tr key={peca.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="lista-td text-center text-gray-500">{idx + 1}</td>
                  <td className="lista-td font-medium">{peca.pessoaNome || '—'}</td>
                  <td className="lista-td text-gray-600">{peca.nomeNaCamiseta || '—'}</td>
                  <td className="lista-td text-center text-gray-600">{peca.numeroNaCamiseta || '—'}</td>
                  <td className="lista-td">{CATEGORIA_LABEL[peca.categoria] || peca.categoria}</td>
                  <td className="lista-td text-center font-bold">{peca.tamanho}</td>
                  <td className="lista-td text-right font-semibold text-orange-700">{formatarMoeda(peca.precoUnitario)}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-800 text-white">
              <td colSpan={5} className="lista-td font-bold text-right">
                TOTAL — {pecas.length} {pecas.length === 1 ? 'peça' : 'peças'}
              </td>
              <td className="lista-td" />
              <td className="lista-td text-right font-bold text-lg">{formatarMoeda(total)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Resumo por tamanho */}
        {Object.keys(resumo).length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Resumo por Tamanho</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(resumo).map(([k, v]) => (
                <div key={k} className="px-3 py-1.5 bg-orange-500 text-white rounded text-xs font-bold">
                  {k}: {v} {v === 1 ? 'peça' : 'peças'}
                </div>
              ))}
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
          .lista-folha {
            margin: 0;
            box-shadow: none;
            width: 100%;
            max-width: 100%;
          }
        }

        .lista-folha {
          max-width: 900px;
          padding: 32px 36px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .lista-info-box {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 12px;
          height: 100%;
        }

        .lista-info-label {
          font-size: 10px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }

        .lista-info-value {
          font-size: 13px;
          color: #111827;
        }

        .lista-info-sub {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 2px;
        }

        .lista-tabela {
          border-collapse: collapse;
          font-size: 12px;
        }

        .lista-th {
          padding: 8px 10px;
          font-size: 11px;
          font-weight: 700;
          text-align: left;
          letter-spacing: 0.03em;
        }

        .lista-td {
          padding: 7px 10px;
          font-size: 12px;
          border-bottom: 1px solid #f3f4f6;
          color: #111827;
        }
      `}</style>
    </>
  )
}
