'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { listarPedidos, duplicarPedido } from '@/lib/firebase'
import type { Pedido } from '@/types/pedido'
import { STATUS_LABELS, STATUS_COLORS } from '@/types/pedido'
import { formatarData, gerarLinkCliente, gerarLinkArteFinalista } from '@/lib/utils'
import { PlusCircle, Search, Copy, ExternalLink, RefreshCw, CopyPlus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const router = useRouter()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [duplicandoId, setDuplicandoId] = useState<string | null>(null)

  async function carregar() {
    setLoading(true)
    try {
      const lista = await listarPedidos()
      setPedidos(lista)
    } catch (e) {
      toast.error('Erro ao carregar pedidos. Verifique a conexão com Firebase.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  function copiar(texto: string, label: string) {
    navigator.clipboard.writeText(texto)
    toast.success(`${label} copiado!`)
  }

  async function handleDuplicar(id: string) {
    setDuplicandoId(id)
    try {
      const novoId = await duplicarPedido(id)
      toast.success('Pedido duplicado!')
      router.push(`/pedido/${novoId}`)
    } catch {
      toast.error('Erro ao duplicar pedido')
    } finally {
      setDuplicandoId(null)
    }
  }

  const nomeCliente = (p: Pedido) =>
    p.clienteType === 'empresa'
      ? p.clienteEmpresa?.razaoSocial || '—'
      : p.clientePF?.nomeCompleto || '—'

  const STATUS_ORDER = ['dados', 'tamanhos', 'arquivos', 'pagamento', 'confirmacao'] as const
  const STATUS_STEP_LABELS = ['Dados', 'Tam.', 'Arq.', 'Pag.', 'OK']

  function ProgressDots({ status }: { status: string }) {
    const currentIdx = STATUS_ORDER.indexOf(status as typeof STATUS_ORDER[number])
    return (
      <div className="flex items-center gap-1" title={`Etapa ${currentIdx + 1} de 4`}>
        {STATUS_ORDER.map((s, i) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < currentIdx
                ? 'bg-green-500'
                : i === currentIdx
                ? 'bg-orange-500'
                : 'bg-gray-200'
            }`}
            title={STATUS_STEP_LABELS[i]}
          />
        ))}
      </div>
    )
  }

  const filtrados = pedidos.filter(p => {
    const matchBusca =
      !busca ||
      nomeCliente(p).toLowerCase().includes(busca.toLowerCase()) ||
      p.numeroPedido.toLowerCase().includes(busca.toLowerCase()) ||
      p.nomeVendedor.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus
    return matchBusca && matchStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-pap.png" alt="Passo a Passo Uniformes" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Passo a Passo Uniformes</h1>
              <p className="text-xs text-gray-500">Sistema de Pedidos</p>
            </div>
          </div>
          <Link
            href="/novo-pedido"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
          >
            <PlusCircle size={18} />
            Novo Pedido
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, pedido ou vendedor..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="input-base pl-9"
            />
          </div>
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="input-base w-auto min-w-[160px]"
          >
            <option value="todos">Todos os status</option>
            <option value="dados">1. Dados</option>
            <option value="tamanhos">2. Tamanhos</option>
            <option value="arquivos">3. Arquivos</option>
            <option value="pagamento">4. Pagamento</option>
            <option value="confirmacao">5. Confirmação</option>
          </select>
          <button
            onClick={carregar}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {(['dados', 'tamanhos', 'arquivos', 'pagamento', 'confirmacao'] as const).map(s => {
            const count = pedidos.filter(p => p.status === s).length
            return (
              <div key={s} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${STATUS_COLORS[s]}`}>
                  {STATUS_LABELS[s]}
                </div>
              </div>
            )
          })}
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-gray-400">Carregando pedidos...</div>
          ) : filtrados.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              {pedidos.length === 0 ? 'Nenhum pedido cadastrado ainda.' : 'Nenhum resultado encontrado.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Nº Pedido</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Cliente</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Vendedor</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Modelo</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Peças</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Entrega</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Progresso</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Links</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtrados.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono font-semibold text-gray-900">{p.numeroPedido || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{nomeCliente(p)}</div>
                        <div className="text-xs text-gray-400 capitalize">{p.clienteType === 'empresa' ? 'Empresa' : 'Pessoa Física'}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{p.nomeVendedor}</td>
                      <td className="px-4 py-3 text-gray-700 capitalize">{p.modelo?.replace(/_/g, ' ')}</td>
                      <td className="px-4 py-3 text-center font-semibold">{p.quantidadeTotal}</td>
                      <td className="px-4 py-3 text-gray-700">{formatarData(p.dataEntregaPrevista)}</td>
                      <td className="px-4 py-3">
                        <ProgressDots status={p.status} />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[p.status]}`}>
                          {STATUS_LABELS[p.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {p.status !== 'dados' && (
                            <button
                              onClick={() => copiar(gerarLinkCliente(p.clienteToken), 'Link do cliente')}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                              title="Copiar link para o cliente preencher tamanhos"
                            >
                              <Copy size={11} /> Link Tamanhos
                            </button>
                          )}
                          <button
                            onClick={() => copiar(gerarLinkArteFinalista(p.id), 'Link arte-finalista')}
                            className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800"
                            title="Copiar link para arte-finalista"
                          >
                            <Copy size={11} /> Link Arte
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/pedido/${p.id}`}
                            className="flex items-center gap-1 text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 px-2 py-1 rounded font-semibold transition"
                          >
                            <ExternalLink size={12} /> Abrir
                          </Link>
                          <button
                            onClick={() => handleDuplicar(p.id)}
                            disabled={duplicandoId === p.id}
                            className="flex items-center gap-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-2 py-1 rounded font-semibold transition border border-gray-200 disabled:opacity-40"
                            title="Duplicar pedido"
                          >
                            <CopyPlus size={12} /> {duplicandoId === p.id ? '...' : 'Dup.'}
                          </button>
                          {p.status === 'confirmacao' && (
                            <Link
                              href={`/confirmacao/${p.id}`}
                              className="flex items-center gap-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded font-semibold transition"
                            >
                              PDF
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">{filtrados.length} pedido(s) exibido(s)</p>
      </main>
    </div>
  )
}
