import type { Category, PricingItem } from '../data/pricingData';

export function PricingTable({ category }: { category: Category }) {
  // Items come directly from props — read-only (no editing allowed)
  const items = category.items;

  // Extract all unique tiers
  const allTiers = Array.from(new Set(
    items.flatMap(item => item.tiers.map(t => t.qty))
  ));

  return (
    <div className="animate-fade-in mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
        {category.description && (
          <p className="text-secondary category-desc">{category.description}</p>
        )}
      </div>

      <div className="table-wrapper glass-card">
        <table className="pricing-table">
          <thead>
            <tr>
              <th>Modelo / Tecido</th>
              {allTiers.map(qty => (
                <th key={qty} className="text-center">{qty}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item: PricingItem) => (
              <tr key={item.id}>
                <td>
                  <div className="col-name">
                    <span>{item.name}</span>
                    {item.obs && <span className="col-obs">{item.obs}</span>}
                    <span className="colors-badge">🎨 {item.colors}</span>
                  </div>
                </td>
                {allTiers.map(qty => {
                  const tier = item.tiers.find(t => t.qty === qty);
                  const isOrcar = tier?.price === 'Orçar' || tier?.price === 0 || tier?.price === null || tier?.price === undefined;
                  return (
                    <td key={qty} className="text-center">
                      {tier ? (
                        <span className={isOrcar ? "price-orcar" : "price-tag"}>
                          {isOrcar ? "Orçar" : `R$ ${Number(tier.price).toFixed(2).replace('.', ',')}`}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
