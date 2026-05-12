import { extraData as defaultExtra } from '../data/pricingData';

type ExtraData = typeof defaultExtra;

interface Props {
  extraData?: ExtraData;
  isAdmin?: boolean;
  onEdit?: () => void;
}

export function PaymentInfo({ extraData = defaultExtra, isAdmin, onEdit }: Props) {
  return (
    <div className="animate-fade-in mt-16 pb-12">
      <div className="mb-8 border-t border-[var(--border-color)] pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">💳 Formas de Pagamento</h2>
          {isAdmin && (
            <button onClick={onEdit} className="admin-edit-section-btn">
              ✏️ Editar seção
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {extraData.paymentData.filter(p => !p.method.toUpperCase().includes('DINHEIRO')).map((pay, i) => (
            <div key={i} className="glass-card payment-card">
              <h3 className="font-bold text-base mb-1 text-[var(--primary-color)]">{pay.method}</h3>
              <p className="font-semibold text-sm text-[var(--text-secondary)] mb-2">{pay.acressimo}</p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{pay.rules}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border-2 border-blue-400 bg-blue-50 dark:bg-blue-900/20 p-5">
        <p className="text-blue-800 dark:text-blue-300 font-bold text-base mb-1">
          📏 Atenção — Tamanhos Especiais (acima do GG)
        </p>
        <p className="text-blue-700 dark:text-blue-400 text-sm leading-relaxed">
          Peças nos tamanhos <strong>XG, XGG, G1, G2, G3</strong> ou equivalentes acima do GG têm <strong>acréscimo de 30%</strong> sobre o valor unitário do modelo escolhido.
        </p>
      </div>

      <div className="mt-12 glass-card p-6 border-l-4 border-l-[var(--accent-color)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">✏️ Personalizações & Adicionais</h2>
          {isAdmin && (
            <button onClick={onEdit} className="admin-edit-section-btn">
              ✏️ Editar seção
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {extraData.personalizacoes.map((item, i) => (
            <div key={i} className="flex justify-between items-center border-b border-[var(--border-color)] pb-2 pt-2">
              <span className="text-[var(--text-secondary)]">{item.item}</span>
              <span className="font-semibold text-[var(--primary-color)]">
                {typeof item.price === 'number' ? `R$ ${item.price.toFixed(2).replace('.', ',')}` : item.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border-2 border-amber-400 bg-amber-50 dark:bg-amber-900/20 p-6 text-center">
        <p className="text-amber-800 dark:text-amber-300 font-bold text-base">
          ⚠️ VALIDADE DO ORÇAMENTO
        </p>
        <p className="text-amber-700 dark:text-amber-400 font-semibold mt-1">
          Os orçamentos emitidos são válidos por <strong>7 (sete) dias corridos</strong> a partir da data de envio.
        </p>
        <p className="text-amber-600 dark:text-amber-500 text-sm mt-1">
          Após esse prazo, os preços poderão sofrer reajuste sem aviso prévio.
        </p>
      </div>
    </div>
  );
}
