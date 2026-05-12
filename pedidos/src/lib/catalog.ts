// Catálogo de modelos e materiais — sincronizado com passoapassouniformes.com/tabeladeprecos

export interface ModeloInfo {
  label: string
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
    descricao: 'Incluso: 1 estampa serigrafia até 2 cores. Peças acima do GG: +30%.',
    materiais: {
      pv_premium: {
        label: 'PV Premium',
        cores: ['Preto', 'Branco', 'Azul Marinho', 'Cinza Mescla Claro', 'Cinza Mescla Escuro', 'Off White', 'Personalizada'],
        obs: 'Produto pronto — tabela de medidas diferente.',
      },
      pv_economi: {
        label: 'PV Economi',
        cores: ['Preto', 'Branco', 'Azul', 'Azul Royal', 'Amarelo', 'Cinza Claro', 'Vermelho', 'Verde', 'Azul Marinho', 'Personalizada'],
        obs: 'Outras cores: mínimo 50 peças.',
      },
      algodao_100: {
        label: '100% Algodão',
        cores: ['Preto Mescla', 'Azul', 'Azul Royal', 'Verde Neon', 'Rosa Neon', 'Laranja Neon', 'Verde Floresta', 'Personalizada'],
        obs: 'Outras cores: mínimo 50 peças.',
      },
      algodao_pa_metattx: {
        label: 'Algodão PA — Metattx',
        cores: ['Preto Mescla', 'Azul', 'Azul Royal', 'Verde Neon', 'Rosa Neon', 'Laranja Neon', 'Verde Floresta', 'Personalizada'],
        obs: 'Outras cores: mínimo 50 peças.',
      },
      algodao_pa_costarica: {
        label: 'Algodão PA — Costa Rica',
        cores: ['Conferir disponibilidade', 'Personalizada'],
        obs: 'Outras cores: mínimo 50 peças.',
      },
      viscolycra: {
        label: 'Viscolycra',
        cores: ['Preto', 'Personalizada'],
        obs: 'Incluso 1 logo bordado até 8 cm.',
      },
      dryfit_liso: {
        label: 'Dryfit Liso',
        cores: ['Preto', 'Branco', 'Personalizada'],
        obs: 'Outras cores: mínimo 50 peças.',
      },
      poliamida: {
        label: 'Poliamida',
        cores: ['Preto', 'Personalizada'],
        obs: 'Produto pronto — tabela de medidas diferente.',
      },
      dry_colmeia: {
        label: 'Dry Colmeia',
        cores: ['Consultar', 'Personalizada'],
        obs: 'Outras cores: mínimo 50 peças.',
      },
      dry_jimp: {
        label: 'Dry Jimp',
        cores: ['Preto', 'Branco', 'Personalizada'],
        obs: 'Incluso 1 estampa 2 cores em plastisol.',
      },
      oversize_algodao: {
        label: 'Over Size — 100% Algodão',
        cores: ['Preto', 'Branco', 'Off White', 'Personalizada'],
        obs: 'Incluso 1 estampa serigrafia 2 cores.',
      },
    },
  },

  // ── CAMISETA POLO ────────────────────────────────────────────────
  polo: {
    label: 'Camiseta Polo',
    descricao: 'Piquet PV: incluso 1 bordado lado esquerdo. Poliviscose/Dry Liso: 2 estampas serigrafia 2 cores. Manga Longa: +R$22. Infantil até 14 anos: -R$5.',
    materiais: {
      piquet_pv: {
        label: 'Piquet PV',
        cores: ['Preto', 'Branco', 'Azul Marinho', 'Cinza Mescla Claro', 'Cinza Mescla Escuro', 'Personalizada'],
        obs: 'Veja acréscimos na tabela de personalização.',
      },
      poliviscose: {
        label: 'Poliviscose',
        cores: ['Preto', 'Branco', 'Azul Marinho', 'Cinza Mescla Claro', 'Cinza Mescla Escuro', 'Personalizada'],
      },
      dryfit_liso: {
        label: 'Dry Fit Liso',
        cores: ['Preto', 'Branco', 'Personalizada'],
      },
    },
  },

  // ── BLUSINHA MANGA BUFANTE ───────────────────────────────────────
  manga_bufante: {
    label: 'Blusinha Manga Bufante',
    descricao: 'Infantil até 14 anos. Incluso: 1 bordado P. Manga Longa: +R$12. Acréscimos iguais ao Polo.',
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

  // ── ESPORTE & FARDAMENTO ─────────────────────────────────────────
  calca_moletom: {
    label: 'Calça Moletom',
    descricao: 'Incluso: 1 estampa 2 cores. Friso: +R$5.',
    materiais: {
      moletom: {
        label: 'Moletom',
        cores: ['Preto', 'Off White', 'Azul Marinho', 'Cinza Mescla Claro', 'Cinza Mescla Escuro', 'Personalizada'],
        obs: 'Friso acrescenta R$5,00.',
      },
    },
  },

  calca_moletinho: {
    label: 'Calça Moletinho',
    descricao: 'Incluso: 1 estampa 2 cores.',
    materiais: {
      moletinho: {
        label: 'Moletinho',
        cores: ['Cinza Mescla Claro', 'Preto', 'Personalizada'],
      },
    },
  },

  regata_basquete: {
    label: 'Regata Basquete',
    descricao: 'Dry Liso. Escudo +R$5, Nome +R$5, Escudo Relevo +R$10.',
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
    descricao: 'Dry Liso. Mesmos acréscimos da Regata Basquete.',
    materiais: {
      dry_liso: {
        label: 'Dry Liso',
        cores: ['Padrão', 'Personalizada'],
        obs: 'Escudo +5, Nome +5, Escudo Relevo +10.',
      },
    },
  },

  calcao_fardamento: {
    label: 'Calção Fardamento Sublimado',
    descricao: 'Dry Liso. Com River +R$12, Escudo +R$5, Nome +R$5, Escudo Relevo +R$10.',
    materiais: {
      dry_liso: {
        label: 'Dry Liso — Sublimado',
        cores: ['Padrão', 'Personalizada'],
        obs: 'Com River +12, Escudo +5, Nome +5, Escudo Relevo +10.',
      },
    },
  },

  // ── JAQUETAS & CONJUNTOS ─────────────────────────────────────────
  corta_vento: {
    label: 'Corta Vento Sublimado',
    materiais: {
      sublimacao: {
        label: 'Sublimação Total',
        cores: ['Sublimação Total', 'Personalizada'],
      },
    },
  },

  jaqueta_1201: {
    label: 'Jaqueta 1201 Fosca',
    descricao: 'Frente Sublimada. Incluso: 1 estampa até 2 cores. Escudo +R$5, Nome +R$5.',
    materiais: {
      fosca_sublimada: {
        label: 'Fosca — Frente Sublimada',
        cores: ['Padrão', 'Personalizada'],
        obs: 'Escudo +5, Nome +5.',
      },
    },
  },

  moletom_canguru: {
    label: 'Moletom Canguru',
    descricao: 'Incluso 2 estampas de 2 cores. Estampa no capuz +R$5, Nome bordado +R$10.',
    materiais: {
      moletom: {
        label: 'Moletom',
        cores: ['Preto', 'Off White', 'Azul', 'Cinza Mescla', 'Personalizada'],
        obs: 'Estampa no capuz +5, Nome bordado +10.',
      },
    },
  },

  suplex_top: {
    label: 'Suplex Feminino — Top Diana',
    descricao: 'Incluso 1 estampa plastisol 1 cor.',
    materiais: {
      suplex: {
        label: 'Suplex',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },

  suplex_legging: {
    label: 'Suplex Feminino — Legging',
    materiais: {
      suplex: {
        label: 'Suplex',
        cores: ['Preto', 'Azul Marinho', 'Personalizada'],
      },
    },
  },
}

// Mapa de cores para hex (usado no quadrado colorido do PDF)
export const COR_HEX: Record<string, string> = {
  'Preto': '#111111',
  'Branco': '#FFFFFF',
  'Off White': '#F5F0E8',
  'Cinza Claro': '#D1D5DB',
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
  'Personalizada': '#E8500A',
  'Padrão': '#6B7280',
  'Sublimação Total': '#8B5CF6',
  'Conferir disponibilidade': '#9CA3AF',
  'Consultar': '#9CA3AF',
}
