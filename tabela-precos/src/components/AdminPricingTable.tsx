import { useState } from 'react';
import { Trash2, Plus, GripVertical, Pencil, X, Check } from 'lucide-react';
import type { Category, PricingItem, PricingTier } from '../data/pricingData';

interface AdminPricingTableProps {
  category: Category;
  onChange: (updated: Category) => void;
  onDelete?: () => void;
}

function priceKey(itemId: string, qty: string) {
  return `${itemId}||${qty}`;
}

function buildPriceInputs(items: PricingItem[]): Record<string, string> {
  const map: Record<string, string> = {};
  items.forEach(item => {
    item.tiers.forEach(t => {
      const k = priceKey(item.id, t.qty);
      map[k] = typeof t.price === 'number' && t.price > 0
        ? t.price.toFixed(2).replace('.', ',')
        : typeof t.price === 'string' && t.price !== '' ? t.price : '';
    });
  });
  return map;
}

/* ─── Modal individual de produto ──────────────────── */
interface ProductModalProps {
  item: PricingItem;
  tiers: string[];
  initialPrices: Record<string, string>;
  onSave: (updated: PricingItem, prices: Record<string, string>) => void;
  onClose: () => void;
}

function ProductModal({ item, tiers, initialPrices, onSave, onClose }: ProductModalProps) {
  const [name, setName] = useState(item.name);
  const [obs, setObs] = useState(item.obs || '');
  const [colors, setColors] = useState(item.colors);
  const [prices, setPrices] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    tiers.forEach(qty => { m[qty] = initialPrices[priceKey(item.id, qty)] || ''; });
    return m;
  });

  const handleSave = () => {
    const newTiers: PricingTier[] = tiers.map(qty => {
      const raw = prices[qty] || '';
      const num = parseFloat(raw.replace(',', '.'));
      return { qty, price: isNaN(num) ? 'Orçar' : num };
    });
    const updatedItem: PricingItem = { ...item, name, obs, colors, tiers: newTiers };
    const updatedPrices: Record<string, string> = { ...initialPrices };
    tiers.forEach(qty => { updatedPrices[priceKey(item.id, qty)] = prices[qty] || ''; });
    onSave(updatedItem, updatedPrices);
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={e => e.stopPropagation()}>
        <div className="product-modal-header">
          <h3 className="product-modal-title">Editar Produto</h3>
          <button onClick={onClose} className="product-modal-close"><X size={18} /></button>
        </div>
        <div className="product-modal-body">
          <div className="admin-label">Nome do produto</div>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="product-modal-input font-semibold"
            placeholder="Nome do produto"
          />

          <div className="admin-label" style={{ marginTop: '0.85rem' }}>Descrição / Observação</div>
          <textarea
            value={obs}
            onChange={e => setObs(e.target.value)}
            className="admin-textarea"
            rows={3}
            placeholder="Ex: Incluso: 1 estampa em serigrafia de até 2 cores..."
          />

          <div className="admin-label" style={{ marginTop: '0.85rem' }}>Cores disponíveis</div>
          <input
            value={colors}
            onChange={e => setColors(e.target.value)}
            className="product-modal-input"
            placeholder="Ex: Branco, Preto, Azul..."
          />

          {tiers.length > 0 && (
            <>
              <div className="admin-label" style={{ marginTop: '0.85rem' }}>Preços por faixa</div>
              <div className="product-modal-prices">
                {tiers.map(qty => (
                  <div key={qty} className="product-modal-price-row">
                    <span className="product-modal-qty">{qty}</span>
                    <span className="product-modal-currency">R$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={prices[qty] || ''}
                      onChange={e => setPrices(prev => ({ ...prev, [qty]: e.target.value }))}
                      className="admin-price-input"
                      placeholder="0,00"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="product-modal-footer">
          <button type="button" onClick={onClose} className="admin-btn-cancel">Cancelar</button>
          <button type="button" onClick={handleSave} className="admin-btn-enter">
            <Check size={16} />
            Salvar produto
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Tabela principal de admin ─────────────────────── */
export function AdminPricingTable({ category, onChange, onDelete }: AdminPricingTableProps) {
  const [items, setItems] = useState<PricingItem[]>(category.items);
  const [description, setDescription] = useState(category.description || '');
  const [title, setTitle] = useState(category.title);
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>(() => buildPriceInputs(category.items));
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const allTiers = Array.from(new Set(items.flatMap(item => item.tiers.map(t => t.qty))));

  const propagate = (newItems: PricingItem[], newDesc = description, newTitle = title) => {
    onChange({ ...category, title: newTitle, description: newDesc, items: newItems });
  };

  /* ── Preço: commit só no blur ───────────────────── */
  const handlePriceChange = (itemId: string, qty: string, value: string) => {
    setPriceInputs(prev => ({ ...prev, [priceKey(itemId, qty)]: value }));
  };

  const handlePriceBlur = (itemId: string, qty: string) => {
    const raw = priceInputs[priceKey(itemId, qty)] || '';
    const num = parseFloat(raw.replace(',', '.'));
    const price = isNaN(num) ? 0 : num;
    const newItems = items.map(item => {
      if (item.id !== itemId) return item;
      const exists = item.tiers.find(t => t.qty === qty);
      const newTiers = exists
        ? item.tiers.map(t => t.qty === qty ? { qty, price } : t)
        : [...item.tiers, { qty, price }];
      return { ...item, tiers: newTiers };
    });
    setItems(newItems);
    propagate(newItems);
  };

  /* ── Produto: adicionar / excluir ───────────────── */
  const addItem = () => {
    const newItem: PricingItem = {
      id: `new-${Date.now()}`,
      name: 'Novo Produto',
      colors: 'Consultar',
      obs: '',
      tiers: allTiers.length > 0
        ? allTiers.map(qty => ({ qty, price: 0 }))
        : [{ qty: '10 pçs', price: 0 }, { qty: '30 pçs', price: 0 }],
    };
    const newItems = [...items, newItem];
    const newInputs = { ...priceInputs };
    newItem.tiers.forEach(t => { newInputs[priceKey(newItem.id, t.qty)] = ''; });
    setItems(newItems);
    setPriceInputs(newInputs);
    propagate(newItems);
    setEditingProductId(newItem.id);
  };

  const deleteItem = (itemId: string) => {
    const newItems = items.filter(i => i.id !== itemId);
    setItems(newItems);
    propagate(newItems);
  };

  /* ── Tier (coluna): adicionar / excluir ─────────── */
  const addTierColumn = () => {
    const tierName = prompt('Nome da faixa de quantidade (ex: 20 pçs):');
    if (!tierName) return;
    const newItems = items.map(item => ({
      ...item,
      tiers: [...item.tiers, { qty: tierName, price: 0 }],
    }));
    const newInputs = { ...priceInputs };
    newItems.forEach(item => { newInputs[priceKey(item.id, tierName)] = ''; });
    setItems(newItems);
    setPriceInputs(newInputs);
    propagate(newItems);
  };

  const deleteTierColumn = (qty: string) => {
    if (!confirm(`Remover a coluna "${qty}" de todos os produtos?`)) return;
    const newItems = items.map(item => ({
      ...item,
      tiers: item.tiers.filter(t => t.qty !== qty),
    }));
    setItems(newItems);
    propagate(newItems);
  };

  /* ── Modal de produto ───────────────────────────── */
  const handleProductSave = (updated: PricingItem, newInputs: Record<string, string>) => {
    const newItems = items.map(i => i.id === updated.id ? updated : i);
    setItems(newItems);
    setPriceInputs(newInputs);
    propagate(newItems);
    setEditingProductId(null);
  };

  const editingItem = editingProductId ? items.find(i => i.id === editingProductId) ?? null : null;

  return (
    <div className="animate-fade-in mb-12">
      {/* Título da categoria */}
      <div className="admin-section-header">
        <div className="flex-1">
          <div className="admin-label">Título da categoria</div>
          <input
            value={title}
            onChange={e => { setTitle(e.target.value); propagate(items, description, e.target.value); }}
            className="admin-cat-title-input"
            placeholder="Título da categoria"
          />
        </div>
        {onDelete && (
          <button
            onClick={() => { if (confirm(`Remover a categoria "${title}"?`)) onDelete(); }}
            className="admin-delete-row-btn"
            title="Excluir categoria"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Descrição */}
      <div className="mb-4">
        <div className="admin-label">Descrição da categoria</div>
        <textarea
          value={description}
          onChange={e => { setDescription(e.target.value); propagate(items, e.target.value); }}
          className="admin-textarea"
          rows={2}
          placeholder="Ex: Incluso: 1 estampa em serigrafia de até 2 cores..."
        />
      </div>

      {/* Tabela */}
      <div className="table-wrapper admin-table-wrapper">
        <table className="pricing-table">
          <thead>
            <tr>
              <th style={{ minWidth: 220 }}>
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="opacity-40" />
                  Modelo / Tecido
                </div>
              </th>
              {allTiers.map(qty => (
                <th key={qty} className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {qty}
                    <button
                      onClick={() => deleteTierColumn(qty)}
                      className="admin-delete-col-btn"
                      title={`Remover coluna ${qty}`}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </th>
              ))}
              <th className="text-center">
                <button onClick={addTierColumn} className="admin-add-col-btn" title="Adicionar faixa">
                  <Plus size={13} />
                </button>
              </th>
              <th style={{ width: 72 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="admin-row">
                <td>
                  <div className="col-name">
                    <span className="font-semibold text-[var(--text-primary)] text-sm">{item.name}</span>
                    {item.obs && (
                      <span className="text-xs text-[var(--text-secondary)] leading-snug">{item.obs}</span>
                    )}
                    <span className="text-xs text-[var(--text-muted)]">🎨 {item.colors}</span>
                  </div>
                </td>
                {allTiers.map(qty => {
                  const k = priceKey(item.id, qty);
                  return (
                    <td key={qty} className="text-center">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={priceInputs[k] ?? ''}
                        onChange={e => handlePriceChange(item.id, qty, e.target.value)}
                        onBlur={() => handlePriceBlur(item.id, qty)}
                        className="admin-price-input"
                        placeholder="—"
                      />
                    </td>
                  );
                })}
                <td className="text-center"></td>
                <td className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <button
                      onClick={() => setEditingProductId(item.id)}
                      className="admin-edit-btn"
                      title="Editar produto"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => { if (confirm(`Excluir "${item.name}"?`)) deleteItem(item.id); }}
                      className="admin-delete-row-btn"
                      title="Excluir produto"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={addItem} className="admin-add-item-btn">
        <Plus size={16} />
        Adicionar produto nesta categoria
      </button>

      {/* Modal de edição individual */}
      {editingItem && (
        <ProductModal
          item={editingItem}
          tiers={allTiers}
          initialPrices={priceInputs}
          onSave={handleProductSave}
          onClose={() => setEditingProductId(null)}
        />
      )}
    </div>
  );
}
