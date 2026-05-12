/**
 * PLANO DE VENDAS ABRIL 2026 — Criador de Google Docs
 *
 * COMO USAR:
 * 1. Acesse: https://script.google.com
 * 2. Clique em "Novo projeto"
 * 3. Apague o código existente e cole este script inteiro
 * 4. Clique em "Executar" (▶)
 * 5. Autorize o script quando solicitado
 * 6. O Google Doc será criado e o link aparecerá no console
 */

function criarPlanoVendas() {
  const doc = DocumentApp.create('📋 Plano de Vendas e Marketing — Abril 2026');
  const body = doc.getBody();

  // Estilo base
  const estiloTituloPrincipal = {
    [DocumentApp.Attribute.FONT_SIZE]: 22,
    [DocumentApp.Attribute.BOLD]: true,
    [DocumentApp.Attribute.FOREGROUND_COLOR]: '#1a1a2e',
  };
  const estiloSecao = {
    [DocumentApp.Attribute.FONT_SIZE]: 16,
    [DocumentApp.Attribute.BOLD]: true,
    [DocumentApp.Attribute.FOREGROUND_COLOR]: '#16213e',
  };
  const estiloSubsecao = {
    [DocumentApp.Attribute.FONT_SIZE]: 13,
    [DocumentApp.Attribute.BOLD]: true,
    [DocumentApp.Attribute.FOREGROUND_COLOR]: '#0f3460',
  };
  const estiloNormal = {
    [DocumentApp.Attribute.FONT_SIZE]: 11,
    [DocumentApp.Attribute.BOLD]: false,
    [DocumentApp.Attribute.FOREGROUND_COLOR]: '#222222',
  };
  const estiloDestaque = {
    [DocumentApp.Attribute.FONT_SIZE]: 11,
    [DocumentApp.Attribute.BOLD]: true,
    [DocumentApp.Attribute.FOREGROUND_COLOR]: '#c0392b',
  };

  function addTitulo(texto) {
    const p = body.appendParagraph(texto);
    p.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    p.setAttributes(estiloTituloPrincipal);
    return p;
  }

  function addSecao(texto) {
    body.appendParagraph('').setSpacingBefore(12);
    const p = body.appendParagraph(texto);
    p.setHeading(DocumentApp.ParagraphHeading.HEADING2);
    p.setAttributes(estiloSecao);
    return p;
  }

  function addSubsecao(texto) {
    const p = body.appendParagraph(texto);
    p.setHeading(DocumentApp.ParagraphHeading.HEADING3);
    p.setAttributes(estiloSubsecao);
    return p;
  }

  function addTexto(texto) {
    const p = body.appendParagraph(texto);
    p.setAttributes(estiloNormal);
    return p;
  }

  function addDestaque(texto) {
    const p = body.appendParagraph(texto);
    p.setAttributes(estiloDestaque);
    return p;
  }

  function addTarefa(texto) {
    const p = body.appendParagraph('☐  ' + texto);
    p.setAttributes(estiloNormal);
    p.setIndentStart(20);
    return p;
  }

  function addSeparador() {
    const p = body.appendParagraph('─────────────────────────────────────────────────────');
    p.setAttributes({
      [DocumentApp.Attribute.FONT_SIZE]: 10,
      [DocumentApp.Attribute.FOREGROUND_COLOR]: '#cccccc',
    });
    return p;
  }

  // ══════════════════════════════════════════════
  // CABEÇALHO
  // ══════════════════════════════════════════════
  addTitulo('📋 PLANO DE EXECUÇÃO COMERCIAL — ABRIL 2026');
  addTexto('Loja de Uniformes Personalizados  |  Meta: R$250.000');
  addDestaque('Situação: R$30K feitos (dia 9/04). Faltam R$220K em 21 dias.');
  addSeparador();

  // ══════════════════════════════════════════════
  // PARTE 0 — DIAGNÓSTICO
  // ══════════════════════════════════════════════
  addSecao('🔍 DIAGNÓSTICO — O que está errado agora');
  addTexto('Leads chegando com intenção real de compra. O problema NÃO é geração de demanda — é conversão e organização da equipe.');
  body.appendParagraph('');
  addTexto('❌  Diretor focou em atender ele mesmo no WhatsApp → gargalo humano, 1 pessoa não escala');
  addTexto('❌  Sem ritmo de follow-up estruturado → leads esfriando, perdendo vendas prontas');
  addTexto('❌  Sem processo claro de fechamento → orçamentos enviados, sem empurrar para o SIM');
  addTexto('❌  Sem cultura de metas diárias na equipe → cada um faz o que acha melhor');
  addTexto('❌  CRM sendo usado mas sem pipeline definido → dados sem direção');
  addSeparador();

  // ══════════════════════════════════════════════
  // PARTE 1 — MATEMÁTICA DA META
  // ══════════════════════════════════════════════
  addSecao('📊 MATEMÁTICA DA META');
  addTexto('Meta total: R$250.000');
  addTexto('Feito até 09/04: R$30.000');
  addTexto('Restante: R$220.000 em ~21 dias');
  addTexto('Meta diária: R$12.200/dia');
  addTexto('Ticket médio estimado: R$2.500 (kit 30-50 peças)');
  addTexto('Fechamentos necessários por dia: ~5 vendas/dia');
  addSeparador();

  // ══════════════════════════════════════════════
  // PARTE 2 — REESTRUTURAÇÃO IMEDIATA
  // ══════════════════════════════════════════════
  addSecao('🚨 PARTE 2 — AÇÕES IMEDIATAS (Fazer HOJE)');

  addSubsecao('2.1 — Reunião de reestruturação da equipe');
  addTarefa('Reunir toda a equipe e apresentar a meta e o novo processo');
  addTarefa('Tirar o Diretor da linha de atendimento — ele vira gestor do processo');
  addTarefa('Definir quem é SDR (qualifica e envia orçamento) e quem é Closer (fecha)');
  addTarefa('Comunicar papéis claros: ninguém improvisa mais');

  addSubsecao('2.2 — Reativação do pipeline existente (PRIORIDADE #1)');
  addDestaque('Abrir o CRM e listar TODOS os orçamentos enviados nos últimos 30 dias que não fecharam');
  addTarefa('Exportar lista de leads com orçamento enviado e sem resposta/sem fechamento');
  addTarefa('Enviar mensagem de reativação para TODOS ainda hoje:');
  addTexto('     💬 "Oi [nome]! Estamos com campanha especial de abril — pra pedidos fechados até dia 25, tenho uma condição especial. Posso te mandar?"');
  addTarefa('Registrar respostas no CRM imediatamente');
  addDestaque('Meta: 100 leads inativos × 10% reativação = 10 vendas = ~R$25.000 só hoje');

  addSubsecao('2.3 — Estruturar CRM com as 6 etapas do funil');
  addTarefa('Criar etapa 1: LEAD NOVO');
  addTarefa('Criar etapa 2: QUALIFICADO');
  addTarefa('Criar etapa 3: ORÇAMENTO ENVIADO');
  addTarefa('Criar etapa 4: EM NEGOCIAÇÃO');
  addTarefa('Criar etapa 5: FECHADO ✅');
  addTarefa('Criar etapa 6: PERDIDO ❌ (com campo de motivo)');
  addSeparador();

  // ══════════════════════════════════════════════
  // PARTE 3 — PROCESSO DE VENDAS
  // ══════════════════════════════════════════════
  addSecao('🔁 PARTE 3 — PROCESSO DE VENDAS (instalar essa semana)');

  addSubsecao('3.1 — As 3 perguntas obrigatórias de qualificação (antes de qualquer orçamento)');
  addTarefa('Treinar equipe na pergunta 1: "Qual a quantidade de peças que você precisa?"');
  addTarefa('Treinar equipe na pergunta 2: "Você tem prazo de entrega? É para quando?"');
  addTarefa('Treinar equipe na pergunta 3: "É para empresa, time ou evento?"');
  addTexto('     ⚡ Quem não qualifica, trabalha dobrado para fechar metade (G4 Vendas)');

  addSubsecao('3.2 — Sequência dos 5 toques de follow-up (instalar agora)');
  addDestaque('A maioria das vendas acontece entre o 4º e 7º contato. Vendedores param no 2º.');
  addTarefa('DIA 0 — Enviar orçamento com prazo de validade de 48h');
  addTarefa('DIA 1 — WhatsApp: "Conseguiu ver o orçamento? Posso ajudar com alguma dúvida?"');
  addTarefa('DIA 2 — WhatsApp: Enviar foto de pedido similar entregue + depoimento de cliente');
  addTarefa('DIA 2 — Se não respondeu: tentar pelo Instagram Direct');
  addTarefa('DIA 4 — WhatsApp: "Nosso prazo de produção é X dias. Se fechar até [data] garanto entrega no prazo"');
  addTarefa('DIA 6 — Ligação + WhatsApp: "Posso te ajudar a fechar hoje? Tenho condição especial válida até amanhã"');

  addSubsecao('3.3 — Gatilhos de fechamento (scripts prontos para usar)');
  addTarefa('Treinar equipe no gatilho de escassez de prazo: "Agenda de produção de abril está quase cheia. Se quiser entrega esse mês, preciso confirmar até amanhã."');
  addTarefa('Treinar equipe no gatilho de desconto real: "Para pedidos fechados essa semana, consigo [X% de desconto / brinde de peças / frete grátis]"');
  addTarefa('Treinar equipe no gatilho de facilidade: "Pode parcelar no cartão em até 3x sem juros, ou Pix à vista com desconto"');
  addTarefa('Treinar equipe no gatilho de prova social: "Acabamos de entregar um kit para empresa similar. Tenho fotos aqui para você ver."');
  addSeparador();

  // ══════════════════════════════════════════════
  // PARTE 4 — RITUAIS DA EQUIPE
  // ══════════════════════════════════════════════
  addSecao('👥 PARTE 4 — RITUAIS DA EQUIPE (cultura G4)');

  addSubsecao('4.1 — Daily de Vendas (todo dia 8h30 — 15 minutos)');
  addTarefa('Marcar daily recorrente no calendário para 8h30 todo dia útil');
  addTarefa('Definir formato: cada vendedor responde — quantos orçamentos enviei / quantos follow-ups fiz / quantas vendas fechei');
  addTarefa('Fazer pipeline review: quais leads estão quentes hoje / quais estão travados');
  addTarefa('Anunciar a meta do dia: "Nossa meta hoje é X fechamentos. Quem vai buscar isso?"');
  addTarefa('Celebrar cada venda fechada no grupo (criar cultura de comemoração)');

  addSubsecao('4.2 — Reunião semanal (segunda-feira 9h — 30 minutos)');
  addTarefa('Fazer review da semana anterior: meta vs realizado');
  addTarefa('Revisar pipeline completo no CRM com toda equipe');
  addTarefa('Fazer treinamento de 10 min (técnica de fechamento ou objeção do momento)');
  addTarefa('Definir foco da semana com meta clara');

  addSubsecao('4.3 — Placar de vendas visível');
  addTarefa('Criar placar físico ou digital atualizado todo dia');
  addTarefa('Exibir: vendas do dia / vendas da semana / vendas do mês vs meta R$250K');
  addTarefa('Criar bônus de sprint: R$500 por vendedor se bater R$200K / R$1.000 se bater R$250K / R$1.500 se bater R$300K');
  addSeparador();

  // ══════════════════════════════════════════════
  // PARTE 5 — CAMPANHAS DE MARKETING
  // ══════════════════════════════════════════════
  addSecao('📣 PARTE 5 — CAMPANHAS DE MARKETING (21 dias)');

  addSubsecao('5.1 — Campanha "Fechamento de Abril" (reativação de leads frios)');
  addTarefa('Listar todos os leads com orçamento enviado nos últimos 30 dias no CRM');
  addTarefa('Enviar mensagem de reativação para todos (script acima, seção 2.2)');
  addTarefa('Fazer follow-up com os que responderam dentro de 1h');
  addTarefa('Registrar resultado de cada reativação no CRM');

  addSubsecao('5.2 — Campanha de Indicação (base de clientes que já compraram)');
  addTarefa('Listar todos os clientes que compraram nos últimos 6 meses');
  addTarefa('Enviar mensagem de indicação: "Se você indicar uma empresa que feche conosco, você ganha [X peças extras / desconto no próximo pedido]"');
  addTarefa('Acompanhar indicações recebidas e priorizar esses leads');
  addDestaque('Lead indicado converte 4x mais rápido e tem ticket 20% maior');

  addSubsecao('5.3 — Stories no Instagram (conteúdo diário de fechamento)');
  addTarefa('Postar story diário "Saiu do forno" — foto de entrega recente');
  addTarefa('Postar 3x por semana depoimento de cliente (print ou vídeo curto)');
  addTarefa('Postar 2x por semana "Agenda de abril quase cheia" (escassez real)');
  addTarefa('Postar 2x por semana bastidores — pedido sendo personalizado');
  addTarefa('Postar 2x por semana oferta do dia com CTA direto');
  addTarefa('Manter CTA fixo em todo story: "Quer orçamento? Link na bio ou responde esse story"');

  addSubsecao('5.4 — Oferta especial de abril (prazo real)');
  addTarefa('Criar oferta: pedidos acima de 30 peças fechados até 25/04 ganham frete grátis + 2 peças extras');
  addTarefa('Comunicar a oferta para toda a equipe de vendas');
  addTarefa('Usar a oferta em todos os follow-ups a partir de agora');
  addTarefa('Divulgar nos stories com contagem regressiva');

  addSubsecao('5.5 — Tráfego pago (se tiver orçamento)');
  addTarefa('Definir budget mínimo: R$50/dia');
  addTarefa('Criar criativo: vídeo de entrega + depoimento + CTA direto para WhatsApp/Direct');
  addTarefa('Segmentar: gestores de empresa, RH, donos de times, coordenadores de escola');
  addTarefa('Monitorar CPL (custo por lead) e taxa de conversão semanalmente');
  addTarefa('Meta: 10-15 leads novos qualificados por dia');
  addSeparador();

  // ══════════════════════════════════════════════
  // PARTE 6 — PLANO SEMANA A SEMANA
  // ══════════════════════════════════════════════
  addSecao('🗓️ PARTE 6 — PLANO SEMANA A SEMANA');

  addSubsecao('SEMANA 1 — 09 a 13/04 | META: R$50.000 | FOCO: Choque de Ordem');
  addTarefa('[09/04] Reunir equipe e redefinir papéis (Diretor sai da linha)');
  addTarefa('[09/04] Enviar mensagem de reativação para TODOS os leads frios do CRM');
  addTarefa('[09/04] Estruturar as 6 etapas do funil no CRM');
  addTarefa('[10/04] Primeira daily às 8h30 — estabelecer o ritual');
  addTarefa('[10/04] Treinar equipe nos 5 toques de follow-up');
  addTarefa('[10/04] Treinar equipe nas 3 perguntas de qualificação');
  addTarefa('[10/04] Iniciar posts diários de stories (saída de pedidos, bastidores)');
  addTarefa('[11/04] Revisar CRM: mover todos os leads para a etapa correta do funil');
  addTarefa('[13/04] Reunião semanal: review semana 1 vs meta R$50K');

  addSubsecao('SEMANA 2 — 14 a 20/04 | META: R$80.000 | FOCO: Aceleração');
  addTarefa('[14/04] Lançar campanha de indicação para base de clientes');
  addTarefa('[14/04] Lançar oferta especial de abril (frete grátis + peças extras até 25/04)');
  addTarefa('[14/04] Ativar tráfego pago se orçamento disponível');
  addTarefa('[15/04] Continuar daily todo dia 8h30');
  addTarefa('[16/04] Postar story com oferta especial e contagem regressiva');
  addTarefa('[17/04] Ligar (não só WhatsApp) para os 20 leads mais quentes do CRM');
  addTarefa('[20/04] Reunião semanal: review semana 2, ajustar abordagem se necessário');

  addSubsecao('SEMANA 3 — 21 a 30/04 | META: R$90.000 | FOCO: Sprint Final');
  addTarefa('[21/04] Ativar gatilho real: "Calendário de produção fecha dia 25"');
  addTarefa('[21/04] Double follow-up nos leads mais quentes (2 toques por dia)');
  addTarefa('[22/04] Ligar pessoalmente para os 10 maiores tickets em negociação');
  addTarefa('[23/04] Oferta de último minuto: desconto ou brinde para fechar até 25/04');
  addTarefa('[25/04] Sprint final — meta do dia: máximo de fechamentos possível');
  addTarefa('[28/04] Levantar total acumulado e ajustar plano para os 2 dias restantes');
  addTarefa('[30/04] Fechamento do mês — compilar resultados, celebrar com a equipe');
  addSeparador();

  // ══════════════════════════════════════════════
  // PARTE 7 — CULTURA E MENSAGEM PARA O TIME
  // ══════════════════════════════════════════════
  addSecao('💬 PARTE 7 — CULTURA E MENSAGEM PARA O TIME');

  addSubsecao('Os 5 princípios G4 de alta performance em vendas');
  addTexto('1. 📊 "Números contam histórias" — Toda decisão baseada em dados do CRM, não em feeling');
  addTexto('2. ⏰ "Ritmo é sagrado" — Daily acontece TODO dia, sem exceção');
  addTexto('3. 🎉 "Celebrar pequeno para conquistar grande" — Cada venda é comemorada no grupo');
  addTexto('4. ⚡ "Feedback imediato" — Perdeu uma venda? Análise no mesmo dia');
  addTexto('5. 🎯 "Todos sabem a meta" — O placar é público, o time se cobra junto');

  body.appendParagraph('');
  addSubsecao('Mensagem para enviar para a equipe hoje');
  addTexto('"Pessoal, a partir de hoje a gente muda a forma como a gente trabalha. Nossa meta é R$250K esse mês. Já fizemos R$30K. Faltam R$220K em 21 dias. Isso é possível — mas só se cada um de nós fizer sua parte com disciplina. Todo dia às 8h30 a gente se fala. Todo orçamento tem follow-up. Toda venda é comemorada. Cada um aqui é responsável pelo número do time. Vamos juntos."');

  addSubsecao('Tabela de bônus de sprint (criar hoje)');
  addTarefa('Comunicar: se bater R$200K → R$500 de bônus por vendedor');
  addTarefa('Comunicar: se bater R$250K → R$1.000 de bônus por vendedor');
  addTarefa('Comunicar: se bater R$300K+ → R$1.500 de bônus por vendedor');
  addSeparador();

  // ══════════════════════════════════════════════
  // PARTE 8 — MÉTRICAS QUE TODO VENDEDOR DEVE CONHECER
  // ══════════════════════════════════════════════
  addSecao('📈 PARTE 8 — MÉTRICAS QUE TODO VENDEDOR DEVE CONHECER');
  addTexto('Acompanhar essas métricas semanalmente no CRM. Sem dado, não tem decisão.');
  body.appendParagraph('');
  addSubsecao('8.1 — Tabela de KPIs individuais');
  addTexto('Taxa de qualificação       →  Leads contatados vs qualificados           →  META: > 70%');
  addTexto('Taxa de proposta           →  Qualificados vs orçamento enviado          →  META: > 80%');
  addTexto('Taxa de fechamento         →  Orçamentos enviados vs pedidos fechados    →  META: > 30%');
  addTexto('Tempo de resposta          →  Primeiro contato após lead entrar          →  META: < 15 minutos');
  addTexto('Ciclo médio de venda       →  Do lead até o pagamento confirmado         →  META: < 5 dias');
  addTexto('Ticket médio               →  Valor médio por pedido fechado             →  META: R$ 2.500+');
  body.appendParagraph('');
  addDestaque('Regra de ouro: quem não mede, não melhora. Cada vendedor deve saber seus números de cabeça toda semana.');
  addSeparador();

  // ══════════════════════════════════════════════
  // PARTE 9 — CRM: COMO USAR PARA FECHAR, NÃO SÓ REGISTRAR
  // ══════════════════════════════════════════════
  addSecao('🗂️ PARTE 9 — CRM: COMO USAR PARA FECHAR, NÃO SÓ REGISTRAR');
  addTexto('O CRM está sendo usado mas sem direção. Veja como transformar em máquina de fechamento.');

  addSubsecao('9.1 — Etapas obrigatórias no pipeline (nunca pular etapa)');
  addTexto('[ 1. LEAD NOVO ]  →  [ 2. QUALIFICADO ]  →  [ 3. ORÇAMENTO ENVIADO ]  →  [ 4. EM NEGOCIAÇÃO ]  →  [ 5. FECHADO ✅ ] / [ 6. PERDIDO ❌ ]');
  body.appendParagraph('');

  addSubsecao('9.2 — Regras de higiene do CRM (inegociáveis)');
  addTarefa('Todo lead novo: resposta obrigatória em até 15 minutos — sem exceção');
  addTarefa('Todo orçamento enviado: entra automaticamente na sequência dos 5 toques de follow-up');
  addTarefa('Todo lead parado há mais de 5 dias sem resposta: trazer para a daily e definir próximo passo');
  addTarefa('Todo lead "perdido": registrar o motivo — preço, prazo, concorrente, sem resposta (vira inteligência de mercado)');
  addTarefa('Nunca fechar o WhatsApp sem atualizar o status no CRM — lead sem status = lead perdido');

  addSubsecao('9.3 — Reunião de pipeline semanal (30 min com o Diretor)');
  addTarefa('Todo vendedor apresenta: quantos leads em cada etapa do funil');
  addTarefa('Todo vendedor aponta: quais estão mais quentes (devem fechar essa semana)');
  addTarefa('Todo vendedor traz: quais estão travados e precisam de ação diferente');
  addTarefa('Diretor define: qual lead precisa de abordagem especial (ligação, visita, desconto)');
  addDestaque('Reunião de pipeline é o momento de transformar "acho que vai fechar" em plano de ação concreto.');
  addSeparador();

  // ══════════════════════════════════════════════
  // RESUMO EXECUTIVO — O QUE FAZER AGORA
  // ══════════════════════════════════════════════
  addSecao('🚀 RESUMO EXECUTIVO — O QUE FAZER AGORA');

  addSubsecao('Nas próximas 4 horas (hoje mesmo):');
  addTarefa('Reunir a equipe e apresentar a meta e o novo processo');
  addTarefa('Abrir o CRM e listar todos os orçamentos enviados nos últimos 30 dias que não fecharam');
  addTarefa('Iniciar a reativação: enviar a mensagem de reativação para TODOS esses leads ainda hoje');
  addTarefa('Definir quem é o SDR e quem é o Closer — Diretor sai da linha de atendimento');
  addTarefa('Marcar a primeira daily para amanhã às 8h30 no calendário de todos');
  addTarefa('Postar um story mostrando pedido saindo ou em produção com CTA direto');

  addSubsecao('Essa semana (até 13/04):');
  addTarefa('Estruturar CRM com as 6 etapas obrigatórias do funil');
  addTarefa('Treinar toda a equipe na sequência dos 5 toques de follow-up');
  addTarefa('Lançar campanha de indicação para base de clientes que já compraram');
  addTarefa('Criar e comunicar a oferta especial de abril (ex: frete grátis + peças extras até 25/04)');
  addTarefa('Atingir R$ 50.000 até sexta-feira 13/04 — esse é o termômetro da semana');
  body.appendParagraph('');
  addDestaque('Lembre: a torneira de leads está aberta. O problema é o cano furado antes de chegar no cliente. Feche o cano. Os leads estão prontos para comprar.');
  addSeparador();

  // ══════════════════════════════════════════════
  // RODAPÉ
  // ══════════════════════════════════════════════
  body.appendParagraph('');
  addTexto('📌 Documento gerado automaticamente via Google Apps Script');
  addTexto('✅ Marque cada caixa (☐) conforme for concluindo as tarefas');
  addTexto('📅 Atualizado em: ' + new Date().toLocaleDateString('pt-BR'));

  // Salvar e retornar link
  doc.saveAndClose();

  const url = 'https://docs.google.com/document/d/' + doc.getId() + '/edit';
  Logger.log('✅ Documento criado com sucesso!');
  Logger.log('🔗 Acesse aqui: ' + url);

  // Mostrar popup com o link
  const ui = DocumentApp.getUi ? DocumentApp.getUi() : null;

  return url;
}
