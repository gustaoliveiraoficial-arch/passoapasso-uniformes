'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { buscarPedido, uploadArquivo, atualizarPedido, atualizarStatus } from '@/lib/firebase'
import type { Pedido, CategoriaSize, EstampaQuadro } from '@/types/pedido'
import { TIPOS_ESTAMPA, POSICOES_ESTAMPA, TIPOS_ESTAMPA_QUADRO } from '@/types/pedido'
import { formatarData } from '@/lib/utils'
import { CATALOGO } from '@/lib/catalog'
import toast from 'react-hot-toast'
import { Upload, Trash2, ExternalLink, Check, AlertCircle, ImageIcon, FileText, Info, ChevronDown, ChevronUp, Plus, X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

type UploadErro = { filename: string; message: string }

const CAT_LABEL: Record<CategoriaSize, string> = { unissex: 'Unissex', babylook: 'Baby Look', infantil: 'Infantil' }

function formatarMoeda(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ArquivosArteFinalista() {
  const { id } = useParams<{ id: string }>()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadandoLayouts, setUploadandoLayouts] = useState(false)
  const [uploadandoVetores, setUploadandoVetores] = useState(false)
  const [confirmado, setConfirmado] = useState(false)
  const [erros, setErros] = useState<UploadErro[]>([])
  const [dragLayouts, setDragLayouts] = useState(false)
  const [dragVetores, setDragVetores] = useState(false)
  const [briefAberto, setBriefAberto] = useState(true)
  const [tamanhosAberto, setTamanhosAberto] = useState(false)

  // Quadros de estampa — estado local editável
  const [quadros, setQuadros] = useState<EstampaQuadro[]>([])
  const [salvandoQuadros, setSalvandoQuadros] = useState(false)
  const [uploadandoQuadroId, setUploadandoQuadroId] = useState<string | null>(null)
  const quadroInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  async function carregar() {
    const p = await buscarPedido(id)
    setPedido(p)
    if (p?.estampaQuadros?.length) setQuadros(p.estampaQuadros)
    setLoading(false)
  }

  useEffect(() => { carregar() }, [id])

  // ── Layouts / Vetores ──
  async function handleUpload(files: FileList | File[], pasta: 'layouts' | 'vetores') {
    if (!files || !pedido) return
    const lista = Array.from(files)
    if (lista.length === 0) return
    if (pasta === 'layouts') setUploadandoLayouts(true)
    else setUploadandoVetores(true)
    setErros([])
    const novas: string[] = []
    const novosErros: UploadErro[] = []
    for (const file of lista) {
      try {
        novas.push(await uploadArquivo(id, file, pasta))
      } catch (err: unknown) {
        novosErros.push({ filename: file.name, message: err instanceof Error ? err.message : 'Erro desconhecido' })
      }
    }
    if (novas.length > 0) {
      const campo = pasta === 'layouts' ? 'layoutImages' : 'vetoresFiles'
      const atual = pasta === 'layouts' ? (pedido.layoutImages ?? []) : (pedido.vetoresFiles ?? [])
      await atualizarPedido(id, { [campo]: [...atual, ...novas] })
      toast.success(`${novas.length} arquivo(s) enviado(s)!`)
      await carregar()
    }
    if (novosErros.length > 0) { setErros(novosErros); toast.error(`Erro em ${novosErros.length} arquivo(s)`) }
    if (pasta === 'layouts') setUploadandoLayouts(false)
    else setUploadandoVetores(false)
  }

  function handleDrop(e: React.DragEvent, pasta: 'layouts' | 'vetores') {
    e.preventDefault()
    if (pasta === 'layouts') setDragLayouts(false); else setDragVetores(false)
    if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files, pasta)
  }

  async function remover(url: string, pasta: 'layouts' | 'vetores') {
    if (!pedido) return
    const campo = pasta === 'layouts' ? 'layoutImages' : 'vetoresFiles'
    const atual = pasta === 'layouts' ? (pedido.layoutImages ?? []) : (pedido.vetoresFiles ?? [])
    await atualizarPedido(id, { [campo]: atual.filter(u => u !== url) })
    toast.success('Arquivo removido')
    await carregar()
  }

  // ── Quadros de estampa ──
  function addQuadro() {
    setQuadros(q => [...q, { id: uuidv4(), posicao: 'Frente', tiposEstampa: [], imagem: '', descricaoCores: '' }])
  }

  function removeQuadro(qid: string) {
    setQuadros(q => q.filter(x => x.id !== qid))
  }

  function updateQuadro(qid: string, campo: Partial<EstampaQuadro>) {
    setQuadros(q => q.map(x => x.id === qid ? { ...x, ...campo } : x))
  }

  function toggleTipoEstampaQuadro(qid: string, tipo: string) {
    setQuadros(q => q.map(x => {
      if (x.id !== qid) return x
      const tipos = x.tiposEstampa.includes(tipo)
        ? x.tiposEstampa.filter(t => t !== tipo)
        : [...x.tiposEstampa, tipo]
      return { ...x, tiposEstampa: tipos }
    }))
  }

  async function uploadImagemQuadro(qid: string, file: File) {
    setUploadandoQuadroId(qid)
    try {
      const url = await uploadArquivo(id, file, 'layouts')
      updateQuadro(qid, { imagem: url })
      toast.success('Imagem da estampa enviada!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar imagem')
    } finally {
      setUploadandoQuadroId(null)
    }
  }

  async function salvarQuadros() {
    if (!pedido) return
    setSalvandoQuadros(true)
    try {
      await atualizarPedido(id, { estampaQuadros: quadros })
      toast.success('Quadros salvos!')
      await carregar()
    } catch {
      toast.error('Erro ao salvar quadros')
    } finally {
      setSalvandoQuadros(false)
    }
  }

  async function confirmarArquivos() {
    if (!pedido) return
    if (!pedido.layoutImages?.length) { toast.error('Envie ao menos uma imagem de layout antes de confirmar.'); return }
    await atualizarStatus(id, 'confirmacao')
    setConfirmado(true)
    toast.success('Arquivos confirmados!')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Carregando...</p>
      </div>
    </div>
  )

  if (!pedido) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl p-8 shadow text-center">
        <p className="text-2xl font-bold text-gray-900 mb-2">Pedido não encontrado</p>
      </div>
    </div>
  )

  if (confirmado) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-10 shadow text-center max-w-md w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-green-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900 mb-2">Arquivos confirmados!</p>
        <p className="text-gray-500 text-sm">O pedido avançou para Confirmação para Produção.</p>
      </div>
    </div>
  )

  const nomeCliente = pedido.clienteType === 'empresa' ? pedido.clienteEmpresa?.razaoSocial : pedido.clientePF?.nomeCompleto
  const telefone = pedido.clienteType === 'empresa' ? pedido.clienteEmpresa?.telefone : pedido.clientePF?.telefone
  const email = pedido.clienteType === 'empresa' ? pedido.clienteEmpresa?.email : pedido.clientePF?.email
  const modeloLabel = CATALOGO[pedido.modelo]?.label || pedido.modelo
  const materialLabel = CATALOGO[pedido.modelo]?.materiais[pedido.material]?.label || pedido.material
  const corFinal = pedido.cor === 'Personalizada' ? pedido.corPersonalizada : pedido.cor
  const estampas = pedido.tiposEstampa?.map(t => TIPOS_ESTAMPA.find(e => e.value === t)?.label).filter(Boolean).join(', ')
  const detalhesAtivos = (['corpo', 'friso', 'punho', 'gola', 'manga', 'bolso'] as const).filter(d => pedido.detalhes?.[d])
  const temLayouts = (pedido.layoutImages?.length ?? 0) > 0
  const temVetores = (pedido.vetoresFiles?.length ?? 0) > 0

  // Totais financeiros
  const totalPedido = pedido.pecas?.reduce((s, p) => s + p.precoUnitario, 0) ?? (pedido.precoUnitario * pedido.quantidadeTotal)

  // Agrupa tamanhos
  const agrupado: Record<string, number> = {}
  pedido.pecas?.forEach(p => {
    const k = `${CAT_LABEL[p.categoria]} ${p.tamanho}`
    agrupado[k] = (agrupado[k] || 0) + 1
  })

  const comPersonalizacao = pedido.pecas?.filter(p => p.nomeNaCamiseta || p.numeroNaCamiseta) ?? []

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <img src="/logo-pap.png" alt="Passo a Passo Uniformes" className="h-9 w-auto flex-shrink-0" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">Arte-Finalista</h1>
            <p className="text-xs text-gray-500">Passo a Passo Uniformes — Pedido #{pedido.numeroPedido}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs font-bold text-red-600">Entrega: {formatarData(pedido.dataEntregaPrevista)}</p>
            <p className="text-xs text-gray-500">Vendedor: {pedido.nomeVendedor}</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-4">

        {/* ── BRIEF COMPLETO DO PEDIDO ── */}
        <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-sm overflow-hidden">
          <button onClick={() => setBriefAberto(v => !v)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-purple-50/30 transition text-left">
            <div className="flex items-center gap-3">
              <span className="text-xl">📋</span>
              <div>
                <p className="font-bold text-gray-900">Brief do Pedido</p>
                <p className="text-xs text-gray-500">Todas as informações para criar o layout</p>
              </div>
            </div>
            {briefAberto ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>

          {briefAberto && (
            <div className="border-t border-purple-100 divide-y divide-gray-100">

              {/* Mensagem do vendedor — destaque */}
              {pedido.mensagemMockup && (
                <div className="px-5 py-4 bg-orange-50">
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-2">💬 Instrução do Vendedor</p>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{pedido.mensagemMockup}</p>
                </div>
              )}

              {/* Cliente */}
              <div className="px-5 py-4 grid grid-cols-2 gap-x-6 gap-y-2">
                <div className="col-span-2">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-2">Cliente</p>
                  <p className="font-bold text-gray-900 text-lg">{nomeCliente}</p>
                </div>
                {telefone && <div><p className="text-xs text-gray-400">Telefone</p><p className="text-sm font-semibold">{telefone}</p></div>}
                {email && <div><p className="text-xs text-gray-400">E-mail</p><p className="text-sm font-semibold truncate">{email}</p></div>}
              </div>

              {/* Produto */}
              <div className="px-5 py-4">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-3">Produto</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div><p className="text-xs text-gray-400">Modelo</p><p className="font-bold text-gray-900">{modeloLabel}</p></div>
                  <div><p className="text-xs text-gray-400">Material</p><p className="font-semibold">{materialLabel}</p></div>
                  <div><p className="text-xs text-gray-400">Cor</p>
                    <p className="font-semibold flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full border border-gray-300 inline-block flex-shrink-0" style={{ background: corFinal.toLowerCase() }} />
                      {corFinal}
                    </p>
                  </div>
                  <div><p className="text-xs text-gray-400">Fornecedor</p><p className="font-semibold">{pedido.fornecedor}</p></div>
                  <div><p className="text-xs text-gray-400">Quantidade</p><p className="font-bold text-orange-600">{pedido.quantidadeTotal} peças</p></div>
                  {estampas && <div><p className="text-xs text-gray-400">Tipo de estampa</p><p className="font-semibold">{estampas}</p></div>}
                </div>
              </div>

              {/* Valores */}
              <div className="px-5 py-4 bg-green-50/60">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-3">Valores</p>
                <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Preço unitário base</p>
                    <p className="font-bold text-gray-900">{formatarMoeda(pedido.precoUnitario)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Qtd. total</p>
                    <p className="font-bold text-gray-900">{pedido.quantidadeTotal} pc</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total estimado</p>
                    <p className="font-bold text-green-700 text-base">{formatarMoeda(totalPedido)}</p>
                  </div>
                </div>
                {pedido.pecas?.some(p => ['XG','XXG','XXXG'].includes(p.tamanho)) && (
                  <p className="text-xs text-amber-600 mt-2">⚠️ Inclui peças XG/XXG/XXXG com acréscimo de 30%.</p>
                )}
              </div>

              {/* Detalhes da peça */}
              {detalhesAtivos.length > 0 && (
                <div className="px-5 py-4">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-2">Detalhes da Peça</p>
                  <div className="flex flex-wrap gap-2">
                    {detalhesAtivos.map(d => {
                      const desc = pedido.detalhes?.[`${d}Desc` as keyof typeof pedido.detalhes] as string
                      return (
                        <span key={d} className="px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-xs font-semibold text-orange-700">
                          {d.charAt(0).toUpperCase() + d.slice(1)}{desc ? `: ${desc}` : ''}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Referências por categoria */}
              {(pedido.referenciaUnissex || pedido.referenciaBabylook || pedido.referenciaInfantil) && (
                <div className="px-5 py-4">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-2">Referências</p>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    {pedido.referenciaUnissex && <div><p className="text-gray-400">Unissex</p><p className="font-semibold">{pedido.referenciaUnissex}</p></div>}
                    {pedido.referenciaBabylook && <div><p className="text-gray-400">Baby Look</p><p className="font-semibold">{pedido.referenciaBabylook}</p></div>}
                    {pedido.referenciaInfantil && <div><p className="text-gray-400">Infantil</p><p className="font-semibold">{pedido.referenciaInfantil}</p></div>}
                  </div>
                </div>
              )}

              {/* Tamanhos resumo */}
              {Object.keys(agrupado).length > 0 && (
                <div className="px-5 py-4">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-2">Tamanhos — {pedido.quantidadeTotal} peças</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(agrupado).map(([k, q]) => (
                      <div key={k} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700">
                        {k} × {q}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── NOMES E NÚMEROS PERSONALIZADOS ── */}
        {comPersonalizacao.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm overflow-hidden">
            <button onClick={() => setTamanhosAberto(v => !v)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-indigo-50/30 transition text-left">
              <div className="flex items-center gap-3">
                <span className="text-xl">👕</span>
                <div>
                  <p className="font-bold text-gray-900">Nomes e Números Personalizados</p>
                  <p className="text-xs text-gray-500">{comPersonalizacao.length} peça(s) com personalização</p>
                </div>
              </div>
              {tamanhosAberto ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
            </button>
            {tamanhosAberto && (
              <div className="border-t border-indigo-100 divide-y divide-gray-50">
                {pedido.pecas?.map((p, i) => (p.nomeNaCamiseta || p.numeroNaCamiseta) ? (
                  <div key={i} className="px-5 py-3 flex items-center gap-4 text-sm">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      {p.pessoaNome && <p className="text-xs text-gray-400">{p.pessoaNome}</p>}
                      <p className="font-semibold text-gray-900">{CAT_LABEL[p.categoria]} {p.tamanho}</p>
                    </div>
                    {p.nomeNaCamiseta && (
                      <div className="text-center px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-400 mb-0.5">Nome na peça</p>
                        <p className="font-bold text-blue-700 text-sm">{p.nomeNaCamiseta}</p>
                      </div>
                    )}
                    {p.numeroNaCamiseta && (
                      <div className="text-center px-3 py-1 bg-orange-50 border border-orange-200 rounded-lg min-w-[3rem]">
                        <p className="text-xs text-orange-400 mb-0.5">Nº</p>
                        <p className="font-bold text-orange-700 text-lg leading-tight">{p.numeroNaCamiseta}</p>
                      </div>
                    )}
                  </div>
                ) : null)}
              </div>
            )}
          </div>
        )}

        {/* ── ARTES DO CLIENTE ── */}
        {(pedido.artesCliente?.length ?? 0) > 0 && (
          <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-amber-100 flex items-center gap-3">
              <span className="text-xl">🎨</span>
              <div>
                <p className="font-bold text-gray-900">Artes do Cliente</p>
                <p className="text-xs text-gray-500">Estampas, logos e referências enviadas pelo cliente</p>
              </div>
              <span className="ml-auto px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">{pedido.artesCliente!.length}</span>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {pedido.artesCliente!.map((url, i) => {
                const isPdf = url.includes('/raw/') || url.toLowerCase().includes('.pdf')
                return (
                  <div key={i} className="group relative">
                    {isPdf ? (
                      <a href={url} target="_blank" rel="noopener noreferrer"
                        className="w-full aspect-square flex flex-col items-center justify-center bg-red-50 rounded-xl border border-red-200 gap-2">
                        <span className="text-3xl">📄</span>
                        <span className="text-xs font-bold text-red-600">PDF — Abrir</span>
                      </a>
                    ) : (
                      <>
                        <img src={url} alt={`Arte cliente ${i + 1}`} className="w-full aspect-square object-cover rounded-xl border border-amber-100" />
                        <a href={url} target="_blank" rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <ExternalLink size={20} className="text-white" />
                        </a>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── RASCUNHO DO VENDEDOR ── */}
        {(pedido.rascunhoVendedor?.length ?? 0) > 0 && (
          <div className="bg-white rounded-2xl border-2 border-green-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-green-100 flex items-center gap-3">
              <span className="text-xl">✏️</span>
              <div>
                <p className="font-bold text-gray-900">Rascunho / Ideia de Layout</p>
                <p className="text-xs text-gray-500">Mockup inicial criado pelo vendedor</p>
              </div>
              <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">{pedido.rascunhoVendedor!.length}</span>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {pedido.rascunhoVendedor!.map((url, i) => {
                const isPdf = url.includes('/raw/') || url.toLowerCase().includes('.pdf')
                return (
                  <div key={i} className="group relative">
                    {isPdf ? (
                      <a href={url} target="_blank" rel="noopener noreferrer"
                        className="w-full aspect-square flex flex-col items-center justify-center bg-blue-50 rounded-xl border border-blue-200 gap-2">
                        <span className="text-3xl">📄</span>
                        <span className="text-xs font-bold text-blue-600">PDF — Abrir</span>
                      </a>
                    ) : (
                      <>
                        <img src={url} alt={`Rascunho ${i + 1}`} className="w-full aspect-square object-cover rounded-xl border border-green-100" />
                        <a href={url} target="_blank" rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <ExternalLink size={20} className="text-white" />
                        </a>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!(pedido.artesCliente?.length) && !(pedido.rascunhoVendedor?.length) && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">Nenhuma arte de referência ou rascunho foi adicionado pelo vendedor ainda.</p>
          </div>
        )}

        {/* ── QUADROS DE ESTAMPA ── */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-blue-100 flex items-center gap-3">
            <span className="text-xl">🖨️</span>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Quadros de Estampa</p>
              <p className="text-xs text-gray-500">Tipo, imagem e cores de cada posição de estampa</p>
            </div>
            <button onClick={addQuadro}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition">
              <Plus size={14} /> Adicionar
            </button>
          </div>

          <div className="p-4 space-y-4">
            {quadros.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-3xl mb-2">🖨️</p>
                <p className="text-sm font-semibold">Nenhum quadro ainda</p>
                <p className="text-xs mt-1">Clique em "Adicionar" para criar um quadro de estampa</p>
              </div>
            )}

            {quadros.map((q, qi) => (
              <div key={q.id} className="border-2 border-gray-100 rounded-2xl overflow-hidden">
                {/* Cabeçalho do quadro */}
                <div className="bg-gray-50 px-4 py-3 flex items-center gap-3 border-b border-gray-100">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">{qi + 1}</span>
                  <select value={q.posicao} onChange={e => updateQuadro(q.id, { posicao: e.target.value })}
                    className="flex-1 text-sm font-bold bg-transparent border-none focus:outline-none text-gray-800 cursor-pointer">
                    {POSICOES_ESTAMPA.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <button onClick={() => removeQuadro(q.id)} className="p-1 text-red-400 hover:text-red-600"><X size={16} /></button>
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Coluna esquerda: tipo + cores */}
                  <div className="space-y-3">
                    {/* Tipo de estampa */}
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tipo de Estampa</p>
                      <div className="space-y-1.5">
                        {TIPOS_ESTAMPA_QUADRO.map(tipo => (
                          <label key={tipo} className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={q.tiposEstampa.includes(tipo)}
                              onChange={() => toggleTipoEstampaQuadro(q.id, tipo)}
                              className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400 cursor-pointer"
                            />
                            <span className="text-xs font-semibold text-gray-700">{tipo}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Cores */}
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Cores</p>
                      <input
                        type="text"
                        placeholder="Ex: Branco, Azul, Turquesa"
                        value={q.descricaoCores}
                        onChange={e => updateQuadro(q.id, { descricaoCores: e.target.value })}
                        className="w-full text-sm border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-blue-400 focus:outline-none"
                      />
                      {q.descricaoCores && (
                        <p className="text-xs text-blue-600 font-semibold mt-1">
                          CORES: {q.descricaoCores.toUpperCase()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Coluna direita: imagem da estampa */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Imagem da Estampa</p>
                    {q.imagem ? (
                      <div className="relative group">
                        <img src={q.imagem} alt={`Estampa ${q.posicao}`}
                          className="w-full aspect-square object-contain rounded-xl border-2 border-blue-100 bg-white" />
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <a href={q.imagem} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow">
                            <ExternalLink size={14} className="text-gray-600" />
                          </a>
                          <button onClick={() => updateQuadro(q.id, { imagem: '' })}
                            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <label htmlFor={`quadro-img-${q.id}`}
                          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl aspect-square cursor-pointer transition ${uploadandoQuadroId === q.id ? 'border-blue-300 bg-blue-50/50 cursor-wait' : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
                          {uploadandoQuadroId === q.id ? (
                            <>
                              <div className="w-6 h-6 border-2 border-blue-300 border-t-blue-500 rounded-full animate-spin mb-2" />
                              <span className="text-xs text-blue-500">Enviando...</span>
                            </>
                          ) : (
                            <>
                              <Upload size={22} className="text-blue-400 mb-1.5" />
                              <span className="text-xs text-gray-500 text-center px-2">Clique para enviar a arte/estampa</span>
                            </>
                          )}
                        </label>
                        <input
                          id={`quadro-img-${q.id}`}
                          ref={el => { quadroInputRefs.current[q.id] = el }}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp,image/*"
                          className="sr-only"
                          onChange={e => {
                            if (e.target.files?.[0]) {
                              uploadImagemQuadro(q.id, e.target.files[0])
                              e.target.value = ''
                            }
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Preview do quadro (como no exemplo) */}
                {(q.tiposEstampa.length > 0 || q.descricaoCores) && (
                  <div className="mx-4 mb-4 bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <div className="space-y-0.5 mb-2">
                      {TIPOS_ESTAMPA_QUADRO.map(tipo => (
                        <div key={tipo} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-sm border flex-shrink-0 ${q.tiposEstampa.includes(tipo) ? 'bg-gray-800 border-gray-800' : 'bg-white border-gray-300'}`} />
                          <span className="text-xs text-gray-600 uppercase tracking-tight font-medium">{tipo}</span>
                        </div>
                      ))}
                    </div>
                    {q.descricaoCores && (
                      <p className="text-xs font-bold text-gray-700 uppercase border-t border-gray-200 pt-2 mt-2">
                        CORES: {q.descricaoCores.toUpperCase()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {quadros.length > 0 && (
              <button onClick={salvarQuadros} disabled={salvandoQuadros}
                className={`w-full py-3 rounded-xl font-bold text-sm transition ${salvandoQuadros ? 'bg-gray-200 text-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                {salvandoQuadros ? 'Salvando...' : '💾 Salvar Quadros de Estampa'}
              </button>
            )}
          </div>
        </div>

        {/* Erros de upload */}
        {erros.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <AlertCircle size={16} /> Erro ao enviar {erros.length} arquivo(s):
            </div>
            {erros.map((e, i) => (
              <div key={i} className="text-xs bg-red-100 rounded-lg p-2 text-red-700">
                <strong>{e.filename}:</strong> {e.message}
              </div>
            ))}
          </div>
        )}

        {/* ── INSTRUÇÕES ── */}
        <div className="bg-purple-600 rounded-2xl p-5 text-white">
          <p className="font-bold text-base mb-2">Agora é com você, Arte-Finalista!</p>
          <div className="space-y-1.5 text-sm text-purple-100">
            <p>1. Use o brief e os quadros de estampa acima para criar o layout final</p>
            <p>2. Envie a <strong className="text-white">imagem do layout</strong> (PNG/JPG/WEBP) na seção abaixo</p>
            <p>3. Envie os <strong className="text-white">arquivos vetorizados</strong> (PDF ou CorelDraw .cdr)</p>
            <p>4. Clique em "Confirmar Envio" quando estiver tudo pronto</p>
          </div>
        </div>

        {/* ── SEÇÃO: IMAGENS DO LAYOUT ── */}
        <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-orange-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ImageIcon size={20} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900">Layout Final</h2>
              <p className="text-xs text-gray-500">Imagem do mockup finalizado (PNG, JPG, WEBP)</p>
            </div>
            {temLayouts && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">{pedido.layoutImages!.length}</span>}
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-orange-50 rounded-xl p-3 flex items-start gap-2">
              <Info size={13} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-orange-700">Formatos aceitos: <strong>PNG, JPG, WEBP</strong></p>
            </div>
            <label htmlFor="upload-layouts"
              onDragEnter={e => { e.preventDefault(); setDragLayouts(true) }} onDragLeave={() => setDragLayouts(false)}
              onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 'layouts')}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition ${dragLayouts ? 'border-orange-500 bg-orange-50' : uploadandoLayouts ? 'border-orange-300 bg-orange-50/50 cursor-wait' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/30'}`}>
              <Upload size={28} className={`mb-3 ${dragLayouts ? 'text-orange-500' : 'text-gray-400'}`} />
              <span className="font-semibold text-sm text-gray-700 text-center">{uploadandoLayouts ? 'Enviando...' : dragLayouts ? 'Solte para enviar' : 'Arraste ou clique para selecionar'}</span>
              {uploadandoLayouts && <div className="mt-3 w-40 h-1.5 bg-orange-200 rounded-full overflow-hidden"><div className="h-full bg-orange-500 rounded-full animate-pulse w-3/5" /></div>}
            </label>
            <input id="upload-layouts" type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/*" multiple className="sr-only"
              disabled={uploadandoLayouts} onChange={e => { if (e.target.files) { handleUpload(e.target.files, 'layouts'); e.target.value = '' } }} />
            {temLayouts && (
              <div className="space-y-2">
                {pedido.layoutImages!.map((url, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <img src={url} alt={`Layout ${i + 1}`} className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                    <p className="text-sm font-semibold text-gray-800 flex-1">Layout {i + 1}</p>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 flex-shrink-0"><ExternalLink size={16} /></a>
                    <button onClick={() => remover(url, 'layouts')} className="text-red-400 hover:text-red-600 flex-shrink-0"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── SEÇÃO: VETORIZADOS ── */}
        <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-purple-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900">Arquivos Vetorizados</h2>
              <p className="text-xs text-gray-500">Arte para produção (PDF ou CorelDraw .cdr)</p>
            </div>
            {temVetores && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">{pedido.vetoresFiles!.length}</span>}
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-purple-50 rounded-xl p-3 flex items-start gap-2">
              <Info size={13} className="text-purple-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-purple-700">Formatos aceitos: <strong>PDF</strong> e <strong>CorelDraw (.cdr)</strong></p>
            </div>
            <label htmlFor="upload-vetores"
              onDragEnter={e => { e.preventDefault(); setDragVetores(true) }} onDragLeave={() => setDragVetores(false)}
              onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 'vetores')}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition ${dragVetores ? 'border-purple-500 bg-purple-50' : uploadandoVetores ? 'border-purple-300 bg-purple-50/50 cursor-wait' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/30'}`}>
              <Upload size={28} className={`mb-3 ${dragVetores ? 'text-purple-500' : 'text-gray-400'}`} />
              <span className="font-semibold text-sm text-gray-700 text-center">{uploadandoVetores ? 'Enviando...' : dragVetores ? 'Solte para enviar' : 'Arraste ou clique para selecionar'}</span>
              {uploadandoVetores && <div className="mt-3 w-40 h-1.5 bg-purple-200 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full animate-pulse w-3/5" /></div>}
            </label>
            <input id="upload-vetores" type="file" accept=".pdf,.cdr,application/pdf" multiple className="sr-only"
              disabled={uploadandoVetores} onChange={e => { if (e.target.files) { handleUpload(e.target.files, 'vetores'); e.target.value = '' } }} />
            {temVetores && (
              <div className="space-y-2">
                {pedido.vetoresFiles!.map((url, i) => {
                  const nome = decodeURIComponent(url.split('/').pop()?.split('?')[0] || `Arquivo ${i + 1}`)
                  const ext = nome.split('.').pop()?.toUpperCase() || 'ARQ'
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${ext === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>{ext}</div>
                      <p className="text-sm font-semibold text-gray-800 truncate flex-1">{nome}</p>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 flex-shrink-0"><ExternalLink size={16} /></a>
                      <button onClick={() => remover(url, 'vetores')} className="text-red-400 hover:text-red-600 flex-shrink-0"><Trash2 size={16} /></button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {!temLayouts && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">Envie pelo menos uma <strong>imagem de layout</strong> para confirmar.</p>
          </div>
        )}

        <button onClick={confirmarArquivos} disabled={uploadandoLayouts || uploadandoVetores || !temLayouts}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition ${temLayouts && !uploadandoLayouts && !uploadandoVetores ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          {uploadandoLayouts || uploadandoVetores ? 'Aguarde, enviando...' : temLayouts ? 'Confirmar Envio de Arquivos →' : 'Envie um layout para continuar'}
        </button>
      </main>
    </div>
  )
}
