import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Copy, Check, MessageCircle, Sparkles, User, Mic, MicOff, RotateCcw } from 'lucide-react';
import { pricingData as defaultCategories, extraData as defaultExtra } from '../data/pricingData';
import type { Category } from '../data/pricingData';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = 'llama-3.3-70b-versatile';

type ExtraData = typeof defaultExtra;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GroqChatProps {
  categories?: Category[];
  extraData?: ExtraData;
}

const GREETING: Message = {
  role: 'assistant',
  content: 'Olá! Sou a **ANA**, assistente da Passo a Passo Uniformes. 👋\n\nPosso te ajudar a:\n- 📦 Gerar orçamentos completos\n- 🔍 Consultar preços e produtos\n- 🎨 Informar cores disponíveis\n- ➕ Explicar adicionais e personalizações\n\nMe diga o que você precisa! Ex: *"30 camisetas Dry Fit Liso e 20 Polo Piquet PV, pagamento no PIX"*'
};

// ─── Tabela de preços compacta (gerada 1x, reutilizada no prompt) ─
function buildPriceTable(categories: Category[]): string {
  return categories.map(cat => {
    const items = cat.items.map(item => {
      const tiers = [...item.tiers]
        .map(t => ({
          qtyNum: parseInt(String(t.qty).replace(/\D/g, '')) || 0,
          priceNum: typeof t.price === 'number' && t.price > 0 ? t.price : null,
          qty: t.qty,
        }))
        .filter(t => t.priceNum !== null)
        .sort((a, b) => a.qtyNum - b.qtyNum) as Array<{ qtyNum: number; priceNum: number; qty: string }>;

      if (tiers.length === 0) return `${item.name}: Orçar`;

      const tierStr = tiers
        .map(t => `≥${t.qty}=R$${t.priceNum.toFixed(2).replace('.', ',')}`)
        .join('|');
      return `${item.name}(${tierStr})`;
    }).join(', ');
    return `[${cat.title}] ${items}`;
  }).join('\n');
}

// ─── System prompt ────────────────────────────────────────────────
function buildSystemPrompt(categories: Category[], extra: ExtraData): string {
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  const priceTable = buildPriceTable(categories);

  const payList = extra.paymentData
    .map((p: { method: string; rules: string }) => `${p.method}: ${p.rules}`)
    .join(' | ');

  return `Você é a ANA, assistente da Passo a Passo Uniformes. Simpática, profissional e PRECISA com números. DATA: ${today}

TABELA DE PREÇOS (formato: produto(≥qty=R$preço|...)):
${priceTable}

REGRA DE FAIXA: use o preço da MAIOR faixa cuja quantidade NÃO ultrapasse o pedido.
Ex: produto com ≥10=R$51,90|≥30=R$49,90 → pedido de 25 pçs → faixa ≥10 → R$51,90 cada.
Ex: pedido de 30 pçs → faixa ≥30 → R$49,90 cada.

CÁLCULO OBRIGATÓRIO: Subtotal = quantidade × preço_unitário (2 casas decimais).
TOTAL GERAL = soma de todos os subtotais.

SESSÃO CONTÍNUA: acumule TODOS os itens pedidos na conversa. Só reinicia com "Novo orçamento".

PAGAMENTO: ${payList}

FORMATO DO ORÇAMENTO (use exatamente assim):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*ORÇAMENTO — PASSO A PASSO UNIFORMES*
📅 Data: ${today}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prezado(a) Cliente,
É com muito prazer que apresentamos o orçamento conforme solicitado.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 *ITENS ORÇADOS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ *[Nome do Produto]*
   📝 [obs/descrição do produto]
   🎨 Cores: [cores disponíveis]
   📊 Qtd: [X] un | 💰 Unit: R$ [preço] | 🧾 *Subtotal: R$ [qtd×preço]*
[repetir por produto]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total peças: [soma] | *💵 TOTAL GERAL: R$ [soma subtotais]*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${extra.paymentData.map((p: { method: string; rules: string }) => `*${p.method}*: ${p.rules}`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *Válido por 7 dias corridos. Após esse prazo, valores podem sofrer reajuste.*
Atenciosamente, *Passo a Passo Uniformes*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

// ─── Componente principal ─────────────────────────────────────────
export function GroqChat({ categories = defaultCategories, extraData = defaultExtra }: GroqChatProps) {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // System prompt gerado uma vez (estável enquanto categories não mudar)
  const systemPrompt = buildSystemPrompt(categories, extraData);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const handleNewQuote = () => {
    setMessages([GREETING]);
    setInput('');
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Mantém apenas as últimas 10 mensagens para controlar tokens
      const historyToSend = newMessages.slice(-10);

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            ...historyToSend.map(m => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.2,
          max_tokens: 1500,
        }),
      });

      if (res.status === 429) {
        const retryAfter = parseFloat(res.headers.get('retry-after') || '3');
        await new Promise(r => setTimeout(r, Math.ceil(retryAfter * 1000) + 500));

        // Uma segunda tentativa após aguardar
        const res2 = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              ...historyToSend.map(m => ({ role: m.role, content: m.content })),
            ],
            temperature: 0.2,
            max_tokens: 1500,
          }),
        });

        if (!res2.ok) {
          const errData = await res2.json();
          throw new Error(errData.error?.message || `Erro ${res2.status}`);
        }

        const data2 = await res2.json();
        const reply2 = data2.choices?.[0]?.message?.content;
        if (reply2) setMessages(prev => [...prev, { role: 'assistant', content: reply2 }]);
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || `Erro ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `❌ Erro: ${err.message}\n\nTente novamente em alguns instantes.` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Reconhecimento de voz não disponível neste navegador. Use Chrome ou Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  };

  const extractQuoteContent = (content: string): string => {
    const marker = 'ORÇAMENTO — PASSO A PASSO';
    const idx = content.indexOf(marker);
    if (idx === -1) return content;
    const before = content.substring(0, idx);
    const sepIdx = before.lastIndexOf('━━━');
    return sepIdx !== -1 ? content.substring(sepIdx) : content.substring(idx);
  };

  const copyMessage = (content: string, index: number) => {
    const textToCopy = isQuote(content) ? extractQuoteContent(content) : content;
    navigator.clipboard.writeText(textToCopy);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sendToWhatsApp = (content: string) => {
    const textToSend = isQuote(content) ? extractQuoteContent(content) : content;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToSend)}`, '_blank');
  };

  const renderContent = (content: string) =>
    content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

  const isQuote = (content: string) =>
    content.includes('ORÇAMENTO — PASSO A PASSO') || content.includes('VALIDADE DO ORÇAMENTO') || content.includes('Válido por 7 dias');

  return (
    <div className="groq-chat-container">
      {/* Header */}
      <div className="groq-chat-header">
        <div className="groq-chat-header-info">
          <div className="groq-avatar">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <div className="groq-chat-title">ANA — Assistente IA</div>
            <div className="groq-chat-subtitle">
              <span className="groq-online-dot" />
              Online · Powered by Groq
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewQuote}
            className="groq-new-quote-btn"
            title="Novo orçamento (limpa a conversa)"
          >
            <RotateCcw size={14} />
            Novo orçamento
          </button>
          <Sparkles size={18} className="text-blue-200" />
        </div>
      </div>

      {/* Messages */}
      <div className="groq-messages" ref={messagesContainerRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`groq-message-row ${msg.role === 'user' ? 'groq-user-row' : 'groq-bot-row'}`}>
            {msg.role === 'assistant' && (
              <div className="groq-msg-avatar">
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div className={`groq-bubble ${msg.role === 'user' ? 'groq-bubble-user' : 'groq-bubble-bot'}`}>
              <div
                className="groq-bubble-text"
                dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
              />
              {msg.role === 'assistant' && msg.content.length > 100 && (
                <div className="groq-bubble-actions">
                  <button
                    onClick={() => copyMessage(msg.content, i)}
                    className="groq-action-btn"
                    title="Copiar mensagem"
                  >
                    {copiedIndex === i ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    {copiedIndex === i ? 'Copiado!' : 'Copiar'}
                  </button>
                  {isQuote(msg.content) && (
                    <button
                      onClick={() => sendToWhatsApp(msg.content)}
                      className="groq-action-btn groq-action-whatsapp"
                      title="Enviar pelo WhatsApp"
                    >
                      <MessageCircle size={13} />
                      WhatsApp
                    </button>
                  )}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="groq-msg-avatar groq-msg-avatar-user">
                <User size={14} className="text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="groq-message-row groq-bot-row">
            <div className="groq-msg-avatar">
              <Bot size={14} className="text-white" />
            </div>
            <div className="groq-bubble groq-bubble-bot groq-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="groq-input-area">
        <div className="groq-input-wrapper">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: 30 camisetas Dry Fit Liso, 20 Polo Piquet PV..."
            className="groq-textarea"
            rows={1}
            disabled={isLoading}
          />
          <div className="groq-input-btns">
            <button
              onClick={toggleVoice}
              disabled={isLoading}
              className={`groq-voice-btn ${isListening ? 'groq-voice-active' : ''}`}
              title={isListening ? 'Parar gravação' : 'Falar pedido'}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="groq-send-btn"
              title="Enviar (Enter)"
            >
              <Send size={17} />
            </button>
          </div>
        </div>
        <div className="groq-input-hint">
          {isListening
            ? '🎙️ Ouvindo... fale seu pedido em português'
            : 'Enter para enviar · Shift+Enter para nova linha · 🎙️ para voz'}
        </div>
      </div>
    </div>
  );
}
