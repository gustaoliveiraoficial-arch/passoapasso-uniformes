export type ClienteType = 'empresa' | 'pessoa_fisica'

export type StatusPedido = 'dados' | 'tamanhos' | 'arquivos' | 'pagamento' | 'confirmacao'

export type CategoriaSize = 'unissex' | 'babylook' | 'infantil'

export type TipoEstampa = 'serigrafia' | 'dtf' | 'plastsol' | 'alto_relevo' | 'sublimacao' | 'bordado'

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
}

export interface ClienteEmpresa {
  razaoSocial: string
  cnpj: string
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

  // Produto
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

  // Vendedor
  nomeVendedor: string

  // Tamanhos — um por peça
  pecas: PieceEntry[]

  // Arquivos (URLs do Cloudinary)
  layoutImages: string[]
  vetoresFiles: string[]

  // Imagens de referência adicionadas pelo vendedor na etapa "dados"
  artesCliente: string[]      // artes/estampas enviadas pelo cliente
  rascunhoVendedor: string[]  // mockup/rascunho inicial feito pelo vendedor

  // Mensagem do vendedor para o arte-finalista
  mensagemMockup?: string

  // Quadros de estampa preenchidos pelo arte-finalista
  estampaQuadros?: EstampaQuadro[]

  // Pagamento
  recibosPagamento?: string[]
  descricaoPagamento?: string

  // Token para link do cliente (tamanhos)
  clienteToken: string

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
  if ((categoria === 'unissex' || categoria === 'babylook') && sobretaxa.includes(tamanho)) {
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
}

export const STATUS_COLORS: Record<StatusPedido, string> = {
  dados: 'bg-yellow-100 text-yellow-800',
  tamanhos: 'bg-blue-100 text-blue-800',
  arquivos: 'bg-purple-100 text-purple-800',
  pagamento: 'bg-teal-100 text-teal-800',
  confirmacao: 'bg-green-100 text-green-800',
}

export const TAMANHOS_UNISSEX = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG']
export const TAMANHOS_BABYLOOK = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG']
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
  'Frente', 'Costas', 'Manga Esq.', 'Manga Dir.', 'Bolso', 'Gola', 'Lateral', 'Outro'
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

export interface EstampaQuadro {
  id: string
  posicao: string
  tiposEstampa: string[]
  imagem: string    // URL Cloudinary
  descricaoCores: string
}
