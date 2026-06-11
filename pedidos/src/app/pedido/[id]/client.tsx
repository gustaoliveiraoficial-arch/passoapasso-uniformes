'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  buscarPedido, atualizarStatus, salvarTamanhos,
  uploadArquivo, atualizarPedido, duplicarPedido
} from '@/lib/firebase'
import type { Pedido, PieceEntry, CategoriaSize, ClienteEmpresa, ClientePF, TipoEstampa, DetalhesPeca, ModeloPedido } from '@/types/pedido'
import {
  STATUS_LABELS, STATUS_COLORS, TAMANHOS_UNISSEX,
  TAMANHOS_BABYLOOK, TAMANHOS_INFANTIL, calcularPreco, TIPOS_ESTAMPA, CATEGORIAS_CAMISETA
} from '@/types/pedido'
import { CATALOGO, COR_HEX, CATEGORIAS } from '@/lib/catalog'
import { formatarData, formatarMoeda, gerarLinkCliente, gerarLinkArteFinalista, urlVerPDF } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import { ArrowLeft, Copy, ExternalLink, Upload, Trash2, ChevronDown, ChevronUp, Lock, MessageCircle, CopyCheck, Layers, Plus, X, Pencil, CopyPlus } from 'lucide-react'

const DETALHES_VAZIOS_EDIT: DetalhesPeca = {
  corpo: false, corpoDesc: '',
  friso: false, frisoDesc: '',
  punho: false, punhoDesc: '',
  gola: false, golaDesc: '',
  manga: false, mangaDesc: '',
  bolso: false, bolsoDesc: '',
}

interface ModeloFormEdit {
  id: string
  categoriaAtiva: string
  modelo: string
  material: string
  cor: string
  corPersonalizada: string
  fornecedor: string
  detalhes: DetalhesPeca
  tiposEstampa: TipoEstampa[]
  precoUnitario: string
  quantidadeTotal: string
  referenciaUnissex: string
  referenciaBabylook: string
  referenciaInfantil: string
  mensagemMockup: string
  recolhido: boolean
}

function criarModeloVazioEdit(): ModeloFormEdit {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    categoriaAtiva: '',
    modelo: '',
    material: '',
    cor: '',
    corPersonalizada: '',
    fornecedor: '',
    detalhes: { ...DETALHES_VAZIOS_EDIT },
    tiposEstampa: [],
    precoUnitario: '',
    quantidadeTotal: '',
    referenciaUnissex: '',
    referenciaBabylook: '',
    referenciaInfantil: '',
    mensagemMockup: '',
    recolhido: false,
  }
}

type LoteLinha = {
  id: string
  categoria: CategoriaSize
  tamanho: string
  quantidade: number
}

type IndividualLinha = {
  id: string
  categoria: CategoriaSize
  tamanho: string
  pessoaNome: string
  nomeNaCamiseta: string
  numeroNaCamiseta: string
}

const CATEGORIA_LABEL: Record<CategoriaSize, string> = {
  unissex: 'Unissex',
  babylook: 'Babylook',
  feminino: 'Feminino',
  masculino: 'Masculino',
  infantil: 'Infantil',
}

const STATUS_ORDER = ['dados', 'tamanhos', 'arquivos', 'pagamento', 'confirmacao']

const STATUS_DESCRIPTIONS: Record<string, string> = {
  dados: 'Etapa 1 — Dados do produto\nPreenchido pelo vendedor',
  tamanhos: 'Etapa 2 — Tamanhos\nGrade de tamanhos preenchida pelo cliente',
  arquivos: 'Etapa 3 — Arquivos\nLayout enviado pela arte-finalista',
  pagamento: 'Etapa 4 — Pagamento\nComprovante enviado pelo cliente',
  confirmacao: 'Etapa 5 — Confirmação\nPedido aprovado para produção',
}

function SectionLocked({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-sm overflow-hidden opacity-60">
      <div className="px-6 py-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <Lock size={18} className="text-gray-400" />
        </div>
        <div>
          <h2 className="font-bold text-gray-500 text-lg">{titulo}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{descricao}</p>
        </div>
      </div>
    </div>
  )
}

export default function PedidoDetalhe() {
  const { id: _paramId } = useParams<{ id: string }>()
  // Se useParams() já retornou o ID real (navegação client-side), usa diretamente.
  // Só usa window.location como fallback quando o static export retorna '__placeholder__'.
  const id = (_paramId && _paramId !== '__placeholder__')
    ? _paramId
    : (typeof window !== 'undefined'
      ? (window.location.pathname.split('/').filter(Boolean).pop() ?? _paramId)
      : _paramId)
  const router = useRouter()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [uploadando, setUploadando] = useState(false)
  const [pecasEditaveis, setPecasEditaveis] = useState<PieceEntry[]>([])
  const [editModal, setEditModal] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Pedido>>({})
  const [modelosEdit, setModelosEdit] = useState<ModeloFormEdit[]>([])
  const [salvandoEdit, setSalvandoEdit] = useState(false)
  const [duplicando, setDuplicando] = useState(false)
  const [tabAberta, setTabAberta] = useState<number | null>(null)
  const [painelDistribuicao, setPainelDistribuicao] = useState(false)
  const [loteLinhas, setLoteLinhas] = useState<LoteLinha[]>([
    { id: uuidv4(), categoria: 'unissex', tamanho: '', quantidade: 0 },
  ])
  const [individuais, setIndividuais] = useState<IndividualLinha[]>([])

  async function carregar() {
    setLoading(true)
    const p = await buscarPedido(id)
    if (!p) { toast.error('Pedido não encontrado'); router.push('/'); return }
    setPedido(p)
    if (p.pecas && p.pecas.length > 0) {
      setPecasEditaveis(p.pecas)
    } else {
      setPecasEditaveis(
        Array.from({ length: p.quantidadeTotal }, (_, i) => ({
          id: uuidv4(),
          pessoaNome: '',
          nomeNaCamiseta: '',
          numeroNaCamiseta: '',
          categoria: 'unissex' as CategoriaSize,
          tamanho: 'M',
          precoUnitario: p.precoUnitario,
        }))
      )
    }
    setLoading(false)
  }

  useEffect(() => { carregar() }, [id])

  // ── Lote (por quantidade) ──
  function adicionarLinhaLote() {
    setLoteLinhas(prev => [...prev, { id: uuidv4(), categoria: 'unissex', tamanho: '', quantidade: 0 }])
  }
  function atualizarLinhaLote(idx: number, campo: Partial<LoteLinha>) {
    setLoteLinhas(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], ...campo }
      if (campo.categoria) next[idx].tamanho = ''
      return next
    })
  }
  function removerLinhaLote(idx: number) {
    setLoteLinhas(prev => prev.filter((_, i) => i !== idx))
  }

  // ── Individual (com nome e número) ──
  function adicionarIndividual() {
    setIndividuais(prev => [...prev, { id: uuidv4(), categoria: 'unissex', tamanho: '', pessoaNome: '', nomeNaCamiseta: '', numeroNaCamiseta: '' }])
  }
  function atualizarIndividual(idx: number, campo: Partial<IndividualLinha>) {
    setIndividuais(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], ...campo }
      if (campo.categoria) next[idx].tamanho = ''
      return next
    })
  }
  function removerIndividual(idx: number) {
    setIndividuais(prev => prev.filter((_, i) => i !== idx))
  }

  // ── Distribuir combinado ──
  function distribuirCombinado() {
    if (!pedido) return
    const totalLote = loteLinhas.filter(l => l.tamanho).reduce((s, l) => s + Number(l.quantidade), 0)
    const totalInd = individuais.filter(l => l.tamanho).length
    const totalGeral = totalLote + totalInd

    if (totalGeral !== pedido.quantidadeTotal) {
      toast.error(`Total atual: ${totalGeral} / ${pedido.quantidadeTotal} peças. Ajuste as quantidades.`)
      return
    }
    if (loteLinhas.some(l => l.tamanho && Number(l.quantidade) <= 0)) {
      toast.error('Alguma linha de lote está com quantidade 0')
      return
    }
    if (individuais.some(l => !l.tamanho)) {
      toast.error('Preencha o tamanho em todas as linhas individuais')
      return
    }

    const novasPecas: PieceEntry[] = []
    let pieceIdx = 0

    // Primeiro os lotes (sem nome)
    for (const linha of loteLinhas.filter(l => l.tamanho && Number(l.quantidade) > 0)) {
      for (let i = 0; i < Number(linha.quantidade); i++) {
        const existente = pecasEditaveis[pieceIdx]
        novasPecas.push({
          id: existente?.id || uuidv4(),
          pessoaNome: '',
          nomeNaCamiseta: '',
          numeroNaCamiseta: '',
          categoria: linha.categoria,
          tamanho: linha.tamanho,
          precoUnitario: calcularPreco(pedido.precoUnitario, linha.categoria, linha.tamanho),
        })
        pieceIdx++
      }
    }

    // Depois os individuais (com nome/número)
    for (const ind of individuais.filter(l => l.tamanho)) {
      const existente = pecasEditaveis[pieceIdx]
      novasPecas.push({
        id: existente?.id || uuidv4(),
        pessoaNome: ind.pessoaNome,
        nomeNaCamiseta: ind.nomeNaCamiseta,
        numeroNaCamiseta: ind.numeroNaCamiseta,
        categoria: ind.categoria,
        tamanho: ind.tamanho,
        precoUnitario: calcularPreco(pedido.precoUnitario, ind.categoria, ind.tamanho),
      })
      pieceIdx++
    }

    setPecasEditaveis(novasPecas)
    toast.success('Distribuição aplicada! Ajuste os detalhes individualmente se necessário.')
    setPainelDistribuicao(false)
  }

  function atualizarPeca(index: number, campo: Partial<PieceEntry>) {
    setPecasEditaveis(prev => {
      const next = [...prev]
      next[index] = {
        ...next[index],
        ...campo,
        precoUnitario: calcularPreco(
          pedido?.precoUnitario || 0,
          campo.categoria || next[index].categoria,
          campo.tamanho || next[index].tamanho
        ),
      }
      return next
    })
  }

  function repetirPeca(fromIdx: number, quantidade: number) {
    setPecasEditaveis(prev => {
      const next = [...prev]
      const source = next[fromIdx]
      const limite = Math.min(fromIdx + 1 + quantidade, next.length)
      for (let i = fromIdx + 1; i < limite; i++) {
        next[i] = {
          ...next[i],
          categoria: source.categoria,
          tamanho: source.tamanho,
          precoUnitario: source.precoUnitario,
        }
      }
      return next
    })
    const copiadas = Math.min(quantidade, pecasEditaveis.length - fromIdx - 1)
    if (copiadas > 0) toast.success(`Tamanho copiado para ${copiadas} peça(s) seguinte(s)`)
    else toast.error('Não há peças seguintes para copiar')
  }

  async function removerPecaDaLista(idx: number) {
    if (!pedido) return
    const novasPecas = pecasEditaveis.filter((_, i) => i !== idx)
    setPecasEditaveis(novasPecas)
    const novoTotal = novasPecas.length
    setPedido(prev => prev ? { ...prev, quantidadeTotal: novoTotal } : prev)
    try {
      await atualizarPedido(id, { pecas: novasPecas, quantidadeTotal: novoTotal })
      toast.success('Peça removida. Quantidade atualizada.')
    } catch {
      toast.error('Erro ao remover peça')
    }
  }

  async function adicionarNovaPeca() {
    if (!pedido) return
    const novaPeca: PieceEntry = {
      id: uuidv4(),
      pessoaNome: '',
      nomeNaCamiseta: '',
      numeroNaCamiseta: '',
      categoria: 'unissex',
      tamanho: 'M',
      precoUnitario: calcularPreco(pedido.precoUnitario, 'unissex', 'M'),
    }
    const novasPecas = [...pecasEditaveis, novaPeca]
    setPecasEditaveis(novasPecas)
    const novoTotal = novasPecas.length
    setPedido(prev => prev ? { ...prev, quantidadeTotal: novoTotal } : prev)
    try {
      await atualizarPedido(id, { pecas: novasPecas, quantidadeTotal: novoTotal })
      toast.success('Peça adicionada. Quantidade atualizada.')
    } catch {
      toast.error('Erro ao adicionar peça')
    }
  }

  function validarTamanhos(): boolean {
    for (let i = 0; i < pecasEditaveis.length; i++) {
      if (!pecasEditaveis[i].categoria || !pecasEditaveis[i].tamanho) {
        toast.error(`Preencha categoria e tamanho da peça ${i + 1}`)
        return false
      }
    }
    return true
  }

  async function salvarTamanhosHandler() {
    if (!validarTamanhos()) return
    setSalvando(true)
    try {
      await salvarTamanhos(id, pecasEditaveis)
      toast.success('Tamanhos salvos!')
      await carregar()
    } catch {
      toast.error('Erro ao salvar tamanhos')
    } finally {
      setSalvando(false)
    }
  }

  function abrirWhatsApp(pedidoData: Pedido) {
    const telefone = pedidoData.clienteType === 'empresa'
      ? pedidoData.clienteEmpresa?.telefone
      : pedidoData.clientePF?.telefone
    if (!telefone) return

    const nome = pedidoData.clienteType === 'empresa'
      ? pedidoData.clienteEmpresa?.razaoSocial
      : pedidoData.clientePF?.nomeCompleto

    const digits = telefone.replace(/\D/g, '')
    const phone = digits.startsWith('55') ? digits : `55${digits}`

    const link = gerarLinkCliente(pedidoData.clienteToken)
    const modelo = CATALOGO[pedidoData.modelo]?.label || pedidoData.modelo
    const material = CATALOGO[pedidoData.modelo]?.materiais[pedidoData.material]?.label || pedidoData.material
    const cor = pedidoData.cor === 'Personalizada' ? pedidoData.corPersonalizada : pedidoData.cor

    const msg = [
      `Olá, ${nome}! 👋`,
      ``,
      `Seu pedido da *Passo a Passo Uniformes* foi registrado com sucesso! ✅`,
      ``,
      `📦 *Produto:* ${modelo}`,
      `🎨 *Material:* ${material} — ${cor}`,
      `📅 *Entrega prevista:* ${formatarData(pedidoData.dataEntregaPrevista)}`,
      `🔢 *Quantidade:* ${pedidoData.quantidadeTotal} peças`,
      ``,
      `Para prosseguirmos com a produção, precisamos que você informe os tamanhos de cada peça. É rápido! Acesse o link abaixo:`,
      ``,
      `👉 ${link}`,
      ``,
      `Qualquer dúvida, estamos à disposição! 🧡`,
      `*Passo a Passo Uniformes*`,
    ].join('\n')

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  async function avancarStatus() {
    if (!pedido) return
    const proximo: Record<string, string> = {
      dados: 'tamanhos',
      tamanhos: 'arquivos',
      arquivos: 'confirmacao',
    }
    const next = proximo[pedido.status]
    if (!next) return

    if (pedido.status === 'tamanhos') {
      if (!validarTamanhos()) return
      await salvarTamanhos(id, pecasEditaveis)
    }

    setSalvando(true)
    try {
      await atualizarStatus(id, next as any)
      toast.success(`Status atualizado para: ${STATUS_LABELS[next as keyof typeof STATUS_LABELS]}`)
      await carregar()
    } catch {
      toast.error('Erro ao atualizar status')
    } finally {
      setSalvando(false)
    }
  }

  async function handleUploadReferencia(files: FileList | null, pasta: 'artes-cliente' | 'rascunho-vendedor') {
    if (!files || !pedido) return
    setUploadando(true)
    try {
      const novas: string[] = []
      for (const file of Array.from(files)) {
        const url = await uploadArquivo(id, file, pasta)
        novas.push(url)
      }
      const campo = pasta === 'artes-cliente' ? 'artesCliente' : 'rascunhoVendedor'
      const atual = pasta === 'artes-cliente' ? (pedido.artesCliente ?? []) : (pedido.rascunhoVendedor ?? [])
      await atualizarPedido(id, { [campo]: [...atual, ...novas] })
      toast.success(`${novas.length} imagem(ns) enviada(s)!`)
      await carregar()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro no upload')
    } finally {
      setUploadando(false)
    }
  }

  async function removerReferencia(url: string, pasta: 'artes-cliente' | 'rascunho-vendedor') {
    if (!pedido) return
    const campo = pasta === 'artes-cliente' ? 'artesCliente' : 'rascunhoVendedor'
    const atual = pasta === 'artes-cliente' ? (pedido.artesCliente ?? []) : (pedido.rascunhoVendedor ?? [])
    await atualizarPedido(id, { [campo]: atual.filter(u => u !== url) })
    toast.success('Imagem removida')
    await carregar()
  }

  async function handleUpload(files: FileList | null, pasta: 'layouts' | 'vetores') {
    if (!files || !pedido) return
    setUploadando(true)
    try {
      const novasUrls: string[] = []
      for (const file of Array.from(files)) {
        const url = await uploadArquivo(id, file, pasta)
        novasUrls.push(url)
      }
      const campo = pasta === 'layouts' ? 'layoutImages' : 'vetoresFiles'
      const atual = pasta === 'layouts' ? pedido.layoutImages : pedido.vetoresFiles
      await atualizarPedido(id, { [campo]: [...(atual || []), ...novasUrls] })
      toast.success(`${novasUrls.length} arquivo(s) enviado(s)!`)
      await carregar()
    } catch {
      toast.error('Erro no upload')
    } finally {
      setUploadando(false)
    }
  }

  async function removerArquivo(url: string, pasta: 'layouts' | 'vetores') {
    if (!pedido) return
    const campo = pasta === 'layouts' ? 'layoutImages' : 'vetoresFiles'
    const atual = pasta === 'layouts' ? pedido.layoutImages : pedido.vetoresFiles
    await atualizarPedido(id, { [campo]: atual.filter(u => u !== url) })
    toast.success('Arquivo removido')
    await carregar()
  }

  function copiar(texto: string, label: string) {
    navigator.clipboard.writeText(texto)
    toast.success(`${label} copiado!`)
  }

  function abrirEditar() {
    if (!pedido) return

    const modelos: ModeloFormEdit[] = pedido.modelos && pedido.modelos.length > 0
      ? pedido.modelos.map((m, i) => ({
          id: m.id || `legacy-${i}`,
          categoriaAtiva: '',
          modelo: m.modelo || '',
          material: m.material || '',
          cor: m.cor || '',
          corPersonalizada: m.corPersonalizada || '',
          fornecedor: m.fornecedor || '',
          detalhes: m.detalhes ? { ...m.detalhes } : { ...DETALHES_VAZIOS_EDIT },
          tiposEstampa: m.tiposEstampa || [],
          precoUnitario: String(m.precoUnitario || ''),
          quantidadeTotal: String(m.quantidadeTotal || ''),
          referenciaUnissex: m.referenciaUnissex || '',
          referenciaBabylook: m.referenciaBabylook || '',
          referenciaInfantil: m.referenciaInfantil || '',
          mensagemMockup: m.mensagemMockup || '',
          recolhido: i > 0,
        }))
      : [{
          id: 'legacy-0',
          categoriaAtiva: '',
          modelo: pedido.modelo || '',
          material: pedido.material || '',
          cor: pedido.cor || '',
          corPersonalizada: pedido.corPersonalizada || '',
          fornecedor: pedido.fornecedor || '',
          detalhes: pedido.detalhes ? { ...pedido.detalhes } : { ...DETALHES_VAZIOS_EDIT },
          tiposEstampa: pedido.tiposEstampa || [],
          precoUnitario: String(pedido.precoUnitario || ''),
          quantidadeTotal: String(pedido.quantidadeTotal || ''),
          referenciaUnissex: pedido.referenciaUnissex || '',
          referenciaBabylook: pedido.referenciaBabylook || '',
          referenciaInfantil: pedido.referenciaInfantil || '',
          mensagemMockup: pedido.mensagemMockup || '',
          recolhido: false,
        }]

    setModelosEdit(modelos)
    setEditForm({
      numeroPedido: pedido.numeroPedido,
      nomeVendedor: pedido.nomeVendedor,
      dataEntregaPrevista: pedido.dataEntregaPrevista,
      observacao: pedido.observacao || '',
      valorNegociacao: pedido.valorNegociacao ?? undefined,
      descricaoNegociacao: pedido.descricaoNegociacao || '',
      clienteEmpresa: pedido.clienteEmpresa ? { ...pedido.clienteEmpresa } : undefined,
      clientePF: pedido.clientePF ? { ...pedido.clientePF } : undefined,
    })
    setEditModal(true)
  }

  async function salvarEdicao() {
    setSalvandoEdit(true)
    try {
      const modelosSalvos: ModeloPedido[] = modelosEdit.map(m => ({
        id: m.id,
        modelo: m.modelo,
        material: m.material,
        cor: m.cor,
        corPersonalizada: m.corPersonalizada,
        fornecedor: m.fornecedor,
        detalhes: m.detalhes,
        tiposEstampa: m.tiposEstampa,
        precoUnitario: Number(m.precoUnitario) || 0,
        quantidadeTotal: Number(m.quantidadeTotal) || 0,
        referenciaUnissex: m.referenciaUnissex,
        referenciaBabylook: m.referenciaBabylook,
        referenciaInfantil: m.referenciaInfantil,
        mensagemMockup: m.mensagemMockup,
        pecas: [],
        layoutImages: [],
        vetoresFiles: [],
      }))

      const primeiro = modelosSalvos[0]
      const quantidadeTotal = modelosSalvos.reduce((s, m) => s + m.quantidadeTotal, 0)

      await atualizarPedido(id, {
        ...editForm,
        modelos: modelosSalvos,
        modelo: primeiro.modelo,
        material: primeiro.material,
        cor: primeiro.cor,
        corPersonalizada: primeiro.corPersonalizada,
        fornecedor: primeiro.fornecedor,
        detalhes: primeiro.detalhes,
        tiposEstampa: primeiro.tiposEstampa,
        precoUnitario: primeiro.precoUnitario,
        quantidadeTotal,
        referenciaUnissex: primeiro.referenciaUnissex,
        referenciaBabylook: primeiro.referenciaBabylook,
        referenciaInfantil: primeiro.referenciaInfantil,
        mensagemMockup: primeiro.mensagemMockup,
      })
      toast.success('Dados atualizados!')
      setEditModal(false)
      await carregar()
    } catch (e) {
      console.error('salvarEdicao:', e)
      toast.error('Erro ao salvar alterações')
    } finally {
      setSalvandoEdit(false)
    }
  }

  async function duplicarHandler() {
    setDuplicando(true)
    try {
      const novoId = await duplicarPedido(id)
      toast.success('Pedido duplicado! Redirecionando...')
      router.push(`/pedido/${novoId}`)
    } catch {
      toast.error('Erro ao duplicar pedido')
    } finally {
      setDuplicando(false)
    }
  }

  function setEmpresa(campo: keyof ClienteEmpresa, valor: string) {
    setEditForm(f => ({
      ...f,
      clienteEmpresa: { ...(f.clienteEmpresa as ClienteEmpresa), [campo]: valor }
    }))
  }

  function setPF(campo: keyof ClientePF, valor: string) {
    setEditForm(f => ({
      ...f,
      clientePF: { ...(f.clientePF as ClientePF), [campo]: valor }
    }))
  }

  function toggleTipoEstampa(value: TipoEstampa) {
    setEditForm(f => {
      const atual = (f.tiposEstampa || []) as TipoEstampa[]
      const existe = atual.includes(value)
      return { ...f, tiposEstampa: existe ? atual.filter(t => t !== value) : [...atual, value] }
    })
  }

  // ── Helpers multi-modelo para edição ──
  function atualizarModeloEdit(idx: number, updates: Partial<ModeloFormEdit>) {
    setModelosEdit(prev => prev.map((m, i) => i === idx ? { ...m, ...updates } : m))
  }

  function adicionarModeloEdit() {
    setModelosEdit(prev => [
      ...prev.map(m => ({ ...m, recolhido: true })),
      criarModeloVazioEdit(),
    ])
  }

  function removerModeloEdit(idx: number) {
    if (modelosEdit.length === 1) {
      toast.error('O pedido precisa ter pelo menos 1 modelo')
      return
    }
    setModelosEdit(prev => prev.filter((_, i) => i !== idx))
  }

  function toggleEstampaEdit(idx: number, tipo: TipoEstampa) {
    const m = modelosEdit[idx]
    atualizarModeloEdit(idx, {
      tiposEstampa: m.tiposEstampa.includes(tipo)
        ? m.tiposEstampa.filter(t => t !== tipo)
        : [...m.tiposEstampa, tipo],
    })
  }

  function toggleDetalheEdit(idx: number, campo: keyof DetalhesPeca) {
    const m = modelosEdit[idx]
    atualizarModeloEdit(idx, { detalhes: { ...m.detalhes, [campo]: !m.detalhes[campo] } })
  }

  function renderModeloFormEdit(idx: number) {
    const m = modelosEdit[idx]
    const modelosDaCategoria = m.categoriaAtiva
      ? Object.entries(CATALOGO).filter(([, cat]) => cat.categoria === m.categoriaAtiva)
      : Object.entries(CATALOGO)
    const materiaisDisponiveis = m.modelo ? Object.entries(CATALOGO[m.modelo]?.materiais || {}) : []
    const coresDisponiveis = (m.modelo && m.material) ? (CATALOGO[m.modelo]?.materiais[m.material]?.cores || []) : []
    const ehCamiseta = CATEGORIAS_CAMISETA.includes(m.categoriaAtiva)

    return (
      <div key={m.id} className="border-2 border-gray-200 rounded-2xl overflow-hidden">
        {/* Cabeçalho colapsável */}
        <div
          className={`flex items-center justify-between px-5 py-4 cursor-pointer transition ${
            m.recolhido ? 'bg-gray-50 hover:bg-gray-100' : 'bg-orange-500'
          }`}
          onClick={() => atualizarModeloEdit(idx, { recolhido: !m.recolhido })}
        >
          <div className="flex items-center gap-3">
            <span className={`font-bold text-sm rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 ${
              m.recolhido ? 'bg-orange-100 text-orange-700' : 'bg-white bg-opacity-30 text-white'
            }`}>
              {idx + 1}
            </span>
            <div>
              <span className={`font-bold text-base ${m.recolhido ? 'text-gray-700' : 'text-white'}`}>
                {m.modelo && CATALOGO[m.modelo] ? CATALOGO[m.modelo].label : `Modelo ${idx + 1}`}
              </span>
              {m.recolhido && m.quantidadeTotal && (
                <span className="ml-2 text-xs text-gray-500">{m.quantidadeTotal} peças</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {modelosEdit.length > 1 && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); removerModeloEdit(idx) }}
                className={`p-1.5 rounded-lg transition ${
                  m.recolhido ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-white opacity-70 hover:opacity-100'
                }`}
                title="Remover modelo"
              >
                <Trash2 size={14} />
              </button>
            )}
            {m.recolhido ? <ChevronDown size={18} className="text-gray-500" /> : <ChevronUp size={18} className="text-white" />}
          </div>
        </div>

        {!m.recolhido && (
          <div className="p-5 space-y-5 bg-white">
            {/* Categoria */}
            <div>
              <label className="label-base text-xs mb-2">
                Categoria
                {ehCamiseta && m.categoriaAtiva && (
                  <span className="ml-2 text-xs font-normal text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Unissex / Babylook / Infantil</span>
                )}
                {!ehCamiseta && m.categoriaAtiva && (
                  <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Feminino / Masculino</span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS.map(cat => (
                  <button key={cat} type="button"
                    onClick={() => atualizarModeloEdit(idx, { categoriaAtiva: cat, modelo: '', material: '', cor: '' })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      m.categoriaAtiva === cat
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                    }`}
                  >{cat}</button>
                ))}
              </div>
            </div>

            {/* Modelo */}
            <div>
              <label className="label-base text-xs mb-2">Modelo</label>
              <div className="flex flex-wrap gap-2">
                {modelosDaCategoria.map(([k, v]) => (
                  <button key={k} type="button"
                    onClick={() => atualizarModeloEdit(idx, { modelo: k, material: '', cor: '' })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      m.modelo === k
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                    }`}
                  >{v.label}</button>
                ))}
              </div>
              {m.modelo && CATALOGO[m.modelo]?.descricao && (
                <p className="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mt-2 leading-relaxed">
                  ℹ️ {CATALOGO[m.modelo].descricao}
                </p>
              )}
            </div>

            {/* Material */}
            {m.modelo && materiaisDisponiveis.length > 0 && (
              <div>
                <label className="label-base text-xs mb-2">Material</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {materiaisDisponiveis.map(([k, mat], i, arr) => (
                    <button key={k} type="button"
                      onClick={() => atualizarModeloEdit(idx, { material: k, cor: '' })}
                      className={`w-full text-left px-3 py-3 flex items-start gap-3 transition-colors ${
                        i < arr.length - 1 ? 'border-b border-gray-100' : ''
                      } ${m.material === k ? 'bg-orange-50' : 'bg-white hover:bg-gray-50'}`}
                    >
                      <div className={`mt-0.5 w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        m.material === k ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                      }`}>
                        {m.material === k && <div className="w-1 h-1 rounded-full bg-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-xs ${m.material === k ? 'text-orange-700' : 'text-gray-800'}`}>{(mat as any).label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">🎨 {(mat as any).cores?.slice(0, 6).join(' · ')}{(mat as any).cores?.length > 6 ? ` +${(mat as any).cores.length - 6}` : ''}</div>
                        {(mat as any).obs && <div className="text-xs text-amber-700 mt-0.5">⚠️ {(mat as any).obs}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cor */}
            {m.modelo && m.material && coresDisponiveis.length > 0 && (
              <div>
                <label className="label-base text-xs mb-2">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {coresDisponiveis.map((c: string) => {
                    const hex = COR_HEX[c] || '#9CA3AF'
                    return (
                      <button key={c} type="button"
                        onClick={() => atualizarModeloEdit(idx, { cor: c })}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                          m.cor === c
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0" style={{ backgroundColor: hex }} />
                        {c}
                      </button>
                    )
                  })}
                </div>
                {m.cor === 'Personalizada' && (
                  <input className="input-base mt-2" value={m.corPersonalizada}
                    onChange={e => atualizarModeloEdit(idx, { corPersonalizada: e.target.value })}
                    placeholder="Ex: Azul Petróleo" />
                )}
              </div>
            )}

            {/* Fornecedor + Preço + Qtd */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label-base text-xs">Fornecedor</label>
                <input className="input-base" value={m.fornecedor}
                  onChange={e => atualizarModeloEdit(idx, { fornecedor: e.target.value })} />
              </div>
              <div>
                <label className="label-base text-xs">Preço Unit. (R$)</label>
                <input type="number" step="0.01" min={0} className="input-base" value={m.precoUnitario}
                  onChange={e => atualizarModeloEdit(idx, { precoUnitario: e.target.value })} />
              </div>
              <div>
                <label className="label-base text-xs">Qtd. Total</label>
                <input type="number" min={1} className="input-base" value={m.quantidadeTotal}
                  onChange={e => atualizarModeloEdit(idx, { quantidadeTotal: e.target.value })} />
              </div>
            </div>

            {/* Tipos de Estampa */}
            <div>
              <label className="label-base text-xs mb-2">Tipos de Estampa</label>
              <div className="flex flex-wrap gap-2">
                {TIPOS_ESTAMPA.map(tipo => (
                  <button key={tipo.value} type="button"
                    onClick={() => toggleEstampaEdit(idx, tipo.value as TipoEstampa)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      m.tiposEstampa.includes(tipo.value as TipoEstampa)
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400'
                    }`}
                  >{tipo.label}</button>
                ))}
              </div>
            </div>

            {/* Referências */}
            <div>
              <label className="label-base text-xs mb-2">Referências por Categoria</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="label-base text-xs">Ref. Unissex</label>
                  <input className="input-base" value={m.referenciaUnissex}
                    onChange={e => atualizarModeloEdit(idx, { referenciaUnissex: e.target.value })} placeholder="Ref." />
                </div>
                <div>
                  <label className="label-base text-xs">Ref. Baby Look</label>
                  <input className="input-base" value={m.referenciaBabylook}
                    onChange={e => atualizarModeloEdit(idx, { referenciaBabylook: e.target.value })} placeholder="Ref." />
                </div>
                <div>
                  <label className="label-base text-xs">Ref. Infantil</label>
                  <input className="input-base" value={m.referenciaInfantil}
                    onChange={e => atualizarModeloEdit(idx, { referenciaInfantil: e.target.value })} placeholder="Ref." />
                </div>
              </div>
            </div>

            {/* Detalhes da Peça */}
            <div>
              <label className="label-base text-xs mb-2">Detalhes da Peça</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { key: 'corpo', label: 'Corpo', descKey: 'corpoDesc' },
                  { key: 'friso', label: 'Friso', descKey: 'frisoDesc' },
                  { key: 'punho', label: 'Punho', descKey: 'punhoDesc' },
                  { key: 'gola', label: 'Gola', descKey: 'golaDesc' },
                  { key: 'manga', label: 'Manga', descKey: 'mangaDesc' },
                  { key: 'bolso', label: 'Bolso', descKey: 'bolsoDesc' },
                ].map(d => {
                  const ativo = !!(m.detalhes?.[d.key as keyof DetalhesPeca])
                  return (
                    <div key={d.key} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                      <input type="checkbox" checked={ativo}
                        onChange={() => toggleDetalheEdit(idx, d.key as keyof DetalhesPeca)}
                        className="accent-orange-500 w-4 h-4 flex-shrink-0" />
                      <span className="font-semibold text-xs text-gray-700 w-12">{d.label}:</span>
                      <input className="input-base flex-1 text-xs" placeholder="Descrição..."
                        disabled={!ativo}
                        value={(m.detalhes?.[d.descKey as keyof DetalhesPeca] as string) || ''}
                        onChange={e => atualizarModeloEdit(idx, {
                          detalhes: { ...m.detalhes, [d.descKey]: e.target.value }
                        })} />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Mensagem Arte-Finalista */}
            <div>
              <label className="label-base text-xs mb-1">Mensagem para o Arte-Finalista</label>
              <textarea className="input-base resize-none" rows={2}
                value={m.mensagemMockup}
                onChange={e => atualizarModeloEdit(idx, { mensagemMockup: e.target.value })}
                placeholder="Ex: Logo centralizado no peito..." />
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Carregando...</div>
  if (!pedido) return null

  const nomeCliente = pedido.clienteType === 'empresa'
    ? pedido.clienteEmpresa?.razaoSocial
    : pedido.clientePF?.nomeCompleto

  const modeloLabel = CATALOGO[pedido.modelo]?.label || pedido.modelo
  const materialLabel = CATALOGO[pedido.modelo]?.materiais[pedido.material]?.label || pedido.material

  const proximo: Record<string, string> = {
    dados: 'tamanhos', tamanhos: 'arquivos', arquivos: 'pagamento', pagamento: 'confirmacao',
  }
  const podavancar = !!proximo[pedido.status]

  const statusIdx = STATUS_ORDER.indexOf(pedido.status)
  const tamanhosAtivo = statusIdx >= 1
  const arquivosAtivo = statusIdx >= 2
  const pagamentoAtivo = statusIdx >= 3

  // Agrupa tamanhos para exibir resumo
  const resumoTamanhos = pecasEditaveis.reduce<Record<string, number>>((acc, p) => {
    const k = `${CATEGORIA_LABEL[p.categoria]} ${p.tamanho}`
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

  // Per-model size summary (when multi-model)
  const resumoTamanhosPorModelo = (pedido.modelos && pedido.modelos.length > 1)
    ? pedido.modelos.map(m => ({
        id: m.id,
        label: CATALOGO[m.modelo]?.label || m.modelo || 'Modelo',
        resumo: (m.pecas ?? []).reduce<Record<string, number>>((acc, p) => {
          const k = `${CATEGORIA_LABEL[p.categoria]} ${p.tamanho}`
          acc[k] = (acc[k] || 0) + 1
          return acc
        }, {}),
        total: (m.pecas ?? []).length,
      }))
    : null

  // For multi-model: compute piece boundaries by model
  const modeloBoundaries = (pedido.modelos && pedido.modelos.length > 1)
    ? pedido.modelos.reduce<{ modeloIdx: number; start: number; end: number; label: string }[]>((acc, m, i) => {
        const start = i === 0 ? 0 : acc[i - 1].end
        return [...acc, { modeloIdx: i, start, end: start + (m.pecas?.length || 0), label: CATALOGO[m.modelo]?.label || m.modelo || 'Modelo' }]
      }, [])
    : null

  const linkCliente = gerarLinkCliente(pedido.clienteToken)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-500 hover:text-gray-700"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Pedido #{pedido.numeroPedido}</h1>
              <p className="text-sm text-gray-500">{nomeCliente}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Progress steps */}
            <div className="hidden sm:flex items-center gap-1 mr-1">
              {STATUS_ORDER.map((s, i) => {
                // Etapa "arquivos" (i=2): só verde se layout já foi enviado pelo arte-finalista
                const layoutOk = (pedido.layoutImages?.length ?? 0) > 0
                const isGreen = i < statusIdx && (i !== 2 || layoutOk)
                return (
                  <div key={s} className="flex items-center gap-1">
                    <div className="relative group/dot">
                      <div className={`w-3 h-3 rounded-full cursor-default ${
                        isGreen ? 'bg-green-500' : i === statusIdx ? 'bg-orange-500' : 'bg-gray-200'
                      }`} />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/dot:block z-50 pointer-events-none">
                        <div className="bg-gray-900 text-white rounded-lg px-3 py-2 shadow-xl min-w-[160px]" style={{ fontSize: 11 }}>
                          {STATUS_DESCRIPTIONS[s].split('\n').map((line, li) => (
                            <p key={li} className={li === 0 ? 'font-bold mb-0.5' : 'text-gray-300'} style={{ margin: 0, lineHeight: 1.4 }}>{line}</p>
                          ))}
                          <div className={`mt-1.5 text-xs font-semibold ${isGreen ? 'text-green-400' : i === statusIdx ? 'text-orange-400' : 'text-gray-500'}`}>
                            {isGreen ? '✓ Concluída' : i === statusIdx ? '● Em andamento' : '○ Pendente'}
                          </div>
                        </div>
                        <div className="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1" />
                      </div>
                    </div>
                    {i < 4 && <div className={`w-6 h-0.5 ${isGreen ? 'bg-green-400' : 'bg-gray-200'}`} />}
                  </div>
                )
              })}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[pedido.status]}`}>
              {STATUS_LABELS[pedido.status]}
            </span>
            <button
              onClick={abrirEditar}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold transition border border-blue-200"
              title="Editar dados do pedido"
            >
              <Pencil size={14} /> Editar
            </button>
            <button
              onClick={duplicarHandler}
              disabled={duplicando}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold transition border border-gray-200 disabled:opacity-50"
              title="Duplicar este pedido"
            >
              <CopyPlus size={14} /> {duplicando ? '...' : 'Duplicar'}
            </button>
            <Link
              href={`/pedido-completo/${id}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition shadow-sm"
              title="Imprimir as 2 folhas juntas (pedido + cliente)"
            >
              🖨️ Imprimir Pedido
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Resumo do pedido */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Data do Pedido', value: formatarData(pedido.dataPedido) },
            { label: 'Entrega Prevista', value: formatarData(pedido.dataEntregaPrevista), destaque: true },
            { label: 'Vendedor', value: pedido.nomeVendedor },
            { label: 'Total de Peças', value: `${pedido.quantidadeTotal} peças` },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium">{item.label}</p>
              <p className={`text-sm font-bold mt-1 ${item.destaque ? 'text-red-600' : 'text-gray-900'}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Observação do Pedido — sempre visível, editável inline */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📋</span>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Observação do Pedido</p>
          </div>
          <textarea
            className="w-full bg-white border-2 border-amber-200 focus:border-amber-500 rounded-xl px-3 py-2.5 text-sm text-amber-900 focus:outline-none resize-none placeholder-amber-300"
            rows={3}
            defaultValue={pedido.observacao ?? ''}
            placeholder="Clique para adicionar uma observação sobre este pedido..."
            onBlur={async e => {
              await atualizarPedido(id, { observacao: e.target.value })
              setPedido(prev => prev ? { ...prev, observacao: e.target.value } : prev)
              toast.success('Observação salva!')
            }}
          />
          <p className="text-xs text-amber-600 mt-1.5">💡 Salvo automaticamente ao sair do campo. Visível no kanban para toda a equipe.</p>
        </div>

        {/* Etapa 1 — Dados do produto */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">1</div>
            <h2 className="font-bold text-gray-900 text-lg">Produto</h2>
            <span className="ml-auto text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">Concluído</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-gray-500">Modelo:</span> <span className="font-semibold ml-1">{modeloLabel}</span></div>
            <div><span className="text-gray-500">Material:</span> <span className="font-semibold ml-1">{materialLabel}</span></div>
            <div><span className="text-gray-500">Cor:</span> <span className="font-semibold ml-1">{pedido.cor === 'Personalizada' ? pedido.corPersonalizada : pedido.cor}</span></div>
            <div><span className="text-gray-500">Fornecedor:</span> <span className="font-semibold ml-1">{pedido.fornecedor}</span></div>
            <div><span className="text-gray-500">Valor Unitário:</span> <span className="font-semibold ml-1 text-orange-600">{formatarMoeda(pedido.precoUnitario)}</span></div>
            <div><span className="text-gray-500">Estampa:</span> <span className="font-semibold ml-1">
              {pedido.tiposEstampa?.map(t => TIPOS_ESTAMPA.find(e => e.value === t)?.label).filter(Boolean).join(', ') || '—'}
            </span></div>
          </div>
          {Object.entries(pedido.detalhes || {}).some(([k, v]) => !k.endsWith('Desc') && v) && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2">DETALHES DA PEÇA</p>
              <div className="flex flex-wrap gap-2">
                {(['corpo', 'friso', 'punho', 'gola', 'manga', 'bolso'] as const).map(d => {
                  if (!pedido.detalhes[d]) return null
                  const desc = pedido.detalhes[`${d}Desc` as keyof typeof pedido.detalhes] as string
                  return (
                    <span key={d} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold">
                      {d.charAt(0).toUpperCase() + d.slice(1)}{desc ? `: ${desc}` : ''}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
          {/* ── IMAGENS DE REFERÊNCIA (sempre visível) ── */}
          <div className="mt-5 pt-4 border-t border-gray-100 space-y-4">
            <p className="text-sm font-bold text-gray-700">Imagens de Referência</p>
            <div className="grid md:grid-cols-2 gap-4">

              {/* Artes do Cliente */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">🎨 Artes do cliente <span className="font-normal text-gray-400">(estampas, logos, referências)</span></p>
                <label htmlFor="upload-artes-cliente" className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition ${uploadando ? 'opacity-50 cursor-wait' : 'border-orange-200 hover:border-orange-400 hover:bg-orange-50/20'}`}>
                  <Upload size={18} className="text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">{uploadando ? 'Enviando...' : 'Clique para selecionar imagens'}</span>
                </label>
                <input id="upload-artes-cliente" type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/*" multiple className="sr-only"
                  onChange={e => { handleUploadReferencia(e.target.files, 'artes-cliente'); e.target.value = '' }} />
                {(pedido.artesCliente?.length ?? 0) > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pedido.artesCliente!.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        <button onClick={() => removerReferencia(url, 'artes-cliente')}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rascunho do Vendedor */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">✏️ Rascunho do vendedor <span className="font-normal text-gray-400">(mockup inicial do layout)</span></p>
                <label htmlFor="upload-rascunho-vendedor" className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition ${uploadando ? 'opacity-50 cursor-wait' : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50/20'}`}>
                  <Upload size={18} className="text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">{uploadando ? 'Enviando...' : 'Clique para selecionar imagens'}</span>
                </label>
                <input id="upload-rascunho-vendedor" type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/*" multiple className="sr-only"
                  onChange={e => { handleUploadReferencia(e.target.files, 'rascunho-vendedor'); e.target.value = '' }} />
                {(pedido.rascunhoVendedor?.length ?? 0) > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pedido.rascunhoVendedor!.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        <button onClick={() => removerReferencia(url, 'rascunho-vendedor')}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mensagem para o arte-finalista */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-sm font-bold text-gray-700 mb-2">💬 Mensagem para o Arte-Finalista</p>
            <p className="text-xs text-gray-400 mb-2">Explique como o cliente quer o mockup. Aparecerá em destaque no brief do arte-finalista.</p>
            <textarea
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-orange-400 focus:outline-none resize-none"
              rows={3}
              defaultValue={pedido.mensagemMockup ?? ''}
              placeholder="Ex: Logo centralizado no peito, nome da empresa em letras grandes nas costas..."
              onBlur={async e => {
                await atualizarPedido(id, { mensagemMockup: e.target.value })
                toast.success('Mensagem salva!')
              }}
            />
          </div>

          {/* Link de tamanhos — sempre visível quando há token */}
          {pedido.clienteToken && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2">🔗 Link de tamanhos para o cliente</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => abrirWhatsApp(pedido)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition"
                >
                  <MessageCircle size={15} /> Enviar via WhatsApp
                </button>
                <button
                  onClick={() => copiar(linkCliente, 'Link do cliente')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition border border-blue-200"
                >
                  <Copy size={14} /> Copiar link
                </button>
                <a
                  href={linkCliente}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  <ExternalLink size={12} /> ver link
                </a>
              </div>
            </div>
          )}

          {/* Avançar para tamanhos (só na fase dados) */}
          {pedido.status === 'dados' && (
            <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-sm text-gray-500">Próximo passo: avançar para a fase de tamanhos.</p>
              <button
                onClick={avancarStatus}
                disabled={salvando}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition disabled:opacity-50 whitespace-nowrap"
              >
                {salvando ? 'Processando...' : 'Avançar → Tamanhos'}
              </button>
            </div>
          )}
        </div>

        {/* Etapa 2 — Tamanhos */}
        {!tamanhosAtivo ? (
          <SectionLocked titulo="Etapa 2 — Tamanhos" descricao="Disponível após avançar para a fase de tamanhos" />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${statusIdx > 1 ? 'bg-green-500' : 'bg-orange-500'}`}>2</div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">Tamanhos — {pedido.quantidadeTotal} peças</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Preencha ou deixe o cliente preencher via link</p>
                  </div>
                  {statusIdx > 1 && <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">Concluído</span>}
                </div>

                {/* Links para o cliente — proeminentes */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => abrirWhatsApp(pedido)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition"
                    title="Abrir WhatsApp com link de tamanhos"
                  >
                    <MessageCircle size={15} /> Enviar via WhatsApp
                  </button>
                  <button
                    onClick={() => copiar(linkCliente, 'Link do cliente')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition border border-blue-200"
                    title="Copiar link para o cliente preencher tamanhos"
                  >
                    <Copy size={14} /> Copiar link
                  </button>
                  <a
                    href={linkCliente}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 underline"
                    title="Abrir link do cliente em nova aba"
                  >
                    <ExternalLink size={12} /> ver link
                  </a>
                </div>
              </div>
            </div>

            {/* Toggle painel de distribuição */}
            <div className="px-6 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-indigo-700">
                <Layers size={15} />
                <span className="font-semibold">Distribuição rápida</span>
                <span className="text-indigo-400 text-xs">— por quantidade ou individual com nome/número</span>
              </div>
              <button
                onClick={() => setPainelDistribuicao(v => !v)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${painelDistribuicao ? 'bg-indigo-600 text-white' : 'bg-white border border-indigo-300 text-indigo-600 hover:bg-indigo-100'}`}
              >
                {painelDistribuicao ? 'Fechar' : 'Abrir'}
              </button>
            </div>

            {/* Painel de distribuição combinado */}
            {painelDistribuicao && (() => {
              const totalLote = loteLinhas.filter(l => l.tamanho).reduce((s, l) => s + Number(l.quantidade), 0)
              const totalInd = individuais.filter(l => l.tamanho).length
              const totalGeral = totalLote + totalInd
              const ok = totalGeral === pedido.quantidadeTotal
              return (
                <div className="border-b border-indigo-100 bg-indigo-50/40">
                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-indigo-100">

                    {/* Seção 1: Por quantidade */}
                    <div className="px-5 py-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">Q</div>
                        <p className="font-bold text-gray-800 text-sm">Por quantidade</p>
                        <span className="text-xs text-gray-400">sem nome individual</span>
                      </div>
                      <div className="space-y-2">
                        {loteLinhas.map((linha, idx) => {
                          const opts = linha.categoria === 'infantil' ? TAMANHOS_INFANTIL : linha.categoria === 'babylook' ? TAMANHOS_BABYLOOK : TAMANHOS_UNISSEX
                          return (
                            <div key={linha.id} className="flex items-center gap-1.5">
                              <select className="input-base flex-1 text-xs py-1.5" value={linha.categoria}
                                onChange={e => atualizarLinhaLote(idx, { categoria: e.target.value as CategoriaSize })}>
                                <option value="unissex">Unissex</option>
                                <option value="babylook">Babylook</option>
                                <option value="infantil">Infantil</option>
                              </select>
                              <select className="input-base w-20 text-xs py-1.5" value={linha.tamanho}
                                onChange={e => atualizarLinhaLote(idx, { tamanho: e.target.value })}>
                                <option value="">Tam.</option>
                                {opts.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                              <input type="number" min={1} placeholder="Qtd"
                                className="input-base w-16 text-center text-xs py-1.5"
                                value={linha.quantidade || ''}
                                onChange={e => atualizarLinhaLote(idx, { quantidade: Number(e.target.value) })} />
                              {loteLinhas.length > 1 && (
                                <button onClick={() => removerLinhaLote(idx)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                                  <X size={15} />
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      <button onClick={adicionarLinhaLote}
                        className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800">
                        <Plus size={13} /> Adicionar linha
                      </button>
                      <p className="text-xs text-blue-600 font-bold">{totalLote} peça(s) neste bloco</p>
                    </div>

                    {/* Seção 2: Individual com nome/número */}
                    <div className="px-5 py-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center">I</div>
                        <p className="font-bold text-gray-800 text-sm">Individual</p>
                        <span className="text-xs text-gray-400">com nome e número</span>
                      </div>
                      {individuais.length === 0 && (
                        <p className="text-xs text-gray-400 italic">Nenhuma peça individual adicionada.</p>
                      )}
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {individuais.map((ind, idx) => {
                          const opts = ind.categoria === 'infantil' ? TAMANHOS_INFANTIL : ind.categoria === 'babylook' ? TAMANHOS_BABYLOOK : TAMANHOS_UNISSEX
                          return (
                            <div key={ind.id} className="bg-white rounded-xl border border-purple-100 p-2.5 space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <select className="input-base flex-1 text-xs py-1" value={ind.categoria}
                                  onChange={e => atualizarIndividual(idx, { categoria: e.target.value as CategoriaSize })}>
                                  <option value="unissex">Unissex</option>
                                  <option value="babylook">Babylook</option>
                                  <option value="infantil">Infantil</option>
                                </select>
                                <select className="input-base w-20 text-xs py-1" value={ind.tamanho}
                                  onChange={e => atualizarIndividual(idx, { tamanho: e.target.value })}>
                                  <option value="">Tam.</option>
                                  {opts.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <button onClick={() => removerIndividual(idx)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                                  <X size={15} />
                                </button>
                              </div>
                              <div className="flex gap-1.5">
                                <input className="input-base flex-1 text-xs py-1" placeholder="Nome da pessoa"
                                  value={ind.pessoaNome} onChange={e => atualizarIndividual(idx, { pessoaNome: e.target.value })} />
                                <input className="input-base w-20 text-xs py-1 text-center" placeholder="Nome peça"
                                  value={ind.nomeNaCamiseta} onChange={e => atualizarIndividual(idx, { nomeNaCamiseta: e.target.value })} />
                                <input className="input-base w-16 text-xs py-1 text-center" placeholder="Nº"
                                  value={ind.numeroNaCamiseta} onChange={e => atualizarIndividual(idx, { numeroNaCamiseta: e.target.value })} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <button onClick={adicionarIndividual}
                        className="flex items-center gap-1 text-xs text-purple-600 font-semibold hover:text-purple-800">
                        <Plus size={13} /> Adicionar peça individual
                      </button>
                      <p className="text-xs text-purple-600 font-bold">{totalInd} peça(s) neste bloco</p>
                    </div>
                  </div>

                  {/* Footer com total e botão */}
                  <div className="px-5 py-3 border-t border-indigo-100 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        Total: <strong className={ok ? 'text-green-600' : 'text-orange-600'}>{totalGeral}</strong>
                        <span className="text-gray-400"> / {pedido.quantidadeTotal} peças</span>
                      </span>
                      {!ok && (
                        <span className="text-xs text-orange-500">
                          {totalGeral < pedido.quantidadeTotal
                            ? `faltam ${pedido.quantidadeTotal - totalGeral}`
                            : `excede em ${totalGeral - pedido.quantidadeTotal}`}
                        </span>
                      )}
                      {ok && <span className="text-xs text-green-600 font-semibold">✓ Total correto</span>}
                    </div>
                    <button
                      onClick={distribuirCombinado}
                      disabled={!ok}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Distribuir →
                    </button>
                  </div>
                </div>
              )
            })()}

            {/* Resumo tamanhos — por modelo se multi-modelo */}
            {resumoTamanhosPorModelo ? (
              <div className="border-b border-gray-200">
                {resumoTamanhosPorModelo.map(m => (
                  <div key={m.id} className="px-6 py-2 bg-gray-50 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-gray-700 uppercase">{m.label}</span>
                      <span className="text-xs text-gray-400">{m.total} peças</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(m.resumo).map(([k, v]) => (
                        <span key={k} className="px-2 py-0.5 bg-orange-500 text-white rounded text-xs font-bold">
                          {k} / {v}
                        </span>
                      ))}
                      {Object.keys(m.resumo).length === 0 && (
                        <span className="text-xs text-gray-400 italic">Sem tamanhos preenchidos</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : Object.keys(resumoTamanhos).length > 0 ? (
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-2">
                {Object.entries(resumoTamanhos).map(([k, v]) => (
                  <span key={k} className="px-2 py-1 bg-orange-500 text-white rounded text-xs font-bold">
                    {k} / {v}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="divide-y divide-gray-100">
              {pecasEditaveis.map((peca, idx) => {
                const boundary = modeloBoundaries?.find(b => b.start === idx)
                return (
                  <div key={peca.id}>
                    {boundary && (
                      <div className="px-6 py-2 bg-gray-800 text-white flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider">Modelo {boundary.modeloIdx + 1}:</span>
                        <span className="text-xs font-bold text-gray-300">{boundary.label}</span>
                        <span className="ml-auto text-xs text-gray-400">{boundary.end - boundary.start} peças</span>
                      </div>
                    )}
                    <div className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                      <button
                        className="flex items-center gap-3 flex-1 text-left"
                        onClick={() => setTabAberta(tabAberta === idx ? null : idx)}
                      >
                        <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-gray-800 text-sm">
                          {peca.pessoaNome || `Peça ${idx + 1}`}
                        </span>
                        {peca.categoria && peca.tamanho && (
                          <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs font-semibold">
                            {CATEGORIA_LABEL[peca.categoria]} {peca.tamanho} — {formatarMoeda(peca.precoUnitario)}
                          </span>
                        )}
                      </button>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => removerPecaDaLista(idx)}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="Remover esta peça"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button onClick={() => setTabAberta(tabAberta === idx ? null : idx)}>
                          {tabAberta === idx ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    {tabAberta === idx && (
                      <div className="px-6 pb-4 bg-orange-50/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="label-base text-xs">Nome da Pessoa</label>
                            <input
                              className="input-base"
                              placeholder="Nome de quem vai usar a peça"
                              value={peca.pessoaNome}
                              onChange={e => atualizarPeca(idx, { pessoaNome: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="label-base text-xs">Categoria *</label>
                            <select
                              className="input-base"
                              value={peca.categoria}
                              onChange={e => atualizarPeca(idx, { categoria: e.target.value as CategoriaSize, tamanho: '' })}
                            >
                              <option value="unissex">Unissex</option>
                              <option value="babylook">Babylook</option>
                              <option value="infantil">Infantil</option>
                            </select>
                          </div>
                          <div>
                            <label className="label-base text-xs">Tamanho *</label>
                            <select
                              className="input-base"
                              value={peca.tamanho}
                              onChange={e => atualizarPeca(idx, { tamanho: e.target.value })}
                            >
                              <option value="">Selecione</option>
                              {(peca.categoria === 'infantil' ? TAMANHOS_INFANTIL : peca.categoria === 'babylook' ? TAMANHOS_BABYLOOK : TAMANHOS_UNISSEX).map(t => {
                                const preco = calcularPreco(pedido.precoUnitario, peca.categoria, t)
                                const extra = ['XG', 'XXG', 'XXXG'].includes(t) ? ' (+30%)' : ['2', '4', '6', '8', '10', '14'].includes(t) ? ' (-R$5)' : ''
                                return <option key={t} value={t}>{t}{extra} — {formatarMoeda(preco)}</option>
                              })}
                            </select>
                          </div>
                          <div>
                            <label className="label-base text-xs">Valor desta peça</label>
                            <div className="input-base bg-gray-50 font-semibold text-orange-600">
                              {formatarMoeda(peca.precoUnitario)}
                            </div>
                          </div>
                          <div>
                            <label className="label-base text-xs">Nome na Camiseta</label>
                            <input
                              className="input-base"
                              placeholder="Nome a imprimir na peça"
                              value={peca.nomeNaCamiseta}
                              onChange={e => atualizarPeca(idx, { nomeNaCamiseta: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="label-base text-xs">Número na Camiseta</label>
                            <input
                              className="input-base"
                              placeholder="Ex: 10"
                              value={peca.numeroNaCamiseta}
                              onChange={e => atualizarPeca(idx, { numeroNaCamiseta: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* Repetir tamanho nas próximas peças */}
                        {idx < pecasEditaveis.length - 1 && peca.tamanho && (
                          <div className="mt-3 pt-3 border-t border-orange-100 flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <CopyCheck size={13} className="text-orange-400" />
                              <span>Repetir <strong>{CATEGORIA_LABEL[peca.categoria]} {peca.tamanho}</strong> nas próximas:</span>
                            </div>
                            {[1, 2, 5].map(n => (
                              <button
                                key={n}
                                onClick={() => repetirPeca(idx, n)}
                                className="px-2.5 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded text-xs font-semibold transition"
                              >
                                +{n} peça{n > 1 ? 's' : ''}
                              </button>
                            ))}
                            <button
                              onClick={() => repetirPeca(idx, pecasEditaveis.length)}
                              className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs font-semibold transition"
                            >
                              todas
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Botão adicionar peça */}
            <div className="px-6 py-3 border-t border-dashed border-gray-200">
              <button
                onClick={adicionarNovaPeca}
                className="flex items-center gap-2 text-sm text-orange-600 font-semibold hover:text-orange-700 hover:bg-orange-50 px-3 py-2 rounded-lg transition w-full justify-center border-2 border-dashed border-orange-200 hover:border-orange-400"
              >
                <Plus size={15} /> Adicionar peça
              </button>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 flex-wrap gap-3">
              <div className="text-sm text-gray-600">
                Total: <span className="font-bold text-gray-900">
                  {formatarMoeda(pecasEditaveis.reduce((s, p) => s + p.precoUnitario, 0))}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href={`/lista-tamanhos/${id}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-semibold text-sm transition border border-green-200"
                  title="Abrir lista de tamanhos para imprimir / salvar PDF"
                >
                  📋 Salvar Lista PDF
                </Link>
                <button
                  onClick={salvarTamanhosHandler}
                  disabled={salvando}
                  className="px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold text-sm transition disabled:opacity-50"
                >
                  {salvando ? 'Salvando...' : 'Salvar Tamanhos'}
                </button>
                {pedido.status === 'tamanhos' && (
                  <button
                    onClick={avancarStatus}
                    disabled={salvando}
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-sm transition disabled:opacity-50"
                  >
                    {salvando ? 'Processando...' : 'Avançar → Arquivos'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Etapa 3 — Arquivos */}
        {!arquivosAtivo ? (
          <SectionLocked titulo="Etapa 3 — Arquivos" descricao="Disponível após confirmar os tamanhos" />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${statusIdx > 2 ? 'bg-green-500' : 'bg-orange-500'}`}>3</div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">Arquivos do Pedido</h2>
                  <p className="text-xs text-gray-500">Layout (PNG/JPG) + Vetores (PDF, CDR, AI)</p>
                </div>
                {statusIdx > 2 && <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">Concluído</span>}
              </div>
              <button
                onClick={() => copiar(gerarLinkArteFinalista(id), 'Link arte-finalista')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-100 transition"
              >
                <Copy size={13} /> Link Arte-Finalista
              </button>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              {/* Layouts */}
              <div>
                <label className="label-base mb-3">Layout (PNG / JPG)</label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Clique para enviar layout</span>
                  <input type="file" accept="image/png,image/jpeg,image/jpg" multiple className="hidden"
                    onChange={e => handleUpload(e.target.files, 'layouts')} />
                </label>
                {pedido.layoutImages?.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {pedido.layoutImages.map((url, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <img src={url} alt="layout" className="w-12 h-12 object-cover rounded" />
                        <span className="text-xs text-gray-600 flex-1 truncate">Layout {i + 1}</span>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"><ExternalLink size={14} /></a>
                        <button onClick={() => removerArquivo(url, 'layouts')} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vetores */}
              <div>
                <label className="label-base mb-3">Vetores (PDF / CDR / AI)</label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Clique para enviar vetores</span>
                  <input type="file" accept=".pdf,.cdr,.ai,.eps,.svg" multiple className="hidden"
                    onChange={e => handleUpload(e.target.files, 'vetores')} />
                </label>
                {pedido.vetoresFiles?.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {pedido.vetoresFiles.map((url, i) => {
                      const nome = url.split('/').pop()?.split('?')[0] || `Arquivo ${i + 1}`
                      return (
                        <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-purple-600 font-bold text-xs">CDR</div>
                          <span className="text-xs text-gray-600 flex-1 truncate">{decodeURIComponent(nome)}</span>
                          <a href={urlVerPDF(url)} download rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"><ExternalLink size={14} /></a>
                          <button onClick={() => removerArquivo(url, 'vetores')} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {pedido.status === 'arquivos' && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button
                  onClick={avancarStatus}
                  disabled={salvando}
                  className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition disabled:opacity-50"
                >
                  {salvando ? 'Processando...' : 'Avançar → Pagamento 💰'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── ETAPA 4 — PAGAMENTO ── */}
        {!pagamentoAtivo ? (
          <SectionLocked titulo="Etapa 4 — Pagamento" descricao="Disponível após confirmar os arquivos" />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${statusIdx > 3 ? 'bg-green-500' : 'bg-teal-500'}`}>4</div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">Situação do Pagamento</h2>
                  <p className="text-xs text-gray-500">Recibo(s) e descrição do pagamento</p>
                </div>
                {statusIdx > 3 && <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">Concluído</span>}
              </div>
            </div>

            <div className="p-6 space-y-5">

              {/* Upload de recibo(s) */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">🧾 Recibo(s) de Pagamento</p>
                <p className="text-xs text-gray-400 mb-3">Cole ou envie imagem(ns) do comprovante. Aceita print de PIX, boleto, transferência, etc.</p>

                <label htmlFor="upload-recibo"
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition ${uploadando ? 'opacity-50 cursor-wait' : 'border-teal-200 hover:border-teal-400 hover:bg-teal-50/20'}`}>
                  <Upload size={22} className="text-teal-400 mb-2" />
                  <span className="text-sm font-semibold text-teal-600">{uploadando ? 'Enviando...' : 'Clique para enviar comprovante'}</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG • Pode enviar múltiplos</span>
                </label>
                <input
                  id="upload-recibo"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/*"
                  multiple
                  className="sr-only"
                  onChange={async e => {
                    if (!e.target.files || !pedido) return
                    setUploadando(true)
                    try {
                      const novas: string[] = []
                      for (const file of Array.from(e.target.files)) {
                        const url = await uploadArquivo(id, file, 'recibo-pagamento')
                        novas.push(url)
                      }
                      const atual = pedido.recibosPagamento ?? []
                      await atualizarPedido(id, { recibosPagamento: [...atual, ...novas] })
                      toast.success(`${novas.length} comprovante(s) enviado(s)!`)
                      await carregar()
                    } catch {
                      toast.error('Erro ao enviar comprovante')
                    } finally {
                      setUploadando(false)
                    }
                    e.target.value = ''
                  }}
                />

                {/* Lista de recibos */}
                {(pedido.recibosPagamento?.length ?? 0) > 0 && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {pedido.recibosPagamento!.map((url, i) => (
                      <div key={i} className="relative group">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt={`Recibo ${i + 1}`} className="w-24 h-24 object-cover rounded-xl border border-gray-200 hover:opacity-80 transition" />
                        </a>
                        <button
                          onClick={async () => {
                            const atual = pedido.recibosPagamento ?? []
                            await atualizarPedido(id, { recibosPagamento: atual.filter(u => u !== url) })
                            toast.success('Comprovante removido')
                            await carregar()
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center shadow"
                        >×</button>
                        <p className="text-xs text-center text-gray-400 mt-1">Rec. {i + 1}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Descrição do pagamento */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">📝 Descrição / Observações do Pagamento</p>
                <textarea
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-teal-400 focus:outline-none resize-none"
                  rows={4}
                  defaultValue={pedido.descricaoPagamento ?? ''}
                  placeholder="Ex: PIX recebido em 10/05/2026 — R$ 850,00. Saldo restante: R$ 200,00 (na entrega). Pagador: João Silva..."
                  onBlur={async e => {
                    await atualizarPedido(id, { descricaoPagamento: e.target.value })
                    toast.success('Observação salva!')
                  }}
                />
                <p className="text-xs text-gray-400 mt-1">Salvo automaticamente ao sair do campo.</p>
              </div>

            </div>

            {pedido.status === 'pagamento' && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500">Confirme o recebimento e avance para a folha final do pedido.</p>
                <button
                  onClick={avancarStatus}
                  disabled={salvando}
                  className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition disabled:opacity-50 whitespace-nowrap"
                >
                  {salvando ? 'Processando...' : 'Avançar → Confirmação Final ✅'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── ETAPA 5 — CONFIRMAÇÃO ── */}
        {statusIdx >= 4 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">5</span>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-green-800 text-lg">Pedido Confirmado!</h2>
              <p className="text-sm text-green-700">Todas as etapas foram concluídas. O pedido está pronto para produção.</p>
            </div>
            <Link
              href={`/confirmacao/${id}`}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition"
            >
              Ver PDF
            </Link>
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════
          MODAL — EDITAR DADOS DO PEDIDO
      ══════════════════════════════════════ */}
      {editModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mb-6">

            {/* Header do modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Pencil size={18} className="text-blue-600" />
                <h2 className="font-bold text-xl text-gray-900">Editar Pedido</h2>
              </div>
              <button onClick={() => setEditModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">

              {/* ── SEÇÃO: INFORMAÇÕES DO PEDIDO ── */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Informações do Pedido</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-base text-xs">Nº Pedido</label>
                    <input className="input-base" value={editForm.numeroPedido || ''} onChange={e => setEditForm(f => ({ ...f, numeroPedido: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label-base text-xs">Vendedor</label>
                    <input className="input-base" value={editForm.nomeVendedor || ''} onChange={e => setEditForm(f => ({ ...f, nomeVendedor: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className="label-base text-xs">Data de Entrega Prevista</label>
                    <input type="date" className="input-base" value={editForm.dataEntregaPrevista || ''} onChange={e => setEditForm(f => ({ ...f, dataEntregaPrevista: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* ── SEÇÃO: PRODUTO(S) — MULTI-MODELO ── */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Produto(s)</p>
                <div className="space-y-3">
                  {modelosEdit.map((_, idx) => renderModeloFormEdit(idx))}
                </div>
                <button
                  type="button"
                  onClick={adicionarModeloEdit}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-orange-300 rounded-2xl text-orange-600 font-semibold text-sm hover:bg-orange-50 hover:border-orange-400 transition"
                >
                  <Plus size={16} /> Adicionar Modelo
                </button>
              </div>

              {/* ── SEÇÃO: CLIENTE ── */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Dados do Cliente — {pedido.clienteType === 'empresa' ? 'Empresa' : 'Pessoa Física'}
                </p>
                {pedido.clienteType === 'empresa' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="label-base text-xs">Razão Social</label>
                      <input className="input-base" value={editForm.clienteEmpresa?.razaoSocial || ''} onChange={e => setEmpresa('razaoSocial', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-base text-xs">CNPJ</label>
                      <input className="input-base" value={editForm.clienteEmpresa?.cnpj || ''} onChange={e => setEmpresa('cnpj', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-base text-xs">Inscrição Estadual</label>
                      <input className="input-base" value={editForm.clienteEmpresa?.inscricaoEstadual || ''} onChange={e => setEmpresa('inscricaoEstadual', e.target.value)} placeholder="Ex: 123.456.789" />
                    </div>
                    <div>
                      <label className="label-base text-xs">Contato</label>
                      <input className="input-base" value={editForm.clienteEmpresa?.contato || ''} onChange={e => setEmpresa('contato', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-base text-xs">Telefone</label>
                      <input className="input-base" value={editForm.clienteEmpresa?.telefone || ''} onChange={e => setEmpresa('telefone', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-base text-xs">E-mail</label>
                      <input className="input-base" value={editForm.clienteEmpresa?.email || ''} onChange={e => setEmpresa('email', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <label className="label-base text-xs">Endereço</label>
                      <input className="input-base" value={editForm.clienteEmpresa?.endereco || ''} onChange={e => setEmpresa('endereco', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-base text-xs">Cidade</label>
                      <input className="input-base" value={editForm.clienteEmpresa?.cidade || ''} onChange={e => setEmpresa('cidade', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="label-base text-xs">Estado</label>
                        <input className="input-base" maxLength={2} value={editForm.clienteEmpresa?.estado || ''} onChange={e => setEmpresa('estado', e.target.value)} />
                      </div>
                      <div>
                        <label className="label-base text-xs">CEP</label>
                        <input className="input-base" value={editForm.clienteEmpresa?.cep || ''} onChange={e => setEmpresa('cep', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="label-base text-xs">Nome Completo</label>
                      <input className="input-base" value={editForm.clientePF?.nomeCompleto || ''} onChange={e => setPF('nomeCompleto', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-base text-xs">CPF</label>
                      <input className="input-base" value={editForm.clientePF?.cpf || ''} onChange={e => setPF('cpf', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-base text-xs">Telefone</label>
                      <input className="input-base" value={editForm.clientePF?.telefone || ''} onChange={e => setPF('telefone', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-base text-xs">E-mail</label>
                      <input className="input-base" value={editForm.clientePF?.email || ''} onChange={e => setPF('email', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-base text-xs">CEP</label>
                      <input className="input-base" value={editForm.clientePF?.cep || ''} onChange={e => setPF('cep', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <label className="label-base text-xs">Endereço</label>
                      <input className="input-base" value={editForm.clientePF?.endereco || ''} onChange={e => setPF('endereco', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-base text-xs">Cidade</label>
                      <input className="input-base" value={editForm.clientePF?.cidade || ''} onChange={e => setPF('cidade', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="label-base text-xs">Estado</label>
                        <input className="input-base" maxLength={2} value={editForm.clientePF?.estado || ''} onChange={e => setPF('estado', e.target.value)} />
                      </div>
                      <div>
                        <label className="label-base text-xs">CEP</label>
                        <input className="input-base" value={editForm.clientePF?.cep || ''} onChange={e => setPF('cep', e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── SEÇÃO: OBSERVAÇÃO DO PEDIDO ── */}
              <div className="border-2 border-amber-300 rounded-xl p-4 bg-amber-50">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span>📋</span> Observação do Pedido
                </p>
                <textarea className="w-full border-2 border-amber-300 focus:border-amber-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none resize-none bg-white placeholder-amber-400" rows={4}
                  value={editForm.observacao || ''}
                  onChange={e => setEditForm(f => ({ ...f, observacao: e.target.value }))}
                  placeholder="Informações importantes, detalhes especiais ou recados sobre este pedido..." />
                <p className="text-xs text-amber-600 mt-1.5">💡 Visível no kanban e no pedido para toda a equipe.</p>
              </div>

              {/* ── SEÇÃO: NEGOCIAÇÃO ── */}
              <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span>💰</span> Valor Final da Negociação
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-base text-xs">Tipo</label>
                    <div className="flex gap-2 mt-1">
                      <button type="button"
                        onClick={() => {
                          const v = Math.abs(editForm.valorNegociacao ?? 0)
                          setEditForm(f => ({ ...f, valorNegociacao: v > 0 ? -v : 0 }))
                        }}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition ${(editForm.valorNegociacao ?? 0) < 0 ? 'bg-red-500 text-white border-red-500' : 'border-gray-300 text-gray-600 bg-white'}`}>
                        − Desconto
                      </button>
                      <button type="button"
                        onClick={() => {
                          const v = Math.abs(editForm.valorNegociacao ?? 0)
                          setEditForm(f => ({ ...f, valorNegociacao: v > 0 ? v : 0 }))
                        }}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition ${(editForm.valorNegociacao ?? 0) > 0 ? 'bg-green-500 text-white border-green-500' : 'border-gray-300 text-gray-600 bg-white'}`}>
                        + Acréscimo
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="label-base text-xs">Valor (R$)</label>
                    <input
                      type="number" min={0} step={0.01}
                      className="input-base"
                      placeholder="0,00"
                      value={editForm.valorNegociacao !== undefined && editForm.valorNegociacao !== 0 ? Math.abs(editForm.valorNegociacao) : ''}
                      onChange={e => {
                        const val = parseFloat(e.target.value) || 0
                        const sign = (editForm.valorNegociacao ?? 0) <= 0 ? -1 : 1
                        setEditForm(f => ({ ...f, valorNegociacao: val === 0 ? 0 : val * sign }))
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="label-base text-xs">Descrição da negociação</label>
                    <input
                      className="input-base"
                      placeholder="Ex: desconto por volume, acréscimo urgência..."
                      value={editForm.descricaoNegociacao || ''}
                      onChange={e => setEditForm(f => ({ ...f, descricaoNegociacao: e.target.value }))}
                    />
                  </div>
                </div>
                {(editForm.valorNegociacao ?? 0) !== 0 && (
                  <p className={`text-sm font-bold mt-2 ${(editForm.valorNegociacao ?? 0) > 0 ? 'text-green-700' : 'text-red-600'}`}>
                    {(editForm.valorNegociacao ?? 0) > 0
                      ? `Acréscimo de R$ ${(editForm.valorNegociacao ?? 0).toFixed(2)}`
                      : `Desconto de R$ ${Math.abs(editForm.valorNegociacao ?? 0).toFixed(2)}`}
                  </p>
                )}
              </div>

            </div>

            {/* Footer do modal */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setEditModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition font-semibold">
                Cancelar
              </button>
              <button onClick={salvarEdicao} disabled={salvandoEdit}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition disabled:opacity-50 flex items-center gap-2">
                {salvandoEdit ? 'Salvando...' : <><Pencil size={14} /> Salvar Alterações</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
