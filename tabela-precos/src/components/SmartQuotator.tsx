import { useState, useEffect } from 'react';
import { Bot, Send, Key, Copy, Check, Info, Trash2, MessageCircle } from 'lucide-react';
import { pricingData, extraData } from '../data/pricingData';

const STORAGE_KEY = 'gemini_api_key_v1';

export function SmartQuotator() {
  const [apiKey, setApiKey] = useState('');
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  const [inputKey, setInputKey] = useState('');

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const saved = localStorage.getItem(STORAGE_KEY);

    if (envKey) {
      setApiKey(envKey);
      setIsKeyConfigured(true);
    } else if (saved) {
      setApiKey(saved);
      setIsKeyConfigured(true);
    }
  }, []);

  const saveKey = () => {
    if (!inputKey.trim()) return;
    localStorage.setItem(STORAGE_KEY, inputKey.trim());
    setApiKey(inputKey.trim());
    setIsKeyConfigured(true);
  };

  const clearKey = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    setIsKeyConfigured(false);
    setInputKey('');
  };

  const generateQuote = async () => {
    if (!prompt.trim() || !apiKey) return;

    setIsGenerating(true);
    setResponse('');
    setIsCopied(false);

    // Sempre usa os dados originais do código (blindados)
    const contextData = `
TABELA DE PREÇOS — PRODUTOS DISPONÍVEIS:
${JSON.stringify(pricingData, null, 2)}

ADICIONAIS DE PERSONALIZAÇÃO:
${JSON.stringify(extraData.personalizacoes, null, 2)}
    `;

    const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const systemPrompt = `Você é o assistente de orçamentos da empresa "Passo a Passo Uniformes".
Sua função é gerar orçamentos 100% completos, profissionais e formais — prontos para envio ao cliente, sem nenhum campo em branco para preenchimento manual.

DADOS OFICIAIS DE PREÇOS E PRODUTOS:
${contextData}

REGRAS ABSOLUTAS — NUNCA VIOLE:
1. Busque produtos PELO NOME DO PRODUTO (campo "name") — não pelo título da categoria. Ex: se o cliente pede "Dry Fit Liso", localize o produto cujo "name" contém "Dryfit Liso" ou "Dry Fit Liso".
2. Use SOMENTE dados da tabela fornecida. Nunca invente preços ou produtos.
3. Para cada produto, inclua o texto do campo "obs" como descrição do item no orçamento — é a informação que aparece abaixo do nome do produto na tabela (ex: "Incluso 1 estampa em serigrafia de até 2 cores").
4. Quantidade entre dois tiers: use o tier imediatamente inferior.
5. Calcule: Quantidade × Preço Unitário = Subtotal por item.
6. O orçamento deve estar 100% preenchido — sem lacunas, sem campos para completar depois.

FORMATO OBRIGATÓRIO DO ORÇAMENTO:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*ORÇAMENTO — PASSO A PASSO UNIFORMES*
Data: ${today}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Prezado(a) Cliente,

É com muito prazer que apresentamos o orçamento conforme solicitado. Trabalhamos com uniformes e fardamentos de alta qualidade, garantindo o melhor custo-benefício para sua equipe.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 *ITENS ORÇADOS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Para cada produto, use este bloco:]
✅ *[Nome do Produto]*
   📝 [Texto do campo obs do produto — descrição/inclusões]
   🎨 Cores disponíveis: [campo colors do produto]
   📊 Quantidade: [qtd] unidades
   💰 Valor unitário: R$ [preço da tier]
   🧾 *Subtotal: R$ [qtd × preço]*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *RESUMO FINANCEIRO*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total de peças: [soma total de peças]
*💵 TOTAL GERAL: R$ [soma de todos os subtotais]*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 *FORMAS DE PAGAMENTO*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💠 *PIX:* Sem acréscimo. 50% na aprovação + 50% na entrega. Pagamento integral à vista: 5% de desconto.

💵 *DINHEIRO:* À vista 7% de desconto.

💳 *CARTÃO DE CRÉDITO:* Débito: sem acréscimo. 1x: +3% / Até 3x: +6%.

🔗 *LINK DE PAGAMENTO:* Até 3x: +7%. Acima de 3x: consultar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Muito obrigado por considerar a Passo a Passo Uniformes para o seu orçamento! Estamos à disposição para esclarecer qualquer dúvida e aguardamos seu retorno para prosseguirmos com o pedido. 😊

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *VALIDADE DO ORÇAMENTO*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *Este orçamento é válido por 7 (sete) dias corridos a partir da data de emissão.*
⚠️ *Após esse prazo, os valores poderão sofrer reajuste sem aviso prévio.*

Atenciosamente,
*Passo a Passo Uniformes*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PEDIDO DO VENDEDOR:
"""${prompt}"""

Gere agora o orçamento completo seguindo EXATAMENTE o formato acima. Substitua todos os campos entre colchetes com os dados reais. Não deixe nenhum campo em branco.`;

    const modelsToTry = [
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro",
    ];

    let lastError = "";

    for (const modelName of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 2048,
            }
          })
        });

        const data = await res.json();

        if (!res.ok) {
          lastError = data.error?.message || `Erro ${res.status}`;
          console.warn(`Modelo ${modelName} falhou: ${lastError}`);
          continue;
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          setResponse(text);
          setIsGenerating(false);
          return;
        } else {
          lastError = "Resposta vazia do modelo";
          continue;
        }
      } catch (err: any) {
        lastError = err.message || "Erro de rede";
        console.warn(`Modelo ${modelName} erro: ${lastError}`);
        continue;
      }
    }

    setResponse(`❌ Nenhum modelo disponível funcionou.\n\nÚltimo erro: ${lastError}\n\n💡 Verifique:\n1. Se sua API Key do Google Gemini é válida\n2. Se você tem internet\n3. Gere uma nova chave em: https://aistudio.google.com/app/apikey`);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (!response) return;
    const encodedText = encodeURIComponent(response);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center shadow-inner backdrop-blur-sm shadow-black/10">
            <Bot className="text-white h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Gerador de Orçamento IA
            </h2>
            <p className="text-blue-100 text-sm font-medium">Orçamentos profissionais prontos para envio</p>
          </div>
        </div>
        {isKeyConfigured && (
          <button
            onClick={clearKey}
            className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Remover Chave API"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="p-6">
        {!isKeyConfigured ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full shrink-0">
                <Key className="text-blue-600 dark:text-blue-300" />
              </div>
              <div className="w-full">
                <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-2">Configure a inteligência</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                  Para gerar orçamentos automatizados, insira sua chave de API gratuita do Google Gemini. Ela será salva de forma segura apenas no seu navegador.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveKey()}
                    placeholder="Cole sua API Key (AIzaSy...)"
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:text-white"
                  />
                  <button onClick={saveKey} className="bg-blue-600 hover:bg-blue-700 text-white px-6 font-medium py-2 rounded-xl transition-all shadow-md">
                    Salvar
                  </button>
                </div>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-3 inline-block font-medium">
                  → Pegar API Key gratuita do Google Gemini
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Cliente quer 30 camisetas Dry Fit Liso e 20 Polo Poliviscose. Pagamento no PIX à vista."
                className="w-full h-32 px-4 py-4 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none dark:bg-slate-800 dark:text-white text-base shadow-sm"
              />
              <button
                onClick={generateQuote}
                disabled={isGenerating || !prompt.trim()}
                className="absolute bottom-4 right-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center group"
                title="Gerar orçamento"
              >
                {isGenerating ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <Send size={18} className="translate-x-[1px] translate-y-[-1px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
              </button>
            </div>

            {response && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-2 mt-6">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Check className="text-green-500" size={18} /> Orçamento Gerado
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center justify-center gap-2 text-sm font-bold px-4 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                      {isCopied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                      {isCopied ? 'Copiado!' : 'Copiar Texto'}
                    </button>
                    <button
                      onClick={handleWhatsAppShare}
                      className="flex items-center justify-center gap-2 text-sm font-bold px-4 py-3 bg-[#25D366] text-white rounded-xl hover:bg-[#20ba5a] transition-all shadow-md shadow-green-500/20"
                    >
                      <MessageCircle size={18} />
                      Enviar p/ WhatsApp
                    </button>
                  </div>
                </div>
                <div className="bg-[#e5ddd5] dark:bg-[#1a202c] p-6 rounded-2xl relative shadow-inner">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none select-none">
                    <Bot size={100} />
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-300 text-[15px] leading-relaxed relative z-10 font-[500]">
                    {response}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 justify-center pt-2">
              <Info size={14} /> Os valores gerados usam exclusivamente as tabelas oficiais. Sempre revise antes de enviar.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
