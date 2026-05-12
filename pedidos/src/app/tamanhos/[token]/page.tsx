'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { buscarPedidoPorToken, salvarTamanhos } from '@/lib/firebase'
import type { Pedido, PieceEntry, CategoriaSize } from '@/types/pedido'
import { TAMANHOS_UNISSEX, TAMANHOS_BABYLOOK, TAMANHOS_INFANTIL, calcularPreco } from '@/types/pedido'
import { formatarData } from '@/lib/utils'
import { CATALOGO } from '@/lib/catalog'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import { Check, Plus, Trash2, AlertCircle, ChevronRight, HelpCircle, X } from 'lucide-react'

// ── Types ──
type GeralLinha = { id: string; categoria: CategoriaSize; tamanho: string; quantidade: number }
type PersonalizadoLinha = { id: string; pessoaNome: string; nomeNaCamiseta: string; numeroNaCamiseta: string; categoria: CategoriaSize; tamanho: string }
type Aba = 'geral' | 'personalizado'

const CAT_LABEL: Record<CategoriaSize, string> = { unissex: 'Unissex', babylook: 'Baby Look', infantil: 'Infantil' }
const CAT_SHORT: Record<CategoriaSize, string> = { unissex: 'UNI', babylook: 'BL', infantil: 'INF' }

function getTamanhos(cat: CategoriaSize) {
  if (cat === 'infantil') return TAMANHOS_INFANTIL
  if (cat === 'babylook') return TAMANHOS_BABYLOOK
  return TAMANHOS_UNISSEX
}

// ── Stepper numérico ──
function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-0 rounded-xl overflow-hidden border-2 border-gray-200 w-fit">
      <button type="button" onPointerDown={() => onChange(Math.max(1, value - 1))}
        className="w-11 h-11 flex items-center justify-center text-xl font-bold text-gray-500 active:bg-gray-200 bg-gray-50 select-none">
        −
      </button>
      <span className="w-12 text-center font-bold text-lg text-gray-900 select-none">{value}</span>
      <button type="button" onPointerDown={() => onChange(value + 1)}
        className="w-11 h-11 flex items-center justify-center text-xl font-bold text-orange-500 active:bg-orange-100 bg-gray-50 select-none">
        +
      </button>
    </div>
  )
}

export default function TamanhosCliente() {
  const { token } = useParams<{ token: string }>()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [aba, setAba] = useState<Aba>('geral')
  const [mostrarResumo, setMostrarResumo] = useState(false)
  const [guiaAberto, setGuiaAberto] = useState(false)
  const [tutorialStep, setTutorialStep] = useState<number | null>(null)

  const [geralLinhas, setGeralLinhas] = useState<GeralLinha[]>([
    { id: uuidv4(), categoria: 'unissex', tamanho: '', quantidade: 1 },
  ])
  const [personalizados, setPersonalizados] = useState<PersonalizadoLinha[]>([])

  useEffect(() => {
    buscarPedidoPorToken(token).then(p => {
      setPedido(p)
      setLoading(false)
      // Inicia tutorial apenas se não foi pulado antes
      const pulado = localStorage.getItem(`tutorial-tamanhos-${token}`)
      if (!pulado) setTutorialStep(0)
    })
  }, [token])

  // ── Tutorial ──
  const TUTORIAL_STEPS = [
    {
      emoji: '👋',
      titulo: 'Olá! Vamos começar',
      texto: 'Enviamos este link para você confirmar os tamanhos do seu pedido. É rápido e fácil — leva menos de 2 minutos. Vamos te mostrar como funciona!',
    },
    {
      emoji: '📊',
      titulo: 'Barra de progresso',
      texto: 'No topo da tela tem um contador que mostra quantas peças você já configurou do total do pedido. O botão de confirmar só aparece quando o número bater exatamente.',
    },
    {
      emoji: '📏',
      titulo: 'Aba "Tamanho Geral"',
      texto: 'Use esta aba quando não precisa identificar quem vai usar cada peça — só informa a quantidade por tamanho.\n\nExemplo: 3 peças M, 2 peças G, 1 peça GG.',
    },
    {
      emoji: '👤',
      titulo: 'Aba "Personalizado"',
      texto: 'Use esta aba quando cada peça tem nome ou número bordado/estampado. Você adiciona uma entrada por pessoa com o tamanho dela.\n\nExemplo: João Silva, nome na peça "CAPITÃO", número 10, tamanho M.',
    },
    {
      emoji: '✅',
      titulo: 'Tudo pronto!',
      texto: 'Agora você já sabe tudo! Preencha os tamanhos, confira o contador no topo e clique em "Revisar e Confirmar" quando terminar.',
    },
  ]

  function tutorialAvancar() {
    if (tutorialStep === null) return
    if (tutorialStep >= TUTORIAL_STEPS.length - 1) {
      fecharTutorial()
    } else {
      setTutorialStep(tutorialStep + 1)
    }
  }

  function fecharTutorial() {
    localStorage.setItem(`tutorial-tamanhos-${token}`, '1')
    setTutorialStep(null)
  }

  const ehUltimoStep = tutorialStep === TUTORIAL_STEPS.length - 1

  // ── Geral ──
  const addGeral = () =>
    setGeralLinhas(p => [...p, { id: uuidv4(), categoria: 'unissex', tamanho: '', quantidade: 1 }])

  const updateGeral = (idx: number, campo: Partial<GeralLinha>) =>
    setGeralLinhas(p => {
      const n = [...p]
      n[idx] = { ...n[idx], ...campo }
      if (campo.categoria) n[idx].tamanho = ''
      return n
    })

  const removeGeral = (idx: number) => setGeralLinhas(p => p.filter((_, i) => i !== idx))

  // ── Personalizado ──
  const addPers = () =>
    setPersonalizados(p => [...p, { id: uuidv4(), pessoaNome: '', nomeNaCamiseta: '', numeroNaCamiseta: '', categoria: 'unissex', tamanho: '' }])

  const updatePers = (idx: number, campo: Partial<PersonalizadoLinha>) =>
    setPersonalizados(p => {
      const n = [...p]
      n[idx] = { ...n[idx], ...campo }
      if (campo.categoria) n[idx].tamanho = ''
      return n
    })

  const removePers = (idx: number) => setPersonalizados(p => p.filter((_, i) => i !== idx))

  // ── Totais ──
  const totalPecas = pedido?.quantidadeTotal || 0
  const totalGeral = geralLinhas.reduce((s, l) => s + (l.tamanho ? Number(l.quantidade) || 0 : 0), 0)
  const totalPers = personalizados.filter(p => p.tamanho).length
  const totalConf = totalGeral + totalPers
  const ok = totalConf === totalPecas && totalPecas > 0
  const pct = totalPecas > 0 ? Math.min(100, (totalConf / totalPecas) * 100) : 0

  function buildPecas(): PieceEntry[] {
    if (!pedido) return []
    const r: PieceEntry[] = []
    for (const l of geralLinhas.filter(l => l.tamanho && Number(l.quantidade) > 0))
      for (let i = 0; i < Number(l.quantidade); i++)
        r.push({ id: uuidv4(), pessoaNome: '', nomeNaCamiseta: '', numeroNaCamiseta: '', categoria: l.categoria, tamanho: l.tamanho, precoUnitario: calcularPreco(pedido.precoUnitario, l.categoria, l.tamanho) })
    for (const p of personalizados.filter(p => p.tamanho))
      r.push({ id: uuidv4(), pessoaNome: p.pessoaNome, nomeNaCamiseta: p.nomeNaCamiseta, numeroNaCamiseta: p.numeroNaCamiseta, categoria: p.categoria, tamanho: p.tamanho, precoUnitario: calcularPreco(pedido.precoUnitario, p.categoria, p.tamanho) })
    return r
  }

  async function confirmar() {
    if (!pedido) return
    setSalvando(true)
    try {
      await salvarTamanhos(pedido.id, buildPecas())
      setSalvo(true)
    } catch {
      toast.error('Erro ao enviar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  // ── Loading ──
  if (loading) return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      <p className="text-orange-600 font-semibold text-sm">Carregando...</p>
    </div>
  )

  if (!pedido) return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-8 shadow text-center w-full max-w-sm">
        <p className="text-xl font-bold text-gray-900 mb-2">Link inválido</p>
        <p className="text-gray-500 text-sm">Este link não corresponde a nenhum pedido.</p>
      </div>
    </div>
  )

  // ── Sucesso ──
  if (salvo) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-10 shadow-lg text-center w-full max-w-sm">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Check size={38} className="text-green-600" />
        </div>
        <p className="text-2xl font-black text-gray-900 mb-2">Enviado!</p>
        <p className="text-gray-500 text-sm leading-relaxed">
          Tamanhos confirmados com sucesso.<br />A equipe Passo a Passo entrará em contato em breve.
        </p>
      </div>
    </div>
  )

  const nomeCliente = pedido.clienteType === 'empresa' ? pedido.clienteEmpresa?.razaoSocial : pedido.clientePF?.nomeCompleto
  const modeloLabel = CATALOGO[pedido.modelo]?.label || pedido.modelo
  const corFinal = pedido.cor === 'Personalizada' ? pedido.corPersonalizada : pedido.cor

  // ── Resumo / Confirmação ──
  if (mostrarResumo) {
    const pecas = buildPecas()
    const grupos: Record<string, number> = {}
    pecas.forEach(p => { const k = `${CAT_LABEL[p.categoria]} ${p.tamanho}`; grupos[k] = (grupos[k] || 0) + 1 })
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
          <button onClick={() => setMostrarResumo(false)} className="text-gray-500 active:text-gray-800 p-1 -ml-1 text-sm font-semibold">
            ← Editar
          </button>
          <span className="font-bold text-gray-900 text-base flex-1 text-center pr-8">Revisar pedido</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 pb-32">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
            <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed"><strong>Confira com atenção.</strong> Após enviar, alterações devem ser feitas com a equipe.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <p className="text-xs text-gray-400 mb-1">{modeloLabel} · {corFinal}</p>
            <p className="font-black text-gray-900 text-lg">{nomeCliente}</p>
            <p className="text-xs text-red-600 font-bold mt-1">Entrega: {formatarData(pedido.dataEntregaPrevista)}</p>
          </div>

          {Object.keys(grupos).length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase text-center mb-3">Total: {pecas.length} peças</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {Object.entries(grupos).map(([k, q]) => (
                  <div key={k} className="px-3 py-2 bg-orange-50 border border-orange-200 rounded-xl text-center">
                    <span className="font-black text-orange-700 text-sm">{k}</span>
                    <span className="text-orange-400 text-xs font-bold"> ×{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {personalizados.filter(p => p.tamanho).length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <p className="text-xs font-bold text-gray-400 uppercase text-center py-3 border-b border-gray-100">Personalizados</p>
              <div className="divide-y divide-gray-50">
                {personalizados.filter(p => p.tamanho).map((p, i) => (
                  <div key={p.id} className="px-4 py-3 text-center">
                    <p className="font-bold text-sm text-gray-900">{p.pessoaNome || `Pessoa ${i + 1}`}</p>
                    <p className="text-xs text-orange-600 font-semibold mt-0.5">{CAT_LABEL[p.categoria]} {p.tamanho}</p>
                    {(p.nomeNaCamiseta || p.numeroNaCamiseta) && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {p.nomeNaCamiseta && <span>"{p.nomeNaCamiseta}"</span>}
                        {p.nomeNaCamiseta && p.numeroNaCamiseta && <span> · </span>}
                        {p.numeroNaCamiseta && <span>Nº {p.numeroNaCamiseta}</span>}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 space-y-2">
          <button onClick={confirmar} disabled={salvando}
            className="w-full py-4 bg-green-600 active:bg-green-700 text-white rounded-2xl font-black text-lg disabled:opacity-50 transition">
            {salvando ? 'Enviando...' : '✓ Confirmar e Enviar'}
          </button>
          <button onClick={() => setMostrarResumo(false)}
            className="w-full py-3 border-2 border-gray-200 text-gray-500 rounded-2xl font-semibold text-sm active:bg-gray-50">
            Voltar e editar
          </button>
        </div>
      </div>
    )
  }

  // ── TELA PRINCIPAL ──
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ WebkitTapHighlightColor: 'transparent' }}>

      {/* ── TUTORIAL OVERLAY ── */}
      {tutorialStep !== null && TUTORIAL_STEPS[tutorialStep] && (() => {
        const step = TUTORIAL_STEPS[tutorialStep]
        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-8 sm:pb-0"
            style={{ background: 'rgba(0,0,0,0.55)' }}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
              {/* Indicador de progresso */}
              <div className="flex gap-1.5 px-5 pt-5 pb-0">
                {TUTORIAL_STEPS.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full flex-1 transition-all duration-300 ${i === tutorialStep ? 'bg-orange-500' : i < tutorialStep ? 'bg-orange-300' : 'bg-gray-200'}`} />
                ))}
              </div>

              {/* Conteúdo */}
              <div className="px-6 pt-5 pb-4 text-center">
                <div className="text-5xl mb-4">{step.emoji}</div>
                <p className="font-black text-gray-900 text-lg mb-3">{step.titulo}</p>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{step.texto}</p>
              </div>

              {/* Botões */}
              <div className="px-5 pb-5 space-y-2">
                <button
                  onClick={tutorialAvancar}
                  className="w-full py-4 bg-orange-500 active:bg-orange-600 text-white rounded-2xl font-black text-base transition active:scale-[0.98]">
                  {ehUltimoStep ? '✓ OK, vou preencher agora!' : 'Próximo →'}
                </button>
                {!ehUltimoStep && (
                  <button
                    onClick={fecharTutorial}
                    className="w-full py-3 text-gray-400 text-sm font-semibold active:text-gray-600">
                    Pular tutorial
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Header compacto */}
      <div className="bg-orange-500 text-white text-center px-4 pt-5 pb-4">
        <img src="/logo-pap.png" alt="Passo a Passo Uniformes" className="h-10 w-auto mx-auto mb-1.5 brightness-0 invert" />
        <p className="text-orange-100 text-xs mt-0.5">Confirmação de Tamanhos</p>
      </div>

      {/* Info pedido compacta */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 text-center shadow-sm">
        <p className="font-black text-gray-900 text-base leading-tight">{nomeCliente}</p>
        <p className="text-xs text-gray-500 mt-0.5">{modeloLabel} · {corFinal}</p>
        <p className="text-xs text-red-600 font-bold mt-0.5">Entrega: {formatarData(pedido.dataEntregaPrevista)}</p>
      </div>

      {/* Barra de progresso sticky */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-gray-500 font-semibold">Peças configuradas</span>
          <span className={`font-black text-sm ${ok ? 'text-green-600' : totalConf > totalPecas ? 'text-red-500' : 'text-orange-600'}`}>
            {totalConf}/{totalPecas}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className={`h-2 rounded-full transition-all duration-300 ${totalConf > totalPecas ? 'bg-red-500' : ok ? 'bg-green-500' : 'bg-orange-500'}`}
            style={{ width: `${pct}%` }} />
        </div>
        {totalConf > totalPecas && <p className="text-red-500 text-xs font-bold mt-1 text-center">Excedeu em {totalConf - totalPecas} peça(s)</p>}
        {ok && <p className="text-green-600 text-xs font-bold mt-1 text-center">Pronto! Role para o final e confirme ↓</p>}
      </div>

      {/* Tabs + botão ajuda */}
      <div className="flex bg-white border-b border-gray-100 items-stretch">
        {(['geral', 'personalizado'] as Aba[]).map(a => (
          <button key={a} onClick={() => setAba(a)}
            className={`flex-1 py-3.5 text-sm font-bold text-center transition border-b-2 ${aba === a ? 'border-orange-500 text-orange-600 bg-orange-50/50' : 'border-transparent text-gray-400 active:bg-gray-50'}`}>
            {a === 'geral' ? (
              <span>📏 Tamanho Geral{totalGeral > 0 && <span className="ml-1 text-xs bg-orange-500 text-white rounded-full px-1.5 py-0.5">{totalGeral}</span>}</span>
            ) : (
              <span>👤 Personalizado{totalPers > 0 && <span className="ml-1 text-xs bg-purple-500 text-white rounded-full px-1.5 py-0.5">{totalPers}</span>}</span>
            )}
          </button>
        ))}
        <button onClick={() => setGuiaAberto(true)}
          className="px-4 flex items-center justify-center border-b-2 border-transparent text-gray-400 active:bg-gray-50">
          <HelpCircle size={20} />
        </button>
      </div>

      {/* Modal guia */}
      {guiaAberto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setGuiaAberto(false)}>
          <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-3xl">
              <p className="font-black text-gray-900 text-base">❓ Como preencher</p>
              <button onClick={() => setGuiaAberto(false)} className="p-1 text-gray-400 active:text-gray-700">
                <X size={22} />
              </button>
            </div>
            <div className="px-5 py-5 space-y-5 pb-8">

              {/* Qual aba usar */}
              <div>
                <p className="font-black text-gray-800 text-sm mb-3">📌 Qual aba usar?</p>
                <div className="space-y-2">
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <p className="font-bold text-blue-700 text-sm mb-1">📏 Tamanho Geral</p>
                    <p className="text-xs text-blue-600 leading-relaxed">
                      Use quando <strong>não importa</strong> quem vai usar cada peça. Você informa só a quantidade por tamanho.<br />
                      <span className="mt-1 block text-blue-500">Exemplo: 3× M, 2× G, 1× GG</span>
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4">
                    <p className="font-bold text-purple-700 text-sm mb-1">👤 Personalizado</p>
                    <p className="text-xs text-purple-600 leading-relaxed">
                      Use quando cada peça tem <strong>nome ou número</strong> bordado/estampado, ou quando precisa identificar quem vai usar cada uma.<br />
                      <span className="mt-1 block text-purple-500">Exemplo: Camisa com "CARLOS" e número 10.</span>
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">Você pode usar as duas abas ao mesmo tempo.</p>
              </div>

              {/* Tipos de modelagem */}
              <div>
                <p className="font-black text-gray-800 text-sm mb-3">👕 Tipos de Modelagem</p>
                <div className="space-y-2">
                  <div className="border border-gray-200 rounded-xl p-3 flex gap-3 items-start">
                    <span className="text-lg mt-0.5">👔</span>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Unissex</p>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">Modelagem padrão, serve para homens e mulheres. Tamanhos: PP, P, M, G, GG, XG, XXG, XXXG.</p>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-3 flex gap-3 items-start">
                    <span className="text-lg mt-0.5">👗</span>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Baby Look</p>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">Modelagem feminina, mais justa ao corpo. Tamanhos: PP, P, M, G, GG, XG.</p>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-3 flex gap-3 items-start">
                    <span className="text-lg mt-0.5">🧒</span>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Infantil</p>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">Modelagem para crianças. Tamanhos: 2, 4, 6, 8, 10, 12, 14, 16.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 mt-2">
                  <p className="text-xs text-amber-700 leading-relaxed">
                    ⚠️ <strong>Tamanhos XG, XXG e XXXG</strong> têm acréscimo de 30% no valor por exigirem mais tecido.
                  </p>
                </div>
              </div>

              {/* Campos do personalizado */}
              <div>
                <p className="font-black text-gray-800 text-sm mb-3">📝 Campos do Personalizado</p>
                <div className="space-y-2">
                  <div className="border border-gray-200 rounded-xl p-3">
                    <p className="font-bold text-gray-800 text-xs uppercase tracking-wide mb-1">Quem vai usar <span className="font-normal text-gray-400">(para entrega)</span></p>
                    <p className="text-xs text-gray-500 leading-relaxed">Nome da pessoa que vai receber a peça. Serve para organizar a entrega. Não aparece na camiseta.</p>
                    <p className="text-xs text-blue-500 mt-1">Ex: João Silva</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-3">
                    <p className="font-bold text-gray-800 text-xs uppercase tracking-wide mb-1">Nome na peça <span className="font-normal text-gray-400">(se tiver)</span></p>
                    <p className="text-xs text-gray-500 leading-relaxed">O nome que vai aparecer bordado ou estampado na camiseta. Pode ser diferente do nome real.</p>
                    <p className="text-xs text-blue-500 mt-1">Ex: CARLOS, CAPITÃO, GALA...</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-3">
                    <p className="font-bold text-gray-800 text-xs uppercase tracking-wide mb-1">Número <span className="font-normal text-gray-400">(se tiver)</span></p>
                    <p className="text-xs text-gray-500 leading-relaxed">Número que vai aparecer na camiseta. Comum em uniformes esportivos ou escolares.</p>
                    <p className="text-xs text-blue-500 mt-1">Ex: 7, 10, 23...</p>
                  </div>
                </div>
              </div>

              {/* Dica final */}
              <div className="bg-green-50 rounded-2xl p-4">
                <p className="font-bold text-green-700 text-sm mb-1">💡 Dica</p>
                <p className="text-xs text-green-600 leading-relaxed">
                  Fique de olho na barra de progresso no topo. Ela mostra quantas peças você já configurou do total do pedido. O botão de confirmar só fica disponível quando o número bater exatamente.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto pb-32">

        {/* ── ABA GERAL ── */}
        {aba === 'geral' && (
          <div className="px-4 pt-4 space-y-3">
            <div className="bg-blue-50 rounded-2xl px-4 py-3 text-center">
              <p className="text-xs text-blue-700 leading-relaxed">
                Informe <strong>quantas peças</strong> de cada tamanho. Sem nome individual.
              </p>
            </div>

            {geralLinhas.map((linha, idx) => {
              const tamanhos = getTamanhos(linha.categoria)
              return (
                <div key={linha.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                  {/* Cabeçalho da linha */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Tamanho {idx + 1}</span>
                    {geralLinhas.length > 1 && (
                      <button onClick={() => removeGeral(idx)} className="p-1 text-red-400 active:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <div className="px-4 py-4 space-y-4">
                    {/* Categoria */}
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-500 mb-2">TIPO DE MODELAGEM</p>
                      <div className="grid grid-cols-3 gap-2">
                        {(['unissex', 'babylook', 'infantil'] as CategoriaSize[]).map(cat => (
                          <button key={cat} type="button" onClick={() => updateGeral(idx, { categoria: cat })}
                            className={`py-3 rounded-xl text-xs font-black border-2 transition active:scale-95 ${linha.categoria === cat ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-200 text-gray-600 bg-white'}`}>
                            {CAT_SHORT[cat]}
                            <span className="block text-xs font-normal mt-0.5 opacity-80">{CAT_LABEL[cat]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tamanho */}
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-500 mb-2">TAMANHO</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {tamanhos.map(t => {
                          const grande = ['XG', 'XXG', 'XXXG'].includes(t)
                          const sel = linha.tamanho === t
                          return (
                            <button key={t} type="button" onClick={() => updateGeral(idx, { tamanho: t })}
                              className={`min-w-[3rem] px-3 py-3 rounded-xl text-sm font-black border-2 transition active:scale-95 ${sel ? 'border-blue-500 bg-blue-500 text-white shadow-md' : grande ? 'border-gray-200 text-gray-400 bg-gray-50' : 'border-gray-200 text-gray-700 bg-white'}`}>
                              {t}
                              {grande && <span className="block text-xs font-normal opacity-70">+30%</span>}
                            </button>
                          )
                        })}
                      </div>
                      {!linha.tamanho && <p className="text-xs text-orange-400 mt-2">Toque em um tamanho ↑</p>}
                    </div>

                    {/* Quantidade */}
                    {linha.tamanho && (
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-500 mb-2">QUANTIDADE</p>
                        <div className="flex justify-center">
                          <Stepper value={linha.quantidade || 1} onChange={v => updateGeral(idx, { quantidade: v })} />
                        </div>
                        <p className="text-xs text-blue-600 font-semibold mt-2">
                          {linha.quantidade} × {CAT_LABEL[linha.categoria]} {linha.tamanho}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            <button type="button" onClick={addGeral}
              className="w-full py-4 border-2 border-dashed border-blue-200 text-blue-500 rounded-2xl font-bold text-sm active:bg-blue-50 flex items-center justify-center gap-2">
              <Plus size={16} /> Adicionar tamanho
            </button>
          </div>
        )}

        {/* ── ABA PERSONALIZADO ── */}
        {aba === 'personalizado' && (
          <div className="px-4 pt-4 space-y-3">
            <div className="bg-purple-50 rounded-2xl px-4 py-3 text-center">
              <p className="text-xs text-purple-700 leading-relaxed">
                Para peças com <strong>nome ou número</strong> bordado/estampado.<br />Adicione uma entrada por pessoa.
              </p>
            </div>

            {personalizados.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-4xl mb-3">👤</p>
                <p className="text-sm font-semibold">Nenhuma peça personalizada</p>
                <p className="text-xs mt-1">Toque em "Adicionar pessoa" abaixo</p>
              </div>
            )}

            {personalizados.map((ind, idx) => {
              const tamanhos = getTamanhos(ind.categoria)
              return (
                <div key={ind.id} className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-purple-50 border-b border-purple-100">
                    <span className="text-xs font-black text-purple-600 uppercase tracking-wide">Pessoa {idx + 1}</span>
                    <button onClick={() => removePers(idx)} className="p-1 text-red-400 active:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="px-4 py-4 space-y-4">
                    {/* Nome de quem vai usar */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 text-center mb-1.5">
                        QUEM VAI USAR
                        <span className="font-normal text-gray-400 ml-1">(para entrega)</span>
                      </label>
                      <input className="w-full text-center border-2 border-gray-200 rounded-xl px-3 py-3 text-sm font-semibold focus:border-purple-400 focus:outline-none bg-white"
                        placeholder="Ex: João Silva"
                        value={ind.pessoaNome}
                        onChange={e => updatePers(idx, { pessoaNome: e.target.value })} />
                    </div>

                    {/* Nome na peça */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 text-center mb-1.5">
                        NOME NA PEÇA
                        <span className="font-normal text-gray-400 ml-1">(se tiver)</span>
                      </label>
                      <input className="w-full text-center border-2 border-gray-200 rounded-xl px-3 py-3 text-sm font-semibold focus:border-purple-400 focus:outline-none bg-white"
                        placeholder="Ex: CARLOS"
                        value={ind.nomeNaCamiseta}
                        onChange={e => updatePers(idx, { nomeNaCamiseta: e.target.value })} />
                    </div>

                    {/* Número */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 text-center mb-1.5">
                        NÚMERO
                        <span className="font-normal text-gray-400 ml-1">(se tiver)</span>
                      </label>
                      <input className="w-full text-center border-2 border-gray-200 rounded-xl px-3 py-3 text-base font-black focus:border-purple-400 focus:outline-none bg-white"
                        placeholder="Ex: 10"
                        inputMode="numeric"
                        value={ind.numeroNaCamiseta}
                        onChange={e => updatePers(idx, { numeroNaCamiseta: e.target.value })} />
                    </div>

                    {/* Categoria */}
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-500 mb-2">TIPO DE MODELAGEM</p>
                      <div className="grid grid-cols-3 gap-2">
                        {(['unissex', 'babylook', 'infantil'] as CategoriaSize[]).map(cat => (
                          <button key={cat} type="button" onClick={() => updatePers(idx, { categoria: cat })}
                            className={`py-3 rounded-xl text-xs font-black border-2 transition active:scale-95 ${ind.categoria === cat ? 'border-purple-500 bg-purple-500 text-white' : 'border-gray-200 text-gray-600 bg-white'}`}>
                            {CAT_SHORT[cat]}
                            <span className="block text-xs font-normal mt-0.5 opacity-80">{CAT_LABEL[cat]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tamanho */}
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-500 mb-2">TAMANHO</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {tamanhos.map(t => {
                          const grande = ['XG', 'XXG', 'XXXG'].includes(t)
                          const sel = ind.tamanho === t
                          return (
                            <button key={t} type="button" onClick={() => updatePers(idx, { tamanho: t })}
                              className={`min-w-[3rem] px-3 py-3 rounded-xl text-sm font-black border-2 transition active:scale-95 ${sel ? 'border-purple-500 bg-purple-500 text-white shadow-md' : grande ? 'border-gray-200 text-gray-400 bg-gray-50' : 'border-gray-200 text-gray-700 bg-white'}`}>
                              {t}
                              {grande && <span className="block text-xs font-normal opacity-70">+30%</span>}
                            </button>
                          )
                        })}
                      </div>
                      {!ind.tamanho && <p className="text-xs text-orange-400 mt-2">Toque em um tamanho ↑</p>}
                    </div>

                    {ind.tamanho && (
                      <div className="bg-purple-50 rounded-xl py-2 text-center">
                        <p className="text-xs text-purple-700 font-bold">
                          {CAT_LABEL[ind.categoria]} {ind.tamanho}
                          {ind.nomeNaCamiseta && <span> · "{ind.nomeNaCamiseta}"</span>}
                          {ind.numeroNaCamiseta && <span> · Nº {ind.numeroNaCamiseta}</span>}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            <button type="button" onClick={addPers}
              className="w-full py-4 border-2 border-dashed border-purple-200 text-purple-500 rounded-2xl font-bold text-sm active:bg-purple-50 flex items-center justify-center gap-2">
              <Plus size={16} /> Adicionar pessoa
            </button>
          </div>
        )}
      </div>

      {/* ── BOTÃO FIXO NO FUNDO ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-xl px-4 pt-3 pb-5 z-30">
        <button
          onClick={() => {
            if (!ok) {
              if (totalConf < totalPecas) toast.error(`Faltam ${totalPecas - totalConf} peça(s).`)
              else toast.error(`Excedeu em ${totalConf - totalPecas} peça(s).`)
              return
            }
            setMostrarResumo(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition active:scale-[0.98] ${
            ok
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
              : 'bg-gray-100 text-gray-400'
          }`}>
          {ok
            ? <><Check size={18} /> Revisar e Confirmar</>
            : totalConf > totalPecas
              ? `Reduza ${totalConf - totalPecas} peça(s)`
              : `Faltam ${totalPecas - totalConf} peça(s)`
          }
          {ok && <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  )
}
