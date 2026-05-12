/**
 * Rex — Daily Stories Scheduler
 * Passo a Passo Uniformes
 * Cronograma de stories: 6 horários, PDF imprimível, email às 7h
 */

'use strict';

const nodemailer  = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs          = require('fs');
const path        = require('path');
const axios       = require('axios');
require('dotenv').config();

// ─────────────────────────────────────────────
// EMPRESA
// ─────────────────────────────────────────────
const E = {
  nome:      'Passo a Passo Uniformes',
  cidade:    'Novo Hamburgo, RS',
  cobertura: '~40 km — Vale dos Sinos',
  anos:      '+30 anos',
  whatsapp:  '(51) 98560-0893',
  instagram: '@passoapassouniformes',
  site:      'passoapasso.com.br',
  cor:       '#C85A00',
  pedidoMin: '10 peças',
};

// ─────────────────────────────────────────────
// CALENDÁRIO DE DATAS ESPECIAIS
// ─────────────────────────────────────────────
const DATAS_ESPECIAIS = {
  '01-01': { nome: 'Ano Novo', emoji: '🎊', tags: '#AnoNovo #2026 #NovoAno' },
  '02-02': { nome: 'Dia de Iemanjá', emoji: '🌊', tags: '#Iemanjá #Cultura' },
  '04-02': { nome: 'Dia Mundial do Câncer', emoji: '💛', tags: '#DiaMundialDoCancer #LutandoJuntos' },
  '08-03': { nome: 'Dia Internacional da Mulher', emoji: '💜', tags: '#DiaInternacionalDaMulher #Mulheres #8M' },
  '21-03': { nome: 'Dia Internacional da Síndrome de Down', emoji: '💛💙', tags: '#SindromeDeDown #Inclusão' },
  '22-03': { nome: 'Dia Mundial da Água', emoji: '💧', tags: '#DiaAguaMundial #MeioAmbiente' },
  '01-04': { nome: 'Dia da Mentira', emoji: '😂', tags: '#DiaDaMentira #Humor' },
  '02-04': { nome: 'Dia Mundial do Autismo', emoji: '💙', tags: '#DiaDoAutismo #Azul #Inclusão' },
  '07-04': { nome: 'Dia Mundial da Saúde', emoji: '💚', tags: '#DiaMundialDaSaude #Saude' },
  '21-04': { nome: 'Tiradentes', emoji: '🇧🇷', tags: '#Tiradentes #FeriadoNacional' },
  '22-04': { nome: 'Dia da Terra', emoji: '🌍', tags: '#DiadaTerra #Sustentabilidade' },
  '01-05': { nome: 'Dia do Trabalhador', emoji: '✊', tags: '#DiaDoTrabalhador #1deMaio' },
  '11-05': { nome: 'Dia das Mães', emoji: '🌷', tags: '#DiaDasMaes #Maes' },
  '12-05': { nome: 'Dia Internacional da Enfermagem', emoji: '🩺', tags: '#DiaDaEnfermagem #Saude' },
  '01-06': { nome: 'Dia Internacional da Criança', emoji: '🧒', tags: '#DiaDaCriança #Infância' },
  '05-06': { nome: 'Dia Mundial do Meio Ambiente', emoji: '🌿', tags: '#MeioAmbiente #Verde' },
  '12-06': { nome: 'Dia dos Namorados', emoji: '❤️', tags: '#DiaDosNamorados #Amor' },
  '07-09': { nome: 'Independência do Brasil', emoji: '🇧🇷', tags: '#IndependênciadoBrasil #7deSetembro' },
  '15-09': { nome: 'Dia do Cliente', emoji: '🤝', tags: '#DiaDoClinete #Gratidão' },
  '12-10': { nome: 'Dia das Crianças', emoji: '🎈', tags: '#DiaDasCriancas' },
  '15-10': { nome: 'Dia do Professor', emoji: '📚', tags: '#DiaDoProfessor #Educacao' },
  '20-11': { nome: 'Dia da Consciência Negra', emoji: '✊🏿', tags: '#ConsciênciaNegra #Novembro' },
  '25-12': { nome: 'Natal', emoji: '🎄', tags: '#Natal #FelizNatal' },
  '31-12': { nome: 'Réveillon', emoji: '🎆', tags: '#Reveillon #ViradaDeAno' },
};

// ─────────────────────────────────────────────
// BANCO DE CONTEÚDO — 8H (BOM DIA MOTIVACIONAL)
// ─────────────────────────────────────────────
const BANCO_8H = [
  {
    frase:   '"A fé move montanhas. Mas é você que tem que pegar a pá." — Chico Xavier',
    subtema: 'Fé e ação',
    reacao:  '❤️ Diz um Amém | 😅 Pega a pá',
    foto:    'Fundo laranja #C85A00 + frase em branco, logo no rodapé',
  },
  {
    frase:   '"O sucesso é a soma de pequenos esforços repetidos dia após dia." — Robert Collier',
    subtema: 'Consistência',
    reacao:  '🔥 Foco total | 😴 Hoje não',
    foto:    'Fundo escuro + tipografia bold branca + emoji ✨',
  },
  {
    frase:   '"Você é capaz de muito mais do que imagina." — Augusto Cury',
    subtema: 'Autoconfiança',
    reacao:  'Enquete: Você acredita no seu potencial? SIM / EM CONSTRUÇÃO',
    foto:    'Foto da equipe Passo a Passo com frase sobreposta',
  },
  {
    frase:   '"Deus não escolhe os capacitados — Ele capacita os escolhidos." — Provérbio bíblico',
    subtema: 'Fé',
    reacao:  '🙏 Amém | 💪 Força!',
    foto:    'Fundo com textura dourada + frase em negrito',
  },
  {
    frase:   '"Não espere por uma crise para descobrir o que é importante em sua vida." — Platão',
    subtema: 'Prioridades',
    reacao:  'Caixa: O que é mais importante pra você hoje?',
    foto:    'Fundo preto clean + frase em branco e detalhe laranja',
  },
  {
    frase:   '"Cada manhã traz novas oportunidades — use-as com coragem." — Nelson Mandela',
    subtema: 'Coragem',
    reacao:  '🌅 Acorda! | 😴 5 minutos mais...',
    foto:    'Imagem amanhecer + frase sobreposta',
  },
  {
    frase:   '"A persistência é o caminho do êxito." — Charles Chaplin',
    subtema: 'Persistência',
    reacao:  '💪 Persisto sempre | 🏳️ Às vezes desisto',
    foto:    'Foto de uniforme sendo costurado + frase',
  },
  {
    frase:   '"Faça o que você pode, com o que você tem, onde você está." — Theodore Roosevelt',
    subtema: 'Pragmatismo',
    reacao:  'Enquete: Hoje você vai dar o seu melhor? SIM / Tentarei',
    foto:    'Fundo laranja + ícone ⚡ + frase',
  },
  {
    frase:   '"Comece onde você está. Use o que você tem. Faça o que você pode." — Arthur Ashe',
    subtema: 'Começo',
    reacao:  '🚀 Comecei! | ⏳ Ainda preparando',
    foto:    'Fundo gradiente escuro para laranja + frase centralizada',
  },
  {
    frase:   '"Sonhos não determinam onde você vai; somente seu trabalho leva até lá." — Will Smith',
    subtema: 'Trabalho e sonhos',
    reacao:  '💼 Trabalho duro | 🌙 Sonho alto',
    foto:    'Foto interna da loja com frase sobreposta',
  },
  {
    frase:   '"A gratidão transforma o que temos em suficiente." — Melody Beattie',
    subtema: 'Gratidão',
    reacao:  '🙏 Gratidão | ❤️ Amei isso',
    foto:    'Fundo claro suave + frase em lettering',
  },
  {
    frase:   '"Não é o quanto você faz, mas quanto amor você coloca no que faz." — Madre Teresa',
    subtema: 'Propósito',
    reacao:  '❤️ Com amor | 💼 No trabalho',
    foto:    'Detalhe de costura/bordado + frase sobreposta',
  },
  {
    frase:   '"Acordar cedo é o primeiro passo para conquistar o dia." — Robin Sharma',
    subtema: 'Disciplina',
    reacao:  '⏰ Já acordei! | 😴 Me liga às 10h',
    foto:    'Fundo com relógio + frase em destaque',
  },
  {
    frase:   '"A qualidade não é um ato, mas sim um hábito." — Aristóteles',
    subtema: 'Qualidade',
    reacao:  '🎯 Qualidade sempre | 😅 Ainda aprendendo',
    foto:    'Foto detalhe tecido/bordado de qualidade + frase',
  },
  {
    frase:   '"Você nunca é velho demais para sonhar um novo sonho." — C. S. Lewis',
    subtema: 'Sonhos',
    reacao:  '🌟 Novo sonho ativo | 💭 Ainda sonhando o mesmo',
    foto:    'Fundo azul noite + estrelas + frase branca',
  },
  {
    frase:   '"O maior de todos os dons é amar e ser amado." — Papa Francisco',
    subtema: 'Amor',
    reacao:  '❤️ Amei | 🙌 Verdade!',
    foto:    'Fundo rosé suave + frase em cursiva + detalhe laranja',
  },
  {
    frase:   '"Não existe elevador para o sucesso. Você tem que pegar as escadas." — Zig Ziglar',
    subtema: 'Esforço',
    reacao:  '🏃 Subindo | 🛗 Queria o elevador',
    foto:    'Fundo laranja intenso + frase em bold branco',
  },
  {
    frase:   '"A vida é 10% do que acontece com você e 90% de como você reage." — Charles Swindoll',
    subtema: 'Atitude',
    reacao:  '💪 Controlo minha reação | 😅 Às vezes perco o controle',
    foto:    'Fundo neutro + infográfico 10% / 90% com cores da marca',
  },
  {
    frase:   '"Deus está nos detalhes." — Warburg (e todo bordado Passo a Passo confirma!)',
    subtema: 'Detalhes',
    reacao:  '🧵 Nos detalhes | ❤️ Amei a referência',
    foto:    'Close em bordado/estampa da Passo a Passo + frase',
  },
  {
    frase:   '"Seja você mesmo; todos os outros já existem." — Oscar Wilde',
    subtema: 'Autenticidade',
    reacao:  'Caixa: Uma palavra que te define hoje?',
    foto:    'Fundo preto + frase branca + detalhe laranja',
  },
  {
    frase:   '"A coragem não é ausência de medo — é agir mesmo com medo." — Nelson Mandela',
    subtema: 'Coragem',
    reacao:  '🔥 Age mesmo com medo | 🤝 Preciso de apoio',
    foto:    'Frase em destaque sobre fundo de textura cinza',
  },
  {
    frase:   '"Cada pedido entregue é um pedaço do nosso coração 🧡" — Equipe Passo a Passo',
    subtema: 'Propósito da empresa',
    reacao:  '🧡 Sentiu isso! | 👏 Que lindo!',
    foto:    'Foto de entrega de pedido + equipe sorrindo',
  },
  {
    frase:   '"Não é o ambiente que nos define — somos nós que definimos o ambiente." — Viktor Frankl',
    subtema: 'Ambiente e atitude',
    reacao:  '💪 Defino meu ambiente | 🤔 Pensando nisso',
    foto:    'Foto interna da loja organizada + frase',
  },
  {
    frase:   '"Oração e trabalho juntos movem o mundo." — Provérbio cristão',
    subtema: 'Fé e trabalho',
    reacao:  '🙏 Orando | 💼 E trabalhando!',
    foto:    'Fundo com bíblia desfocada + frase em destaque',
  },
  {
    frase:   '"Um uniforme une. Uma equipe unida vence." — Rex, CEO Passo a Passo',
    subtema: 'União / Time',
    reacao:  '🤝 Time unido! | 💪 Vamo que vamo',
    foto:    'Foto de time/equipe uniformizado + frase',
  },
  {
    frase:   '"A excelência não é um destino — é uma jornada diária." — Brian Tracy',
    subtema: 'Excelência',
    reacao:  '🏆 Busco excelência | 📈 Crescendo todo dia',
    foto:    'Fundo escuro + troféu emoji + frase em bold',
  },
  {
    frase:   '"Tudo que você precisa já está dentro de você." — Paulo Coelho',
    subtema: 'Autoconhecimento',
    reacao:  '✨ Acredito! | 🤔 Ainda buscando',
    foto:    'Fundo gradiente laranja + frase em branco',
  },
  {
    frase:   '"Comece sua manhã com gratidão e termine com conquistas." — Joel Osteen',
    subtema: 'Rotina de sucesso',
    reacao:  '🌅 Gratidão de manhã | 🌙 Conquista à noite',
    foto:    'Fundo com nascer do sol + frase sobreposta',
  },
];

// ─────────────────────────────────────────────
// BANCO DE CONTEÚDO — 9H (BASTIDORES MANHÃ)
// ─────────────────────────────────────────────
const BANCO_9H = [
  {
    tema:   'Abrindo a loja',
    texto:  'A loja acabou de abrir e já tem energia aqui dentro ☕🧡 Hoje mais um dia de fazer uniformes que marcam histórias. Bate no nosso DM se quiser visitar!',
    reacao: '☕ Também começando | 💼 Já tô no pique',
    foto:   'Vídeo: porta da loja abrindo + café na mão + sorriso',
  },
  {
    tema:   'Mesa cheia de pedidos',
    texto:  'Mesa lotada, equipe feliz 🧡 Isso aqui é o que acontece quando o Vale dos Sinos confia na gente. E você, já pediu o seu?',
    reacao: 'Enquete: Já tem uniforme personalizado? SIM / AINDA NÃO',
    foto:   'Foto ou vídeo da mesa com fichas de pedido / amostras de tecido',
  },
  {
    tema:   'Você sabia? (curiosidade da loja)',
    texto:  'Você sabia que antes de cada pedido a gente faz uma consultoria gratuita? 🤫 Sim. Você fala o que precisa, a gente te orienta sobre tecido, cor, modelo e personalização.',
    reacao: 'Enquete: Sabia disso? SIM JÁ SABIA / NÃO, QUE BACANA',
    foto:   'Bastidor: consultora com amostras de tecido na mão mostrando opções',
  },
  {
    tema:   'Simulador de uniforme',
    texto:  'Olha que ferramenta incrível 😍 Esse é nosso simulador de uniforme — você vê como vai ficar ANTES de produzir. Zero surpresa na entrega. Link na bio!',
    reacao: 'Caixa de pergunta: Qual sua maior dúvida sobre uniforme?',
    foto:   'Tela do computador mostrando simulador + mão apontando',
  },
  {
    tema:   'Gatilho: processo produção',
    texto:  'Atrás de cada uniforme existe uma história que poucos veem 👀 Tecido, corte, costura, bordado ou sublimação, acabamento, qualidade... tudo conferido peça por peça.',
    reacao: '🧵 Que dedicação! | 😍 Amei saber isso',
    foto:   'Reel curto: processo acelerado mostrando as etapas',
  },
  {
    tema:   'Bastidor: chegada de material',
    texto:  'Chegando material novo por aqui 📦🧡 Tecidos fresquinhos para os pedidos da semana! Sua encomenda pode estar entre eles.',
    reacao: '📦 Que animação! | 👀 Quero ver mais',
    foto:   'Unboxing de rolos de tecido chegando',
  },
  {
    tema:   'Frase gatilho: equipe',
    texto:  'Aqui tem gente que veste a camisa da empresa com orgulho 🧡 Nossa equipe é apaixonada por uniforme. E quando você ama o que faz, aparece no produto final.',
    reacao: '🙌 Que time incrível | ❤️ Sentiu o amor',
    foto:   'Foto da equipe trabalhando + sorrindo',
  },
  {
    tema:   'Curiosidade: diferença de tecidos',
    texto:  '🤔 Curiosidade do dia: você sabe a diferença entre dry-fit e poliéster? São primos... mas não irmãos! Diz aqui: você sabe a diferença?',
    reacao: 'Enquete: Sei a diferença! SIM / ME EXPLICA',
    foto:   'Dois tecidos lado a lado + seta apontando a diferença',
  },
  {
    tema:   'Bastidor: bordado sendo feito',
    texto:  'Tem coisa mais satisfatória do que ver seu logo sendo bordado? 🧵✨ A gente ama esse momento. Quem é que quer ver mais?',
    reacao: '🙋‍♀️ Mostra mais! | 😍 Que lindo isso',
    foto:   'Vídeo close da máquina de bordado funcionando',
  },
  {
    tema:   'Gatilho: prova social + clientes',
    texto:  'Nomes grandes confiaram em nós — Beira Rio, Mônaco Atacado, Ortobom 🧡 Mas nossa maior satisfação? Ver o seu pedido pronto na sua mão.',
    reacao: '🤩 Impressionante! | 🤝 Quero ser cliente também',
    foto:   'Foto de uniforme entregue para grande cliente (com logo deles)',
  },
  {
    tema:   'Tour rápido pela loja',
    texto:  'Quer conhecer a Passo a Passo sem sair de casa? 👀 Vem dar um tour por aqui! [tour rápido nos bastidores]',
    reacao: '👀 Adorei o tour! | 🏃 Quero visitar pessoalmente',
    foto:   'Reel de 15s: tour rápido pela loja — recepção, amostras, produção',
  },
  {
    tema:   'Frase curiosidade: 30 anos',
    texto:  'Em 30 anos de Passo a Passo, quantos uniformes você acha que já saíram daqui? 🤔 Me diz um número nos comentários!',
    reacao: 'Caixa de pergunta: Chuta um número!',
    foto:   'Foto histórica da loja / collage de uniformes ao longo do tempo',
  },
  {
    tema:   'Bastidor: consultoria de cor',
    texto:  'Sabia que a cor do uniforme influencia muito na percepção da sua marca? 🎨 Aqui a gente faz isso junto com você — consultoria de identidade visual incluída.',
    reacao: 'Enquete: Já pensou nisso antes? SIM / NÃO, INCRÍVEL',
    foto:   'Bastidor mostrando paleta de cores + amostras de tecido colorido',
  },
  {
    tema:   'Gatilho: urgência manhã',
    texto:  '⏰ Pedidos recebidos hoje entram na fila de produção essa semana! Ainda dá tempo de garantir o seu. Manda mensagem agora.',
    reacao: '🏃 Já fui! | 📲 Vou mandar agora',
    foto:   'Foto de relógio ou calendário + CTA visual',
  },
  {
    tema:   'Bastidor: estampa sublimação',
    texto:  'Sublimação total: isso é quando a cor entra NA FIBRA do tecido 🔥 Não descasca, não desbota. Vem ver de perto!',
    reacao: '😍 Que tecnologia! | 🤔 Mas é caro?',
    foto:   'Vídeo da prensa de sublimação em ação',
  },
  {
    tema:   'Bastidor: costureira trabalho',
    texto:  'Cada ponto, um compromisso com qualidade 🧵🧡 Nossa equipe costura cada peça com cuidado. Isso não tem diferença para nenhuma máquina automática.',
    reacao: '🙌 Valorizo o artesanal | 💯 Qualidade acima de tudo',
    foto:   'Close das mãos costurando / máquina de costura em ação',
  },
  {
    tema:   'Curiosidade: pedido mínimo',
    texto:  '📌 Lembrete que muita gente não sabe: nosso pedido mínimo é de só 10 peças! Academias, times, turmas — tudo começa de 10. Fácil assim.',
    reacao: 'Enquete: Você já sabia disso? SIM / NÃO QUE ÓTIMO',
    foto:   'Arte simples: "10 peças já viram uniforme personalizado" com brand',
  },
  {
    tema:   'Bastidor: reunião de briefing',
    texto:  'Antes de qualquer pedido: a gente se reúne, ouve você e entende a sua necessidade 📋 Esse é o segredo dos uniformes que a gente entrega.',
    reacao: '🤝 Atendimento nota 10! | 📝 Quero marcar uma reunião',
    foto:   'Foto de consultora conversando com cliente / mesa de reunião',
  },
  {
    tema:   'Curiosidade história: enchente 2024',
    texto:  'Em maio de 2024, quando as enchentes assolaram o RS, a Passo a Passo doou cobertores para desabrigados 🧡 Aqui não é só negócio. É pertencimento.',
    reacao: '🧡 Que história linda | 🙏 Orgulho do RS',
    foto:   'Foto do momento da doação ou montagem com cores do RS',
  },
  {
    tema:   'Bastidor: qualidade final',
    texto:  'Antes de ir para o cliente, cada peça passa por inspeção de qualidade 🔍 Padrão Passo a Passo: só sai quando está perfeito.',
    reacao: '✅ Exigência máxima! | 😤 Odeio coisa mal feita',
    foto:   'Vídeo: funcionária verificando uniforme antes de embalar',
  },
];

// ─────────────────────────────────────────────
// BANCO DE CONTEÚDO — 10H (VENDAS CATÁLOGO)
// ─────────────────────────────────────────────
const BANCO_10H = [
  {
    modelo:  'Polo Piqué',
    area:    'Empresas, escolas, recepções',
    tecido:  'Piqué 100% algodão fio penteado — não amassa, não torce, durabilidade comprovada',
    cta:     '🔥 OFERTA: Kit com 10 polos com logo bordado. Prazo: 15 dias. Manda o logo no DM!',
    acao:    'Botão WhatsApp | Responda com: "POLO"',
    foto:    'Polo piqué na cor da marca do cliente, detalhe no bordado do logo',
  },
  {
    modelo:  'Camiseta Dry-Fit',
    area:    'Academias, CrossFit, times esportivos',
    tecido:  'Poliéster dry-fit de alta performance — absorve suor, seca 3x mais rápido que algodão',
    cta:     '💪 KIT ACADEMIA: 10 camisetas personalizadas a partir de R$X. Orçamento no DM!',
    acao:    'Enquete: Sua academia tem uniforme? SIM / NÃO, PRECISA TER',
    foto:    'Camiseta dry-fit com sublimação total vibrante, alguém usando na academia',
  },
  {
    modelo:  'Jaqueta Softshell',
    area:    'Empresas, vendedores externos, equipes de campo',
    tecido:  'Softshell 3 camadas — vento, frio e chuvisco não passam. Parece terno, protege como escudo.',
    cta:     '❄️ Inverno chegando! Garanta já sua jaqueta corporativa. 10 peças. Link na bio.',
    acao:    'Caixa de pergunta: Qual o logo da sua empresa?',
    foto:    'Jaqueta softshell com logo bordado, modelo com visual executivo',
  },
  {
    modelo:  'Moletom Unissex',
    area:    'Escolas, turmas de formandos, eventos',
    tecido:  'Moletom fleece de gramatura pesada — maciez premium que não perde forma nas lavagens',
    cta:     '🎓 FORMANDOS: Moletom personalizado da turma. Pedido mínimo: 10 peças. Garanta o seu!',
    acao:    '🎓 Sou formando | 👟 Quero p/ academia',
    foto:    'Moletom com estampa da turma (nome da escola + ano), grupo de jovens usando',
  },
  {
    modelo:  'Camiseta Básica Fio 30',
    area:    'Eventos, churrascos, equipes, uniformes casuais',
    tecido:  'Malha fio 30 100% algodão — toque suave, ideal para estampa em silk ou sublimação',
    cta:     '🎉 Evento da empresa? Camiseta temática a partir de 10 unidades. Orçamento grátis!',
    acao:    'Enquete: Prefere camiseta com: BORDADO / ESTAMPA',
    foto:    'Camiseta básica com silk clean corporativo, vários funcionários usando',
  },
  {
    modelo:  'Bermuda Tactel',
    area:    'Academias, esportes, times, beach',
    tecido:  'Tactel 100% poliéster — leve como uma pena, resistência extra para treinos intensos',
    cta:     '💪 Uniforme de academia completo: camiseta + bermuda personalizadas. Feche agora!',
    acao:    '🏋️ Academia | 🏐 Time esportivo | 🏖️ Evento',
    foto:    'Kit camiseta + bermuda combinando com logo da academia',
  },
  {
    modelo:  'Colete Corporativo',
    area:    'Empresas, lojas, eventos, hospitalar',
    tecido:  'Oxford 100% poliéster — resistente, não amassa, visual elegante que projeta autoridade',
    cta:     '🏢 Colete corporativo com logo: presença de marca em todo ambiente. Peça seu orçamento!',
    acao:    'Caixa: Qual o nome da sua empresa?',
    foto:    'Colete com nome e logo da empresa, funcionário de loja usando',
  },
  {
    modelo:  'Jaleco / Avental Hospitalar',
    area:    'Clínicas, consultórios, farmácias, saúde',
    tecido:  'Brim leve anti-pilling — fácil higienização, resistente a lavagens frequentes, durável',
    cta:     '🩺 Equipe de saúde uniforme e profissional. Jaleco com nome bordado. Fale conosco!',
    acao:    'Enquete: Você trabalha na área da saúde? SIM / NÃO',
    foto:    'Jaleco branco com nome bordado em azul ou verde, visual clínico',
  },
  {
    modelo:  'Camiseta Raglan',
    area:    'Academia, esporte, uso casual',
    tecido:  'Raglan bicolor — costuras reforçadas nas mangas para movimentos amplos sem rasgar',
    cta:     '🏃 Uniforme que acompanha qualquer movimento. Treino, jogo ou dia a dia. DM!',
    acao:    '🏃 Esporte | 👕 Casual | 💪 Academia',
    foto:    'Raglan bicolor da academia com logo, pessoa em movimento',
  },
  {
    modelo:  'Camiseta Polo Feminina',
    area:    'Lojas, restaurantes, empresas, eventos',
    tecido:  'Piqué feminino com corte anatômico — valoriza o corpo e mantém visual profissional',
    cta:     '💼 Sua equipe feminina merece um uniforme que veste bem E projeta a marca. Orçamento grátis!',
    acao:    'Enquete: Sua empresa tem uniforme feminino separado? SIM / NÃO, DEVERIA',
    foto:    'Polo feminina com logo bordado, mulher de equipe comercial usando',
  },
  {
    modelo:  'Agasalho Completo',
    area:    'Academias, times, grupos, escolas',
    tecido:  'Kit jaqueta + calça moletom — identidade visual completa do topo à ponta dos pés',
    cta:     '⚽ Kit completo para seu time: agasalho personalizado. Do 10 ao XGG. Fecha com a gente!',
    acao:    '⚽ Time | 🏋️ Academia | 🎒 Escola',
    foto:    'Agasalho completo com logo do time, equipe esportiva posando',
  },
  {
    modelo:  'Camisa Social Personalizada',
    area:    'Empresas formais, bancos, corretoras, eventos VIP',
    tecido:  'Oxford fio 50 — elegância que a concorrência vai perceber antes do cliente',
    cta:     '🤵 Sua empresa no próximo nível: camisa social com logo. Apresentação que fecha contratos.',
    acao:    'Caixa: Em que ramo de negócio você está?',
    foto:    'Camisa social com logo discreto bordado no peito, executivo confiante',
  },
  {
    modelo:  'Camiseta UV / Praia',
    area:    'Escolas (natação), eventos ao ar livre, beach clubs',
    tecido:  'Lycra com proteção UV50+ — cor que não desvanece nem na água salgada ou cloro',
    cta:     '☀️ Proteção UV + identidade da sua escola: camiseta de natação personalizada. Vem ver!',
    acao:    '🏊 Escola natação | 🏖️ Beach | ☀️ Evento externo',
    foto:    'Camiseta UV com logo de escola de natação, aluno na beira da piscina',
  },
  {
    modelo:  'Uniforme Gastronômico',
    area:    'Restaurantes, bares, lanchonetes, buffets',
    tecido:  'Sarja 100% algodão com tratamento anti-manchas — resiste a molhos, óleos e lavagens diárias',
    cta:     '🍕 Equipe que serve bem se apresenta bem. Uniforme gastronômico personalizado. Orçamento!',
    acao:    'Enquete: Seu restaurante tem uniforme? SIM / NÃO, QUERO',
    foto:    'Uniforme de garçom/cozinheiro com logo do restaurante, ambiente de restaurante',
  },
  {
    modelo:  'Kit Formandos 3º ano',
    area:    'Escolas — turmas de terceirão',
    tecido:  'Moletom premium + camiseta personalizada — kit completo da turma, memória para sempre',
    cta:     '🎓 TERCEIRÃO 2026: feche o kit da sua turma antes que as vagas acabem! Até maio.',
    acao:    'Caixa: Qual é o nome da sua turma?',
    foto:    'Moletom do terceirão com identidade da turma + nome dos alunos nas costas',
  },
];

// ─────────────────────────────────────────────
// BANCO DE CONTEÚDO — 13H (BASTIDORES TARDE)
// ─────────────────────────────────────────────
const BANCO_13H = [
  {
    tema:   'Pedidos saindo para entrega',
    texto:  '📦 Hora de entrega aqui! Mais pedidos indo para clientes felizes 🧡 Cada pacote desse carrega 30 anos de cuidado. Vai chegar com amor.',
    reacao: '📦 Entrega chegando! | 🧡 Que cuidado',
    foto:   'Vídeo ou foto: pacotes embalados prontos + alguém carregando para entregar',
  },
  {
    tema:   'Equipe em ritmo de produção',
    texto:  'Tarde de produção aqui na Passo a Passo ✂️🧵 A equipe no ritmo total para garantir que cada pedido saia no prazo. Isso é compromisso!',
    reacao: '✂️ Na costura | 💼 Trabalhando igual',
    foto:   'Foto/vídeo da equipe na produção — costura, bordado, estampa',
  },
  {
    tema:   'Bastidor: conferência de qualidade',
    texto:  'Cada peça passa pelo nosso check de qualidade antes de sair 🔍 Aqui a gente não manda "mais ou menos". Só sai quando está perfeito!',
    reacao: '✅ Rigor total | 😤 Odeio coisa pela metade',
    foto:   'Funcionária inspecionando peça com expressão séria e atenta',
  },
  {
    tema:   'Pergunta de engajamento tarde',
    texto:  'Você já usou uniforme alguma vez na sua vida? 🤔 Escola, academia, trabalho, time... Me conta aqui nos comentários qual foi o mais especial!',
    reacao: 'Caixa de pergunta: Conta sobre seu uniforme mais marcante!',
    foto:   'Collage de tipos diferentes de uniformes Passo a Passo',
  },
  {
    tema:   'Bastidor: bordado saindo',
    texto:  'Olha só esse bordado saindo da máquina 😍 Detalhe que faz a diferença. É a sua logo virando identidade real no tecido.',
    reacao: '😍 Incrível! | 🧡 Arte demais',
    foto:   'Close em bordado saindo da máquina em tempo real (Reels)',
  },
  {
    tema:   'Frase curiosidade tarde',
    texto:  'Você sabe quantas etapas tem um pedido personalizado aqui? 🤔 Spoiler: são mais de 10! E cada uma é feita com cuidado total.',
    reacao: 'Enquete: Acha que tem: + DE 5 ETAPAS / MAIS DE 10',
    foto:   'Arte com as etapas do processo (lista visual)',
  },
  {
    tema:   'Bastidor: tecido sendo cortado',
    texto:  'Corte preciso = uniforme que caiu bem 👌 Aqui a diferença começa antes de costurar. Cada corte é calculado para o caimento perfeito.',
    reacao: '✂️ Precisão máxima | 👌 Caimento perfeito',
    foto:   'Vídeo close do tecido sendo cortado com precisão',
  },
  {
    tema:   'Tarde produtiva — bastidor real',
    texto:  'Mais uma tarde corrida por aqui 😅 São tantos pedidos que a gente mal para! Mas para a gente isso é alegria — porque significa que vocês confiam em nós 🧡',
    reacao: '🔥 Orgulho de vocês! | 💼 Assim que tem que ser',
    foto:   'Foto espontânea da equipe trabalhando com boa energia',
  },
  {
    tema:   'Gatilho de escassez — tarde',
    texto:  '⚠️ AVISO: as vagas de produção de Abril estão quase fechando. Se você precisa de uniforme para maio, o prazo de pedido é AGORA. Manda DM!',
    reacao: '😱 Sério isso?! | 📲 Já mandei mensagem',
    foto:   'Arte com calendário: "Vagas para Abril — 🔴 quase esgotadas"',
  },
  {
    tema:   'Bastidor: embalagem final',
    texto:  'O momento favorito da equipe: colocar na caixa e saber que está perfeito 📦🧡 Cada detalhe conferido, cada peça dobrada com carinho.',
    reacao: '📦 Emocionou! | 🧡 Que cuidado lindo',
    foto:   'Vídeo: uniforme sendo dobrado e embalado com capricho',
  },
  {
    tema:   'Bastidor: sublimação sendo prensada',
    texto:  'Esse calorzão serve para alguma coisa boa 🔥 Prensa de sublimação em ação — é assim que as cores ficam permanentes no tecido!',
    reacao: '🔥 Que tecnologia | 😍 Quero ver de perto',
    foto:   'Vídeo: prensa de sublimação sendo fechada + resultado saindo',
  },
  {
    tema:   'Curiosidade: lavagem do uniforme',
    texto:  '💡 Dica de tarde: uniforme de qualidade precisa de cuidado. Lavar do avesso, água fria e não usar amaciante. Duração: muito mais longa!',
    reacao: 'Enquete: Você sabia dessa dica? JÁ SABIA / NÃO, SALVEI',
    foto:   'Arte informativa com ícones de cuidado com roupa',
  },
  {
    tema:   'Bastidor: reunião de produção',
    texto:  'Reunião rápida de tarde para alinhar entregas da semana 📋 Equipe unida = pedido entregue no prazo. Assim funciona a Passo a Passo.',
    reacao: '📋 Organização total | 🤝 Equipe que alinha',
    foto:   'Foto da equipe em volta da mesa com fichas de pedido',
  },
  {
    tema:   'Depoimento de cliente (bastidor)',
    texto:  '"A atenção da equipe desde o primeiro contato foi incrível" — cliente recente 🧡 Isso não tem preço. E a gente vai continuar assim por mais 30 anos.',
    reacao: '🌟 Cliente feliz | ❤️ Orgulho da equipe',
    foto:   'Print do depoimento (com nome ocultado) + fundo laranja',
  },
];

// ─────────────────────────────────────────────
// BANCO DE CONTEÚDO — 14H (ENQUETES / EDUCAÇÃO)
// ─────────────────────────────────────────────
const BANCO_14H = [
  {
    tema:   'Branding: cor do uniforme',
    texto:  '🎨 Você sabe que a cor do uniforme da sua equipe comunica algo sobre a sua marca antes de qualquer palavra ser dita? Qual é a cor da sua empresa?',
    reacao: 'Caixa de pergunta: Qual a cor do uniforme da sua empresa?',
    foto:   'Arte com paleta de cores e significado: azul=confiança, verde=saúde, laranja=energia',
  },
  {
    tema:   'Marketing: uniforme aumenta vendas',
    texto:  '📈 Curiosidade de marketing: equipes uniformizadas geram até 20% mais confiança nos clientes na hora da compra. Você se lembra de alguma empresa que te convenceu pelo visual?',
    reacao: 'Enquete: Uniforme transmite mais confiança? COM CERTEZA / NÃO SEI',
    foto:   'Arte com dado: "Equipe uniformizada = +20% confiança do cliente"',
  },
  {
    tema:   'Branding: identidade visual',
    texto:  '🤔 Identidade visual não é só logo. É cor, tipografia, uniforme e o jeito que sua marca aparece no mundo. Sua empresa tem identidade visual definida?',
    reacao: 'Enquete: Sua empresa tem identidade visual? SIM COMPLETA / AINDA CONSTRUINDO',
    foto:   'Infográfico: elementos de identidade visual (logo + cor + fonte + uniforme)',
  },
  {
    tema:   'Curiosidade: primeiro uniforme da história',
    texto:  '📚 Você sabia? O uniforme mais antigo registrado é de soldados romanos do século 4 a.C. Hoje evoluiu muito — mas a essência é a mesma: identificar e unir.',
    reacao: '🤯 Não sabia! | 📚 Que história',
    foto:   'Arte: linha do tempo de uniformes da história até hoje',
  },
  {
    tema:   'Marketing: first impression',
    texto:  '👀 Pesquisas mostram que levamos apenas 7 SEGUNDOS para formar uma primeira impressão. O uniforme da sua equipe está falando o que você quer nos primeiros 7 segundos?',
    reacao: 'Enquete: Você já julgou uma empresa pelo uniforme? SIM / NÃO',
    foto:   'Arte: "7 segundos" em destaque com relógio',
  },
  {
    tema:   'Dica: tecido certo por segmento',
    texto:  '🧵 Qual tecido escolher para cada segmento? Academia: dry-fit. Empresa: piqué ou oxford. Gastronomia: sarja. Saúde: gabardine. Salva pra não esquecer!',
    reacao: 'Enquete: Você está no: Academia / Empresa / Saúde / Outro',
    foto:   'Arte informativa: tecido + segmento recomendado com ícones',
  },
  {
    tema:   'Branding: coerência de marca',
    texto:  '💼 Marca forte = mensagem coerente em tudo. Isso inclui: site, cartão, uniforme, atendimento... Quando um desses está fora do padrão, a marca fica fraca. Tá tudo alinhado na sua?',
    reacao: 'Enquete: Sua marca está coerente? ESTÁ / PRECISA MELHORAR',
    foto:   'Arte: quebra-cabeça de elementos de marca (site + uniforme + logo + cartão)',
  },
  {
    tema:   'Curiosidade: uniforme na psicologia',
    texto:  '🧠 Psicologia diz: quem veste uniforme sente mais pertencimento e produz até 15% mais. Isso é real e acontece em times, academias e empresas. Sua equipe sente isso?',
    reacao: 'Enquete: Uniforme te deixa mais produtivo? SIM / NÃO SINTO DIFERENÇA',
    foto:   'Arte com ícone de cérebro e dados de produtividade',
  },
  {
    tema:   'Dica: personalização x padronização',
    texto:  '🔄 Quando personalizar demais pode ser ruim? Quando perde a coesão! Uniforme bom é aquele que une a equipe visualmente sem perder a identidade individual.',
    reacao: 'Caixa: O que você mais gosta em um uniforme?',
    foto:   'Comparação: uniforme caótico vs uniforme harmonioso da mesma equipe',
  },
  {
    tema:   'Marketing: custo x benefício',
    texto:  '💰 Você gastou R$X no uniforme. Mas ele vai aparecer em fotos, redes sociais, eventos... durante ANOS. Dividido pelo tempo de uso, o custo por dia é centavos. Faz sentido?',
    reacao: 'Enquete: Vale o investimento em uniforme? VALE MUITO / AINDA TENHO DÚVIDA',
    foto:   'Arte com cálculo visual: R$X ÷ 365 dias = centavos/dia',
  },
  {
    tema:   'Curiosidade: cor favorita do Brasil',
    texto:  '🇧🇷 Curiosidade: as cores mais pedidas em uniformes no Brasil são: azul marinho, preto e vermelho. Laranja está crescendo forte 🧡 (sabemos disso por experiência de 30 anos!)',
    reacao: 'Enquete: Sua cor preferida para uniforme: AZUL / PRETO / VERMELHO / LARANJA',
    foto:   'Gráfico pizza visual com as cores + fundo da marca',
  },
  {
    tema:   'Dica: nome bordado no uniforme',
    texto:  '🪡 Dica ninja: bordar o NOME do funcionário no uniforme aumenta o atendimento personalizado percebido pelo cliente. "Obrigado, João!" É simples e potente.',
    reacao: 'Enquete: Seu uniforme tem o nome bordado? TEM / NÃO TEM, VOU PEDIR',
    foto:   'Close em bordado com nome de funcionário no uniforme',
  },
  {
    tema:   'Marketing: uniforme nas redes sociais',
    texto:  '📱 Seus funcionários postam fotos no Instagram com uniforme? Isso é marketing orgânico gratuito! Cada post é sua marca alcançando uma nova audiência.',
    reacao: 'Enquete: Você posta foto com uniforme do trabalho? SIM / NÃO, NUNCA PENSEI',
    foto:   'Montagem de "prints de Instagram" com uniformes de times/empresas',
  },
  {
    tema:   'Curiosidade: impacto no time',
    texto:  '⚽ Pesquisa da FIFA: times com uniformes bem projetados ganham mais torcedores e vendem mais camisetas. Funciona igual para academias, escolas e empresas.',
    reacao: 'Caixa: Você torceria mais por um time com uniforme bonito?',
    foto:   'Collage de uniformes esportivos bonitos com logo em destaque',
  },
  {
    tema:   'Dica: bordado vs estampa',
    texto:  '🧵 Bordado: mais elegante, durável, transmite premium. Estampa: mais colorida, complexa, mais barata. Qual é melhor? Depende do seu segmento! Me pergunta e te oriento.',
    reacao: 'Enquete: Você prefere: BORDADO / ESTAMPA',
    foto:   'Lado a lado: uniforme com bordado vs uniforme com estampa',
  },
  {
    tema:   'Curiosidade: encurtamento de ciclo de venda',
    texto:  '🛒 Empresas com equipe uniformizada fecham propostas 25% mais rápido. O cliente sente confiança logo de entrada. Isso é branding funcionando silenciosamente.',
    reacao: '💼 Funciona mesmo! | 🤔 Preciso ver dados',
    foto:   'Arte: funil de vendas com uniforme na entrada do funil',
  },
  {
    tema:   'Branding: rebranding com uniforme novo',
    texto:  '🔄 Rebranding é mais do que trocar logo. É trocar uniforme, embalagem, linguagem. Se você mudou a identidade da empresa mas não o uniforme, a mensagem chegou pela metade.',
    reacao: 'Enquete: Você já fez rebranding? SIM / NÃO',
    foto:   'Antes e depois: empresa com uniforme antigo vs novo',
  },
  {
    tema:   'Curiosidade: tendências 2026 de uniforme',
    texto:  '👔 Tendências de uniforme em 2026: minimalismo, cores terrosas, bordado tone-on-tone e sustentabilidade no tecido. A Passo a Passo já trabalha com tudo isso 🧡',
    reacao: '🔥 Que tendência bacana! | 👕 Quero no meu',
    foto:   'Arte mood board: tendências visuais de uniforme 2026',
  },
];

// ─────────────────────────────────────────────
// BANCO DE CONTEÚDO — 15H (CAMPANHAS ATIVAS)
// ─────────────────────────────────────────────
const BANCO_15H = [
  // ── TERCEIRÃO
  {
    campanha: 'Terceirão 2026',
    texto:    '🎓 TERCEIRÃO 2026: a última camiseta da turma que vai para sempre no armário. Personalizada com o nome da escola, ano e os nomes de quem fez história junto. Garanta até MAIO!',
    reacao:   'Enquete: Você é do terceirão? SIM 🎓 / NÃO MAS QUERO VER',
    cta:      '👉 DM com "TERCEIRÃO" e a gente te envia o catálogo completo',
    foto:     'Moletom do terceirão com nomes nas costas, grupo de amigos comemorando',
  },
  {
    campanha: 'Terceirão 2026',
    texto:    '📢 ALERTA TERCEIRÃO: só até o fim de Abril para fechar seu kit! Moletom, camiseta e muito mais com a identidade da sua turma. Depois disso não garantimos prazo.',
    reacao:   'Caixa de pergunta: Qual é o nome da sua turma do terceirão?',
    cta:      '⏰ Prazo esgotando! Manda o DM agora.',
    foto:     'Arte urgência: "Vagas para Maio — feche até 30/04" com contador',
  },
  {
    campanha: 'Terceirão 2026',
    texto:    '🎒 Vocês passaram 12 anos juntos. Merecem um uniforme que conta essa história 🧡 Kit terceirão Passo a Passo: moletom + camiseta personalizada para toda a turma.',
    reacao:   '🎓 Quero o kit! | ❤️ Vai me emocionar',
    cta:      'Link na bio para simular o uniforme da turma',
    foto:     'Alunos do terceirão posando com moletom personalizado',
  },
  // ── UNIFORMES EMPRESARIAIS
  {
    campanha: 'Uniformes Empresariais',
    texto:    '🏢 Sua empresa tem mais de 10 funcionários? Então você já pode ter um uniforme corporativo que representa quem vocês são. Mostre para o mercado que você é profissional.',
    reacao:   'Enquete: Sua empresa tem uniforme? SIM / NÃO, QUERO',
    cta:      '📲 DM "EMPRESA" + número de funcionários → receba proposta em até 24h',
    foto:     'Equipe de empresa uniformizada na frente do escritório',
  },
  {
    campanha: 'Uniformes Empresariais',
    texto:    '🤝 Beira Rio, Mônaco Atacado, Ortobom — grandes nomes confiam na Passo a Passo. E sua empresa? Somos especialistas em uniforme corporativo há mais de 30 anos.',
    reacao:   '💼 Impressionante! | 🤝 Quero ser cliente também',
    cta:      '📋 Solicite sua proposta: (51) 98560-0893',
    foto:     'Collage de uniformes de grandes empresas clientes + logo Passo a Passo',
  },
  {
    campanha: 'Uniformes Empresariais',
    texto:    '📊 Empresas com uniforme têm 30% mais profissionalismo percebido pelos clientes. Seu concorrente já sabe disso. E você? Hora de agir.',
    reacao:   '💼 Bora! | 📈 Faz sentido de negócio',
    cta:      '⚡ OFERTA EMPRESAS: 10-30 peças com preço especial. Válido esse mês.',
    foto:     'Arte: dado "30% mais profissional" em destaque + uniforme corporativo',
  },
  // ── PASSO A PASSO VISITA
  {
    campanha: 'Passo a Passo Visita',
    texto:    '🚗 Você não precisa sair da sua empresa para escolher o uniforme! A Passo a Passo vai até você — com amostras de tecido, catálogo e consultoria no local. Grátis!',
    reacao:   '😍 Que serviço! | 📍 Atende onde estou?',
    cta:      '📲 Agende sua visita: DM "VISITA" + cidade + seu nome',
    foto:     'Consultora com maletinha de amostras chegando na empresa do cliente',
  },
  {
    campanha: 'Passo a Passo Visita',
    texto:    '📍 Novo Hamburgo e região (até ~40km): a Passo a Passo leva o showroom até você! Escolha o tecido tocando, veja as cores de verdade e feche o pedido sem sair do trabalho.',
    reacao:   'Enquete: Prefere atendimento: NA LOJA / NA MINHA EMPRESA',
    cta:      '📲 Agende agora: (51) 98560-0893',
    foto:     'Mapa mostrando raio de 40km de NH + logo da empresa',
  },
  {
    campanha: 'Passo a Passo Visita',
    texto:    '🤝 Atendimento presencial faz diferença. A gente entende sua cultura, seu espaço, seu time — e entrega um uniforme que faz sentido para quem você é. Agende sua visita!',
    reacao:   '🌟 Atendimento diferenciado! | 📅 Quero agendar',
    cta:      '📲 DM agora para data disponível esta semana',
    foto:     'Consultora conversando com cliente dentro da empresa, sorrindo',
  },
];

// ─────────────────────────────────────────────
// FORMATAÇÃO DE DATAS
// ─────────────────────────────────────────────
const DIAS_PT   = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
const MESES_PT  = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

function formatarData(d) {
  const dia      = String(d.getDate()).padStart(2,'0');
  const mes      = String(d.getMonth()+1).padStart(2,'0');
  const ano      = d.getFullYear();
  const diaSemana = DIAS_PT[d.getDay()];
  const mesNome  = MESES_PT[d.getMonth()];
  return { dia, mes, ano, diaSemana, mesNome, chave: `${dia}-${mes}`, iso: `${ano}-${mes}-${dia}` };
}

// ─────────────────────────────────────────────
// ESTADO: controle de rotação sem repetição
// ─────────────────────────────────────────────
const STATE_DIR  = path.join(__dirname, 'state');
const STATE_FILE = path.join(STATE_DIR, 'stories-state.json');

function loadState() {
  if (!fs.existsSync(STATE_DIR)) fs.mkdirSync(STATE_DIR, { recursive: true });
  if (!fs.existsSync(STATE_FILE)) return { history: {} };
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); }
  catch { return { history: {} }; }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function pickContent(bank, slot, state, isoDate) {
  const history = state.history;
  // Coleta índices usados nos últimos 30 dias para este slot
  const used = new Set();
  const thirtyDaysAgo = new Date(isoDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  for (const [date, slots] of Object.entries(history)) {
    if (new Date(date) >= thirtyDaysAgo && slots[slot] !== undefined) {
      used.add(slots[slot]);
    }
  }

  // Filtra candidatos
  const candidates = bank.map((_,i) => i).filter(i => !used.has(i));
  const pool = candidates.length > 0 ? candidates : bank.map((_,i) => i);

  // Escolhe pelo hash do dia para ser determinístico (roda várias vezes → mesmo resultado)
  const dateHash = isoDate.split('-').reduce((a,b) => a + parseInt(b), 0);
  const slotHash = slot.charCodeAt(0);
  return pool[(dateHash + slotHash) % pool.length];
}

// ─────────────────────────────────────────────
// MONTAGEM DO CRONOGRAMA
// ─────────────────────────────────────────────
function montarCronograma(dataInfo, state) {
  const { iso, chave } = dataInfo;
  const datEsp = DATAS_ESPECIAIS[chave] || null;

  const idx8h  = pickContent(BANCO_8H,  '8h',  state, iso);
  const idx9h  = pickContent(BANCO_9H,  '9h',  state, iso);
  const idx10h = pickContent(BANCO_10H, '10h', state, iso);
  const idx13h = pickContent(BANCO_13H, '13h', state, iso);
  const idx14h = pickContent(BANCO_14H, '14h', state, iso);
  const idx15h = pickContent(BANCO_15H, '15h', state, iso);

  // Salva no histórico
  if (!state.history[iso]) state.history[iso] = {};
  state.history[iso]['8h']  = idx8h;
  state.history[iso]['9h']  = idx9h;
  state.history[iso]['10h'] = idx10h;
  state.history[iso]['13h'] = idx13h;
  state.history[iso]['14h'] = idx14h;
  state.history[iso]['15h'] = idx15h;

  // Limpa histórico acima de 90 dias
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  for (const d of Object.keys(state.history)) {
    if (new Date(d) < cutoff) delete state.history[d];
  }

  // Atualização do dia (data especial ou genérica de tendências)
  const atualizacaoGlobal = datEsp
    ? `🗓️ HOJE: ${datEsp.emoji} ${datEsp.nome} — use ${datEsp.tags}`
    : `📲 Pesquise trends: TikTok → "uniforme" / Instagram Explore / Twitter Trending Brasil`;

  return {
    data:       dataInfo,
    dataEspecial: datEsp,
    atualizacaoGlobal,
    slots: [
      {
        horario:  '08:00',
        categoria:'☀️ BOM DIA MOTIVACIONAL',
        cor:      '#E07000',
        tema:     `Tema: ${BANCO_8H[idx8h].subtema}`,
        texto:    BANCO_8H[idx8h].frase,
        reacao:   BANCO_8H[idx8h].reacao,
        foto:     BANCO_8H[idx8h].foto,
        atualizacao: datEsp
          ? `Adapte a frase para ${datEsp.emoji} ${datEsp.nome} se fizer sentido`
          : 'Verifique se há fato marcante do dia (notícia positiva, feriado próximo)',
      },
      {
        horario:  '09:00',
        categoria:'👀 BASTIDORES — MANHÃ',
        cor:      '#6B4C91',
        tema:     `Tema: ${BANCO_9H[idx9h].tema}`,
        texto:    BANCO_9H[idx9h].texto,
        reacao:   BANCO_9H[idx9h].reacao,
        foto:     BANCO_9H[idx9h].foto,
        atualizacao: 'Capture o momento real da loja agora — espontâneo converte mais',
      },
      {
        horario:  '10:00',
        categoria:'🛒 VENDA — CATÁLOGO',
        cor:      '#C85A00',
        tema:     `Modelo: ${BANCO_10H[idx10h].modelo} | Área: ${BANCO_10H[idx10h].area}`,
        texto:    `${BANCO_10H[idx10h].tecido}\n\n${BANCO_10H[idx10h].cta}`,
        reacao:   BANCO_10H[idx10h].acao,
        foto:     BANCO_10H[idx10h].foto,
        atualizacao: atualizacaoGlobal,
      },
      {
        horario:  '13:00',
        categoria:'🏭 BASTIDORES — PRODUÇÃO',
        cor:      '#1976A8',
        tema:     `Tema: ${BANCO_13H[idx13h].tema}`,
        texto:    BANCO_13H[idx13h].texto,
        reacao:   BANCO_13H[idx13h].reacao,
        foto:     BANCO_13H[idx13h].foto,
        atualizacao: 'Mostre um pedido real em produção (com permissão do cliente)',
      },
      {
        horario:  '14:00',
        categoria:'📊 ENQUETE / EDUCAÇÃO',
        cor:      '#2E7D32',
        tema:     `Tema: ${BANCO_14H[idx14h].tema}`,
        texto:    BANCO_14H[idx14h].texto,
        reacao:   BANCO_14H[idx14h].reacao,
        foto:     BANCO_14H[idx14h].foto,
        atualizacao: 'Responda os comentários em tempo real para bostar engajamento',
      },
      {
        horario:  '15:00',
        categoria:`📣 CAMPANHA: ${BANCO_15H[idx15h].campanha}`,
        cor:      '#B71C1C',
        tema:     `Campanha: ${BANCO_15H[idx15h].campanha}`,
        texto:    `${BANCO_15H[idx15h].texto}\n\n${BANCO_15H[idx15h].cta}`,
        reacao:   BANCO_15H[idx15h].reacao,
        foto:     BANCO_15H[idx15h].foto,
        atualizacao: 'Adicione urgência real (ex: vagas restantes, prazo desta semana)',
      },
    ],
  };
}

// ─────────────────────────────────────────────
// GERAÇÃO DE PDF
// ─────────────────────────────────────────────
function gerarPDF(cronograma) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({
      size:    'A4',
      layout:  'landscape',
      margins: { top: 20, bottom: 20, left: 25, right: 25 },
    });

    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end',  () => resolve(Buffer.concat(chunks)));

    const W   = doc.page.width  - 50; // 841 - 50 = 791
    const X   = 25;
    let   Y   = 20;

    // ── helpers
    const fillRect = (x,y,w,h,cor) => {
      doc.rect(x,y,w,h).fillColor(cor).fill();
    };
    const checkbox = (x,y) => {
      doc.rect(x,y,11,11).lineWidth(1).strokeColor('#555').stroke();
    };
    const textBox = (label, value, x, y, w, maxH) => {
      doc.fontSize(7).fillColor('#C85A00').font('Helvetica-Bold').text(label.toUpperCase(), x, y, { width: w });
      const yVal = y + 9;
      doc.fontSize(7.5).fillColor('#222').font('Helvetica').text(value, x, yVal, { width: w, lineGap: 1 });
      return doc.y;
    };

    // ═══════════════════════════════════════════
    // HEADER
    // ═══════════════════════════════════════════
    fillRect(X, Y, W, 48, '#C85A00');
    doc.fontSize(16).fillColor('#fff').font('Helvetica-Bold')
      .text('CRONOGRAMA DE STORIES', X+10, Y+7, { width: W-20 });
    const { diaSemana, dia, mesNome, ano } = cronograma.data;
    const dataStr = `${diaSemana.charAt(0).toUpperCase()+diaSemana.slice(1)}, ${dia} de ${mesNome} de ${ano}`;
    doc.fontSize(9).fillColor('rgba(255,255,255,0.85)').font('Helvetica')
      .text(dataStr + '  ·  Passo a Passo Uniformes — @passoapassouniformes', X+10, Y+28, { width: W-20 });
    Y += 55;

    // ═══════════════════════════════════════════
    // BARRA DE DATA ESPECIAL / TRENDS
    // ═══════════════════════════════════════════
    if (cronograma.dataEspecial) {
      const { nome, emoji, tags } = cronograma.dataEspecial;
      fillRect(X, Y, W, 18, '#FFF3E0');
      doc.rect(X,Y,W,18).lineWidth(0.5).strokeColor('#C85A00').stroke();
      doc.fontSize(8).fillColor('#B45000').font('Helvetica-Bold')
        .text(`${emoji}  DATA ESPECIAL HOJE: ${nome}    ${tags}`, X+8, Y+5, { width: W-16 });
      Y += 23;
    }

    // Instrução de trends
    fillRect(X, Y, W, 16, '#F5F5F5');
    doc.rect(X,Y,W,16).lineWidth(0.3).strokeColor('#CCC').stroke();
    doc.fontSize(7).fillColor('#555').font('Helvetica-Oblique')
      .text('⚡  TRENDS DO DIA: verifique TikTok → busca "uniforme" | Instagram Explore | Twitter/X Trending Brasil antes de postar', X+8, Y+5, { width: W-16 });
    Y += 21;

    // ═══════════════════════════════════════════
    // SLOTS
    // ═══════════════════════════════════════════
    const SLOT_H   = 93;
    const COL1_W   = 230;
    const COL2_W   = 220;
    const COL3_W   = W - COL1_W - COL2_W - 20;
    const GAP      = 5;

    for (const slot of cronograma.slots) {
      // Header do slot
      fillRect(X, Y, W, 16, slot.cor);
      checkbox(X+4, Y+3);
      doc.fontSize(9).fillColor('#fff').font('Helvetica-Bold')
        .text(`${slot.horario}  —  ${slot.categoria}`, X+20, Y+4, { width: W-30 });
      Y += 17;

      // Área de conteúdo
      const contentY = Y;
      const borderH  = SLOT_H - 17;

      // Fundo
      fillRect(X, Y, W, borderH, '#FAFAFA');
      doc.rect(X, contentY, W, borderH).lineWidth(0.4).strokeColor('#DDD').stroke();

      // Linha divisória entre colunas
      doc.moveTo(X+COL1_W+GAP, contentY+4).lineTo(X+COL1_W+GAP, contentY+borderH-4)
        .lineWidth(0.3).strokeColor('#DDD').stroke();
      doc.moveTo(X+COL1_W+COL2_W+GAP*2, contentY+4).lineTo(X+COL1_W+COL2_W+GAP*2, contentY+borderH-4)
        .lineWidth(0.3).strokeColor('#DDD').stroke();

      const c1x = X+5;
      const c2x = X+COL1_W+GAP+5;
      const c3x = X+COL1_W+COL2_W+GAP*2+5;

      textBox('Tema / O que postar', slot.tema, c1x, contentY+4, COL1_W-10, 20);
      textBox('Texto do story',      slot.texto, c1x, contentY+22, COL1_W-10, borderH-26);

      textBox('Botão de reação',     slot.reacao, c2x, contentY+4, COL2_W-10, 25);
      textBox('O que gravar / foto', slot.foto, c2x, contentY+28, COL2_W-10, borderH-32);

      textBox('Atualização do dia',  slot.atualizacao, c3x, contentY+4, COL3_W-10, borderH-8);

      Y += borderH + 4;
    }

    // ═══════════════════════════════════════════
    // FOOTER
    // ═══════════════════════════════════════════
    Y += 4;
    doc.fontSize(7).fillColor('#999').font('Helvetica')
      .text(`Gerado por Rex, CEO Agent  ·  Passo a Passo Uniformes  ·  ${E.site}  ·  ${E.whatsapp}`, X, Y, { width: W, align: 'center' });

    doc.end();
  });
}

// ─────────────────────────────────────────────
// BUSCA DE TENDÊNCIAS (Google Trends + News)
// ─────────────────────────────────────────────
async function buscarTendencias() {
  const resultado = {
    googleTrends: [],
    noticias: [],
    tiktokHashtags: ['#uniforme', '#uniformepersonalizado', '#uniformeescolar', '#moda2026', '#trabalho'],
  };

  try {
    const [trendsRes, newsRes] = await Promise.allSettled([
      axios.get('https://trends.google.com/trending/rss?geo=BR', {
        timeout: 10000,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RexBot/1.0)' },
      }),
      axios.get('https://news.google.com/rss?hl=pt-BR&gl=BR&ceid=BR:pt-419', {
        timeout: 10000,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RexBot/1.0)' },
      }),
    ]);

    // Google Trends Brasil — extrai os títulos dos trending topics
    if (trendsRes.status === 'fulfilled') {
      const xml = trendsRes.value.data;
      const itemMatches = [...xml.matchAll(/<item>[\s\S]*?<\/item>/g)];
      for (const itemMatch of itemMatches.slice(0, 7)) {
        const titleMatch = itemMatch[0].match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/);
        const approxMatch = itemMatch[0].match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/);
        if (titleMatch) {
          resultado.googleTrends.push({
            termo: titleMatch[1].trim(),
            volume: approxMatch ? approxMatch[1].trim() : '',
          });
        }
      }
    }

    // Google News Brasil — extrai as 5 principais notícias
    if (newsRes.status === 'fulfilled') {
      const xml = newsRes.value.data;
      const itemMatches = [...xml.matchAll(/<item>[\s\S]*?<\/item>/g)];
      for (const itemMatch of itemMatches.slice(0, 5)) {
        const titleMatch = itemMatch[0].match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/);
        const sourceMatch = itemMatch[0].match(/<source[^>]*>(.*?)<\/source>/);
        if (titleMatch) {
          resultado.noticias.push({
            titulo: titleMatch[1].trim(),
            fonte: sourceMatch ? sourceMatch[1].trim() : 'Google News',
          });
        }
      }
    }
  } catch (e) {
    console.warn('⚠️  Tendências indisponíveis:', e.message);
  }

  return resultado;
}

// ─────────────────────────────────────────────
// GERAÇÃO DO HTML DO EMAIL
// ─────────────────────────────────────────────
function gerarEmailHTML(cronograma, tendencias = {}) {
  const { diaSemana, dia, mesNome, ano } = cronograma.data;
  const titulo = `${diaSemana.charAt(0).toUpperCase()+diaSemana.slice(1)}, ${dia} de ${mesNome} de ${ano}`;

  const corBadge = s => s.cor;

  const slotCards = cronograma.slots.map(s => `
    <tr>
      <td style="padding:10px 0 4px">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #E0E0E0">
          <tr><td style="background:${corBadge(s)};padding:8px 14px">
            <span style="color:#fff;font-weight:800;font-size:13px">${s.horario} — ${s.categoria}</span>
          </td></tr>
          <tr><td style="padding:12px 14px;background:#FAFAFA">
            <table width="100%" cellpadding="4" cellspacing="0">
              <tr>
                <td width="33%" valign="top">
                  <p style="margin:0 0 3px;font-size:10px;color:${corBadge(s)};font-weight:700;text-transform:uppercase">Tema / O que postar</p>
                  <p style="margin:0 0 10px;font-size:12px;color:#333">${s.tema}</p>
                  <p style="margin:0 0 3px;font-size:10px;color:${corBadge(s)};font-weight:700;text-transform:uppercase">Texto do story</p>
                  <p style="margin:0;font-size:12px;color:#333;white-space:pre-line">${s.texto}</p>
                </td>
                <td width="33%" valign="top" style="border-left:1px solid #E0E0E0;padding-left:10px">
                  <p style="margin:0 0 3px;font-size:10px;color:${corBadge(s)};font-weight:700;text-transform:uppercase">Botão de reação</p>
                  <p style="margin:0 0 10px;font-size:12px;color:#333">${s.reacao}</p>
                  <p style="margin:0 0 3px;font-size:10px;color:${corBadge(s)};font-weight:700;text-transform:uppercase">O que gravar / foto</p>
                  <p style="margin:0;font-size:12px;color:#333">${s.foto}</p>
                </td>
                <td width="34%" valign="top" style="border-left:1px solid #E0E0E0;padding-left:10px">
                  <p style="margin:0 0 3px;font-size:10px;color:${corBadge(s)};font-weight:700;text-transform:uppercase">Atualização do dia</p>
                  <p style="margin:0;font-size:12px;color:#333">${s.atualizacao}</p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </td>
    </tr>
  `).join('');

  const alertaData = cronograma.dataEspecial
    ? `<tr><td style="padding:6px 0"><div style="background:#FFF3E0;border:1px solid #C85A00;border-radius:6px;padding:8px 14px;font-size:12px;color:#B45000"><strong>${cronograma.dataEspecial.emoji} DATA ESPECIAL:</strong> ${cronograma.dataEspecial.nome} — ${cronograma.dataEspecial.tags}</div></td></tr>`
    : '';

  // Bloco Google Trends
  const { googleTrends = [], noticias = [], tiktokHashtags = [] } = tendencias;

  const trendsRows = googleTrends.length > 0
    ? googleTrends.map((t, i) => `
        <tr style="border-bottom:1px solid #F0F0F0">
          <td style="padding:4px 8px;font-size:11px;color:#555;font-weight:700">${i + 1}.</td>
          <td style="padding:4px 4px;font-size:11px;color:#222">${t.termo}</td>
          <td style="padding:4px 8px;font-size:10px;color:#888;text-align:right">${t.volume}</td>
        </tr>`).join('')
    : `<tr><td colspan="3" style="padding:8px;font-size:11px;color:#AAA;text-align:center">Indisponível no momento</td></tr>`;

  const noticiasRows = noticias.length > 0
    ? noticias.map(n => `
        <tr style="border-bottom:1px solid #F0F0F0">
          <td style="padding:5px 8px">
            <span style="font-size:11px;color:#222">${n.titulo}</span>
            <span style="font-size:10px;color:#AAA;margin-left:6px">— ${n.fonte}</span>
          </td>
        </tr>`).join('')
    : `<tr><td style="padding:8px;font-size:11px;color:#AAA;text-align:center">Indisponível no momento</td></tr>`;

  const tiktokRow = tiktokHashtags.length > 0
    ? tiktokHashtags.map(h => `<span style="background:#F0F0F0;border-radius:4px;padding:3px 7px;font-size:11px;color:#444;margin:2px;display:inline-block">${h}</span>`).join(' ')
    : '';

  const blocoTendencias = `
  <tr><td style="padding:0 0 14px">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8E8E8;border-radius:8px;overflow:hidden">
      <!-- cabeçalho tendências -->
      <tr><td colspan="3" style="background:#1A1A2E;padding:10px 14px">
        <span style="color:#fff;font-weight:800;font-size:13px">⚡ TENDÊNCIAS DO DIA</span>
        <span style="color:rgba(255,255,255,0.5);font-size:10px;margin-left:8px">Atualizado automaticamente às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
      </td></tr>
      <!-- 2 colunas: trends + noticias -->
      <tr>
        <!-- col 1: Google Trends -->
        <td width="38%" valign="top" style="padding:0;border-right:1px solid #EEE">
          <div style="background:#4285F4;padding:6px 10px">
            <span style="color:#fff;font-size:11px;font-weight:700">🔍 Google Trends Brasil</span>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff">
            ${trendsRows}
          </table>
        </td>
        <!-- col 2: Notícias -->
        <td width="62%" valign="top" style="padding:0">
          <div style="background:#EA4335;padding:6px 10px">
            <span style="color:#fff;font-size:11px;font-weight:700">📰 Notícias Brasil agora</span>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff">
            ${noticiasRows}
          </table>
        </td>
      </tr>
      <!-- TikTok hashtags -->
      <tr><td colspan="3" style="background:#F8F8F8;padding:8px 12px;border-top:1px solid #EEE">
        <span style="font-size:10px;color:#888;font-weight:700;margin-right:8px">🎵 TikTok — busque agora:</span>
        ${tiktokRow}
        <span style="font-size:10px;color:#C0C0C0;display:block;margin-top:4px">Abra o TikTok → aba Explorar → veja o que está viral hoje e adapte o conteúdo</span>
      </td></tr>
    </table>
  </td></tr>`;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#F0F0F0;margin:0;padding:0}
a{color:#C85A00}</style></head>
<body>
<table width="100%" bgcolor="#F0F0F0" cellpadding="0" cellspacing="0"><tr><td>
<table width="640" align="center" cellpadding="0" cellspacing="0" style="margin:20px auto">
  <!-- HEADER -->
  <tr><td style="background:#C85A00;border-radius:10px 10px 0 0;padding:18px 24px">
    <p style="margin:0;color:#fff;font-size:18px;font-weight:800">📱 Cronograma de Stories</p>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:12px">${titulo} · Passo a Passo Uniformes</p>
  </td></tr>
  <!-- BODY -->
  <tr><td style="background:#fff;padding:16px 24px;border-radius:0 0 10px 10px">
    <table width="100%" cellpadding="0" cellspacing="0">
      ${alertaData}
      ${blocoTendencias}
      ${slotCards}
    </table>
    <p style="margin:18px 0 4px;text-align:center;font-size:11px;color:#AAA">O PDF com o cronograma imprimível está em anexo 🖨️</p>
    <p style="margin:4px 0 0;text-align:center;font-size:11px;color:#CCC">Rex, CEO Agent · Passo a Passo Uniformes · ${E.site}</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

// ─────────────────────────────────────────────
// ENVIO DE EMAIL
// ─────────────────────────────────────────────
async function enviarEmail(cronograma, pdfBuffer, tendencias) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const { dia, mes, ano } = cronograma.data;
  const datEsp = cronograma.dataEspecial ? ` ${cronograma.dataEspecial.emoji} ${cronograma.dataEspecial.nome}` : '';
  const assunto = `📱 Stories do Dia ${dia}/${mes}/${ano}${datEsp} | Passo a Passo`;

  await transporter.sendMail({
    from:    `"Rex | Passo a Passo" <${process.env.GMAIL_USER}>`,
    to:      'passoapassouniformes2025@gmail.com',
    subject: assunto,
    html:    gerarEmailHTML(cronograma, tendencias),
    attachments: [{
      filename:    `cronograma-stories-${ano}${mes}${dia}.pdf`,
      content:     pdfBuffer,
      contentType: 'application/pdf',
    }],
  });

  console.log(`✅ Email enviado: ${assunto}`);
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log('👔 Rex — Gerando cronograma de stories...');

  const hoje     = new Date();
  const dataInfo = formatarData(hoje);
  const state    = loadState();

  console.log(`📅 ${dataInfo.diaSemana}, ${dataInfo.dia}/${dataInfo.mes}/${dataInfo.ano}`);

  const cronograma = montarCronograma(dataInfo, state);
  saveState(state);

  console.log('🔍 Buscando tendências do dia...');
  const tendencias = await buscarTendencias();
  console.log(`   Google Trends: ${tendencias.googleTrends.length} termos | Notícias: ${tendencias.noticias.length}`);

  console.log('📄 Gerando PDF...');
  const pdfBuffer = await gerarPDF(cronograma);

  console.log('📧 Enviando email...');
  await enviarEmail(cronograma, pdfBuffer, tendencias);

  console.log('🎉 Cronograma entregue com sucesso!');
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
