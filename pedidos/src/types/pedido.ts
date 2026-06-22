export type ClienteType = 'empresa' | 'pessoa_fisica'

export type StatusPedido = 'dados' | 'tamanhos' | 'arquivos' | 'pagamento' | 'confirmacao' | 'formalizado' | 'retirada'

export type StatusProducao = 'em_producao' | 'em_atraso' | 'pronto' | 'em_conserto'

export interface Conserto {
  descricao: string
  responsavel: 'nos' | 'cliente'
  foto?: string
  dataEnvio: string
}

export type CategoriaSize = 'unissex' | 'babylook' | 'feminino' | 'masculino' | 'infantil'

export type TipoEstampa = 'serigrafia' | 'dtf' | 'plastsol' | 'alto_relevo' | 'sublimacao' | 'bordado'

// Categorias que suportam babylook/unissex — demais usam feminino/masculino
export const CATEGORIAS_CAMISETA = [
  'Camiseta / Baby Look',
  'Camisetas Polos',
  'Blusinha Manga Bufante',
  'Camiseta Manga Longa',
  'Regatas e Cropped',
  'Fitness',
  'Sublimados',
  'Kit Futebol',
  'Kit FTV',
]

export interface DetalhesPeca {
  corpo: boolean
  corpoDesc: string
  friso: boolean
  frisoDesc: string
  punho: boolean
  punhoDesc: string
  gola: boolean
  golaDesc: string
  manga: boolean
  mangaDesc: string
  bolso: boolean
  bolsoDesc: string
}

export interface PieceEntry {
  id: string
  pessoaNome: string
  nomeNaCamiseta: string
  numeroNaCamiseta: string
  categoria: CategoriaSize
  tamanho: string
  precoUnitario: number // calculado com base na categoria/tamanho
  infoExtra?: string    // observação extra da peça (ex: personalização especial)
  ajustePreco?: number  // acréscimo (+) ou desconto (−) individual em R$
}

export interface ClienteEmpresa {
  razaoSocial: string
  cnpj: string
  inscricaoEstadual?: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  telefone: string
  email: string
  contato: string
}

export interface ClientePF {
  nomeCompleto: string
  cpf: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  telefone: string
  email: string
}

export interface EstampaQuadro {
  id: string
  posicao: string
  tiposEstampa: string[]
  imagem: string    // URL Cloudinary
  descricaoCores: string
}

// Cada modelo = 1 folha A4 de produção
export interface ModeloPedido {
  id: string
  modelo: string
  material: string
  cor: string
  corPersonalizada: string
  fornecedor: string
  detalhes: DetalhesPeca
  tiposEstampa: TipoEstampa[]
  precoUnitario: number
  quantidadeTotal: number
  referenciaUnissex: string
  referenciaBabylook: string
  referenciaInfantil: string
  tipoReferencia?: 'babylook_unissex' | 'masculino_feminino'
  mensagemMockup?: string
  pecas: PieceEntry[]
  layoutImages: string[]
  vetoresFiles: string[]
  estampaQuadros?: EstampaQuadro[]
}

export interface Pedido {
  id: string
  numeroPedido: string
  status: StatusPedido
  clienteType: ClienteType
  clienteEmpresa?: ClienteEmpresa
  clientePF?: ClientePF

  // Datas
  dataPedido: string // ISO string
  dataEntregaPrevista: string // ISO string

  // Produto legado (mantido para pedidos existentes e compatibilidade)
  modelo: string
  material: string
  cor: string
  corPersonalizada: string
  fornecedor: string
  detalhes: DetalhesPeca
  tiposEstampa: TipoEstampa[]
  precoUnitario: number
  quantidadeTotal: number

  // Referências por categoria (para PDF)
  referenciaUnissex: string
  referenciaBabylook: string
  referenciaInfantil: string

  // Multi-modelos — cada item representa 1 folha A4 de produção
  modelos?: ModeloPedido[]

  // Negociação
  valorNegociacao?: number
  descricaoNegociacao?: string

  // Vendedor
  nomeVendedor: string

  // Tamanhos legado — um por peça
  pecas: PieceEntry[]

  // Arquivos legado (URLs do Cloudinary)
  layoutImages: string[]
  vetoresFiles: string[]
  artesCliente: string[]
  rascunhoVendedor: string[]

  // Mensagem do vendedor para o arte-finalista (legado)
  mensagemMockup?: string

  // Quadros de estampa (legado)
  estampaQuadros?: EstampaQuadro[]

  // Pagamento
  recibosPagamento?: string[]
  descricaoPagamento?: string

  // Token para link do cliente (tamanhos)
  clienteToken: string

  // Formalização
  numeroPedidoSistema?: string
  termosEnviados?: boolean

  // Retirada
  dataRetirada?: string
  comprovanteRetirada?: string[]
  observacaoRetirada?: string
  statusPagamentoFinal?: 'pago' | 'falta_pagamento'

  // Observação interna do pedido
  observacao?: string

  // Controle de Produção
  statusProducao?: StatusProducao
  dataEntradaProducao?: string  // ISO — quando entrou em "em_producao", nunca muda
  dataEntregaNovaProducao?: string // nova data prevista quando em atraso
  motivoAtraso?: string
  conserto?: Conserto

  createdAt: string
  updatedAt: string
}

// Helpers de preço
export function calcularPreco(precoBase: number, categoria: CategoriaSize, tamanho: string): number {
  const sobretaxa = ['XG', 'XXG', 'XXXG']
  const desconto = ['2', '4', '6', '8', '10', '12', '14']

  if (categoria === 'infantil' && desconto.includes(tamanho)) {
    return Math.max(0, precoBase - 5)
  }
  if ((categoria === 'unissex' || categoria === 'babylook' || categoria === 'feminino' || categoria === 'masculino') && sobretaxa.includes(tamanho)) {
    return precoBase * 1.3
  }
  return precoBase
}

export const STATUS_LABELS: Record<StatusPedido, string> = {
  dados: '1. Dados',
  tamanhos: '2. Tamanhos',
  arquivos: '3. Arquivos',
  pagamento: '4. Pagamento',
  confirmacao: '5. Confirmação',
  formalizado: '✓ Formalizado',
  retirada: '📦 Retirada',
}

export const STATUS_COLORS: Record<StatusPedido, string> = {
  dados: 'bg-yellow-100 text-yellow-800',
  tamanhos: 'bg-blue-100 text-blue-800',
  arquivos: 'bg-purple-100 text-purple-800',
  pagamento: 'bg-teal-100 text-teal-800',
  confirmacao: 'bg-orange-100 text-orange-800',
  formalizado: 'bg-emerald-100 text-emerald-800',
  retirada: 'bg-indigo-100 text-indigo-800',
}

export const TAMANHOS_UNISSEX = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG']
export const TAMANHOS_BABYLOOK = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG']
export const TAMANHOS_FEMININO = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG']
export const TAMANHOS_MASCULINO = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG']
export const TAMANHOS_INFANTIL = ['2', '4', '6', '8', '10', '12', '14']

export const TIPOS_ESTAMPA: { value: TipoEstampa; label: string }[] = [
  { value: 'serigrafia', label: 'Serigrafia' },
  { value: 'dtf', label: 'DTF' },
  { value: 'plastsol', label: 'Plastsol' },
  { value: 'alto_relevo', label: 'Alto Relevo' },
  { value: 'sublimacao', label: 'Sublimação' },
  { value: 'bordado', label: 'Bordado' },
]

export const POSICOES_ESTAMPA = [
  'Frente', 'Costas', 'Mangas', 'Manga Esq.', 'Manga Dir.', 'Bolso', 'Gola', 'Lateral', 'Outro'
]

export const TIPOS_ESTAMPA_QUADRO = [
  'Bordado',
  'Sublimado + Bordado',
  'Serigrafia',
  'Silk',
  'DTF',
  'Plastsol',
  'Alto Relevo',
]
