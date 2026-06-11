// Catálogo de modelos e materiais — sincronizado com passoapassouniformes.com/tabeladeprecos

export interface ModeloInfo {
  label: string
  categoria: string
  descricao?: string
  materiais: Record<string, MaterialInfo>
}

export interface MaterialInfo {
  label: string
  cores: string[]
  obs?: string
}

export const CATALOGO: Record<string, ModeloInfo> = {

  // ── CAMISETA / BABY LOOK ─────────────────────────────────────────
  camiseta_babylook: {
    label: 'Camiseta / Baby Look',
    categoria: 'Camiseta / Baby Look',
    descricao: 'Incluso: 1 estampa serigrafia até 2 cores. Peças XG, XXG, XXXG: +30%.',
    materiais: {
      pv_premium: {
        label: 'PV Premium',
        cores: ['Preto', 'Branco', 'Azul Marinho', 'Cinza Mescla Claro', 'Cinza Mescla Escuro', 'Off White', 'Personalizada'],
      },
      pv_economi_poliester: {
        label: 'Economi 100% Poliester',
        cores: ['Preto', 'Personalizada'],
      },
      algodao_100: {
        label: '100% Algodão',
        cores: ['Preto', 'Branco', 'Off White', 'Personalizada'],
      },
      algodao_pa_metatex: {
        label: 'Algodão PA — Metatex',
        cores: ['Preto Mescla', 'Azul', 'Azul Royal', 'Verde Neon', 'Rosa Neon', 'Laranja Neon', 'Verde Floresta', 'Personalizada'],
      },
      algodao_pa_costarica: {
        label: 'Algodão PA — Costa Rica',
        cores: ['Consultar', 'Personalizada'],
        obs: 'Consultar disponibilidade de cores.',
      },
      viscolycra: {
        label: 'Viscolycra',
        cores: ['Preto', 'Personalizada'],
        obs: 'Incluso 1 logo bordado até 8 cm.',
      },
      dryfit_liso: {
        label: 'Dryfit Liso',
        cores: ['Preto', 'Branco', 'Personalizada'],
        obs: 'Outras cores consultar.',
      },
      poliamida: {
        label: 'Poliamida',
        cores: ['Preto', 'Personalizada'],
        obs: 'Outras cores consultar.',
      },
      dry_colmeia: {
        label: 'Dry Colmeia',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
      dry_jimp: {
        label: 'Dry Jimp',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
      oversize_algodao: {
        label: 'Over Size Unissex 100% Algodão',
        cores: ['Preto', 'Branco', 'Off White', 'Personalizada'],
        obs: 'Incluso 1 estampa serigrafia 2 cores.',
      },
    },
  },

  // ── CAMISETAS POLOS ──────────────────────────────────────────────
  polo: {
    label: 'Camiseta Polo',
    categoria: 'Camisetas Polos',
    descricao: 'Piquet PV: incluso 1 bordado lado esquerdo. Poliviscose / Dry Colméia: 2 estampas serigrafia 2 cores. Manga Longa: +R$22. Infantil até 14 anos: -R$5.',
    materiais: {
      piquet_pv: {
        label: 'Piquet PV',
        cores: ['Preto', 'Branco', 'Azul Marinho', 'Cinza Mescla Claro', 'Cinza Mescla Escuro', 'Personalizada'],
      },
      poliviscose: {
        label: 'Poliviscose',
        cores: ['Preto', 'Branco', 'Azul Marinho', 'Cinza Mescla Claro', 'Cinza Mescla Escuro', 'Personalizada'],
      },
      dry_fit_liso: {
        label: 'Dry Fit Liso',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
      dry_colmeia: {
        label: 'Dry Colméia',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
      piquet_economi_poliester: {
        label: 'Piquet Economi 100% Poliester',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  // ── BLUSINHA MANGA BUFANTE ───────────────────────────────────────
  manga_bufante: {
    label: 'Blusinha Manga Bufante',
    categoria: 'Blusinha Manga Bufante',
    descricao: 'Incluso: 1 bordado P. Manga Longa: +R$12. Acréscimos iguais ao Polo.',
    materiais: {
      piquet_pv_poliviscose: {
        label: 'Piquet PV / Poliviscose',
        cores: ['Preto', 'Branco', 'Azul Marinho', 'Cinza Mescla Claro', 'Cinza Mescla Escuro', 'Personalizada'],
      },
      viscolycra: {
        label: 'Viscolycra',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  // ── CALÇAS ───────────────────────────────────────────────────────
  calca_brim_sarja: {
    label: 'Calça de Brim Sarja',
    categoria: 'Calças',
    materiais: {
      brim_sarja: {
        label: 'Brim Sarja',
        cores: ['Preto', 'Azul Marinho', 'Cinza', 'Cáqui', 'Personalizada'],
      },
    },
  },

  calca_brim_sarja_refletivo: {
    label: 'Calça de Brim Sarja com Refletivo',
    categoria: 'Calças',
    materiais: {
      brim_sarja_refletivo: {
        label: 'Brim Sarja com Refletivo',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  calca_moletom_3cabos: {
    label: 'Calça de Moletom 3 Cabos',
    categoria: 'Calças',
    descricao: 'Incluso: 1 estampa 2 cores. Friso: +R$5.',
    materiais: {
      moletom_3cabos: {
        label: 'Moletom 3 Cabos',
        cores: ['Preto', 'Off White', 'Azul Marinho', 'Cinza Mescla Claro', 'Personalizada'],
        obs: 'Friso acrescenta R$5,00.',
      },
    },
  },

  calca_moletom_2cabos: {
    label: 'Calça de Moletom 2 Cabos',
    categoria: 'Calças',
    descricao: 'Incluso: 1 estampa 2 cores. Friso: +R$5.',
    materiais: {
      moletom_2cabos: {
        label: 'Moletom 2 Cabos',
        cores: ['Preto', 'Off White', 'Azul Marinho', 'Cinza Mescla Claro', 'Personalizada'],
        obs: 'Friso acrescenta R$5,00.',
      },
    },
  },

  calca_seletel_fosco: {
    label: 'Calça de Seletel Fosco Trabalhado',
    categoria: 'Calças',
    materiais: {
      seletel_fosco: {
        label: 'Seletel Fosco Trabalhado',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  calca_seletel_liso: {
    label: 'Calça de Seletel Liso',
    categoria: 'Calças',
    materiais: {
      seletel_liso: {
        label: 'Seletel Liso',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  calca_moletinho: {
    label: 'Calça de Moletinho',
    categoria: 'Calças',
    materiais: {
      moletinho: {
        label: 'Moletinho',
        cores: ['Cinza Mescla Claro', 'Preto', 'Personalizada'],
      },
    },
  },

  calca_malha_colegial: {
    label: 'Calça Malha Colegial',
    categoria: 'Calças',
    materiais: {
      malha_colegial: {
        label: 'Malha Colegial',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  calca_thermo: {
    label: 'Calça Thermo',
    categoria: 'Calças',
    materiais: {
      thermo: {
        label: 'Thermo',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  calca_moletom_economi: {
    label: 'Calça de Moletom Economi',
    categoria: 'Calças',
    materiais: {
      moletom_economi: {
        label: 'Moletom Economi',
        cores: ['Preto', 'Cinza Mescla Claro', 'Personalizada'],
      },
    },
  },

  // ── MOLETONS, BLUSA GOLA REDONDA, SUÉTER ────────────────────────
  moletom_canguru_3cabos: {
    label: 'Moletom Canguru 3 Cabos',
    categoria: 'Moletons / Blusa Gola Redonda / Suéter',
    descricao: 'Incluso 2 estampas de 2 cores. Estampa no capuz +R$5, Nome bordado +R$10.',
    materiais: {
      moletom_3cabos: {
        label: 'Moletom 3 Cabos',
        cores: ['Preto', 'Off White', 'Azul Marinho', 'Cinza Mescla Claro', 'Personalizada'],
        obs: 'Estampa no capuz +5, Nome bordado +10.',
      },
    },
  },

  moletom_canguru_2cabos: {
    label: 'Moletom Canguru 2 Cabos',
    categoria: 'Moletons / Blusa Gola Redonda / Suéter',
    descricao: 'Incluso 2 estampas de 2 cores. Estampa no capuz +R$5, Nome bordado +R$10.',
    materiais: {
      moletom_2cabos: {
        label: 'Moletom 2 Cabos',
        cores: ['Preto', 'Off White', 'Azul Marinho', 'Cinza Mescla Claro', 'Personalizada'],
        obs: 'Estampa no capuz +5, Nome bordado +10.',
      },
    },
  },

  moletom_economi: {
    label: 'Moletom Economi',
    categoria: 'Moletons / Blusa Gola Redonda / Suéter',
    materiais: {
      moletom_economi: {
        label: 'Moletom Economi',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  casaco_moletom_zipper_3cabos: {
    label: 'Casaco Moletom Canguru 3 Cabos c/ Zipper',
    categoria: 'Moletons / Blusa Gola Redonda / Suéter',
    descricao: 'Incluso 2 estampas de 2 cores. Estampa no capuz +R$5, Nome bordado +R$10.',
    materiais: {
      moletom_3cabos: {
        label: 'Moletom 3 Cabos c/ Zipper',
        cores: ['Preto', 'Off White', 'Azul Marinho', 'Cinza Mescla Claro', 'Personalizada'],
      },
    },
  },

  casaco_moletom_zipper_2cabos: {
    label: 'Casaco Moletom Canguru 2 Cabos c/ Zipper',
    categoria: 'Moletons / Blusa Gola Redonda / Suéter',
    materiais: {
      moletom_2cabos: {
        label: 'Moletom 2 Cabos c/ Zipper',
        cores: ['Preto', 'Azul Marinho', 'Cinza Mescla Claro', 'Personalizada'],
      },
    },
  },

  moletom_gola_redonda_3cabos: {
    label: 'Moletom Gola Redonda 3 Cabos',
    categoria: 'Moletons / Blusa Gola Redonda / Suéter',
    materiais: {
      moletom_3cabos: {
        label: 'Moletom 3 Cabos',
        cores: ['Preto', 'Off White', 'Azul Marinho', 'Cinza Mescla Claro', 'Personalizada'],
      },
    },
  },

  moletom_gola_redonda_2cabos: {
    label: 'Moletom Gola Redonda 2 Cabos',
    categoria: 'Moletons / Blusa Gola Redonda / Suéter',
    materiais: {
      moletom_2cabos: {
        label: 'Moletom 2 Cabos',
        cores: ['Preto', 'Azul Marinho', 'Cinza Mescla Claro', 'Personalizada'],
      },
    },
  },

  blusa_gola_redonda_malha: {
    label: 'Blusa Gola Redonda Malha Colegial',
    categoria: 'Moletons / Blusa Gola Redonda / Suéter',
    materiais: {
      malha_colegial: {
        label: 'Malha Colegial',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  sueter_soft_zipper: {
    label: 'Suéter de Soft c/ Zipper na Gola',
    categoria: 'Moletons / Blusa Gola Redonda / Suéter',
    materiais: {
      soft: {
        label: 'Soft',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  moletom_college: {
    label: 'Moletom College',
    categoria: 'Moletons / Blusa Gola Redonda / Suéter',
    materiais: {
      college: {
        label: 'College',
        cores: ['Consultar', 'Personalizada'],
        obs: 'Consultar disponibilidade.',
      },
    },
  },

  // ── JAQUETAS, JAPONA, CORTA VENTO, COLETE ───────────────────────
  jaqueta_thermo_apeluciado: {
    label: 'Jaqueta Thermo Apeluciado',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    materiais: {
      thermo: {
        label: 'Thermo Apeluciado',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  jaqueta_dry_furadinho: {
    label: 'Jaqueta Dry Furadinho c/ Dedal Fem',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    materiais: {
      dry_furadinho: {
        label: 'Dry Furadinho',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
    },
  },

  jaqueta_cropped_over_seletel: {
    label: 'Jaqueta Cropped Over Seletel',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    materiais: {
      seletel: {
        label: 'Seletel',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
    },
  },

  jaqueta_1201_fosco: {
    label: 'Jaqueta 1201 Seletel Fosco Trabalhado',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    descricao: 'Incluso: 1 estampa até 2 cores. Escudo +R$5, Nome +R$5.',
    materiais: {
      seletel_fosco: {
        label: 'Seletel Fosco Trabalhado',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  jaqueta_1201_liso: {
    label: 'Jaqueta 1201 Seletel Liso',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    descricao: 'Incluso: 1 estampa até 2 cores. Escudo +R$5, Nome +R$5.',
    materiais: {
      seletel_liso: {
        label: 'Seletel Liso',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  jaqueta_1201_impermeavel: {
    label: 'Jaqueta 1201 Seletel Impermeavel (Brilhoso)',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    materiais: {
      seletel_impermeavel: {
        label: 'Seletel Impermeavel (Brilhoso)',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  jaqueta_corta_vento_raglan_fosco: {
    label: 'Jaqueta Corta Vento Raglan c/ Capuz — Seletel Fosco Trabalhado',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    materiais: {
      seletel_fosco: {
        label: 'Seletel Fosco Trabalhado',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  jaqueta_corta_vento_raglan_liso: {
    label: 'Jaqueta Corta Vento Raglan c/ Capuz — Seletel Liso',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    materiais: {
      seletel_liso: {
        label: 'Seletel Liso',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  jaqueta_corta_vento_raglan_impermeavel: {
    label: 'Jaqueta Corta Vento Raglan c/ Capuz — Seletel Impermeavel (Brilhoso)',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    materiais: {
      seletel_impermeavel: {
        label: 'Seletel Impermeavel (Brilhoso)',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  jaqueta_corta_vento_basic_fosco: {
    label: 'Jaqueta Corta Vento Basic — Seletel Fosco Trabalhado',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    materiais: {
      seletel_fosco: {
        label: 'Seletel Fosco Trabalhado',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
    },
  },

  jaqueta_corta_vento_basic_liso: {
    label: 'Jaqueta Corta Vento Basic — Seletel Liso',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    materiais: {
      seletel_liso: {
        label: 'Seletel Liso',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
    },
  },

  jaqueta_corta_vento_basic_impermeavel: {
    label: 'Jaqueta Corta Vento Basic — Seletel Impermeavel (Brilhoso)',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    materiais: {
      seletel_impermeavel: {
        label: 'Seletel Impermeavel (Brilhoso)',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
    },
  },

  jaqueta_puffer: {
    label: 'Jaqueta Puffer',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    materiais: {
      puffer: {
        label: 'Puffer',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  colete_puffer: {
    label: 'Colete Puffer',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    materiais: {
      puffer: {
        label: 'Puffer',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  jaqueta_malha_colegial: {
    label: 'Jaqueta Malha Colegial',
    categoria: 'Jaquetas / Japona / Corta Vento / Colete',
    materiais: {
      malha_colegial: {
        label: 'Malha Colegial',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  // ── SUBLIMADOS ───────────────────────────────────────────────────
  jaqueta_sublimada_corta_vento_raglan: {
    label: 'Jaqueta Sublimada Corta Vento Raglan c/ Capuz',
    categoria: 'Sublimados',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  jaqueta_sublimada_corta_vento_basic: {
    label: 'Jaqueta Sublimada Corta Vento Basic',
    categoria: 'Sublimados',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  jaqueta_sublimada_1201: {
    label: 'Jaqueta Sublimada 1201',
    categoria: 'Sublimados',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  jaqueta_sublimada_thermo: {
    label: 'Jaqueta Sublimada Thermo',
    categoria: 'Sublimados',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  jaqueta_sublimada_soft: {
    label: 'Jaqueta Sublimada Soft',
    categoria: 'Sublimados',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  jaqueta_sublimada_colegial: {
    label: 'Jaqueta Sublimada Malha Colegial',
    categoria: 'Sublimados',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  camiseta_sublimada_manga_curta: {
    label: 'Camiseta Sublimada Manga Curta',
    categoria: 'Sublimados',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  camiseta_sublimada_manga_longa: {
    label: 'Camiseta Sublimada Manga Longa',
    categoria: 'Sublimados',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  calca_sublimada_seletel: {
    label: 'Calça Sublimada Seletel',
    categoria: 'Sublimados',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  bermuda_sublimada_seletel: {
    label: 'Bermuda Sublimada Seletel',
    categoria: 'Sublimados',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  regata_sublimada: {
    label: 'Regata Sublimada',
    categoria: 'Sublimados',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  bermuda_sublimada_futebol: {
    label: 'Bermuda Sublimada Futebol',
    categoria: 'Sublimados',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  polo_sublimada: {
    label: 'Polo Sublimada',
    categoria: 'Sublimados',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  camiseta_sublimada_dry: {
    label: 'Camiseta Sublimada Dry Liso',
    categoria: 'Sublimados',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  // ── KIT FUTEBOL ──────────────────────────────────────────────────
  calcao_fardamento: {
    label: 'Calção Fardamento',
    categoria: 'Kit Futebol',
    descricao: 'Com River +R$12, Escudo +R$5, Nome +R$5, Escudo Relevo +R$10.',
    materiais: {
      dry_liso_sublimado: {
        label: 'Dry Liso Sublimado',
        cores: ['Padrão', 'Personalizada'],
        obs: 'Com River +12, Escudo +5, Nome +5, Escudo Relevo +10.',
      },
    },
  },

  kit_futebol_basic: {
    label: 'Kit Futebol Basic Dry Liso',
    categoria: 'Kit Futebol',
    descricao: 'Kit completo: camisa + bermuda/calção.',
    materiais: {
      dry_liso: {
        label: 'Dry Liso',
        cores: ['Padrão', 'Personalizada'],
        obs: 'Escudo +5, Nome +5, Escudo Relevo +10.',
      },
    },
  },

  kit_futebol_colmeia: {
    label: 'Kit Futebol Dry Colméia',
    categoria: 'Kit Futebol',
    descricao: 'Kit completo: camisa + bermuda/calção.',
    materiais: {
      dry_colmeia: {
        label: 'Dry Colméia',
        cores: ['Padrão', 'Personalizada'],
        obs: 'Escudo +5, Nome +5, Escudo Relevo +10.',
      },
    },
  },

  kit_futebol_elastano: {
    label: 'Kit Futebol Elastano Premium',
    categoria: 'Kit Futebol',
    descricao: 'Kit completo: camisa + bermuda/calção.',
    materiais: {
      elastano: {
        label: 'Elastano Premium',
        cores: ['Padrão', 'Personalizada'],
        obs: 'Escudo +5, Nome +5, Escudo Relevo +10.',
      },
    },
  },

  // ── CONJUNTOS ────────────────────────────────────────────────────
  conjunto_jaqueta_thermo_sublimada_calca: {
    label: 'Conjunto Jaqueta Thermo Sublimada + Calça Lisa',
    categoria: 'Conjuntos',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total + Calça Lisa',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  conjunto_jaqueta_thermo_calca: {
    label: 'Conjunto Jaqueta Thermo + Calça',
    categoria: 'Conjuntos',
    materiais: {
      thermo: {
        label: 'Thermo + Calça',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  conjunto_moletom_3cabos_calca: {
    label: 'Conjunto Moletom Canguru + Calça (3 Cabos)',
    categoria: 'Conjuntos',
    materiais: {
      moletom_3cabos: {
        label: 'Moletom 3 Cabos + Calça',
        cores: ['Preto', 'Off White', 'Azul Marinho', 'Cinza Mescla Claro', 'Personalizada'],
      },
    },
  },

  conjunto_moletom_2cabos_calca: {
    label: 'Conjunto Moletom Canguru + Calça (2 Cabos)',
    categoria: 'Conjuntos',
    materiais: {
      moletom_2cabos: {
        label: 'Moletom 2 Cabos + Calça',
        cores: ['Preto', 'Azul Marinho', 'Cinza Mescla Claro', 'Personalizada'],
      },
    },
  },

  conjunto_jaqueta_1201_calca: {
    label: 'Conjunto Jaqueta 1201 + Calça',
    categoria: 'Conjuntos',
    materiais: {
      seletel_liso: {
        label: 'Seletel Liso + Calça',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  // ── BERMUDAS ─────────────────────────────────────────────────────
  bermuda_brim_sarja: {
    label: 'Bermuda Brim Sarja',
    categoria: 'Bermudas',
    materiais: {
      brim_sarja: {
        label: 'Brim Sarja',
        cores: ['Preto', 'Azul Marinho', 'Cinza', 'Cáqui', 'Personalizada'],
      },
    },
  },

  bermuda_seletel_liso: {
    label: 'Bermuda Seletel Liso',
    categoria: 'Bermudas',
    materiais: {
      seletel_liso: {
        label: 'Seletel Liso',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  bermuda_seletel_trabalhado: {
    label: 'Bermuda Seletel Trabalhado',
    categoria: 'Bermudas',
    materiais: {
      seletel_fosco: {
        label: 'Seletel Fosco Trabalhado',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  bermuda_seletel_elastano: {
    label: 'Bermuda Seletel com Elastano',
    categoria: 'Bermudas',
    materiais: {
      seletel_elastano: {
        label: 'Seletel com Elastano',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  bermuda_moletinho: {
    label: 'Bermuda Moletinho',
    categoria: 'Bermudas',
    materiais: {
      moletinho: {
        label: 'Moletinho',
        cores: ['Cinza Mescla Claro', 'Preto', 'Personalizada'],
      },
    },
  },

  bermuda_malha_colegial: {
    label: 'Bermuda Malha Colegial',
    categoria: 'Bermudas',
    materiais: {
      malha_colegial: {
        label: 'Malha Colegial',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  // ── CAMISETA MANGA LONGA ─────────────────────────────────────────
  manga_longa_pv_premium: {
    label: 'Camiseta Manga Longa PV Premium c/ Punho',
    categoria: 'Camiseta Manga Longa',
    materiais: {
      pv_premium: {
        label: 'PV Premium c/ Punho',
        cores: ['Preto', 'Branco', 'Azul Marinho', 'Cinza Mescla Claro', 'Off White', 'Personalizada'],
      },
    },
  },

  manga_longa_viscolycra: {
    label: 'Camiseta Manga Longa Viscolycra',
    categoria: 'Camiseta Manga Longa',
    materiais: {
      viscolycra: {
        label: 'Viscolycra',
        cores: ['Preto', 'Personalizada'],
        obs: 'Incluso 1 logo bordado até 8 cm.',
      },
    },
  },

  manga_longa_dry_liso: {
    label: 'Camiseta Manga Longa Dry Liso',
    categoria: 'Camiseta Manga Longa',
    materiais: {
      dry_liso: {
        label: 'Dry Liso',
        cores: ['Preto', 'Branco', 'Personalizada'],
        obs: 'Outras cores consultar.',
      },
    },
  },

  manga_longa_poliamida: {
    label: 'Camiseta Manga Longa Poliamida',
    categoria: 'Camiseta Manga Longa',
    materiais: {
      poliamida: {
        label: 'Poliamida',
        cores: ['Preto', 'Personalizada'],
        obs: 'Outras cores consultar.',
      },
    },
  },

  manga_longa_dry_colmeia: {
    label: 'Camiseta Manga Longa Dry Colméia',
    categoria: 'Camiseta Manga Longa',
    materiais: {
      dry_colmeia_punho: {
        label: 'Dry Colméia c/ Punho',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
      dry_colmeia_sem_punho: {
        label: 'Dry Colméia Sem Punho',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
    },
  },

  manga_longa_dry_elastano: {
    label: 'Camiseta Manga Longa Dry com Elastano',
    categoria: 'Camiseta Manga Longa',
    materiais: {
      dry_elastano: {
        label: 'Dry com Elastano',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  manga_longa_termico: {
    label: 'Camiseta Manga Longa Térmico',
    categoria: 'Camiseta Manga Longa',
    materiais: {
      termico: {
        label: 'Térmico',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  // ── OUTROS ───────────────────────────────────────────────────────
  jaleco_liso: {
    label: 'Jaleco Liso',
    categoria: 'Outros',
    materiais: {
      brim_oxford: {
        label: 'Brim / Oxford',
        cores: ['Branco', 'Azul Marinho', 'Preto', 'Personalizada'],
      },
    },
  },

  jaleco_com_nome: {
    label: 'Jaleco com Nome',
    categoria: 'Outros',
    materiais: {
      brim_oxford: {
        label: 'Brim / Oxford',
        cores: ['Branco', 'Azul Marinho', 'Preto', 'Personalizada'],
      },
    },
  },

  jaleco_personalizado_logo: {
    label: 'Jaleco Personalizado c/ Logo',
    categoria: 'Outros',
    materiais: {
      brim_oxford: {
        label: 'Brim / Oxford',
        cores: ['Branco', 'Azul Marinho', 'Preto', 'Personalizada'],
      },
    },
  },

  guarda_po: {
    label: 'Guarda Pó',
    categoria: 'Outros',
    materiais: {
      brim_oxford: {
        label: 'Brim / Oxford',
        cores: ['Branco', 'Azul Marinho', 'Preto', 'Personalizada'],
      },
    },
  },

  avental_basic: {
    label: 'Avental Basic',
    categoria: 'Outros',
    materiais: {
      brim: {
        label: 'Brim',
        cores: ['Preto', 'Branco', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  avental_premium: {
    label: 'Avental Premium',
    categoria: 'Outros',
    materiais: {
      brim: {
        label: 'Brim Premium',
        cores: ['Preto', 'Branco', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  sacola_tnt: {
    label: 'Sacola TNT',
    categoria: 'Outros',
    materiais: {
      tnt: {
        label: 'TNT',
        cores: ['Diversas', 'Personalizada'],
      },
    },
  },

  colete_dry_fit: {
    label: 'Colete de Dry Fit',
    categoria: 'Outros',
    materiais: {
      dry_fit: {
        label: 'Dry Fit',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
    },
  },

  toalha_lavabinho: {
    label: 'Toalha Lavabinho',
    categoria: 'Outros',
    materiais: {
      toalha: {
        label: 'Toalha',
        cores: ['Branco', 'Personalizada'],
      },
    },
  },

  // ── FITNESS ──────────────────────────────────────────────────────
  suplex_top_diana: {
    label: 'Suplex Feminino — Top Diana',
    categoria: 'Fitness',
    materiais: {
      suplex: {
        label: 'Suplex / Poliamida',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
        obs: 'Incluso 1 estampa plastisol 1 cor.',
      },
    },
  },

  fitness_top_1: {
    label: 'Top 1',
    categoria: 'Fitness',
    materiais: {
      suplex: {
        label: 'Suplex / Poliamida',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  fitness_top_2: {
    label: 'Top 2',
    categoria: 'Fitness',
    materiais: {
      suplex: {
        label: 'Suplex / Poliamida',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  fitness_top_3: {
    label: 'Top 3',
    categoria: 'Fitness',
    materiais: {
      suplex: {
        label: 'Suplex / Poliamida',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  fitness_short_cross: {
    label: 'Short Cross',
    categoria: 'Fitness',
    materiais: {
      suplex: {
        label: 'Suplex / Poliamida',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  fitness_short_bike: {
    label: 'Short Bike',
    categoria: 'Fitness',
    materiais: {
      suplex: {
        label: 'Suplex / Poliamida',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  fitness_legging: {
    label: 'Legging',
    categoria: 'Fitness',
    materiais: {
      suplex: {
        label: 'Suplex / Poliamida',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  // ── REGATAS E CROPPED ────────────────────────────────────────────
  regata_basquete: {
    label: 'Regata Basquete',
    categoria: 'Regatas e Cropped',
    descricao: 'Escudo +R$5, Nome +R$5, Escudo Relevo +R$10.',
    materiais: {
      dry_liso: {
        label: 'Dry Liso',
        cores: ['Padrão', 'Personalizada'],
        obs: 'Escudo +5, Nome +5, Escudo Relevo +10.',
      },
    },
  },

  bermuda_basquete: {
    label: 'Bermuda Basquete',
    categoria: 'Regatas e Cropped',
    descricao: 'Mesmos acréscimos da regata basquete.',
    materiais: {
      dry_liso: {
        label: 'Dry Liso',
        cores: ['Padrão', 'Personalizada'],
        obs: 'Escudo +5, Nome +5, Escudo Relevo +10.',
      },
    },
  },

  regata_tati_fem: {
    label: 'Regata Tati Fem',
    categoria: 'Regatas e Cropped',
    materiais: {
      dry_liso: {
        label: 'Dry Liso',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
    },
  },

  regata_basica: {
    label: 'Regata Básica',
    categoria: 'Regatas e Cropped',
    materiais: {
      dry_liso: {
        label: 'Dry Liso',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
    },
  },

  regata_pedro_masc: {
    label: 'Regata Pedro Masc',
    categoria: 'Regatas e Cropped',
    materiais: {
      dry_liso: {
        label: 'Dry Liso',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
    },
  },

  regata_hellem_fem: {
    label: 'Regata Hellem Fem',
    categoria: 'Regatas e Cropped',
    materiais: {
      dry_liso: {
        label: 'Dry Liso',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
    },
  },

  cropped_com_manga: {
    label: 'Cropped com Manga',
    categoria: 'Regatas e Cropped',
    materiais: {
      suplex: {
        label: 'Suplex / Poliamida',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  cropped_regata: {
    label: 'Cropped Regata',
    categoria: 'Regatas e Cropped',
    materiais: {
      suplex: {
        label: 'Suplex / Poliamida',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  cropped_manga_longa_poliamida: {
    label: 'Cropped Manga Longa Poliamida',
    categoria: 'Regatas e Cropped',
    materiais: {
      poliamida: {
        label: 'Poliamida',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  cropped_poliamida_manga_curta: {
    label: 'Cropped Poliamida Manga Curta',
    categoria: 'Regatas e Cropped',
    materiais: {
      poliamida: {
        label: 'Poliamida',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  cropped_poliamida_regata: {
    label: 'Cropped Poliamida Regata',
    categoria: 'Regatas e Cropped',
    materiais: {
      poliamida: {
        label: 'Poliamida',
        cores: ['Preto', 'Personalizada'],
      },
    },
  },

  // ── KIT FTV ──────────────────────────────────────────────────────
  kit_ftv_manga_curta: {
    label: 'Kit FTV Manga Curta e Short',
    categoria: 'Kit FTV',
    descricao: 'Kit completo: camiseta manga curta + short.',
    materiais: {
      dry_liso: {
        label: 'Dry Liso',
        cores: ['Padrão', 'Personalizada'],
      },
    },
  },

  kit_ftv_manga_longa: {
    label: 'Kit FTV Manga Longa e Short',
    categoria: 'Kit FTV',
    descricao: 'Kit completo: camiseta manga longa + short.',
    materiais: {
      dry_liso: {
        label: 'Dry Liso',
        cores: ['Padrão', 'Personalizada'],
      },
    },
  },

  // ── LINHA SOCIAL ─────────────────────────────────────────────────
  camisa_social: {
    label: 'Camisa Social',
    categoria: 'Linha Social',
    materiais: {
      social: {
        label: 'Tecido Social',
        cores: ['Branco', 'Azul', 'Preto', 'Consultar', 'Personalizada'],
      },
    },
  },
}

// Lista de categorias para agrupamento no formulário
export const CATEGORIAS = [
  'Camiseta / Baby Look',
  'Camisetas Polos',
  'Blusinha Manga Bufante',
  'Calças',
  'Moletons / Blusa Gola Redonda / Suéter',
  'Jaquetas / Japona / Corta Vento / Colete',
  'Sublimados',
  'Kit Futebol',
  'Conjuntos',
  'Bermudas',
  'Camiseta Manga Longa',
  'Outros',
  'Fitness',
  'Regatas e Cropped',
  'Kit FTV',
  'Linha Social',
]

// Mapa de cores para hex (usado no quadrado colorido do PDF)
export const COR_HEX: Record<string, string> = {
  'Preto': '#111111',
  'Branco': '#FFFFFF',
  'Off White': '#F5F0E8',
  'Cinza Claro': '#D1D5DB',
  'Cinza': '#9CA3AF',
  'Cinza Mescla': '#9CA3AF',
  'Cinza Mescla Claro': '#D1D5DB',
  'Cinza Mescla Escuro': '#6B7280',
  'Cinza Chumbo': '#4B5563',
  'Azul': '#3B82F6',
  'Azul Royal': '#2563EB',
  'Azul Marinho': '#1E3A5F',
  'Vermelho': '#DC2626',
  'Verde': '#16A34A',
  'Verde Neon': '#22C55E',
  'Verde Floresta': '#14532D',
  'Verde Floresta/Militar': '#4B5320',
  'Rosa': '#EC4899',
  'Rosa Neon': '#F472B6',
  'Laranja': '#EA580C',
  'Laranja Neon': '#FB923C',
  'Amarelo': '#EAB308',
  'Roxo': '#7C3AED',
  'Bordô': '#7F1D1D',
  'Caramelo': '#D97706',
  'Preto Mescla': '#374151',
  'Cáqui': '#B5A642',
  'Diversas': '#8B5CF6',
  'Personalizada': '#E8500A',
  'Padrão': '#6B7280',
  'Sublimação Total': '#8B5CF6',
  'Consultar': '#9CA3AF',
}
