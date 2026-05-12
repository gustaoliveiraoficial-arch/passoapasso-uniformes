'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { criarPedido } from '@/lib/firebase'
import type { Pedido, DetalhesPeca, TipoEstampa } from '@/types/pedido'
import { CATALOGO, COR_HEX } from '@/lib/catalog'
import { TIPOS_ESTAMPA } from '@/types/pedido'
import { formatarCPF, formatarCNPJ, formatarCEP } from '@/lib/utils'
import toast from 'react-hot-toast'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

const DETALHES_VAZIOS: DetalhesPeca = {
  corpo: false, corpoDesc: '',
  friso: false, frisoDesc: '',
  punho: false, punhoDesc: '',
  gola: false, golaDesc: '',
  manga: false, mangaDesc: '',
  bolso: false, bolsoDesc: '',
}

export default function NovoPedido() {
  const router = useRouter()
  const [salvando, setSalvando] = useState(false)

  // Cliente
  const [clienteType, setClienteType] = useState<'empresa' | 'pessoa_fisica'>('pessoa_fisica')
  // Empresa
  const [razaoSocial, setRazaoSocial] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [enderecoEmpresa, setEnderecoEmpresa] = useState('')
  const [cidadeEmpresa, setCidadeEmpresa] = useState('')
  const [estadoEmpresa, setEstadoEmpresa] = useState('')
  const [cepEmpresa, setCepEmpresa] = useState('')
  const [telefoneEmpresa, setTelefoneEmpresa] = useState('')
  const [emailEmpresa, setEmailEmpresa] = useState('')
  const [contatoEmpresa, setContatoEmpresa] = useState('')
  // PF
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

  // Produto
  const [modelo, setModelo] = useState('')
  const [material, setMaterial] = useState('')
  const [cor, setCor] = useState('')
  const [corPersonalizada, setCorPersonalizada] = useState('')
  const [fornecedor, setFornecedor] = useState('')
  const [detalhes, setDetalhes] = useState<DetalhesPeca>({ ...DETALHES_VAZIOS })
  const [tiposEstampa, setTiposEstampa] = useState<TipoEstampa[]>([])
  const [precoUnitario, setPrecoUnitario] = useState('')
  const [quantidadeTotal, setQuantidadeTotal] = useState('')
  const [nomeVendedor, setNomeVendedor] = useState('')
  const [numeroPedido, setNumeroPedido] = useState('')
  const [mensagemMockup, setMensagemMockup] = useState('')
  const [referenciaUnissex, setReferenciaUnissex] = useState('')
  const [referenciaBabylook, setReferenciaBabylook] = useState('')
  const [referenciaInfantil, setReferenciaInfantil] = useState('')

  const materaisDisponiveis = modelo ? Object.entries(CATALOGO[modelo]?.materiais || {}) : []
  const coresDisponiveis = (modelo && material) ? (CATALOGO[modelo]?.materiais[material]?.cores || []) : []

  function toggleEstampa(tipo: TipoEstampa) {
    setTiposEstampa(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
    )
  }

  function toggleDetalhe(campo: keyof DetalhesPeca) {
    setDetalhes(prev => ({ ...prev, [campo]: !prev[campo] }))
  }

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

  function validarProduto(): boolean {
    if (!modelo || !material || !cor) {
      toast.error('Selecione modelo, material e cor')
      return false
    }
    if (cor === 'Personalizada' && !corPersonalizada) {
      toast.error('Descreva a cor personalizada')
      return false
    }
    if (!fornecedor) { toast.error('Informe o fornecedor'); return false }
    if (!precoUnitario || isNaN(Number(precoUnitario)) || Number(precoUnitario) <= 0) {
      toast.error('Informe o valor unitário válido'); return false
    }
    if (!quantidadeTotal || isNaN(Number(quantidadeTotal)) || Number(quantidadeTotal) <= 0) {
      toast.error('Informe a quantidade total válida'); return false
    }
    if (!nomeVendedor) { toast.error('Informe o nome do vendedor'); return false }
    if (!numeroPedido) { toast.error('Informe o número do pedido'); return false }
    return true
  }

  async function salvar() {
    if (!validarCliente() || !validarProduto()) return

    setSalvando(true)
    try {
      const dadosBase = {
        numeroPedido,
        status: 'dados' as const,
        clienteType,
        dataPedido,
        dataEntregaPrevista,
        modelo,
        material,
        cor,
        corPersonalizada,
        fornecedor,
        detalhes,
        tiposEstampa,
        precoUnitario: Number(precoUnitario),
        quantidadeTotal: Number(quantidadeTotal),
        referenciaUnissex,
        referenciaBabylook,
        referenciaInfantil,
        nomeVendedor,
        mensagemMockup,
        pecas: [],
        layoutImages: [],
        vetoresFiles: [],
        artesCliente: [],
        rascunhoVendedor: [],
      }

      const dados: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt' | 'clienteToken'> = clienteType === 'empresa'
        ? {
            ...dadosBase,
            clienteEmpresa: {
              razaoSocial, cnpj, endereco: enderecoEmpresa, cidade: cidadeEmpresa,
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
            {/* Tipo de cliente */}
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
                  <label className="label-base">Telefone</label>
                  <input className="input-base" value={telefoneEmpresa} onChange={e => setTelefoneEmpresa(e.target.value)} />
                </div>
                <div>
                  <label className="label-base">Nome do Contato</label>
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

        {/* ── SEÇÃO 2: PRODUTO ── */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-orange-500 px-6 py-4">
            <h2 className="text-white font-bold text-lg">2. Produto</h2>
          </div>
          <div className="p-6 space-y-6">

            {/* ── MODELOS — pill tabs ── */}
            <div>
              <label className="label-base mb-3">Modelo *</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CATALOGO).map(([key, m]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setModelo(key); setMaterial(''); setCor('') }}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      modelo === key
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-gray-900'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              {modelo && CATALOGO[modelo]?.descricao && (
                <p className="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mt-3 leading-relaxed">
                  ℹ️ {CATALOGO[modelo].descricao}
                </p>
              )}
            </div>

            {/* ── MATERIAIS — linhas clicáveis estilo tabela ── */}
            {modelo && (
              <div>
                <label className="label-base mb-3">Material *</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {Object.entries(CATALOGO[modelo].materiais).map(([key, m], idx, arr) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setMaterial(key); setCor('') }}
                      className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors ${
                        idx < arr.length - 1 ? 'border-b border-gray-100' : ''
                      } ${
                        material === key
                          ? 'bg-orange-50'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {/* Radio visual */}
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        material === key ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                      }`}>
                        {material === key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm ${material === key ? 'text-orange-700' : 'text-gray-800'}`}>
                          {m.label}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                          🎨 {m.cores.slice(0, 8).join(' · ')}{m.cores.length > 8 ? ` · +${m.cores.length - 8} cores` : ''}
                        </div>
                        {m.obs && (
                          <div className="text-xs text-amber-700 mt-1">⚠️ {m.obs}</div>
                        )}
                      </div>
                      {/* Indicador de seleção */}
                      {material === key && (
                        <span className="text-xs font-bold text-orange-500 flex-shrink-0 mt-0.5">✓ Selecionado</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── CORES — swatches coloridos ── */}
            {material && (
              <div>
                <label className="label-base mb-3">Cor *</label>
                <div className="flex flex-wrap gap-2">
                  {coresDisponiveis.map(c => {
                    const hex = COR_HEX[c] || '#9CA3AF'
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCor(c)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          cor === c
                            ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
                          style={{ backgroundColor: hex }}
                        />
                        {c}
                        {cor === c && <Check size={11} />}
                      </button>
                    )
                  })}
                </div>
                {cor === 'Personalizada' && (
                  <input
                    className="input-base mt-3"
                    value={corPersonalizada}
                    onChange={e => setCorPersonalizada(e.target.value)}
                    placeholder="Descreva a cor personalizada: Ex: Verde Limão, Azul Bebê..."
                  />
                )}
              </div>
            )}

            {/* Fornecedor */}
            <div>
              <label className="label-base">Nome do Fornecedor *</label>
              <input className="input-base" value={fornecedor} onChange={e => setFornecedor(e.target.value)} placeholder="Ex: U.S, Paquetá, Fardamento..." />
            </div>

            {/* Referências */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label-base">Referência Unissex</label>
                <input className="input-base" value={referenciaUnissex} onChange={e => setReferenciaUnissex(e.target.value)} placeholder="Ref." />
              </div>
              <div>
                <label className="label-base">Referência Babylook</label>
                <input className="input-base" value={referenciaBabylook} onChange={e => setReferenciaBabylook(e.target.value)} placeholder="Ref." />
              </div>
              <div>
                <label className="label-base">Referência Infantil</label>
                <input className="input-base" value={referenciaInfantil} onChange={e => setReferenciaInfantil(e.target.value)} placeholder="Ref." />
              </div>
            </div>

            {/* Detalhes da peça */}
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
                      checked={detalhes[d.key as keyof DetalhesPeca] as boolean}
                      onChange={() => toggleDetalhe(d.key as keyof DetalhesPeca)}
                      className="accent-orange-500 w-4 h-4 flex-shrink-0"
                    />
                    <span className="font-semibold text-sm text-gray-700 w-16">{d.label}:</span>
                    <input
                      className="input-base flex-1"
                      placeholder="Descrição..."
                      disabled={!detalhes[d.key as keyof DetalhesPeca]}
                      value={detalhes[d.descKey as keyof DetalhesPeca] as string}
                      onChange={e => setDetalhes(prev => ({ ...prev, [d.descKey]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tipo de estampa */}
            <div>
              <label className="label-base">Tipo de Estampa</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {TIPOS_ESTAMPA.map(t => (
                  <label key={t.value} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition font-medium text-sm ${tiposEstampa.includes(t.value) ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={tiposEstampa.includes(t.value)}
                      onChange={() => toggleEstampa(t.value)}
                    />
                    {tiposEstampa.includes(t.value) && <Check size={14} />}
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Preço e Quantidade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label-base">Valor Unitário (R$) *</label>
                <input
                  className="input-base"
                  type="number"
                  min="0"
                  step="0.01"
                  value={precoUnitario}
                  onChange={e => setPrecoUnitario(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="label-base">Quantidade Total de Peças *</label>
                <input
                  className="input-base"
                  type="number"
                  min="1"
                  value={quantidadeTotal}
                  onChange={e => setQuantidadeTotal(e.target.value)}
                  placeholder="20"
                />
              </div>
              <div>
                <label className="label-base">Total Estimado</label>
                <div className="input-base bg-gray-50 font-semibold text-orange-600">
                  {precoUnitario && quantidadeTotal
                    ? `R$ ${(Number(precoUnitario) * Number(quantidadeTotal)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : '—'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SEÇÃO 3: VENDEDOR ── */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-orange-500 px-6 py-4">
            <h2 className="text-white font-bold text-lg">3. Vendedor & Número do Pedido</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label-base">Nome do Vendedor *</label>
                <input className="input-base" value={nomeVendedor} onChange={e => setNomeVendedor(e.target.value)} placeholder="Ex: Gustavo" />
              </div>
              <div>
                <label className="label-base">Número do Pedido *</label>
                <input className="input-base" value={numeroPedido} onChange={e => setNumeroPedido(e.target.value)} placeholder="Ex: 2026-0042" />
              </div>
            </div>
            <div>
              <label className="label-base">Mensagem para o Arte-Finalista <span className="font-normal text-gray-400">(como o cliente quer o mockup)</span></label>
              <textarea
                className="input-base resize-none"
                rows={4}
                value={mensagemMockup}
                onChange={e => setMensagemMockup(e.target.value)}
                placeholder="Ex: Cliente quer o logo centralizado no peito, frente com nome da empresa em letras grandes, costas com os valores da empresa em lista. Referência visual: estilo corporativo sóbrio, sem excesso de cores..."
              />
              <p className="text-xs text-gray-400 mt-1">Esta mensagem aparecerá em destaque no brief do arte-finalista.</p>
            </div>
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
