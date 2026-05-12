/**
 * PLANO DE AÇÃO — REUNIÃO 30/03/2026
 *
 * COMO USAR:
 * 1. Acesse script.google.com
 * 2. Crie um novo projeto (Novo projeto em branco)
 * 3. Cole TODO este código substituindo o conteúdo existente
 * 4. Clique em "Executar" (▶) na função criarPlanoDeAcao
 * 5. Autorize o acesso quando solicitado
 * 6. O Google Doc será criado automaticamente no seu Google Drive
 * 7. Um link será exibido no Log (Ver > Registros)
 */

function criarPlanoDeAcao() {

  // ─── CRIA O DOCUMENTO ───────────────────────────────────────────────────────
  const doc = DocumentApp.create('📋 Plano de Ação — Reunião 30/03/2026');
  const body = doc.getBody();
  body.clear();

  // Estilos
  const AZUL_ESCURO  = '#1a3a5c';
  const VERDE_ESCURO = '#1e5631';
  const CINZA        = '#555555';
  const VERDE_CLARO  = '#d4edda';
  const AZUL_CLARO   = '#dbeafe';
  const AMARELO      = '#fff3cd';

  // ─── CABEÇALHO ──────────────────────────────────────────────────────────────
  const titulo = body.appendParagraph('📋 PLANO DE AÇÃO — REUNIÃO 30/03/2026');
  titulo.setHeading(DocumentApp.ParagraphHeading.TITLE);
  titulo.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  titulo.editAsText()
    .setForegroundColor(AZUL_ESCURO)
    .setFontSize(20)
    .setBold(true);

  body.appendParagraph('');

  // ─── RESUMO FINANCEIRO ───────────────────────────────────────────────────────
  const resumoTitulo = body.appendParagraph('📊 RESUMO FINANCEIRO — MARÇO 2026');
  resumoTitulo.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  resumoTitulo.editAsText().setForegroundColor(AZUL_ESCURO).setBold(true);

  const tabela = body.appendTable([
    ['📦 Meta Total', 'R$ 196.000'],
    ['✅ Feito',       'R$ 93.000'],
    ['⏳ Falta',       'R$ 103.000'],
    ['🚀 Vendido em 1 semana (16–25/03)', 'R$ 32.000'],
  ]);

  // Formata tabela
  tabela.setBorderWidth(1);
  for (let r = 0; r < tabela.getNumRows(); r++) {
    const row = tabela.getRow(r);
    row.getCell(0).editAsText().setBold(true).setForegroundColor(AZUL_ESCURO);
    row.getCell(1).editAsText().setBold(true).setForegroundColor(VERDE_ESCURO);
    row.getCell(0).setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(10).setPaddingRight(10);
    row.getCell(1).setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(10).setPaddingRight(10);
  }

  body.appendParagraph('');

  // ─── TAREFAS ─────────────────────────────────────────────────────────────────
  /*
   * Estrutura de cada tarefa:
   * { texto, feito, prioridade, obs }
   * - feito: true = tarefa já concluída (riscada no quadro branco)
   * - prioridade: 'alta' | 'normal' | 'definir'
   * - obs: texto adicional opcional
   */
  const tarefas = [

    // ── PRODUTOS & OPERAÇÕES ──────────────────────────────────────────────────
    {
      categoria: '🏭 PRODUTOS & OPERAÇÕES',
      cor: AZUL_CLARO,
      itens: [
        {
          texto: 'DTF: prazo de 20 dias para produção — comunicar clientes',
          feito: true,
          prioridade: 'normal',
        },
        {
          texto: 'Desconto somente após o pagamento confirmado',
          feito: true,
          prioridade: 'normal',
        },
        {
          texto: 'Regatas Poliamida — definir grade e fornecedor',
          feito: true,
          prioridade: 'normal',
        },
        {
          texto: 'Ficha técnica de produtos (todos os modelos)',
          feito: true,
          prioridade: 'normal',
        },
        {
          texto: 'Modelo Regata para Sublimar — Beach Tennis, Surf...',
          feito: false,
          prioridade: 'alta',
        },
        {
          texto: 'Manga longa térmica + sublimada — desenvolver produto',
          feito: false,
          prioridade: 'alta',
        },
        {
          texto: 'Buscar estampas e módulos de uniformes: FTV, Vôlei, Basquete... (buscar referências no Pinterest — 1 referência por rolo)',
          feito: false,
          prioridade: 'alta',
        },
        {
          texto: 'Cores de linha disponíveis: solicitar lista ao Felipe — DEFINIR quais outras 100+ estão disponíveis (mínimo de pedido)',
          feito: false,
          prioridade: 'definir',
        },
        {
          texto: 'Cores: sublimação e tecido — montar material detalhado com informações para o cliente (descrito + foto)',
          feito: false,
          prioridade: 'normal',
        },
      ],
    },

    // ── VENDAS & CHECKLIST ────────────────────────────────────────────────────
    {
      categoria: '💰 VENDAS & PROCESSOS',
      cor: VERDE_CLARO,
      itens: [
        {
          texto: 'Dificuldades na venda — levantar e documentar os principais bloqueios',
          feito: true,
          prioridade: 'normal',
        },
        {
          texto: 'Vendedora que pegar o pedido resolve do início ao fim — a venda é dela',
          feito: true,
          prioridade: 'normal',
        },
        {
          texto: 'CHECKLIST obrigatório p/ cliente aprovar o pedido: cores, tecido, tamanho, estampa, forma/produto — DEFINIR e tornar OBRIGATÓRIO',
          feito: false,
          prioridade: 'definir',
        },
        {
          texto: 'Sobre produtos de linha: não dar todas as opções ao cliente. Mostrar os ótimos. Se pedir algo que não temos, n pode mandar — treinar comunicação',
          feito: false,
          prioridade: 'alta',
        },
        {
          texto: 'Organização das vendas e comissões: cada vendedor vende, ganha comissão, o lucro vai para o Gustavo e a marca Augusto',
          feito: false,
          prioridade: 'alta',
        },
        {
          texto: 'Venda = Tempo + Aquisição + Energia — reforçar mentalidade com o time',
          feito: false,
          prioridade: 'normal',
        },
      ],
    },

    // ── MARKETING & CONTEÚDO ─────────────────────────────────────────────────
    {
      categoria: '📣 MARKETING & CONTEÚDO',
      cor: AMARELO,
      itens: [
        {
          texto: '1 vídeo engraçado por semana — responsável a definir',
          feito: false,
          prioridade: 'normal',
        },
        {
          texto: 'Datas das feiras de sábado nos próximos 3 meses — DEFINIR calendário',
          feito: false,
          prioridade: 'definir',
        },
        {
          texto: 'Produto promocional do mês por 3 meses consecutivos — DEFINIR quais produtos',
          feito: false,
          prioridade: 'definir',
        },
        {
          texto: 'Parcerias: Box, Ginásios, Academia — prospectar e fechar',
          feito: false,
          prioridade: 'alta',
        },
        {
          texto: 'Lista de influencers para promover a marca — DEFINIR e contatar',
          feito: false,
          prioridade: 'definir',
        },
        {
          texto: 'FeedBack: solicitar avaliação no Google — quem vai fazer? CASHBACK por avaliação em até 4 meses — DEFINIR responsável e regras',
          feito: false,
          prioridade: 'definir',
        },
      ],
    },

    // ── RELACIONAMENTO & GESTÃO ──────────────────────────────────────────────
    {
      categoria: '🤝 RELACIONAMENTO & GESTÃO',
      cor: '#f3e5f5',
      itens: [
        {
          texto: 'Brindes: Pano a Pano e parceiro Pedro — definir o que oferecer e quando',
          feito: false,
          prioridade: 'normal',
        },
        {
          texto: 'Marcia: manter contato diário — visita, ligação, áudio... estar por perto',
          feito: false,
          prioridade: 'alta',
        },
      ],
    },

  ];

  // ─── LEGENDA ─────────────────────────────────────────────────────────────────
  const legendaTitulo = body.appendParagraph('📌 LEGENDA');
  legendaTitulo.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  legendaTitulo.editAsText().setForegroundColor(AZUL_ESCURO).setBold(true);

  const legendaItens = [
    '☑ Tarefa concluída (riscada no quadro branco)',
    '☐ Tarefa pendente',
    '🔴 ALTA prioridade',
    '🟡 DEFINIR — precisa de decisão antes de executar',
  ];
  legendaItens.forEach(item => {
    const p = body.appendParagraph(item);
    p.setIndentStart(20);
    p.editAsText().setFontSize(11).setForegroundColor(CINZA);
  });

  body.appendParagraph('');

  // ─── GERA AS TAREFAS ─────────────────────────────────────────────────────────
  tarefas.forEach(categoria => {

    // Título da categoria
    const catTitulo = body.appendParagraph(categoria.categoria);
    catTitulo.setHeading(DocumentApp.ParagraphHeading.HEADING2);
    catTitulo.editAsText()
      .setForegroundColor(AZUL_ESCURO)
      .setBold(true)
      .setFontSize(14);

    body.appendParagraph('');

    // Itens
    categoria.itens.forEach((item, idx) => {

      // Monta prefixo
      let check  = item.feito ? '☑' : '☐';
      let emoji  = '';
      if (!item.feito) {
        if (item.prioridade === 'alta')   emoji = ' 🔴';
        if (item.prioridade === 'definir') emoji = ' 🟡 DEFINIR';
      }

      const linha = body.appendParagraph(`${check}  ${item.texto}${emoji}`);
      linha.setIndentStart(20);

      const t = linha.editAsText();
      t.setFontSize(12);

      if (item.feito) {
        // Tarefa concluída: cor verde + strikethrough
        t.setForegroundColor('#2e7d32');
        t.setStrikethrough(true);
      } else if (item.prioridade === 'alta') {
        t.setForegroundColor('#b71c1c');
        t.setBold(false);
      } else if (item.prioridade === 'definir') {
        t.setForegroundColor('#e65100');
        t.setBold(false);
      } else {
        t.setForegroundColor('#212121');
      }

      // Linha separadora leve
      if (idx < categoria.itens.length - 1) {
        body.appendParagraph('');
      }
    });

    body.appendParagraph('');
    body.appendParagraph('─────────────────────────────────────────────────────');
    body.appendParagraph('');
  });

  // ─── RODAPÉ ──────────────────────────────────────────────────────────────────
  body.appendParagraph('');
  const rodape = body.appendParagraph('Gerado automaticamente a partir da reunião de 30/03/2026 · Synkra AIOS');
  rodape.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  rodape.editAsText().setForegroundColor(CINZA).setFontSize(10).setItalic(true);

  // ─── SALVA E EXIBE LINK ───────────────────────────────────────────────────────
  doc.saveAndClose();

  const url = 'https://docs.google.com/document/d/' + doc.getId() + '/edit';
  Logger.log('✅ Documento criado com sucesso!');
  Logger.log('🔗 Link: ' + url);

  // Mostra um alerta com o link
  try {
    const ui = DocumentApp.getUi();
    ui.alert('✅ Plano de Ação Criado!\n\n🔗 Link:\n' + url);
  } catch (e) {
    // Se rodar via script editor, só mostra no log
  }

  return url;
}
