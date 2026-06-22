export type StatusPedido = 'dados' | 'tamanhos' | 'arquivos' | 'pagamento' | 'confirmacao' | 'formalizado' | 'retirada'

export type StatusProducao = 'em_producao' | 'em_atraso' | 'pronto' | 'em_conserto'

export interface Conserto {
  descricao: string
  responsavel: 'nos' | 'cliente'
  foto?: string
  dataEnvio: string
}

export interface PieceEntry {
  id: string
  pessoaNome: string
  nomeNaCamiseta: string
  numeroNaCamiseta: string
  categoria: string
  tamanho: string
  precoUnitario: number
  infoExtra?: string
  ajustePreco?: number
}

export interface ModeloPedido {
  id: string
  modelo: string
  material: string
  cor: string
  quantidadeTotal: number
  pecas: PieceEntry[]
}

export interface ClienteEmpresa {
  razaoSocial: string
  cnpj: string
  telefone: string
  email: string
  contato: string
  cidade: string
  estado: string
}

export interface ClientePF {
  nomeCompleto: string
  cpf: string
  telefone: string
  email: string
  cidade: string
  estado: string
}

export interface Pedido {
  id: string
  numeroPedido: string
  numeroPedidoSistema?: string
  status: StatusPedido
  clienteType: 'empresa' | 'pessoa_fisica'
  clienteEmpresa?: ClienteEmpresa
  clientePF?: ClientePF

  // Datas
  dataPedido: string
  dataEntregaPrevista: string

  // Produto
  modelo: string
  quantidadeTotal: number

  // Multi-modelos
  modelos?: ModeloPedido[]
  pecas: PieceEntry[]

  // Vendedor
  nomeVendedor: string

  // Negociação
  valorNegociacao?: number
  descricaoNegociacao?: string

  // Retirada
  dataRetirada?: string

  // Controle de Produção
  statusProducao?: StatusProducao
  dataEntradaProducao?: string  // ISO — quando entrou em "em_producao", nunca muda
  dataEntregaNovaProducao?: string
  motivoAtraso?: string
  conserto?: Conserto

  // Mensagens para Márcia
  mensagensMarcia?: MensagemMarcia[]

  createdAt: string
  updatedAt: string
}

export interface MensagemMarcia {
  id: string
  texto: string
  novaDataSolicitada?: string
  criadoEm: string
  respondidoEm?: string
  resposta?: string
}
