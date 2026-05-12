import { useState, useCallback, useRef } from 'react';
import { X, Plus, Trash2, FileDown, ChevronDown } from 'lucide-react';
import type { Category, PricingItem } from '../data/pricingData';
import { extraData as defaultExtra } from '../data/pricingData';

type ExtraData = typeof defaultExtra;

interface Adicional {
  id: string;
  descricao: string;
  qtd: number;
  precoUnit: number;
  isCustom: boolean;
}

interface QuotationItem {
  id: string;
  categoryId: string;
  productId: string;
  descricao: string;
  qty: number;
  adicionais: Adicional[];
  customUnitPrice?: number | null;
}

interface GlobalAdicional {
  id: string;
  descricao: string;
  precoUnit: number;
  qty: number;
  isCustom: boolean;
}

interface Props {
  categories: Category[];
  extraData?: ExtraData;
  onClose: () => void;
}

function parseTierQty(qtyStr: string): number {
  const match = qtyStr.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

function getUnitPrice(item: PricingItem, qty: number): number | null | 'Orçar' {
  if (qty <= 0) return null;
  const tiers = item.tiers
    .map(t => ({ threshold: parseTierQty(t.qty), price: t.price }))
    .sort((a, b) => a.threshold - b.threshold);

  let applicable: (typeof tiers)[0] | null = null;
  for (const tier of tiers) {
    if (qty >= tier.threshold) applicable = tier;
  }
  if (!applicable) applicable = tiers[0];
  if (!applicable) return null;
  if (applicable.price === 'Orçar') return 'Orçar';
  return applicable.price as number;
}

function fmtBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyItem(): QuotationItem {
  return { id: uid(), categoryId: '', productId: '', descricao: '', qty: 1, adicionais: [], customUnitPrice: null };
}


export function QuotationModal({ categories, extraData = defaultExtra, onClose }: Props) {
  const modalBodyRef = useRef<HTMLDivElement>(null);

  // Client info
  const [clienteNome, setClienteNome] = useState('');
  const [clienteEmpresa, setClienteEmpresa] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [prazoEntrega, setPrazoEntrega] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Items
  const [items, setItems] = useState<QuotationItem[]>([emptyItem()]);

  // Global adicionais
  const [globalAdicionais, setGlobalAdicionais] = useState<GlobalAdicional[]>([]);
  const [showGlobalAdicionalPicker, setShowGlobalAdicionalPicker] = useState(false);

  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(today.getDate() + 7);
  const fmtDate = (d: Date) =>
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // ── Item handlers ──────────────────────────────────────────────────────────

  const updateItem = useCallback((id: string, patch: Partial<QuotationItem>) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it));
  }, []);

  const handleCategoryChange = (itemId: string, catId: string) => {
    updateItem(itemId, { categoryId: catId, productId: '', descricao: '', qty: 1 });
  };

  const handleProductChange = (itemId: string, productId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const cat = categories.find(c => c.id === item.categoryId);
    const prod = cat?.items.find(p => p.id === productId);
    updateItem(itemId, {
      productId,
      descricao: prod ? prod.name : '',
      customUnitPrice: null,
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const addItem = () => setItems(prev => [...prev, emptyItem()]);

  // ── Adicional per-item ─────────────────────────────────────────────────────

  const addAdicionalToItem = (itemId: string, fromPersonalizacao?: { descricao: string; precoUnit: number }) => {
    const novo: Adicional = {
      id: uid(),
      descricao: fromPersonalizacao?.descricao ?? '',
      qtd: 1,
      precoUnit: fromPersonalizacao?.precoUnit ?? 0,
      isCustom: !fromPersonalizacao,
    };
    setItems(prev => prev.map(it =>
      it.id === itemId ? { ...it, adicionais: [...it.adicionais, novo] } : it
    ));
  };

  const updateAdicional = (itemId: string, adicId: string, patch: Partial<Adicional>) => {
    setItems(prev => prev.map(it =>
      it.id === itemId
        ? { ...it, adicionais: it.adicionais.map(a => a.id === adicId ? { ...a, ...patch } : a) }
        : it
    ));
  };

  const removeAdicional = (itemId: string, adicId: string) => {
    setItems(prev => prev.map(it =>
      it.id === itemId ? { ...it, adicionais: it.adicionais.filter(a => a.id !== adicId) } : it
    ));
  };

  // ── Global adicionais ──────────────────────────────────────────────────────

  const addGlobalAdicional = (fromPersonalizacao?: { descricao: string; precoUnit: number }) => {
    const novo: GlobalAdicional = {
      id: uid(),
      descricao: fromPersonalizacao?.descricao ?? '',
      precoUnit: fromPersonalizacao?.precoUnit ?? 0,
      qty: 1,
      isCustom: !fromPersonalizacao,
    };
    setGlobalAdicionais(prev => [...prev, novo]);
    setShowGlobalAdicionalPicker(false);
  };

  const updateGlobalAdicional = (id: string, patch: Partial<GlobalAdicional>) => {
    setGlobalAdicionais(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
  };

  const removeGlobalAdicional = (id: string) => {
    setGlobalAdicionais(prev => prev.filter(a => a.id !== id));
  };

  // ── Calculations ───────────────────────────────────────────────────────────

  const getItemCalc = (item: QuotationItem) => {
    const cat = categories.find(c => c.id === item.categoryId);
    const prod = cat?.items.find(p => p.id === item.productId);
    if (!prod) return { unitPrice: null, autoUnitPrice: null as number | 'Orçar' | null, total: null, isOrcamento: false };
    const autoPrice = getUnitPrice(prod, item.qty);
    const adicionaisTotal = item.adicionais.reduce((s, a) => s + a.precoUnit * a.qtd * item.qty, 0);
    if (item.customUnitPrice != null) {
      const total = item.customUnitPrice * item.qty + adicionaisTotal;
      return { unitPrice: item.customUnitPrice as number, autoUnitPrice: autoPrice, total, isOrcamento: false };
    }
    if (autoPrice === null) return { unitPrice: null, autoUnitPrice: null, total: null, isOrcamento: false };
    if (autoPrice === 'Orçar') return { unitPrice: 'Orçar' as const, autoUnitPrice: 'Orçar' as const, total: null, isOrcamento: true };
    const total = autoPrice * item.qty + adicionaisTotal;
    return { unitPrice: autoPrice, autoUnitPrice: autoPrice, total, isOrcamento: false };
  };

  const subtotalItems = items.reduce((s, item) => {
    const { total } = getItemCalc(item);
    return s + (typeof total === 'number' ? total : 0);
  }, 0);

  const subtotalGlobalAdicionais = globalAdicionais.reduce((s, a) => s + a.precoUnit * a.qty, 0);

  const totalGeral = subtotalItems + subtotalGlobalAdicionais;

  // ── PDF ────────────────────────────────────────────────────────────────────

  const [generating, setGenerating] = useState(false);

  const handlePrint = async () => {
    const source = modalBodyRef.current;
    if (!source) return;

    setGenerating(true);
    try {
      const { default: html2pdf } = await import('html2pdf.js');

      // 1. Oculta elementos no-print
      const noPrintEls = Array.from(source.querySelectorAll<HTMLElement>('.no-print'));
      noPrintEls.forEach(el => { el.style.setProperty('display', 'none', 'important'); });

      // 2. Substitui inputs/textareas por divs com o valor completo (evita texto cortado)
      const inputEls = Array.from(source.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea'));
      const inputDivs: HTMLElement[] = [];
      inputEls.forEach(input => {
        const div = document.createElement('div');
        div.textContent = input.value || '';
        const cs = window.getComputedStyle(input);
        div.style.cssText = `
          font-family: ${cs.fontFamily};
          font-size: ${cs.fontSize};
          color: ${cs.color};
          background: ${cs.backgroundColor};
          border: ${cs.border};
          border-radius: ${cs.borderRadius};
          padding: ${cs.padding};
          min-height: ${input.offsetHeight}px;
          width: 100%;
          box-sizing: border-box;
          overflow: visible;
          white-space: pre-wrap;
          word-break: break-word;
        `;
        input.parentNode?.insertBefore(div, input);
        input.style.display = 'none';
        inputDivs.push(div);
      });

      // 3. Remove restrições de scroll/altura do modal
      const prevMaxHeight = source.style.maxHeight;
      const prevOverflow = source.style.overflow;
      source.style.maxHeight = 'none';
      source.style.overflow = 'visible';

      const filename = `orcamento-${clienteNome ? clienteNome.replace(/\s+/g, '-').toLowerCase() : 'pap'}-${new Date().toISOString().slice(0, 10)}.pdf`;

      await html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename,
          image: { type: 'jpeg', quality: 0.97 },
          html2canvas: { scale: 2, useCORS: true, logging: false, allowTaint: true, scrollX: 0, scrollY: 0 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(source)
        .save();

      // 4. Restaura tudo
      inputDivs.forEach(div => div.remove());
      inputEls.forEach(input => { input.style.removeProperty('display'); });
      noPrintEls.forEach(el => { el.style.removeProperty('display'); });
      source.style.maxHeight = prevMaxHeight;
      source.style.overflow = prevOverflow;
    } finally {
      setGenerating(false);
    }
  };

  // ── Personalizacoes as options ─────────────────────────────────────────────

  const parsePersonalizacaoPrice = (price: string | number): number => {
    if (typeof price === 'number') return price;
    const match = price.match(/[\d,.]+/);
    if (!match) return 0;
    return parseFloat(match[0].replace(',', '.'));
  };

  const allPersonalizacoes = extraData.personalizacoes.map(p => ({
    descricao: p.item,
    precoUnit: parsePersonalizacaoPrice(p.price),
  }));

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #quotation-print-root, #quotation-print-root * { visibility: visible; }
          #quotation-print-root {
            position: fixed !important;
            inset: 0;
            background: white !important;
            z-index: 99999;
            overflow: visible !important;
          }
          .no-print { display: none !important; }
          .quotation-modal { box-shadow: none !important; border-radius: 0 !important; max-height: none !important; overflow: visible !important; width: 100% !important; max-width: 100% !important; }
          .quotation-modal-body { overflow: visible !important; max-height: none !important; }
        }
      `}</style>

      <div id="quotation-print-root" className="quotation-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="quotation-modal">

          {/* ── Modal Header (nav) ── */}
          <div className="quotation-nav no-print">
            <span className="quotation-nav-title">Gerar Orçamento</span>
            <div className="flex gap-2">
              <button onClick={handlePrint} disabled={generating} className="q-btn-pdf">
                <FileDown size={16} />
                {generating ? 'Gerando...' : 'Salvar PDF'}
              </button>
              <button onClick={onClose} className="q-btn-close">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="quotation-modal-body" ref={modalBodyRef}>

            {/* ── Document Header ── */}
            <div className="q-doc-header">
              <div className="q-doc-logo-wrap">
                <img src={`${import.meta.env.BASE_URL}logo-pap.png`} alt="Passo a Passo Uniformes" className="q-doc-logo" />
              </div>
              <div className="q-doc-title-wrap">
                <h1 className="q-doc-title">PROPOSTA DE ORÇAMENTO</h1>
                <p className="q-doc-subtitle">Uniformes Personalizados</p>
                <div className="q-doc-meta">
                  <span>Data: {fmtDate(today)}</span>
                  <span>Válido até: {fmtDate(validUntil)}</span>
                </div>
              </div>
            </div>

            {/* ── Client Info ── */}
            <div className="q-section">
              <h2 className="q-section-title">Dados do Cliente</h2>
              <div className="q-grid-2">
                <div className="q-field">
                  <label>Nome do cliente / responsável</label>
                  <input value={clienteNome} onChange={e => setClienteNome(e.target.value)} placeholder="Nome completo" className="q-input" />
                </div>
                <div className="q-field">
                  <label>Empresa / Escola / Grupo</label>
                  <input value={clienteEmpresa} onChange={e => setClienteEmpresa(e.target.value)} placeholder="Ex: Colégio Príncipe da Paz" className="q-input" />
                </div>
                <div className="q-field">
                  <label>Telefone / WhatsApp</label>
                  <input value={clienteTelefone} onChange={e => setClienteTelefone(e.target.value)} placeholder="(00) 00000-0000" className="q-input" />
                </div>
                <div className="q-field">
                  <label>E-mail</label>
                  <input value={clienteEmail} onChange={e => setClienteEmail(e.target.value)} placeholder="email@exemplo.com" className="q-input" />
                </div>
                <div className="q-field q-field-full">
                  <label>Endereço de entrega</label>
                  <input value={enderecoEntrega} onChange={e => setEnderecoEntrega(e.target.value)} placeholder="Rua, número, bairro, cidade - UF" className="q-input" />
                </div>
                <div className="q-field">
                  <label>Prazo de entrega estimado</label>
                  <input value={prazoEntrega} onChange={e => setPrazoEntrega(e.target.value)} placeholder="Ex: 25 dias úteis" className="q-input" />
                </div>
                <div className="q-field q-field-full">
                  <label>Observações gerais</label>
                  <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} placeholder="Cores, especificações, referências, etc." className="q-input q-textarea" rows={2} />
                </div>
              </div>
            </div>

            {/* ── Items ── */}
            <div className="q-section">
              <h2 className="q-section-title">Itens do Orçamento</h2>

              {items.map((item, idx) => {
                const cat = categories.find(c => c.id === item.categoryId);
                const prod = cat?.items.find(p => p.id === item.productId);
                const { unitPrice, total, isOrcamento } = getItemCalc(item);

                return (
                  <div key={item.id} className="q-item-block">
                    <div className="q-item-header">
                      <span className="q-item-number">Item {idx + 1}</span>
                      <button onClick={() => removeItem(item.id)} className="q-btn-remove no-print" title="Remover item">
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Selectors row */}
                    <div className="q-item-selectors no-print">
                      {/* Category */}
                      <div className="q-select-wrap">
                        <label>Categoria</label>
                        <div className="q-select-inner">
                          <select
                            value={item.categoryId}
                            onChange={e => handleCategoryChange(item.id, e.target.value)}
                            className="q-select"
                          >
                            <option value="">Selecionar categoria...</option>
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="q-select-icon" />
                        </div>
                      </div>

                      {/* Product */}
                      <div className="q-select-wrap">
                        <label>Produto</label>
                        <div className="q-select-inner">
                          <select
                            value={item.productId}
                            onChange={e => handleProductChange(item.id, e.target.value)}
                            disabled={!item.categoryId}
                            className="q-select"
                          >
                            <option value="">Selecionar produto...</option>
                            {(cat?.items ?? []).map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="q-select-icon" />
                        </div>
                      </div>

                      {/* Qty */}
                      <div className="q-select-wrap q-select-qty">
                        <label>Quantidade</label>
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={e => updateItem(item.id, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="q-input q-input-qty"
                        />
                      </div>
                    </div>

                    {/* Item data row (print + screen) */}
                    <div className="q-item-data-row">
                      <div className="q-item-desc">
                        <span className="q-label">Descrição</span>
                        <input
                          value={item.descricao}
                          onChange={e => updateItem(item.id, { descricao: e.target.value })}
                          placeholder="Descrição do produto"
                          className="q-input"
                        />
                      </div>
                      <div className="q-item-qty-display">
                        <span className="q-label">Qtd</span>
                        <span className="q-value">{item.qty} pçs</span>
                      </div>
                      <div className="q-item-price">
                        <span className="q-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Preço Unit.
                          {item.customUnitPrice != null && (
                            <button
                              onClick={() => updateItem(item.id, { customUnitPrice: null })}
                              className="no-print"
                              title="Restaurar preço automático"
                              style={{ fontSize: '0.65rem', color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
                            >↺ auto</button>
                          )}
                        </span>
                        {(typeof unitPrice === 'number') || item.customUnitPrice != null ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>R$</span>
                            <input
                              type="number"
                              min={0}
                              step={0.01}
                              value={item.customUnitPrice ?? (typeof unitPrice === 'number' ? unitPrice : 0)}
                              onChange={e => {
                                const v = parseFloat(e.target.value);
                                updateItem(item.id, { customUnitPrice: isNaN(v) ? null : v });
                              }}
                              className="q-input q-input-sm q-input-num"
                              style={{ width: '75px', color: item.customUnitPrice != null ? '#7c3aed' : '#E85000', fontWeight: 700, padding: '2px 4px' }}
                              title="Clique para editar o valor unitário"
                            />
                          </div>
                        ) : (
                          <span className={`q-value ${isOrcamento ? 'text-amber-600' : 'text-[#E85000]'}`}>
                            {unitPrice === null ? '—' : 'A Orçar'}
                          </span>
                        )}
                      </div>
                      <div className="q-item-total">
                        <span className="q-label">Total do item</span>
                        <span className="q-value-total">
                          {total === null ? (isOrcamento ? 'A Orçar' : '—') : fmtBRL(total)}
                        </span>
                      </div>
                    </div>

                    {/* Product info (obs, description) */}
                    {prod && (prod.obs || prod.colors) && (
                      <div className="q-item-obs">
                        {prod.colors && <span>Cores disponíveis: {prod.colors}</span>}
                        {prod.obs && <span>Obs: {prod.obs}</span>}
                      </div>
                    )}

                    {/* Adicionais do item */}
                    {item.adicionais.length > 0 && (
                      <div className="q-adicionais">
                        <span className="q-adicionais-title">Adicionais deste item:</span>
                        {item.adicionais.map(ad => (
                          <div key={ad.id} className="q-adicional-row">
                            <div className="q-adicional-desc">
                              <input
                                value={ad.descricao}
                                onChange={e => updateAdicional(item.id, ad.id, { descricao: e.target.value })}
                                placeholder="Descrição do adicional"
                                className="q-input q-input-sm"
                              />
                            </div>
                            <div className="q-adicional-qtd">
                              <span className="q-label">Qtd (× {item.qty} pçs)</span>
                              <input
                                type="number"
                                min={1}
                                value={ad.qtd}
                                onChange={e => updateAdicional(item.id, ad.id, { qtd: Math.max(1, parseInt(e.target.value) || 1) })}
                                className="q-input q-input-sm q-input-num"
                              />
                            </div>
                            <div className="q-adicional-price">
                              <span className="q-label">Preço unit.</span>
                              <div className="q-price-input-wrap">
                                <span className="q-price-prefix">R$</span>
                                <input
                                  type="number"
                                  min={0}
                                  step={0.01}
                                  value={ad.precoUnit}
                                  onChange={e => updateAdicional(item.id, ad.id, { precoUnit: parseFloat(e.target.value) || 0 })}
                                  className="q-input q-input-sm q-input-num"
                                />
                              </div>
                            </div>
                            <div className="q-adicional-total">
                              <span className="q-label">Total</span>
                              <span className="q-value text-[#E85000]">{fmtBRL(ad.precoUnit * ad.qtd * item.qty)}</span>
                            </div>
                            <button onClick={() => removeAdicional(item.id, ad.id)} className="q-btn-remove no-print">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add adicional to item */}
                    <div className="q-item-add-adicional no-print">
                      <AdicionalPicker
                        label="+ Adicional neste item"
                        options={allPersonalizacoes}
                        onSelect={(opt) => addAdicionalToItem(item.id, opt)}
                        onCustom={() => addAdicionalToItem(item.id)}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Add item + Add global adicional */}
              <div className="q-add-row no-print">
                <button onClick={addItem} className="q-btn-add-item">
                  <Plus size={16} /> Adicionar novo item
                </button>
                <div className="relative">
                  <button onClick={() => setShowGlobalAdicionalPicker(p => !p)} className="q-btn-add-adicional">
                    <Plus size={16} /> Adicionar adicional individual
                  </button>
                  {showGlobalAdicionalPicker && (
                    <div className="q-picker-dropdown">
                      <p className="q-picker-label">Escolher adicional:</p>
                      <div className="q-picker-options">
                        {allPersonalizacoes.map((p, i) => (
                          <button key={i} onClick={() => addGlobalAdicional(p)} className="q-picker-option">
                            {p.descricao} — {fmtBRL(p.precoUnit)}
                          </button>
                        ))}
                        <button onClick={() => addGlobalAdicional()} className="q-picker-option q-picker-custom">
                          ✏️ Personalizado (digitar)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Global Adicionais ── */}
            {globalAdicionais.length > 0 && (
              <div className="q-section">
                <h2 className="q-section-title">Adicionais Individuais</h2>
                <div className="q-global-adicionais">
                  {globalAdicionais.map(ga => (
                    <div key={ga.id} className="q-adicional-row">
                      <div className="q-adicional-desc">
                        <input
                          value={ga.descricao}
                          onChange={e => updateGlobalAdicional(ga.id, { descricao: e.target.value })}
                          placeholder="Descrição do adicional"
                          className="q-input q-input-sm"
                        />
                      </div>
                      <div className="q-adicional-qtd">
                        <span className="q-label">Quantidade</span>
                        <input
                          type="number"
                          min={1}
                          value={ga.qty}
                          onChange={e => updateGlobalAdicional(ga.id, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="q-input q-input-sm q-input-num"
                        />
                      </div>
                      <div className="q-adicional-price">
                        <span className="q-label">Preço unit.</span>
                        <div className="q-price-input-wrap">
                          <span className="q-price-prefix">R$</span>
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={ga.precoUnit}
                            onChange={e => updateGlobalAdicional(ga.id, { precoUnit: parseFloat(e.target.value) || 0 })}
                            className="q-input q-input-sm q-input-num"
                          />
                        </div>
                      </div>
                      <div className="q-adicional-total">
                        <span className="q-label">Total</span>
                        <span className="q-value text-[#E85000]">{fmtBRL(ga.precoUnit * ga.qty)}</span>
                      </div>
                      <button onClick={() => removeGlobalAdicional(ga.id)} className="q-btn-remove no-print">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Totals ── */}
            <div className="q-section">
              <div className="q-totals">
                {globalAdicionais.length > 0 && (
                  <>
                    <div className="q-total-row">
                      <span>Subtotal — Produtos</span>
                      <span>{fmtBRL(subtotalItems)}</span>
                    </div>
                    <div className="q-total-row">
                      <span>Subtotal — Adicionais Individuais</span>
                      <span>{fmtBRL(subtotalGlobalAdicionais)}</span>
                    </div>
                    <div className="q-total-divider" />
                  </>
                )}
                <div className="q-total-row q-total-final">
                  <span>TOTAL GERAL DO ORÇAMENTO</span>
                  <span>{fmtBRL(totalGeral)}</span>
                </div>
                {items.some(i => getItemCalc(i).isOrcamento) && (
                  <p className="q-total-obs">* Itens marcados como "A Orçar" não estão incluídos no total.</p>
                )}
              </div>
            </div>

            {/* ── Payment Info ── */}
            <div className="q-section">
              <h2 className="q-section-title">Formas de Pagamento</h2>
              <div className="q-payment-grid">
                {extraData.paymentData.filter(p => !p.method.toUpperCase().includes('DINHEIRO')).map((pay, i) => (
                  <div key={i} className="q-payment-card">
                    <p className="q-payment-method">{pay.method}</p>
                    <p className="q-payment-acrescimo">{pay.acressimo}</p>
                    <p className="q-payment-rules">{pay.rules}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Validity + Notes ── */}
            <div className="q-section">
              <div className="q-validity">
                <p className="q-validity-title">⚠️ VALIDADE DO ORÇAMENTO</p>
                <p className="q-validity-text">
                  Este orçamento é válido por <strong>7 (sete) dias corridos</strong> a partir da data de emissão ({fmtDate(today)}),
                  expirando em <strong>{fmtDate(validUntil)}</strong>.
                </p>
                <p className="q-validity-obs">Após esse prazo, os preços poderão sofrer reajuste sem aviso prévio.</p>
              </div>
            </div>

            {/* ── Disclaimer final ── */}
            <div className="q-section">
              <div style={{ borderRadius: '12px', border: '2px solid #f59e0b', background: '#fffbeb', padding: '1rem 1.25rem' }}>
                <p style={{ fontWeight: 700, color: '#92400e', marginBottom: '0.35rem' }}>
                  ⚠️ ATENÇÃO — Este não é o orçamento final do pedido
                </p>
                <p style={{ fontSize: '0.875rem', color: '#b45309', lineHeight: '1.5' }}>
                  Os valores apresentados nesta proposta poderão ser <strong>revisados e ajustados</strong> após o envio das informações completas de tamanhos pelos clientes e após a <strong>aprovação do layout</strong> final da peça. O orçamento definitivo será emitido somente com todos esses dados confirmados.
                </p>
              </div>
            </div>

            {/* ── Contact footer ── */}
            <div className="q-contact-footer">
              <p>Passo a Passo Uniformes · passoapassouniformes.com</p>
            </div>

            {/* ── Print button (bottom, screen only) ── */}
            <div className="q-bottom-actions no-print">
              <button onClick={handlePrint} disabled={generating} className="q-btn-pdf q-btn-pdf-lg">
                <FileDown size={18} />
                {generating ? 'Gerando PDF...' : 'Salvar como PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── AdicionalPicker sub-component ─────────────────────────────────────────────

interface AdicionalPickerProps {
  label: string;
  options: { descricao: string; precoUnit: number }[];
  onSelect: (opt: { descricao: string; precoUnit: number }) => void;
  onCustom: () => void;
}

function AdicionalPicker({ label, options, onSelect, onCustom }: AdicionalPickerProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(p => !p)} className="q-btn-add-mini">
        <Plus size={13} /> {label}
      </button>
      {open && (
        <div className="q-picker-dropdown q-picker-sm">
          <p className="q-picker-label">Escolher adicional:</p>
          <div className="q-picker-options">
            {options.map((opt, i) => (
              <button key={i} onClick={() => { onSelect(opt); setOpen(false); }} className="q-picker-option">
                {opt.descricao} — {fmtBRL(opt.precoUnit)}
              </button>
            ))}
            <button onClick={() => { onCustom(); setOpen(false); }} className="q-picker-option q-picker-custom">
              ✏️ Personalizado (digitar)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
