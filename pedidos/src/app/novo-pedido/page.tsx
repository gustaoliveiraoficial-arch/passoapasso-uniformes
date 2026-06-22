'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { criarPedido } from '@/lib/firebase'
import type { Pedido, DetalhesPeca, TipoEstampa, ModeloPedido } from '@/types/pedido'
import { CATEGORIAS_CAMISETA, TIPOS_ESTAMPA } from '@/types/pedido'
import { CATALOGO, CATEGORIAS, COR_HEX } from '@/lib/catalog'
import { formatarCPF, formatarCNPJ, formatarCEP } from '@/lib/utils'
import toast from 'react-hot-toast'
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

const DETALHES_VAZIOS: DetalhesPeca = {
  corpo: false, corpoDesc: '',
  friso: false, frisoDesc: '',
  punho: false, punhoDesc: '',
  gola: false, golaDesc: '',
  manga: false, mangaDesc: '',
  bolso: false, bolsoDesc: '',
}

interface ModeloForm {
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
  tipoReferencia: 'babylook_unissex' | 'masculino_feminino' | ''
  mensagemMockup: string
  recolhido: boolean
}

function criarModeloVazio(): ModeloForm {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    categoriaAtiva: '',
    modelo: '',
    material: '',
    cor: '',
    corPersonalizada: '',
    fornecedor: '',
    detalhes: { ...DETALHES_VAZIOS },
    tiposEstampa: [],
    precoUnitario: '',
    quantidadeTotal: '',
    referenciaUnissex: '',
    referenciaBabylook: '',
    referenciaInfantil: '',
    tipoReferencia: '',
    mensagemMockup: '',
    recolhido: false,
  }
}

export default function NovoPedido() {
  const router = useRouter()
  const [salvando, setSalvando] = useState(false)

  // ── Cliente ──
  const [clienteType, setClienteType] = useState<'empresa' | 'pessoa_fisica'>('pessoa_fisica')
  const [razaoSocial, setRazaoSocial] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [enderecoEmpresa, setEnderecoEmpresa] = useState('')
  const [cidadeEmpresa, setCidadeEmpresa] = useState('')
  const [estadoEmpresa, setEstadoEmpresa] = useState('')
  const [cepEmpresa, setCepEmpresa] = useState('')
  const [telefoneEmpresa, setTelefoneEmpresa] = useState('')
  const [emailEmpresa, setEmailEmpresa] = useState('')
  const [contatoEmpresa, setContatoEmpresa] = useState('')
  const [inscricaoEstadualEmpresa, setInscricaoEstadualEmpresa] = useState('')
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [cpf, setCpf] = useState('')
  const [enderecoPF, setEnderecoPF] = useState('')
  const [cidadePF, setCidadePF] = useState('')
  const [estadoPF, setEstadoPF] = useState('')
  const [cepPF, setCepPF] = useState('')
  const [telefonePF, setTelefonePF] = useState('')
  const [emailPF, setEmailPF] = useState('')

  // Datas
  const [dataPedido, setDataPedido] = useState(new Date().toISOString().split('T')[0])
  const [dataEntregaPrevista, setDataEntregaPrevista] = useState('')

  // ── Multi-modelos ──
  const [modelosForms, setModelosForms] = useState<ModeloForm[]>([criarModeloVazio()])

  // ── Negociação ──
  const [valorNegociacao, setValorNegociacao] = useState('')
  const [descricaoNegociacao, setDescricaoNegociacao] = useState('')

  // ── Vendedor ──
  const [nomeVendedor, setNomeVendedor] = useState('')
  const [numeroPedido, setNumeroPedido] = useState('')
  const [observacao, setObservacao] = useState('')

  // ── Helpers para modelos ──
  function atualizarModelo(idx: number, updates: Partial<ModeloForm>) {
    setModelosForms(prev => prev.map((m, i) => i === idx ? { ...m, ...updates } : m))
  }

  function adicionarModelo() {
    setModelosForms(prev => [
      ...prev.map(m => ({ ...m, recolhido: true })),
      criarModeloVazio(),
    ])
  }

  function removerModelo(idx: number) {
    if (modelosForms.length === 1) {
      toast.error('O pedido precisa ter pelo menos 1 modelo')
      return
    }
    setModelosForms(prev => prev.filter((_, i) => i !== idx))
  }

  function toggleEstampa(idx: number, tipo: TipoEstampa) {
    const m = modelosForms[idx]
    atualizarModelo(idx, {
      tiposEstampa: m.tiposEstampa.includes(tipo)
        ? m.tiposEstampa.filter(t => t !== tipo)
        : [...m.tiposEstampa, tipo],
    })
  }

  function toggleDetalhe(idx: number, campo: keyof DetalhesPeca) {
    const m = modelosForms[idx]
    atualizarModelo(idx, { detalhes: { ...m.detalhes, [campo]: !m.detalhes[campo] } })
  }

  // ── Validação ──
  function validarCliente(): boolean {
    if (clienteType === 'empresa') {
      if (!razaoSocial || !emailEmpresa) {
        toast.error('Preencha razão social e e-mail da empresa')
        return false
      }
    } else {
      if (!nomeCompleto || !cpf || !enderecoPF || !cepPF || !emailPF) {
        toast.error('Preencha todos os campos obrigatórios do cliente')
        return false
      }
    }
    if (!dataPedido || !dataEntregaPrevista) {
      toast.error('Preencha as datas do pedido')
      return false
    }
    return true
  }

  function validarModelos(): boolean {
    for (let i = 0; i < modelosForms.length; i++) {
      const m = modelosForms[i]
      const sufixo = modelosForms.length > 1 ? ` (Modelo ${i + 1})` : ''
      if (!m.modelo || !m.material || !m.cor) {
        toast.error(`Selecione modelo, material e cor${sufixo}`)
        return false
      }
      if (m.cor === 'Personalizada' && !m.corPersonalizada) {
        toast.error(`Descreva a cor personalizada${sufixo}`)
        return false
      }
      if (!m.fornecedor) { toast.error(`Informe o fornecedor${sufixo}`); return false }
      if (!m.precoUnitario || isNaN(Number(m.precoUnitario)) || Number(m.precoUnitario) <= 0) {
        toast.error(`Informe o valor unitário válido${sufixo}`); return false
      }
      if (!m.quantidadeTotal || isNaN(Number(m.quantidadeTotal)) || Number(m.quantidadeTotal) <= 0) {
        toast.error(`Informe a quantidade total válida${sufixo}`); return false
      }
    }
    if (!nomeVendedor) { toast.error('Informe o nome do vendedor'); return false }
    if (!numeroPedido) { toast.error('Informe o número do pedido'); return false }
    return true
  }

  async function salvar() {
    if (!validarCliente() || !validarModelos()) return

    setSalvando(true)
    try {
      const modelosSalvos: ModeloPedido[] = modelosForms.map(m => ({
        id: m.id,
        modelo: m.modelo,
        material: m.material,
        cor: m.cor,
        corPersonalizada: m.corPersonalizada,
        fornecedor: m.fornecedor,
        detalhes: m.detalhes,
        tiposEstampa: m.tiposEstampa,
        precoUnitario: Number(m.precoUnitario),
        quantidadeTotal: Number(m.quantidadeTotal),
        referenciaUnissex: m.referenciaUnissex,
        referenciaBabylook: m.referenciaBabylook,
        referenciaInfantil: m.referenciaInfantil,
        tipoReferencia: m.tipoReferencia || undefined,
        mensagemMockup: m.mensagemMockup,
        pecas: [],
        layoutImages: [],
        vetoresFiles: [],
      }))

      // Primeiro modelo popula campos legados para compatibilidade
      const primeiro = modelosSalvos[0]
      const quantidadeTotal = modelosSalvos.reduce((s, m) => s + m.quantidadeTotal, 0)

      const dadosBase = {
        numeroPedido,
        status: 'dados' as const,
        clienteType,
        dataPedido,
        dataEntregaPrevista,
        // Campos legados do primeiro modelo
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
        // Multi-modelos
        modelos: modelosSalvos,
        // Negociação
        ...(valorNegociacao ? { valorNegociacao: Number(valorNegociacao) } : {}),
        ...(descricaoNegociacao ? { descricaoNegociacao } : {}),
        // Vendedor / geral
        nomeVendedor,
        pecas: [],
        layoutImages: [],
        vetoresFiles: [],
        artesCliente: [],
        rascunhoVendedor: [],
        observacao,
      }

      const dados: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt' | 'clienteToken'> = clienteType === 'empresa'
        ? {
            ...dadosBase,
            clienteEmpresa: {
              razaoSocial, cnpj, inscricaoEstadual: inscricaoEstadualEmpresa,
              endereco: enderecoEmpresa, cidade: cidadeEmpresa,
              estado: estadoEmpresa, cep: cepEmpresa, telefone: telefoneEmpresa,
              email: emailEmpresa, contato: contatoEmpresa,
            },
          }
        : {
            ...dadosBase,
            clientePF: {
              nomeCompleto, cpf, endereco: enderecoPF, cidade: cidadePF,
              estado: estadoPF, cep: cepPF, telefone: telefonePF, email: emailPF,
            },
          }

      const id = await criarPedido(dados)
      toast.success('Pedido criado com sucesso!')
      router.push(`/pedido/${id}`)
    } catch (e) {
      toast.error('Erro ao salvar pedido. Tente novamente.')
      console.error(e)
    } finally {
      setSalvando(false)
    }
  }

  // ── Renderiza seção de produto para um modelo ──
  function renderModeloForm(idx: number) {
    const m = modelosForms[idx]
    const modelosDaCategoria = m.categoriaAtiva
      ? Object.entries(CATALOGO).filter(([, cat]) => cat.categoria === m.categoriaAtiva)
      : []
    const materiaisDisponiveis = m.modelo ? Object.entries(CATALOGO[m.modelo]?.materiais || {}) : []
    const coresDisponiveis = (m.modelo && m.material) ? (CATALOGO[m.modelo]?.materiais[m.material]?.cores || []) : []

    // Babylook/Unissex apenas para camisetas
    const ehCamiseta = CATEGORIAS_CAMISETA.includes(m.categoriaAtiva)

    return (
      <div key={m.id} className="border-2 border-gray-200 rounded-2xl overflow-hidden">
        {/* Cabeçalho do modelo */}
        <div
          className={`flex items-center justify-between px-5 py-4 cursor-pointer transition ${
            m.recolhido ? 'bg-gray-50 hover:bg-gray-100' : 'bg-orange-500'
          }`}
          onClick={() => atualizarModelo(idx, { recolhido: !m.recolhido })}
        >
          <div className="flex items-center gap-3">
            <span className={`font-bold text-sm rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 ${
              m.recolhido ? 'bg-orange-100 text-orange-700' : 'bg-white bg-opacity-30 text-white'
            }`}>
              {idx + 1}
            </span>
            <div>
              <span className={`font-bold text-base ${m.recolhido ? 'text-gray-700' : 'text-white'}`}>
                {m.modelo && CATALOGO[m.modelo]
                  ? CATALOGO[m.modelo].label
                  : `Modelo ${idx + 1}`}
              </span>
              {m.recolhido && m.quantidadeTotal && (
                <span className="ml-2 text-xs text-gray-500">{m.quantidadeTotal} peças</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {modelosForms.length > 1 && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); removerModelo(idx) }}
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

        {/* Conteúdo do modelo */}
        {!m.recolhido && (
          <div className="p-6 space-y-6 bg-white">
            {/* ── Categorias ── */}
            <div>
              <label className="label-base mb-3">
                Categoria *
                {!ehCamiseta && m.categoriaAtiva && (
                  <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Tamanhos: Feminino / Masculino
                  </span>
                )}
                {ehCamiseta && m.categoriaAtiva && (
                  <span className="ml-2 text-xs font-normal text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                    Tamanhos: Unissex / Babylook / Infantil
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => atualizarModelo(idx, { categoriaAtiva: cat, modelo: '', material: '', cor: '' })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      m.categoriaAtiva === cat
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-gray-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Modelos da categoria ── */}
            {m.categoriaAtiva && (
              <div>
                <label className="label-base mb-3">Modelo *</label>
                <div className="flex flex-wrap gap-2">
                  {modelosDaCategoria.map(([key, cat]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => atualizarModelo(idx, { modelo: key, material: '', cor: '' })}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        m.modelo === key
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-gray-900'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                {m.modelo && CATALOGO[m.modelo]?.descricao && (
                  <p className="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mt-3 leading-relaxed">
                    ℹ️ {CATALOGO[m.modelo].descricao}
                  </p>
                )}
              </div>
            )}

            {/* ── Materiais ── */}
            {m.modelo && (
              <div>
                <label className="label-base mb-3">Material *</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {materiaisDisponiveis.map(([key, mat], matIdx, arr) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => atualizarModelo(idx, { material: key, cor: '' })}
                      className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors ${
                        matIdx < arr.length - 1 ? 'border-b border-gray-100' : ''
                      } ${m.material === key ? 'bg-orange-50' : 'bg-white hover:bg-gray-50'}`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        m.material === key ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                      }`}>
                        {m.material === key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm ${m.material === key ? 'text-orange-700' : 'text-gray-800'}`}>
                          {mat.label}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                          🎨 {mat.cores.slice(0, 8).join(' · ')}{mat.cores.length > 8 ? ` · +${mat.cores.length - 8} cores` : ''}
                        </div>
                        {mat.obs && <div className="text-xs text-amber-700 mt-1">⚠️ {mat.obs}</div>}
                      </div>
                      {m.material === key && (
                        <span className="text-xs font-bold text-orange-500 flex-shrink-0 mt-0.5">✓ Selecionado</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Cores ── */}
            {m.material && (
              <div>
                <label className="label-base mb-3">Cor *</label>
                <div className="flex flex-wrap gap-2">
                  {coresDisponiveis.map(c => {
                    const hex = COR_HEX[c] || '#9CA3AF'
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => atualizarModelo(idx, { cor: c })}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          m.cor === c
                            ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0" style={{ backgroundColor: hex }} />
                        {c}
                        {m.cor === c && <Check size={11} />}
                      </button>
                    )
                  })}
                </div>
                {m.cor === 'Personalizada' && (
                  <input
                    className="input-base mt-3"
                    value={m.corPersonalizada}
                    onChange={e => atualizarModelo(idx, { corPersonalizada: e.target.value })}
                    placeholder="Descreva a cor personalizada: Ex: Verde Limão, Azul Bebê..."
                  />
                )}
              </div>
            )}

            {/* ── Fornecedor ── */}
            <div>
              <label className="label-base">Nome do Fornecedor *</label>
              <input
                className="input-base"
                value={m.fornecedor}
                onChange={e => atualizarModelo(idx, { fornecedor: e.target.value })}
                placeholder="Ex: U.S, Paquetá, Fardamento..."
              />
            </div>

            {/* ── Tipo de Referência de Tamanhos ── */}
            <div>
              <label className="label-base mb-3">
                Referência de Tamanhos *
                <span className="ml-2 text-xs font-normal text-gray-400">— define quais tamanhos o cliente verá no link</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => atualizarModelo(idx, { tipoReferencia: 'babylook_unissex' })}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition ${
                    m.tipoReferencia === 'babylook_unissex'
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'
                  }`}
                >
                  👗 Babylook / Unissex
                </button>
                <button
                  type="button"
                  onClick={() => atualizarModelo(idx, { tipoReferencia: 'masculino_feminino' })}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition ${
                    m.tipoReferencia === 'masculino_feminino'
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'
                  }`}
                >
                  👔 Masculino / Feminino
                </button>
              </div>
              {!m.tipoReferencia && (
                <p className="text-xs text-amber-600 mt-1.5">⚠ Selecione o tipo de referência para filtrar os tamanhos no link do cliente</p>
              )}
            </div>

            {/* ── Referências ── */}
            {ehCamiseta ? (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label-base">Referência Unissex</label>
                  <input className="input-base" value={m.referenciaUnissex} onChange={e => atualizarModelo(idx, { referenciaUnissex: e.target.value })} placeholder="Ref." />
                </div>
                <div>
                  <label className="label-base">Referência Babylook</label>
                  <input className="input-base" value={m.referenciaBabylook} onChange={e => atualizarModelo(idx, { referenciaBabylook: e.target.value })} placeholder="Ref." />
                </div>
                <div>
                  <label className="label-base">Referência Infantil</label>
                  <input className="input-base" value={m.referenciaInfantil} onChange={e => atualizarModelo(idx, { referenciaInfantil: e.target.value })} placeholder="Ref." />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-base">Referência Feminino</label>
                  <input className="input-base" value={m.referenciaBabylook} onChange={e => atualizarModelo(idx, { referenciaBabylook: e.target.value })} placeholder="Ref." />
                </div>
                <div>
                  <label className="label-base">Referência Masculino</label>
                  <input className="input-base" value={m.referenciaUnissex} onChange={e => atualizarModelo(idx, { referenciaUnissex: e.target.value })} placeholder="Ref." />
                </div>
              </div>
            )}

            {/* ── Detalhes da peça ── */}
            <div>
              <label className="label-base">Detalhes da Peça</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {[
                  { key: 'corpo', label: 'Corpo', descKey: 'corpoDesc' },
                  { key: 'friso', label: 'Friso', descKey: 'frisoDesc' },
                  { key: 'punho', label: 'Punho', descKey: 'punhoDesc' },
                  { key: 'gola', label: 'Gola', descKey: 'golaDesc' },
                  { key: 'manga', label: 'Manga', descKey: 'mangaDesc' },
                  { key: 'bolso', label: 'Bolso', descKey: 'bolsoDesc' },
                ].map(d => (
                  <div key={d.key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={m.detalhes[d.key as keyof DetalhesPeca] as boolean}
                      onChange={() => toggleDetalhe(idx, d.key as keyof DetalhesPeca)}
                      className="accent-orange-500 w-4 h-4 flex-shrink-0"
                    />
                    <span className="font-semibold text-sm text-gray-700 w-16">{d.label}:</span>
                    <input
                      className="input-base flex-1"
                      placeholder="Descrição..."
                      disabled={!m.detalhes[d.key as keyof DetalhesPeca]}
                      value={m.detalhes[d.descKey as keyof DetalhesPeca] as string}
                      onChange={e => atualizarModelo(idx, { detalhes: { ...m.detalhes, [d.descKey]: e.target.value } })}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Tipo de estampa ── */}
            <div>
              <label className="label-base">Tipo de Estampa</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {TIPOS_ESTAMPA.map(t => (
                  <label key={t.value} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition font-medium text-sm ${
                    m.tiposEstampa.includes(t.value)
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 text-gray-600 hover:border-orange-300'
                  }`}>
                    <input type="checkbox" className="hidden" checked={m.tiposEstampa.includes(t.value)} onChange={() => toggleEstampa(idx, t.value)} />
                    {m.tiposEstampa.includes(t.value) && <Check size={14} />}
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            {/* ── Preço, Quantidade e Mensagem ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label-base">Valor Unitário (R$) *</label>
                <input
                  className="input-base"
                  type="number"
                  min="0"
                  step="0.01"
                  value={m.precoUnitario}
                  onChange={e => atualizarModelo(idx, { precoUnitario: e.target.value })}
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="label-base">Quantidade Total de Peças *</label>
                <input
                  className="input-base"
                  type="number"
                  min="1"
                  value={m.quantidadeTotal}
                  onChange={e => atualizarModelo(idx, { quantidadeTotal: e.target.value })}
                  placeholder="20"
                />
              </div>
              <div>
                <label className="label-base">Total Estimado</label>
                <div className="input-base bg-gray-50 font-semibold text-orange-600">
                  {m.precoUnitario && m.quantidadeTotal
                    ? `R$ ${(Number(m.precoUnitario) * Number(m.quantidadeTotal)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : '—'}
                </div>
              </div>
            </div>

            {/* ── Mensagem para arte-finalista ── */}
            <div>
              <label className="label-base">Mensagem para o Arte-Finalista <span className="font-normal text-gray-400">(mockup)</span></label>
              <textarea
                className="input-base resize-none"
                rows={3}
                value={m.mensagemMockup}
                onChange={e => atualizarModelo(idx, { mensagemMockup: e.target.value })}
                placeholder="Ex: Logo centralizado no peito, nome da empresa em letras grandes nas costas..."
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Total estimado de todos os modelos ──
  const totalGeral = modelosForms.reduce((s, m) => {
    if (m.precoUnitario && m.quantidadeTotal) {
      return s + Number(m.precoUnitario) * Number(m.quantidadeTotal)
    }
    return s
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Novo Pedido</h1>
            <p className="text-xs text-gray-500">Preencha todos os campos para registrar o pedido</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* ── SEÇÃO 1: DADOS DO CLIENTE ── */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-orange-500 px-6 py-4">
            <h2 className="text-white font-bold text-lg">1. Dados do Cliente</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex gap-4">
              {[
                { value: 'pessoa_fisica', label: 'Pessoa Física' },
                { value: 'empresa', label: 'Empresa (CNPJ)' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="clienteType"
                    value={opt.value}
                    checked={clienteType === opt.value}
                    onChange={() => setClienteType(opt.value as 'empresa' | 'pessoa_fisica')}
                    className="accent-orange-500 w-4 h-4"
                  />
                  <span className="font-medium text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>

            {clienteType === 'pessoa_fisica' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label-base">Nome Completo *</label>
                  <input className="input-base" value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} placeholder="Nome completo" />
                </div>
                <div>
                  <label className="label-base">CPF *</label>
                  <input className="input-base" value={cpf} onChange={e => setCpf(formatarCPF(e.target.value))} placeholder="000.000.000-00" maxLength={14} />
                </div>
                <div>
                  <label className="label-base">Telefone</label>
                  <input className="input-base" value={telefonePF} onChange={e => setTelefonePF(e.target.value)} placeholder="(51) 99999-9999" />
                </div>
                <div className="md:col-span-2">
                  <label className="label-base">Endereço completo *</label>
                  <input className="input-base" value={enderecoPF} onChange={e => setEnderecoPF(e.target.value)} placeholder="Rua, número, bairro" />
                </div>
                <div>
                  <label className="label-base">Cidade</label>
                  <input className="input-base" value={cidadePF} onChange={e => setCidadePF(e.target.value)} />
                </div>
                <div>
                  <label className="label-base">Estado</label>
                  <input className="input-base" value={estadoPF} onChange={e => setEstadoPF(e.target.value)} placeholder="RS" maxLength={2} />
                </div>
                <div>
                  <label className="label-base">CEP *</label>
                  <input className="input-base" value={cepPF} onChange={e => setCepPF(formatarCEP(e.target.value))} placeholder="00000-000" maxLength={9} />
                </div>
                <div>
                  <label className="label-base">E-mail *</label>
                  <input className="input-base" type="email" value={emailPF} onChange={e => setEmailPF(e.target.value)} placeholder="email@exemplo.com" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label-base">Razão Social *</label>
                  <input className="input-base" value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)} placeholder="Nome da empresa" />
                </div>
                <div>
                  <label className="label-base">CNPJ</label>
                  <input className="input-base" value={cnpj} onChange={e => setCnpj(formatarCNPJ(e.target.value))} placeholder="00.000.000/0000-00" maxLength={18} />
                </div>
                <div>
                  <label className="label-base">Inscrição Estadual</label>
                  <input className="input-base" value={inscricaoEstadualEmpresa} onChange={e => setInscricaoEstadualEmpresa(e.target.value)} placeholder="Ex: 123.456.789" />
                </div>
                <div>
                  <label className="label-base">Telefone</label>
                  <input className="input-base" value={telefoneEmpresa} onChange={e => setTelefoneEmpresa(e.target.value)} />
                </div>
                <div>
                  <label className="label-base">Responsável pelo pedido</label>
                  <input className="input-base" value={contatoEmpresa} onChange={e => setContatoEmpresa(e.target.value)} />
                </div>
                <div>
                  <label className="label-base">E-mail *</label>
                  <input className="input-base" type="email" value={emailEmpresa} onChange={e => setEmailEmpresa(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="label-base">Endereço</label>
                  <input className="input-base" value={enderecoEmpresa} onChange={e => setEnderecoEmpresa(e.target.value)} />
                </div>
                <div>
                  <label className="label-base">Cidade</label>
                  <input className="input-base" value={cidadeEmpresa} onChange={e => setCidadeEmpresa(e.target.value)} />
                </div>
                <div>
                  <label className="label-base">Estado</label>
                  <input className="input-base" value={estadoEmpresa} onChange={e => setEstadoEmpresa(e.target.value)} maxLength={2} />
                </div>
                <div>
                  <label className="label-base">CEP</label>
                  <input className="input-base" value={cepEmpresa} onChange={e => setCepEmpresa(formatarCEP(e.target.value))} maxLength={9} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-base">Data do Pedido *</label>
                <input className="input-base" type="date" value={dataPedido} onChange={e => setDataPedido(e.target.value)} />
              </div>
              <div>
                <label className="label-base">Data de Entrega Prevista *</label>
                <input className="input-base" type="date" value={dataEntregaPrevista} onChange={e => setDataEntregaPrevista(e.target.value)} />
              </div>
            </div>
          </div>
        </section>

        {/* ── SEÇÃO 2: MODELOS DO PEDIDO ── */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-orange-500 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">2. Produto(s)</h2>
              <p className="text-orange-100 text-xs mt-0.5">
                Cada modelo = 1 folha A4 para produção
              </p>
            </div>
            {modelosForms.length > 1 && (
              <span className="bg-white bg-opacity-20 text-white text-sm font-bold px-3 py-1 rounded-full">
                {modelosForms.length} modelos
              </span>
            )}
          </div>

          <div className="p-6 space-y-4">
            {modelosForms.map((_, idx) => renderModeloForm(idx))}

            {/* Total geral */}
            {modelosForms.length > 1 && totalGeral > 0 && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Total estimado (todos os modelos):</span>
                <span className="text-base font-bold text-orange-600">
                  R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            {/* Botão adicionar modelo */}
            <button
              type="button"
              onClick={adicionarModelo}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-orange-300 rounded-xl text-orange-600 font-semibold text-sm hover:border-orange-500 hover:bg-orange-50 transition"
            >
              <Plus size={16} />
              Adicionar Modelo
            </button>
          </div>
        </section>

        {/* ── SEÇÃO 3: NEGOCIAÇÃO ── */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-green-600 px-6 py-4 flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <h2 className="text-white font-bold text-lg">3. Negociação</h2>
              <p className="text-green-100 text-xs mt-0.5">Valor final acordado e condições da negociação</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-base">Valor Final da Negociação (R$)</label>
                <input
                  className="input-base"
                  type="number"
                  min="0"
                  step="0.01"
                  value={valorNegociacao}
                  onChange={e => setValorNegociacao(e.target.value)}
                  placeholder="Ex: 1500,00"
                />
                <p className="text-xs text-gray-400 mt-1">Valor total combinado com o cliente (pode diferir do estimado)</p>
              </div>
              {valorNegociacao && totalGeral > 0 && (
                <div className="flex items-center">
                  <div className={`w-full p-3 rounded-xl text-sm font-semibold text-center ${
                    Number(valorNegociacao) < totalGeral
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : Number(valorNegociacao) > totalGeral
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200'
                  }`}>
                    {Number(valorNegociacao) < totalGeral
                      ? `📉 Desconto de R$ ${(totalGeral - Number(valorNegociacao)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : Number(valorNegociacao) > totalGeral
                        ? `📈 Acréscimo de R$ ${(Number(valorNegociacao) - totalGeral).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        : '✓ Igual ao estimado'}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="label-base">Descrição da Negociação</label>
              <textarea
                className="w-full border border-gray-200 focus:border-green-500 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                rows={3}
                value={descricaoNegociacao}
                onChange={e => setDescricaoNegociacao(e.target.value)}
                placeholder="Ex: 10% de desconto por ser cliente recorrente. Pagamento 50% entrada + 50% na retirada. Frete incluso..."
              />
            </div>
          </div>
        </section>

        {/* ── SEÇÃO 4: VENDEDOR ── */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-orange-500 px-6 py-4">
            <h2 className="text-white font-bold text-lg">4. Vendedor & Número do Pedido</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-base">Nome do Vendedor *</label>
                <input className="input-base" value={nomeVendedor} onChange={e => setNomeVendedor(e.target.value)} placeholder="Ex: Gustavo" />
              </div>
              <div>
                <label className="label-base">Número do Pedido *</label>
                <input className="input-base" value={numeroPedido} onChange={e => setNumeroPedido(e.target.value)} placeholder="Ex: 2026-0042" />
              </div>
            </div>
          </div>
        </section>

        {/* ── SEÇÃO 5: OBSERVAÇÃO ── */}
        <section className="bg-white rounded-2xl border-2 border-amber-400 shadow-md overflow-hidden">
          <div className="bg-amber-400 px-6 py-4 flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="text-white font-bold text-lg">5. Observação do Pedido</h2>
              <p className="text-amber-100 text-xs mt-0.5">Informações importantes ou recados para a equipe</p>
            </div>
          </div>
          <div className="p-6">
            <textarea
              className="w-full border-2 border-amber-300 focus:border-amber-500 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none bg-amber-50 placeholder-amber-400"
              rows={4}
              value={observacao}
              onChange={e => setObservacao(e.target.value)}
              placeholder="Ex: Cliente pediu prazo extra. Entrega em endereço diferente. Combinar pagamento do saldo na retirada..."
            />
            <p className="text-xs text-amber-600 mt-2 font-medium">💡 Visível no kanban para toda a equipe.</p>
          </div>
        </section>

        {/* Botão Salvar */}
        <div className="flex justify-end gap-4">
          <Link href="/" className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition">
            Cancelar
          </Link>
          <button
            onClick={salvar}
            disabled={salvando}
            className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-base transition disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : (
              <>
                Salvar Pedido <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  )
}
