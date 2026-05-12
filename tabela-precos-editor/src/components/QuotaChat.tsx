import { useState, useEffect, useRef } from 'react'
import {
  MessageCircle, X, Send, Key, Trash2,
  Copy, Check, ExternalLink, Bot, ChevronDown
} from 'lucide-react'
import { defaultData, paymentData } from '../data'
import type { Category } from '../data'

const API_KEY_STORAGE = 'groq_api_key_v1'
const EDITOR_DATA_KEY = 'tabela-precos-editor-v1'
const CHAT_HISTORY_KEY = 'quota-chat-history-v1'
const MATRIX_KEY = 'matriz_bordado_feita'

// Modelos preferidos em ordem de prioridade (fallback se a API não retornar lista)
const PREFERRED_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant']

// Cache em memória para não buscar toda mensagem
let cachedModels: string[] | null = null

async function fetchGroqModels(apiKey: string): Promise<string[]> {
  if (cachedModels) return cachedModels
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey.trim()}` },
    })
    if (!res.ok) return PREFERRED_MODELS
    const data = await res.json() as { data: { id: string }[] }
    // Filtra apenas modelos de chat (exclui whisper, tts, etc.)
    const chatModels = data.data
      .map(m => m.id)
      .filter(id => !id.includes('whisper') && !id.includes('tts') && !id.includes('vision') && !id.includes('guard'))
    // Coloca os preferidos na frente se disponíveis
    const ordered = [
      ...PREFERRED_MODELS.filter(m => chatModels.includes(m)),
      ...chatModels.filter(m => !PREFERRED_MODELS.includes(m)),
    ]
    cachedModels = ordered.length > 0 ? ordered : PREFERRED_MODELS
    return cachedModels
  } catch {
    return PREFERRED_MODELS
  }
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function getCurrentPricing(): Category[] {
  try {
    const saved = localStorage.getItem(EDITOR_DATA_KEY)
    return saved ? (JSON.parse(saved) as Category[]) : defaultData
  } catch {
    return defaultData
  }
}

function buildSystemPrompt(matrizJaFeita: boolean): string {
  const pricing = getCurrentPricing()

  const pricingText = pricing
    .map(cat => {
      const items = cat.items
        .map(item => {
          const tiers = item.tiers.map(t => `${t.qty}: R$${t.price}`).join(' | ')
          const extra = [item.colors, item.obs].filter(Boolean).join(' — ')
          return `  • ${item.name} [${tiers}]${extra ? ` (${extra})` : ''}`
        })
        .join('\n')
      return `📦 ${cat.title}${cat.description ? `\n  ℹ️ ${cat.description}` : ''}\n${items}`
    })
    .join('\n\n')

  const paymentText = paymentData
    .map(p => `  • *${p.method}*: ${p.rules}`)
    .join('\n')

  const matrizInstrucao = matrizJaFeita
    ? '✅ A matriz de bordado já foi feita anteriormente. NÃO cobrar R$45 de matriz neste pedido.'
    : '❗ A matriz de bordado (R$45,00) deve ser incluída se o cliente pedir bordado pela primeira vez. É cobrada uma única vez e fica arquivada para pedidos futuros.'

  return `Você é o assistente de orçamentos da *Passo a Passo Uniformes*.

Sua função é gerar orçamentos completos e profissionais no *formato WhatsApp*, prontos para o vendedor copiar e enviar ao cliente.

=== TABELA DE PREÇOS ATUALIZADA ===
${pricingText}

=== FORMAS DE PAGAMENTO ===
${paymentText}

=== REGRA DA MATRIZ DE BORDADO ===
${matrizInstrucao}

=== REGRA DAS FAIXAS DE PREÇO (MUITO IMPORTANTE) ===
Na tabela, os preços são exibidos com o prefixo "+" indicando a quantidade MÍNIMA para aquele preço.
Isso significa que o preço SÓ muda quando a quantidade ATINGIR ou ULTRAPASSAR a faixa seguinte.

Exemplo com PV Premium:
  +10 pçs → R$ 51,90   significa: de 10 até 29 peças = R$ 51,90 cada
  +30 pçs → R$ 49,90   significa: de 30 até 49 peças = R$ 49,90 cada
  +50 pçs → R$ 47,90   significa: de 50 em diante = R$ 47,90 cada

REGRA DE CÁLCULO:
- Cliente pede 15 peças → usa o preço de +10 pçs (R$ 51,90), pois não atingiu 30
- Cliente pede 30 peças → usa o preço de +30 pçs (R$ 49,90), pois atingiu exatamente 30
- Cliente pede 45 peças → usa o preço de +30 pçs (R$ 49,90), pois não atingiu 50
- Cliente pede 50 peças → usa o preço de +50 pçs (R$ 47,90), pois atingiu exatamente 50

Aplique esta mesma lógica para TODOS os produtos com faixas de preço.

=== OUTRAS REGRAS ===
- Polo Poliviscose: o preço já inclui 1 bordado até 9cm. NÃO cobrar bordado adicional para a logomarca principal neste produto.
- Peças acima do GG têm acréscimo de 30% sobre o valor unitário (camisetas).
- Respeite os mínimos informados nos produtos.
- Sempre mostre o cálculo: quantidade × preço unitário = subtotal.

=== FORMATO OBRIGATÓRIO DO ORÇAMENTO ===
Estruture SEMPRE exatamente desta forma:

1. Saudação cordial com emoji

2. Agradecimento pelo interesse

3. 📋 *ORÇAMENTO — [nome do cliente, se informado]*

4. Para cada produto, use este bloco:
   👕 *Nome do produto*
   _[1 frase curta sobre a qualidade/tecido — ex: "Tecido PV premium de alta durabilidade, toque macio e excelente caimento." ou "Dry fit respirável, ideal para fardamento esportivo." — adapte ao produto]_
   Quantidade: XX peças × R$ XX,XX = R$ XX,XX

5. Se houver personalização adicional (bordado, estampa extra, nome, numeração):
   🎨 *Personalizações:*
   • [Item]: XX peças × R$ XX,XX = R$ XX,XX

6. Se bordado (primeira vez):
   🪡 *Matriz de bordado (1ª vez)* — R$ 45,00 _(cobrada uma única vez, fica arquivada para pedidos futuros)_

7. 💰 *TOTAL GERAL: R$ XX,XX*

8. 💳 *FORMAS DE PAGAMENTO*
   _(cada forma em um parágrafo separado, uma abaixo da outra)_

   💠 *PIX:* Sem acréscimo. 50% na aprovação + 50% na entrega. Pagamento integral à vista: 5% de desconto.

   💵 *DINHEIRO:* À vista. Sem nota fiscal: 7% de desconto.

   💳 *CARTÃO DE CRÉDITO:* Débito: sem acréscimo. 1x: +3%. Até 3x: +6%.

   🔗 *LINK DE PAGAMENTO:* Até 3x: +12%. Acima de 3x: consultar.

9. Despedida profissional e disponibilidade para dúvidas

10. Assinatura: *Passo a Passo Uniformes* 👕

Use *asteriscos* para negrito e _underline_ para itálico. Emojis com moderação. Revise todos os cálculos antes de responder.`
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function callGroq(
  apiKey: string,
  systemPrompt: string,
  messages: Message[]
): Promise<string> {
  const payload = {
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.4,
    max_tokens: 3000,
  }

  let lastError = ''
  const models = await fetchGroqModels(apiKey)

  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        if (attempt > 0) await sleep(1500 * attempt)
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({ ...payload, model }),
        })
        const data = await res.json()

        if (!res.ok) {
          const msg: string = data.error?.message ?? `Erro ${res.status}`
          lastError = `[${model}] ${msg}`
          console.warn(lastError)
          if (res.status !== 429) break
          continue
        }

        const text: string | undefined = data.choices?.[0]?.message?.content
        if (text?.trim()) return text.trim()
        lastError = `[${model}] Resposta vazia`
        break
      } catch (e: unknown) {
        lastError = `[${model}] ${e instanceof Error ? e.message : 'Erro de rede'}`
        console.warn(lastError)
      }
    }
  }
  throw new Error(lastError || 'Nenhum modelo disponível')
}

function renderWA(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {line.split(/(\*[^*\n]+\*)/g).map((part, j) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <strong key={j}>{part.slice(1, -1)}</strong>
        ) : (
          part
        )
      )}
      {i < arr.length - 1 && <br />}
    </span>
  ))
}

export function QuotaChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY)
      return saved ? (JSON.parse(saved) as Message[]) : []
    } catch {
      return []
    }
  })
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [isKeyConfigured, setIsKeyConfigured] = useState(false)
  const [inputKey, setInputKey] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [matrizJaFeita, setMatrizJaFeita] = useState(
    () => localStorage.getItem(MATRIX_KEY) === 'true'
  )
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(API_KEY_STORAGE)
    if (saved) { setApiKey(saved); setIsKeyConfigured(true); return }
    // Usa chave embutida no build como fallback automático
    const envKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined
    if (envKey) {
      localStorage.setItem(API_KEY_STORAGE, envKey)
      setApiKey(envKey)
      setIsKeyConfigured(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isGenerating])

  useEffect(() => {
    if (isOpen && isKeyConfigured) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isKeyConfigured])

  const saveKey = () => {
    if (!inputKey.trim()) return
    localStorage.setItem(API_KEY_STORAGE, inputKey.trim())
    setApiKey(inputKey.trim())
    setIsKeyConfigured(true)
  }

  const clearKey = () => {
    localStorage.removeItem(API_KEY_STORAGE)
    setApiKey(''); setIsKeyConfigured(false); setInputKey('')
  }

  const toggleMatriz = () => {
    const next = !matrizJaFeita
    setMatrizJaFeita(next)
    localStorage.setItem(MATRIX_KEY, String(next))
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem(CHAT_HISTORY_KEY)
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isGenerating) return
    setError('')
    setInput('')

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setIsGenerating(true)

    try {
      const systemPrompt = buildSystemPrompt(matrizJaFeita)
      const reply = await callGroq(apiKey, systemPrompt, newMessages)
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: reply },
      ])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const openWhatsApp = (content: string) => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(content)}`, '_blank')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl transition-all font-semibold text-sm ${
          isOpen ? 'hidden' : 'bg-[#25D366] hover:bg-[#1ebe5d] text-white'
        }`}
      >
        <MessageCircle size={20} />
        Gerar Orçamento
        {messages.length > 0 && (
          <span className="bg-white/30 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
            {messages.filter(m => m.role === 'assistant').length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="w-full max-w-[460px] bg-white shadow-2xl flex flex-col h-full">
            <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                <Bot size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">Assistente de Orçamentos</p>
                <p className="text-[#b2dfdb] text-xs">Passo a Passo Uniformes</p>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button onClick={clearChat} className="p-2 text-[#b2dfdb] hover:text-white hover:bg-white/10 rounded-full transition-all" title="Limpar conversa">
                    <Trash2 size={16} />
                  </button>
                )}
                {isKeyConfigured && (
                  <button onClick={clearKey} className="p-2 text-[#b2dfdb] hover:text-white hover:bg-white/10 rounded-full transition-all" title="Trocar chave">
                    <Key size={16} />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-2 text-[#b2dfdb] hover:text-white hover:bg-white/10 rounded-full transition-all">
                  <X size={18} />
                </button>
              </div>
            </div>

            {isKeyConfigured && (
              <div className="bg-[#ECF3F3] border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-2">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold">Matriz de bordado:</span>{' '}
                  {matrizJaFeita
                    ? <span className="text-green-700">✅ Já feita (não cobrar R$45)</span>
                    : <span className="text-orange-700">⚠️ 1ª vez (cobrar R$45)</span>}
                </div>
                <button
                  onClick={toggleMatriz}
                  className={`text-xs px-2 py-1 rounded-md font-semibold transition-all ${
                    matrizJaFeita ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  Alternar
                </button>
              </div>
            )}

            {!isKeyConfigured ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4 bg-[#ECF3F3]">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 w-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#25D366]/10 p-2.5 rounded-full">
                      <Key size={20} className="text-[#25D366]" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Configure a IA</p>
                      <p className="text-xs text-slate-500">OpenRouter — modelos gratuitos, sem limite</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3 text-xs text-blue-800 space-y-1">
                    <p className="font-semibold">🆓 Como obter a chave gratuita:</p>
                    <p>1. Acesse <strong>console.groq.com</strong> e crie uma conta</p>
                    <p>2. Vá em <strong>API Keys</strong> e clique em <strong>Create API Key</strong></p>
                    <p>3. Copie e cole a chave abaixo (começa com <code>gsk_</code>)</p>
                  </div>
                  <input
                    type="password"
                    value={inputKey}
                    onChange={e => setInputKey(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveKey()}
                    placeholder="gsk_..."
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] mb-3"
                  />
                  <button
                    onClick={saveKey}
                    disabled={!inputKey.trim()}
                    className="w-full bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-50 text-white py-2.5 rounded-xl font-semibold text-sm transition-all"
                  >
                    Salvar e Começar
                  </button>
                  <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-[#25D366] hover:underline mt-3 justify-center">
                    <ExternalLink size={12} /> Criar conta gratuita no Groq
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                  style={{ background: '#ECF3F3' }}
                >
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bot size={28} className="text-[#25D366]" />
                      </div>
                      <p className="text-slate-600 text-sm font-medium">Olá! 👋</p>
                      <p className="text-slate-500 text-xs mt-1 max-w-[240px] mx-auto">
                        Descreva o pedido e gero o orçamento completo no formato WhatsApp.
                      </p>
                      <div className="mt-4 space-y-2">
                        {[
                          '30 polos poliviscose com bordado no peito, cliente João',
                          '50 camisetas dry fit lisas, pagar no pix à vista',
                          '20 calças moletom + 20 camisetas algodão',
                        ].map(ex => (
                          <button key={ex} onClick={() => setInput(ex)}
                            className="block w-full text-left text-xs bg-white hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-xl border border-slate-200 transition-all">
                            💬 {ex}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-[#DCF8C6] text-slate-800 rounded-tr-sm'
                          : 'bg-white text-slate-800 rounded-tl-sm'
                      }`}>
                        {msg.role === 'assistant' ? (
                          <>
                            <div className="text-sm leading-relaxed font-[450]">
                              {renderWA(msg.content)}
                            </div>
                            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                              <button onClick={() => copyMessage(msg.id, msg.content)}
                                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors">
                                {copiedId === msg.id
                                  ? <><Check size={13} className="text-green-500" /> Copiado!</>
                                  : <><Copy size={13} /> Copiar</>}
                              </button>
                              <span className="text-slate-200">|</span>
                              <button onClick={() => openWhatsApp(msg.content)}
                                className="flex items-center gap-1.5 text-xs text-[#25D366] hover:text-[#1ebe5d] font-semibold transition-colors">
                                <MessageCircle size={13} /> Enviar WhatsApp
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-[#25D366] rounded-full animate-bounce [animation-delay:0ms]" />
                          <div className="w-2 h-2 bg-[#25D366] rounded-full animate-bounce [animation-delay:150ms]" />
                          <div className="w-2 h-2 bg-[#25D366] rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2">
                      ❌ {error}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {messages.length > 3 && (
                  <div className="relative">
                    <button
                      onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                      className="absolute -top-10 right-4 bg-white shadow-md rounded-full p-1.5 text-slate-500 hover:text-slate-700"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                )}

                <div className="bg-[#F0F0F0] px-3 py-3 flex items-end gap-2 border-t border-slate-200">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Descreva o pedido... (Enter para enviar)"
                    rows={2}
                    className="flex-1 bg-white rounded-2xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#25D366] border border-slate-200 max-h-32"
                    style={{ minHeight: '44px' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isGenerating || !input.trim()}
                    className="bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-40 text-white p-3 rounded-full transition-all shadow-md shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
