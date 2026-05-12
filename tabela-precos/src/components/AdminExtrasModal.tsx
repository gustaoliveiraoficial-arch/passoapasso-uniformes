import { useState } from 'react';
import { X, Plus, Trash2, Check } from 'lucide-react';
import type { extraData as ExtraDataType } from '../data/pricingData';

type ExtraData = typeof ExtraDataType;

interface Props {
  extraData: ExtraData;
  onSave: (updated: ExtraData) => void;
  onClose: () => void;
}

export function AdminExtrasModal({ extraData, onSave, onClose }: Props) {
  const [tab, setTab] = useState<'personalizacoes' | 'pagamento'>('personalizacoes');
  const [personaliz, setPersonaliz] = useState(extraData.personalizacoes.map((p, i) => ({ ...p, _id: i })));
  const [payments, setPayments] = useState(extraData.paymentData.map((p, i) => ({ ...p, _id: i })));

  const handleSave = () => {
    onSave({
      paymentData: payments.map(({ _id, ...p }) => p),
      personalizacoes: personaliz.map(({ _id, ...p }) => p),
    });
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="product-modal-header" style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5)' }}>
          <h3 className="product-modal-title">Editar Adicionais e Pagamento</h3>
          <button onClick={onClose} className="product-modal-close"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid var(--border-color)' }}>
          <button
            onClick={() => setTab('personalizacoes')}
            style={{
              flex:1, padding:'0.7rem', fontSize:'0.85rem', fontWeight:600, cursor:'pointer',
              background: tab==='personalizacoes' ? 'var(--surface-hover)' : 'transparent',
              border:'none', borderBottom: tab==='personalizacoes' ? '2px solid #2563eb' : '2px solid transparent',
              color: tab==='personalizacoes' ? '#2563eb' : 'var(--text-secondary)',
            }}
          >
            Personalizações Adicionais
          </button>
          <button
            onClick={() => setTab('pagamento')}
            style={{
              flex:1, padding:'0.7rem', fontSize:'0.85rem', fontWeight:600, cursor:'pointer',
              background: tab==='pagamento' ? 'var(--surface-hover)' : 'transparent',
              border:'none', borderBottom: tab==='pagamento' ? '2px solid #2563eb' : '2px solid transparent',
              color: tab==='pagamento' ? '#2563eb' : 'var(--text-secondary)',
            }}
          >
            Formas de Pagamento
          </button>
        </div>

        {/* Body */}
        <div className="product-modal-body">
          {tab === 'personalizacoes' && (
            <div>
              {personaliz.map((p, i) => (
                <div key={p._id} style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.5rem' }}>
                  <input
                    value={p.item}
                    onChange={e => setPersonaliz(prev => prev.map((x,j) => j===i ? {...x, item: e.target.value} : x))}
                    className="product-modal-input"
                    style={{ flex:2 }}
                    placeholder="Nome do adicional"
                  />
                  <input
                    value={String(p.price)}
                    onChange={e => setPersonaliz(prev => prev.map((x,j) => j===i ? {...x, price: e.target.value} : x))}
                    className="product-modal-input"
                    style={{ flex:1 }}
                    placeholder="Preço"
                  />
                  <button
                    onClick={() => setPersonaliz(prev => prev.filter((_,j) => j!==i))}
                    className="admin-delete-row-btn"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setPersonaliz(prev => [...prev, { item:'', price:'', _id: Date.now() }])}
                className="admin-add-item-btn"
                style={{ marginTop:'0.5rem' }}
              >
                <Plus size={15} /> Adicionar item
              </button>
            </div>
          )}

          {tab === 'pagamento' && (
            <div>
              {payments.map((p, i) => (
                <div key={p._id} style={{ marginBottom:'1rem', padding:'0.75rem', background:'var(--surface-hover)', borderRadius:'0.5rem' }}>
                  <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.4rem' }}>
                    <input
                      value={p.method}
                      onChange={e => setPayments(prev => prev.map((x,j) => j===i ? {...x, method: e.target.value} : x))}
                      className="product-modal-input"
                      style={{ flex:1 }}
                      placeholder="Método (ex: 💠 PIX)"
                    />
                    <input
                      value={p.acressimo}
                      onChange={e => setPayments(prev => prev.map((x,j) => j===i ? {...x, acressimo: e.target.value} : x))}
                      className="product-modal-input"
                      style={{ flex:1 }}
                      placeholder="Acréscimo/destaque"
                    />
                  </div>
                  <textarea
                    value={p.rules}
                    onChange={e => setPayments(prev => prev.map((x,j) => j===i ? {...x, rules: e.target.value} : x))}
                    className="admin-textarea"
                    rows={2}
                    placeholder="Regras / descrição completa"
                  />
                </div>
              ))}
              <button
                onClick={() => setPayments(prev => [...prev, { method:'', icon:'', acressimo:'', rules:'', _id: Date.now() }])}
                className="admin-add-item-btn"
                style={{ marginTop:'0.5rem' }}
              >
                <Plus size={15} /> Adicionar forma de pagamento
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="product-modal-footer">
          <button type="button" onClick={onClose} className="admin-btn-cancel">Cancelar</button>
          <button type="button" onClick={handleSave} className="admin-btn-enter">
            <Check size={16} /> Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}
