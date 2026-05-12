export interface PricingTier {
  qty: string;
  price: string | number;
}

export interface PricingItem {
  id: string;
  name: string;
  tiers: PricingTier[];
  colors: string;
  obs?: string;
  details?: string;
}

export interface Category {
  id: string;
  title: string;
  description?: string;
  items: PricingItem[];
}

export const pricingData: Category[] = [
  {
    id: "camisetas",
    title: "Camiseta / Baby Look",
    description: "Incluso: 1 estampa em serigrafia de até 2 cores. Atenção: Peças acima do GG têm acréscimo de 30% sobre o valor unitário.",
    items: [
      {
        id: "c-pv-premium",
        name: "PV Premium",
        colors: "Preto, Branco, Az. Marinho, Cinza Mescla Claro/Escuro, Off White",
        obs: "Produto pronto — tabela medidas diferente",
        tiers: [
          { qty: "10 pçs", price: 51.90 },
          { qty: "30 pçs", price: 49.90 },
          { qty: "50 pçs", price: 47.90 },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "c-pv-economi",
        name: "PV Economi",
        colors: "Preto, Branco, Azul, Royal, Amarelo, Cinza Cl., Vermelho, Verde, Az. Marinho",
        obs: "Outras cores min 50 pçs",
        tiers: [
          { qty: "10 pçs", price: 33.90 },
          { qty: "30 pçs", price: 32.90 },
          { qty: "50 pçs", price: "Orçar" },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "c-algodao",
        name: "100% Algodão",
        colors: "Preto Mescla, Azul, Royal, Verde Neon, Rosa Neon, Laranja Neon, Verde Floresta",
        obs: "Outras cores min 50 pçs",
        tiers: [
          { qty: "10 pçs", price: 56.90 },
          { qty: "30 pçs", price: 54.90 },
          { qty: "50 pçs", price: 52.90 },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "c-algodao-pa-metattx",
        name: "Algodão PA — Metattx",
        colors: "Preto Mescla, Azul, Royal, Verde/Rosa/Laranja Neon, Verde Floresta",
        obs: "Outras cores min 50 pçs",
        tiers: [
          { qty: "10 pçs", price: 64.90 },
          { qty: "30 pçs", price: 62.90 },
          { qty: "50 pçs", price: 59.90 },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "c-algodao-pa-costarica",
        name: "Algodão PA — Costa Rica",
        colors: "Conferir disponibilidade",
        obs: "Outras cores min 50 pçs",
        tiers: [
          { qty: "10 pçs", price: 52.90 },
          { qty: "30 pçs", price: 49.90 },
          { qty: "50 pçs", price: 47.90 },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "c-viscolycra",
        name: "Viscolycra",
        colors: "Preto",
        obs: "Incluso 1 logo bordado até 8cm",
        tiers: [
          { qty: "10 pçs", price: 63.90 },
          { qty: "30 pçs", price: 61.90 },
          { qty: "50 pçs", price: 59.90 },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "c-dryfit-liso",
        name: "Dryfit Liso",
        colors: "Preto, Branco",
        obs: "Outras cores min 50 pçs",
        tiers: [
          { qty: "10 pçs", price: 50.90 },
          { qty: "30 pçs", price: 48.90 },
          { qty: "50 pçs", price: 46.90 },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "c-poliamida",
        name: "Poliamida",
        colors: "Preto",
        obs: "Produto pronto — tabela medidas diferente",
        tiers: [
          { qty: "10 pçs", price: 58.90 },
          { qty: "30 pçs", price: 56.90 },
          { qty: "50 pçs", price: "Orçar" },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "c-dry-colmeia",
        name: "Dry Colmeia",
        colors: "Consultar",
        obs: "Outras cores min 50 pçs",
        tiers: [
          { qty: "10 pçs", price: 54.90 },
          { qty: "30 pçs", price: 52.90 },
          { qty: "50 pçs", price: 50.90 },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "c-dry-jimp",
        name: "Dry Jimp",
        colors: "Preto, Branco",
        obs: "Incluso 1 estampa 2 cor em plastisol",
        tiers: [
          { qty: "10 pçs", price: 65.90 },
          { qty: "30 pçs", price: 64.90 },
          { qty: "50 pçs", price: 62.90 },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "c-oversize",
        name: "Camiseta Over Size Unissex — 100% Algodão",
        colors: "Preto, Branco, Off White",
        obs: "Incluso 1 estampa serigrafia 2 cores",
        tiers: [
          { qty: "10 pçs", price: 69.90 },
          { qty: "30 pçs", price: 67.90 },
          { qty: "50 pçs", price: 64.90 },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      }
    ]
  },
  {
    id: "polos",
    title: "Camisetas Polo",
    description: "Incluso Piquet PV: 1 bordado lado esquerdo | Poliviscose/Dry Liso: 2 estampas serigrafia de 2 cores. Manga Longa: +R$22,00. Infantil até 14 anos: -R$5,00.",
    items: [
      {
        id: "p-piquet-pv",
        name: "Piquet PV",
        colors: "Preto, Branco, Az. Marinho, Cinza Mescla Claro/Escuro",
        obs: "Veja acréscimos na tabela de personalização",
        tiers: [
          { qty: "10 pçs", price: 79.90 },
          { qty: "30 pçs", price: 76.90 },
          { qty: "50 pçs", price: "Orçar" },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "p-poliviscose",
        name: "Poliviscose",
        colors: "Preto, Branco, Az. Marinho, Cinza Mescla Claro/Escuro",
        tiers: [
          { qty: "10 pçs", price: 71.90 },
          { qty: "30 pçs", price: 69.90 },
          { qty: "50 pçs", price: 67.90 },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "p-dryfit-liso",
        name: "Dry Fit Liso",
        colors: "Preto, Branco",
        tiers: [
          { qty: "10 pçs", price: 74.90 },
          { qty: "30 pçs", price: 72.90 },
          { qty: "50 pçs", price: 70.90 },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      }
    ]
  },
  {
    id: "manga-bufante",
    title: "Blusinha Manga Bufante",
    description: "Infantil até 14 anos. Incluso: 1 Bordado P. Manga Longa: +R$12,00. Acréscimos iguais ao Polo.",
    items: [
      {
        id: "mb-piquet-pv",
        name: "Piquet PV e Poliviscose",
        colors: "Preto, Branco, Az. Marinho, Cinza Mescla Claro/Escuro",
        tiers: [
          { qty: "10 pçs", price: 75.90 },
          { qty: "30 pçs", price: 71.90 },
          { qty: "50 pçs", price: 68.90 },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "mb-viscolycra",
        name: "Viscolycra",
        colors: "Preto",
        tiers: [
          { qty: "10 pçs", price: 81.90 },
          { qty: "30 pçs", price: 79.90 },
          { qty: "50 pçs", price: 77.90 },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      }
    ]
  },
  {
    id: "esporte",
    title: "Esporte & Fardamento",
    description: "Calças, Basquete, Calções, Bermudas. Incluso nas calças: 1 estampa 2 cores.",
    items: [
      {
        id: "e-calca-moletom",
        name: "Calça Moletom",
        colors: "Preto, Off, Az. Marinho, Cinza Mescla Claro/Escuro",
        obs: "Friso acrescenta R$5,00",
        tiers: [
          { qty: "10 pçs", price: 115.90 },
          { qty: "30 pçs", price: 111.90 },
          { qty: "50 pçs", price: 109.90 }
        ]
      },
      {
        id: "e-calca-moletinho",
        name: "Calça Moletinho",
        colors: "Cinza Mescla Claro e Preto",
        tiers: [
          { qty: "10 pçs", price: 95.90 },
          { qty: "30 pçs", price: 91.90 },
          { qty: "50 pçs", price: 89.90 }
        ]
      },
      {
        id: "e-regata-basquete-dry",
        name: "Regata Basquete — Dry Liso",
        colors: "Padrão",
        obs: "Escudo +5, Nome +5, Escudo Relevo +10",
        tiers: [
          { qty: "10 pçs", price: 95.90 },
          { qty: "20 pçs", price: 93.90 },
          { qty: "30 pçs", price: 91.90 },
          { qty: "40 pçs", price: 88.90 },
          { qty: "50 pçs", price: 84.90 }
        ]
      },
      {
        id: "e-bermuda-basquete-dry",
        name: "Bermuda Basquete — Dry Liso",
        colors: "Padrão",
        obs: "Mesmos acréscimos da regata basquete",
        tiers: [
          { qty: "10 pçs", price: 90.90 },
          { qty: "20 pçs", price: 88.90 },
          { qty: "30 pçs", price: 85.90 },
          { qty: "40 pçs", price: 83.90 },
          { qty: "50 pçs", price: 81.90 }
        ]
      },
      {
        id: "e-calcao-dry",
        name: "Calção Fardamento Sublimado — Dry Liso",
        colors: "Padrão",
        obs: "Com River +12, Escudo +5, Nome +5, Escudo Relevo +10",
        tiers: [
          { qty: "10 pçs", price: 84.90 },
          { qty: "20 pçs", price: 81.90 },
          { qty: "30 pçs", price: 78.90 },
          { qty: "40 pçs", price: 75.90 },
          { qty: "50 pçs", price: 72.90 }
        ]
      }
    ]
  },
  {
    id: "jaquetas",
    title: "Jaquetas & Conjuntos",
    description: "Corta Vento, Jaquetas 1201 Sublimadas, Moletom, e Suplex.",
    items: [
      {
        id: "j-corta-vento",
        name: "Corta Vento Sublimado",
        colors: "Sublimação Total",
        tiers: [
          { qty: "10 pçs", price: 245.00 },
          { qty: "20 pçs", price: 239.90 },
          { qty: "30 pçs", price: 235.90 },
          { qty: "40 pçs", price: 229.90 },
          { qty: "50 pçs", price: 225.90 }
        ]
      },
      {
        id: "j-1201-frente",
        name: "Jaqueta 1201 Fosca — Frente Sublimada",
        colors: "Padrão",
        obs: "Incluso: 1 estampa até 2 cores. Escudo +5, Nome +5.",
        tiers: [
          { qty: "10 pçs", price: 206.90 },
          { qty: "20 pçs", price: 201.90 },
          { qty: "30 pçs", price: 197.90 },
          { qty: "40 pçs", price: 193.90 },
          { qty: "50 pçs", price: 189.90 }
        ]
      },
      {
        id: "j-moletom-canguru",
        name: "Moletom Canguru",
        colors: "Preto, Off, Azul, Cinza Mescla",
        obs: "Incluso 2 estampas de 2 cores. Estampa no capuz +5, Nome bordado +10.",
        tiers: [
          { qty: "10 pçs", price: 185.90 },
          { qty: "30 pçs", price: 183.90 },
          { qty: "50+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "j-suplex-top",
        name: "Suplex Feminino - Top Diana",
        colors: "Preto, Azul Marinho",
        obs: "Incluso 1 estampa plastisol 1 cor.",
        tiers: [
          { qty: "10 pçs", price: 69.90 },
          { qty: "30 pçs", price: 67.90 },
          { qty: "50 pçs", price: 65.90 },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      },
      {
        id: "j-suplex-legging",
        name: "Suplex Feminino - Legging",
        colors: "Preto, Azul Marinho",
        tiers: [
          { qty: "10 pçs", price: 99.90 },
          { qty: "30 pçs", price: 90.90 },
          { qty: "50 pçs", price: "Orçar" },
          { qty: "100+ pçs", price: "Orçar" }
        ]
      }
    ]
  }
];

export const extraData = {
  paymentData: [
    {
      method: "💠 PIX",
      icon: "💠",
      acressimo: "Sem acréscimo",
      rules: "50% na aprovação + 50% na entrega. Pagamento integral à vista: 5% de desconto."
    },
    {
      method: "💳 CARTÃO DE CRÉDITO",
      icon: "💳",
      acressimo: "Débito sem acréscimo",
      rules: "Débito: sem acréscimo. 1x: +3% / Até 3x: +6%."
    },
    {
      method: "🔗 LINK DE PAGAMENTO",
      icon: "🔗",
      acressimo: "Até 3x: +7%",
      rules: "Até 3x: +7%. Acima de 3x: consultar."
    }
  ],
  personalizacoes: [
    { item: "Matriz de bordado (geral)", price: 45.00 },
    { item: "Matriz bordado (polo/blusinha)", price: 20.00 },
    { item: "Bordado P — até 5 cm", price: "+ R$ 7,00" },
    { item: "Bordado M — até 9 cm", price: "+ R$ 12,00" },
    { item: "Nome (serigrafia)", price: "+ R$ 10,00" },
    { item: "Logo extra até 2 cores — 28 cm", price: "+ R$ 6,00" },
    { item: "Cor adicional (por cor)", price: "+ R$ 1,50" },
    { item: "Numeração", price: "+ R$ 12,00" },
    { item: "Plastisol", price: "+ R$ 6,00" },
    { item: "Gola personalizada", price: "+ R$ 10,00" },
    { item: "Gola V / Punho", price: "+ R$ 5,00" }
  ]
};
