/**
 * Rex — Daily Instagram Content Generator
 * Passo a Passo Uniformes
 * Sistema de templates rotativos — 100% gratuito
 */

const nodemailer = require('nodemailer');

// ===========================
// CONTEXTO DA EMPRESA
// ===========================
const EMPRESA = {
  instagram: '@passoapassouniformes',
  whatsapp: '(51) 98560-0893',
  cidade: 'Novo Hamburgo, RS',
  anos: '+30 anos',
  landing: 'passoapasso.com.br'
};

const CAMPANHA_ATIVA = {
  nome: 'Desafio Formandos 2026',
  prazo: '31/03/2026',
  premio: 'coquetel de salgados e refrigerante',
  cta: 'Link na bio para participar!'
};

const DIAS_PT = ['domingo','segunda-feira','terca-feira','quarta-feira','quinta-feira','sexta-feira','sabado'];
const MESES_PT = ['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

// ===========================
// BANCO DE TEMPLATES
// 5 variacoes por pilar = 5 semanas sem repetir
// ===========================
const TEMPLATES = {

  // DOMINGO — INSPIRACAO
  0: [
    {
      formato: 'Post unico',
      horario: '10h',
      arte: 'Fundo laranja #C85A00 | Texto branco centralizado | Logo no rodape',
      conteudo: `SLIDE UNICO:
"Cada uniforme conta uma historia.
Qual e a sua?"

Logo Passo a Passo + @passoapassouniformes`,
      legenda: `Voce sabia que o uniforme diz muito sobre quem voce e e onde pertence? 🧡

Ha 30 anos, a Passo a Passo ajuda pessoas a vestirem sua identidade com orgulho — seja na escola, na academia, na empresa ou na formatura.

Qual uniforme marca a sua historia?

📍 Novo Hamburgo e regiao
📲 Link na bio

#PassoaPassoUniformes #UniformePersonalizado #NovoHamburgo #ValeDosSinos #Identidade`,
      dica: 'Posts inspiracionais no domingo tem alto engajamento — pessoas estao mais relaxadas e reflexivas.'
    },
    {
      formato: 'Post unico',
      horario: '11h',
      arte: 'Fundo preto | Frase em Inter 800 branco | Detalhe laranja',
      conteudo: `SLIDE UNICO:
"30 anos. Milhares de uniformes.
Uma unica missao: vestir com qualidade."

Passo a Passo Uniformes`,
      legenda: `Tres decadas no Vale dos Sinos. 🧡

Cada peca que sai daqui carrega o cuidado de quem faz isso por amor — nao so por oficio.

Escola, empresa, academia, time ou formatura: a gente veste quem faz acontecer.

📲 Orcamento no link da bio
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #30Anos #ValeDosSinos #FerramentaDeIdentidade`,
      dica: 'Numeros grandes como "30 anos" geram credibilidade instantanea. Use sempre que possivel.'
    },
    {
      formato: 'Carrossel',
      horario: '10h',
      arte: 'Slide 1: laranja | Slides 2-3: preto | Tipografia Inter bold',
      conteudo: `SLIDE 1: "O uniforme certo transforma o ambiente."
SLIDE 2: "Uma equipe uniformizada transmite profissionalismo."
SLIDE 3: "Uma turma uniformizada cria pertencimento."
SLIDE 4: "Ha 30 anos transformando identidade em realidade. 🧡"`,
      legenda: `O uniforme vai muito alem da roupa. 👇

Ele cria identidade. Une as pessoas. Transmite profissionalismo.

Ha 30 anos a Passo a Passo faz isso com qualidade e cuidado no Vale dos Sinos.

📲 Orcamento: ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#UniformePersonalizado #PassoaPassoUniformes #Identidade #NovoHamburgo`,
      dica: 'Carrosseis educativos tem salvo (compartilhamento privado) alto — otimo para alcance organico.'
    },
    {
      formato: 'Post unico',
      horario: '10h30',
      arte: 'Foto de uniforme entregue (ou fundo laranja) | Frase em destaque',
      conteudo: `"Nao e so um uniforme.
E a roupa que voce veste
quando representa algo maior."

Passo a Passo Uniformes | ${EMPRESA.cidade}`,
      legenda: `Cada vez que alguem veste um uniforme feito pela Passo a Passo, representa algo. 🧡

Uma escola. Uma empresa. Um time. Uma turma de formandos.

Isso e o que nos move ha 30 anos.

📲 Link na bio para orcamento
#PassoaPassoUniformes #ValeDosSinos #UniformeComSignificado`,
      dica: 'Posts com frases curtas e impactantes tem maior taxa de salvamento no Instagram.'
    },
    {
      formato: 'Post unico',
      horario: '11h',
      arte: 'Fundo: foto ou laranja | Texto: Playfair Display italic',
      conteudo: `"Ha quem faca uniforme.
Ha quem vista identidade.

A Passo a Passo e do segundo tipo."`,
      legenda: `Diferenca que faz diferenca. 🧡

Nao so produzimos uniformes — entendemos o que cada peca representa para cada cliente.

30 anos de historia no Vale dos Sinos nos ensinaram isso.

📍 ${EMPRESA.cidade} | Atendemos raio de 40km
📲 Orcamento: link na bio

#PassoaPassoUniformes #Qualidade #UniformePersonalizado`,
      dica: 'Tom mais poetico no domingo funciona bem — combine com uma foto bonita do produto.'
    }
  ],

  // SEGUNDA — PROVA SOCIAL
  1: [
    {
      formato: 'Carrossel',
      horario: '18h',
      arte: 'Slide 1: fundo preto + logo cliente | Slides seguintes: produto entregue',
      conteudo: `SLIDE 1: "Mais um projeto entregue com muito carinho 🧡"
SLIDE 2: [foto do uniforme]
SLIDE 3: "Cliente: [nome/segmento]"
SLIDE 4: "Obrigada pela confianca! Seu proximo uniforme tambem pode ser assim."`,
      legenda: `Entrega concluida! 🧡

Mais uma turma/empresa/academia que confiou na Passo a Passo para vestir sua identidade.

Ha 30 anos fazemos isso com o mesmo cuidado do primeiro dia.

Quer ver o que podemos fazer pela sua equipe?
📲 ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #ProjetoConcluido #UniformePersonalizado #NovoHamburgo`,
      dica: 'Peca autorizacao do cliente para marcar o perfil — aumenta muito o alcance.'
    },
    {
      formato: 'Post unico',
      horario: '19h',
      arte: 'Foto do produto com qualidade | Overlay laranja sutil',
      conteudo: `"Clientes como Beira Rio, Monaco Atacado e Ortobom
ja confiaram na Passo a Passo.

E voce, ja conhece nosso trabalho?"`,
      legenda: `Nomes grandes confiam em nos. 🧡

Beira Rio. Monaco Atacado. Ortobom.

Empresas que exigem qualidade e sabem reconhecer um bom fornecedor.

Se voce tambem precisa de uniformes personalizados para sua empresa ou equipe, a gente tem 30 anos de experiencia para te ajudar.

📲 Orcamento: ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade} | ~40km de cobertura

#PassoaPassoUniformes #BeiraRio #UniformeEmpresarial #Qualidade`,
      dica: 'Citar clientes conhecidos aumenta muito a credibilidade — use com frequencia.'
    },
    {
      formato: 'Reels',
      horario: '18h',
      arte: 'Video curto mostrando bastidores da producao ou produto final',
      conteudo: `[0-3s] Texto: "Chegou! 📦"
[3-8s] Mostrar o produto sendo desembalado ou entregue
[8-13s] Texto: "Mais um projeto Passo a Passo entregue com amor 🧡"
[13-15s] Logo + CTA`,
      legenda: `Chegou mais um pedido! 📦🧡

Ver o produto pronto nas maos do cliente e o melhor momento do nosso dia.

Quer o seu? Fala com a gente!
📲 ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #UniformePersonalizado #Entrega #NovoHamburgo`,
      dica: 'Reels de "unboxing" ou entrega tem alto engajamento — filmem sempre que possivel.'
    },
    {
      formato: 'Post unico',
      horario: '19h',
      arte: 'Print de conversa de WhatsApp (com nome ocultado) ou depoimento visual',
      conteudo: `"[Depoimento do cliente aqui]"

— Cliente satisfeito, [cidade/segmento]`,
      legenda: `Nada melhor do que ouvir de quem ja comprou! 🧡

Esse e o combustivel que nos faz continuar com o mesmo cuidado ha 30 anos.

Voce tambem quer esse resultado para sua equipe?
📲 ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #Depoimento #ClienteSatisfeito #UniformePersonalizado`,
      dica: 'Colete depoimentos por escrito no WhatsApp e pe ca autorizacao para publicar — ouro para o Instagram.'
    },
    {
      formato: 'Carrossel',
      horario: '18h30',
      arte: 'Slide 1: chamada | Slide 2-4: fotos de projetos diferentes | Slide 5: CTA',
      conteudo: `SLIDE 1: "Veja o que saiu da Passo a Passo essa semana 👇"
SLIDE 2-4: [fotos de uniformes entregues]
SLIDE 5: "Seu projeto pode ser o proximo. 📲 Link na bio"`,
      legenda: `A semana foi produtiva por aqui! 🧡

Varios projetos entregues com qualidade e no prazo — do jeito que a gente gosta.

Academia, escola, empresa ou formatura: a Passo a Passo entrega.

📲 ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade} | 30 anos de mercado

#PassoaPassoUniformes #Producao #UniformePersonalizado #ValeDosSinos`,
      dica: 'Carrosseis com portfolio geram salvamentos — as pessoas guardam para referencia futura.'
    }
  ],

  // TERCA — EDUCACAO
  2: [
    {
      formato: 'Carrossel',
      horario: '12h',
      arte: 'Slides informativos | Fundo claro + texto escuro + detalhes laranja',
      conteudo: `SLIDE 1: "Voce sabe escolher o tecido certo para o seu uniforme? 👇"
SLIDE 2: "POLIESTER — Leve, resistente, seca rapido. Ideal para academia e esportes."
SLIDE 3: "ALGODAO — Confortavel e macio. Ideal para uso diario em escritorios."
SLIDE 4: "MALHA DRY FIT — Alta performance. Perfeito para atividade fisica intensa."
SLIDE 5: "Duvida? A gente te ajuda a escolher o melhor para sua equipe 📲"`,
      legenda: `Escolher o tecido certo faz toda a diferenca no resultado final! 🧡

Cada segmento tem um tecido ideal — e a Passo a Passo tem 30 anos de experiencia para te orientar na melhor escolha.

📲 Fala com a gente: ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#UniformePersonalizado #PassoaPassoUniformes #DicaDeUniforme #Tecidos`,
      dica: 'Conteudo educativo e muito salvo e compartilhado — posiciona a marca como autoridade.'
    },
    {
      formato: 'Carrossel',
      horario: '12h',
      arte: 'Visual limpo | Icons + texto | Cores da marca',
      conteudo: `SLIDE 1: "5 erros ao pedir uniforme personalizado (e como evitar) 👇"
SLIDE 2: "1. Nao definir a quantidade antes — sempre saiba o numero de pecas"
SLIDE 3: "2. Ignorar o prazo de producao — planeje com antecedencia"
SLIDE 4: "3. Nao aprovar uma amostra — sempre confira antes de fechar tudo"
SLIDE 5: "4. Escolher so pelo preco — qualidade e durabilidade importam"
SLIDE 6: "5. Nao considerar a identidade visual — uniforme precisa combinar com a marca"
SLIDE 7: "A Passo a Passo te guia em cada etapa. 30 anos de experiencia a seu favor. 📲"`,
      legenda: `Evite esses erros no seu proximo pedido de uniforme! 👇🧡

Depois de 30 anos no mercado, a gente ja viu de tudo. Por isso compartilhamos o que aprendemos.

Quer fazer certo desde o inicio?
📲 ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #DicaDeUniforme #UniformePersonalizado #NovoHamburgo`,
      dica: 'Listas de "erros a evitar" tem alto engajamento — as pessoas se identificam e compartilham.'
    },
    {
      formato: 'Post unico',
      horario: '12h30',
      arte: 'Infografico simples | Fundo claro | Icones laranja',
      conteudo: `"PEDIDO MINIMO: 10 PECAS

Por que?
✓ Garante custo acessivel por peca
✓ Permite personalizacao completa
✓ Viabiliza producao de qualidade

Menos que isso, a qualidade cai.
Mais que isso, a gente escala junto com voce."`,
      legenda: `Uma duvida muito comum: por que pedido minimo de 10 pecas? 🧡

A resposta e simples: abaixo disso, o custo por peca sobe muito e a qualidade da personalizacao cai.

Com 10 pecas ou mais, a gente consegue entregar o uniforme que voce merece — com qualidade, prazo e preco justo.

📲 ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade} | 30 anos de mercado

#PassoaPassoUniformes #UniformePersonalizado #PedidoMinimo #Transparencia`,
      dica: 'Transparencia sobre processos gera confianca — clientes valorizam marcas que explicam o "por que".'
    },
    {
      formato: 'Carrossel',
      horario: '12h',
      arte: 'Visual de comparacao | Antes/depois ou lado a lado',
      conteudo: `SLIDE 1: "Sublimacao vs Silk: qual e o melhor para o seu uniforme? 👇"
SLIDE 2: "SUBLIMACAO — Cor em toda a peca, duravel, nao descasca. Ideal para esportes e academia."
SLIDE 3: "SILK SCREEN — Impressao sobre tecido, economico para grandes quantidades. Ideal para empresas."
SLIDE 4: "A escolha certa depende do seu uso. A gente te ajuda! 📲"`,
      legenda: `Sublimacao ou silk? Essa duvida aparece muito por aqui! 🧡

Cada tecnica tem sua aplicacao ideal — e escolher certo faz toda a diferenca no resultado final.

Com 30 anos de experiencia, a Passo a Passo te orienta na melhor escolha para o seu projeto.

📲 ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #Sublimacao #Silk #UniformePersonalizado #DicaDeUniforme`,
      dica: 'Comparativos educativos tem altissima taxa de salvamento — as pessoas guardam para consultar depois.'
    },
    {
      formato: 'Post unico',
      horario: '12h',
      arte: 'Visual clean | Checklist visual | Cores da marca',
      conteudo: `"CHECKLIST DO UNIFORME PERFEITO:
✓ Tecido adequado para o uso
✓ Cores alinhadas com a identidade visual
✓ Personalizacao (logo, nome, numero)
✓ Quantidade certa (min. 10 pecas)
✓ Prazo definido com antecedencia
✓ Fornecedor de confianca

Esse ultimo item a gente ja resolve. 😉"`,
      legenda: `Antes de pedir o proximo uniforme, passa por esse checklist! ✅🧡

Cada item faz diferenca no resultado final — e a Passo a Passo esta aqui para garantir que nenhum seja esquecido.

30 anos de experiencia a seu favor.

📲 ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #ChecklistUniforme #UniformePersonalizado #NovoHamburgo`,
      dica: 'Checklists sao muito salvos — excelente formato para gerar trafego organico recorrente.'
    }
  ],

  // QUARTA — CAMPANHA ATIVA
  3: [
    {
      formato: 'Carrossel',
      horario: '18h',
      arte: 'Slide 1: fundo laranja | Slides: fundo preto | Texto branco bold',
      conteudo: `SLIDE 1: "Sua turma pode GANHAR uma festa! 🎉 [prazo: ${CAMPANHA_ATIVA.prazo}]"
SLIDE 2: "Como participar do Desafio Formandos 2026:"
SLIDE 3: "01 — Feche o uniforme ate ${CAMPANHA_ATIVA.prazo}"
SLIDE 4: "02 — Tire foto com a turma toda"
SLIDE 5: "03 — Posta marcando @passoapassouniformes"
SLIDE 6: "04 — Turma com mais curtidas GANHA 🏆"
SLIDE 7: "Premio: ${CAMPANHA_ATIVA.premio} para comemorar! 📲 Link na bio"`,
      legenda: `Formandos 2026, isso e para voces! 🎉

Feche o uniforme da turma com a Passo a Passo, poste a foto marcando a gente e a turma com mais curtidas ganha um ${CAMPANHA_ATIVA.premio} para comemorar junto!

So ate ${CAMPANHA_ATIVA.prazo}. Nao perca!

✅ Pedido minimo: 10 pecas
📲 Link na bio para participar
📍 ${EMPRESA.cidade} e regiao

#DesafioFormandos2026 #Formandos2026 #UniformeDeFormatura #PassoaPassoUniformes #NovoHamburgo`,
      dica: 'Quarta-feira e o melhor dia para posts de campanha — meio da semana, alto engajamento.'
    },
    {
      formato: 'Reels',
      horario: '18h',
      arte: 'Video dinamico com texto animado | Musica trending',
      conteudo: `[0-3s] "Atenção formandos 2026 👀"
[3-7s] "Feche o uniforme ate ${CAMPANHA_ATIVA.prazo}"
[7-11s] "Poste a foto marcando @passoapassouniformes"
[11-14s] "A turma com mais curtidas GANHA 🏆"
[14-16s] "${CAMPANHA_ATIVA.premio.toUpperCase()}! 🎉"
[16-18s] "Link na bio — so ate ${CAMPANHA_ATIVA.prazo}!"`,
      legenda: `Desafio Formandos 2026 ainda esta aberto! 🏆🎉

Regras simples:
✅ Fecha o uniforme ate ${CAMPANHA_ATIVA.prazo}
📸 Tira foto com a turma
❤️ Posta marcando a gente
🎉 Mais curtidas = ${CAMPANHA_ATIVA.premio}!

Corre — faltam poucos dias!
📲 Link na bio

#DesafioFormandos2026 #Formandos2026 #PassoaPassoUniformes #Formatura2026`,
      dica: 'Reels de campanha com urgencia geram compartilhamentos — peca a turma para marcar os amigos.'
    },
    {
      formato: 'Post unico',
      horario: '19h',
      arte: 'Contador visual de dias restantes | Fundo laranja | Texto grande',
      conteudo: `"FALTAM X DIAS
para fechar no Desafio Formandos 2026

🏆 Premio: ${CAMPANHA_ATIVA.premio}
📅 Prazo: ${CAMPANHA_ATIVA.prazo}
📲 Link na bio"`,
      legenda: `O relogio esta correndo! ⏰🧡

Desafio Formandos 2026: feche o uniforme da sua turma, poste a foto e concorra a ${CAMPANHA_ATIVA.premio} para comemorar a formatura!

Prazo: ${CAMPANHA_ATIVA.prazo}

📲 ${CAMPANHA_ATIVA.cta}
📍 ${EMPRESA.cidade} | Pedido min. 10 pecas

#DesafioFormandos2026 #Formandos2026 #Formatura2026 #PassoaPassoUniformes`,
      dica: 'Posts com contagem regressiva criam urgencia real — atualize o numero de dias manualmente.'
    },
    {
      formato: 'Carrossel',
      horario: '18h',
      arte: 'Estilo "antes e depois" ou depoimento de formando | Tons laranja e preto',
      conteudo: `SLIDE 1: "Por que escolher a Passo a Passo para o uniforme de formatura?"
SLIDE 2: "+30 anos fazendo uniformes de formatura no Vale dos Sinos"
SLIDE 3: "Simulador de uniforme — voce ve antes de confirmar"
SLIDE 4: "Pedido minimo de 10 pecas — acessivel para qualquer turma"
SLIDE 5: "E ainda: Desafio Formandos 2026 🏆 — ${CAMPANHA_ATIVA.premio}!"
SLIDE 6: "Corre! So ate ${CAMPANHA_ATIVA.prazo}. Link na bio."`,
      legenda: `Formandos 2026: a Passo a Passo e a escolha certa para o uniforme da sua turma! 🧡

30 anos de experiencia + simulador de uniforme + pedido minimo acessivel + Desafio Formandos 2026!

A turma com mais curtidas na foto ganha ${CAMPANHA_ATIVA.premio} — custeado pela gente!

Prazo: ${CAMPANHA_ATIVA.prazo}
📲 Link na bio para participar

#Formandos2026 #UniformeDeFormatura #DesafioFormandos2026 #PassoaPassoUniformes`,
      dica: 'Combine prova social com CTA de campanha — funciona melhor que so campanha.'
    },
    {
      formato: 'Post unico',
      horario: '18h30',
      arte: 'Fundo laranja | Emojis grandes | Texto direto e animado',
      conteudo: `"🎉 DESAFIO FORMANDOS 2026 🎉

Sua turma + mais curtidas =
${CAMPANHA_ATIVA.premio.toUpperCase()}!

Prazo: ${CAMPANHA_ATIVA.prazo}
📲 Link na bio — e gratis participar!"`,
      legenda: `Manda esse post para o grupo da turma! 📲👇

Desafio Formandos 2026 ainda ta aberto — e o premio e ${CAMPANHA_ATIVA.premio} para a turma toda comemorar!

So fechar o uniforme ate ${CAMPANHA_ATIVA.prazo} e participar!

📲 Link na bio
📍 ${EMPRESA.cidade} | Pedido min. 10 pecas

#DesafioFormandos2026 #Formandos2026 #PassoaPassoUniformes #UniformeDeFormatura #Formatura2026`,
      dica: 'Peca diretamente para mandar no grupo da turma — isso viraliza a campanha organicamente.'
    }
  ],

  // QUINTA — IDENTIDADE
  4: [
    {
      formato: 'Post unico',
      horario: '18h',
      arte: 'Foto da equipe ou producao | Overlay laranja suave | Texto branco',
      conteudo: `"Mais de 30 anos.
As mesmas maos cuidadosas.
O mesmo amor pelo que fazemos."

Passo a Passo Uniformes | ${EMPRESA.cidade}`,
      legenda: `Por aqui, cada peca e feita com cuidado. 🧡

Tres decadas no Vale dos Sinos nos ensinaram que o que fideliza um cliente nao e so o produto — e o cuidado com que ele e feito.

Obrigada a cada cliente que confiou e confia na Passo a Passo.

📲 ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #30Anos #FeitoComAmor #ValeDosSinos`,
      dica: 'Posts humanizados (equipe, bastidores, historia) geram muito engajamento emocional.'
    },
    {
      formato: 'Carrossel',
      horario: '18h',
      arte: 'Linha do tempo visual | Fundo escuro | Marcos em laranja',
      conteudo: `SLIDE 1: "Nossa historia em numeros 🧡"
SLIDE 2: "+30 anos no mercado"
SLIDE 3: "Atendemos raio de 40km — NH e toda a regiao"
SLIDE 4: "Segmentos: escolas, empresas, esportes, saude, academias, formandos"
SLIDE 5: "Clientes: Beira Rio, Monaco Atacado, Ortobom"
SLIDE 6: "1 missao: vestir com qualidade quem faz o Vale dos Sinos acontecer"`,
      legenda: `Quando a gente para para olhar para tras, a historia e bonita. 🧡

+30 anos. Dezenas de segmentos atendidos. Centenas de clientes satisfeitos. Milhares de uniformes entregues.

E a mesma dedicacao do primeiro dia.

Obrigada por fazer parte dessa historia!

📲 ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #Historia #ValeDosSinos #UniformePersonalizado`,
      dica: 'Mostrar numeros reais (anos, clientes, alcance) aumenta muito a percepacao de autoridade.'
    },
    {
      formato: 'Post unico',
      horario: '19h',
      arte: 'Foto da producao ou equipe | Estilo editorial | Cores da marca',
      conteudo: `"Em 2024, quando o RS precisou,
a Passo a Passo parou tudo
e fez cobertores para doacao.

Porque somos parte desse povo."`,
      legenda: `Isso a gente nunca vai esquecer. 🧡

Na enchente de 2024, a pior da historia do Rio Grande do Sul, a Passo a Passo parou a producao de uniformes e passou a produzir cobertores para doacao.

Porque nao somos so uma confeccao. Somos gaúchos. Somos parte dessa comunidade.

Obrigada a todos que apoiaram e continuam apoiando a Passo a Passo.

📍 ${EMPRESA.cidade}
#PassoaPassoUniformes #RioGrandeDoSul #ValeDosSinos #Solidariedade #GauchoNaoDesiste`,
      dica: 'A historia da enchente e o maior ativo emocional da marca — use com frequencia e sem medo.'
    },
    {
      formato: 'Reels',
      horario: '18h',
      arte: 'Tour pelo atelie/producao | Musica instrumental suave',
      conteudo: `[0-5s] Mostrar a entrada ou fachada
[5-15s] Bastidores da producao — maquinas, tecidos, equipe trabalhando
[15-20s] Produto pronto sendo embalado
[20-25s] Texto: "30 anos fazendo com cuidado. Isso e Passo a Passo."`,
      legenda: `Quer ver de perto como e feito? 👀🧡

Cada uniforme que sai daqui passou por maos dedicadas e por um processo cuidadoso de producao.

Ha 30 anos fazemos isso em Novo Hamburgo para o Vale dos Sinos todo.

📲 Orcamento: ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #Bastidores #Producao #UniformePersonalizado #NovoHamburgo`,
      dica: 'Videos de bastidores de producao tem alcance organico alto — as pessoas amam ver "como e feito".'
    },
    {
      formato: 'Post unico',
      horario: '18h30',
      arte: 'Citacao visual | Fundo preto | Texto grande branco | Detalhe laranja',
      conteudo: `"Nosso diferencial nao e so a qualidade
do produto — e a qualidade
do relacionamento com cada cliente."

Passo a Passo Uniformes | +30 anos`,
      legenda: `Atendimento atencioso nao e obrigacao — e nossa marca registrada. 🧡

Ha 30 anos no Vale dos Sinos, aprendemos que o cliente nao quer so um bom produto. Quer ser ouvido, entendido e bem atendido.

E e exatamente isso que a Passo a Passo entrega — sempre.

📲 ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #AtendimentoAtencioso #Relacionamento #30Anos`,
      dica: 'Diferencial de atendimento ressoa muito com decisores B2B — otimo para atrair empresas.'
    }
  ],

  // SEXTA — ENGAJAMENTO
  5: [
    {
      formato: 'Post unico',
      horario: '18h',
      arte: 'Fundo laranja | Pergunta grande | Visual limpo',
      conteudo: `"ENQUETE 📊

Voce prefere uniforme com:
❤️ Identidade simples e elegante
🔥 Estampa arrojada e personalizada

Comenta aqui em baixo!"`,
      legenda: `Bora debater! 👇🧡

Todo mundo tem uma preferencia quando o assunto e uniforme — e a gente adora saber a opiniao de voces!

Voce prefere o estilo mais limpo e elegante ou uma estampa mais ousada e personalizada?

Comenta abaixo ⬇️

📲 Qualquer que seja sua escolha, a Passo a Passo faz! ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #Enquete #UniformePersonalizado #SuaOpiniao`,
      dica: 'Perguntas diretas nos posts aumentam os comentarios — o algoritmo adora isso.'
    },
    {
      formato: 'Post unico',
      horario: '18h30',
      arte: 'Dois uniformes lado a lado | Fundo neutro | Visual clean',
      conteudo: `"ISSO OU AQUILO? 👇

A: Uniforme classico, cores solidas
B: Uniforme com sublimacao total

Qual voce escolheria para sua equipe?
Comenta A ou B! 👇"`,
      legenda: `Qual time voce esta? 😄🧡

Uniformes classicos com cores solidas ou sublimacao total com design arrojado?

Comenta A ou B aqui embaixo — queremos saber!

(E claro: a Passo a Passo faz os dois com a mesma qualidade 😉)

📲 ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #IssoOuAquilo #UniformePersonalizado #Engajamento`,
      dica: 'Posts "escolha A ou B" tem alta taxa de comentario — simples e eficaz para engajamento.'
    },
    {
      formato: 'Post unico',
      horario: '18h',
      arte: 'Fundo escuro | Texto grande | Icone de interrogacao em laranja',
      conteudo: `"ADIVINHE O SEGMENTO 🤔

Qual tipo de cliente usaria esse uniforme?
[ foto do uniforme ]

A) Academia
B) Escola
C) Empresa
D) Time esportivo

Comenta sua resposta! 👇"`,
      legenda: `Voce consegue adivinhar? 👀🧡

Cada uniforme conta uma historia — e quem trabalha com isso ha 30 anos aprende a ler essa historia so de olhar.

Comenta abaixo qual segmento voce acha que e! ⬇️

📲 Quer um uniforme assim para sua equipe? ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #Quiz #UniformePersonalizado #Adivinha`,
      dica: 'Posts de "adivinhe" sao muito comentados — use fotos de uniformes do portfolio.'
    },
    {
      formato: 'Post unico',
      horario: '18h',
      arte: 'Fundo laranja | Pergunta direta | Espaco para resposta nos comentarios',
      conteudo: `"CAIXA DE PERGUNTAS 📬

Manda sua duvida sobre uniformes aqui nos comentarios!

Preco? Prazo? Tecido? Personalizacao?

A gente responde TODOS 🧡"`,
      legenda: `Tem duvida sobre uniformes personalizados? Manda aqui! 👇🧡

A gente tem 30 anos de experiencia e responde tudo — preco, prazo, tecido, quantidade minima, personalizacao, entrega...

Comenta sua pergunta abaixo ⬇️

📲 Resposta rapida tambem pelo WhatsApp: ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #CaixaDePerguntas #UniformePersonalizado #Duvidas`,
      dica: 'Caixa de perguntas nos comentarios gera engajamento alto E mostra autoridade nas respostas.'
    },
    {
      formato: 'Post unico',
      horario: '18h30',
      arte: 'Visual divertido | Fundo claro | Emojis | Tom descontraido',
      conteudo: `"VERDADE OU MITO? 🤔

Uniforme personalizado e so para grandes empresas.

MITO! ✅

Pedido minimo: 10 pecas
Atendemos academias, times, turmas e muito mais

Conhecia esse fato? Comenta! 👇"`,
      legenda: `Desmistificando o uniforme personalizado! 🧡

Muita gente acha que uniforme personalizado so e possivel para grandes empresas. MITO!

Com apenas 10 pecas voce ja consegue um uniforme 100% personalizado com a identidade da sua equipe.

Academia, time, turma, clinica — a Passo a Passo atende todo mundo!

📲 ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#PassoaPassoUniformes #VerdadeOuMito #UniformePersonalizado #PequenaEmpresa`,
      dica: 'Posts "verdade ou mito" educam e engajam ao mesmo tempo — combo perfeito.'
    }
  ],

  // SABADO — PRODUTO
  6: [
    {
      formato: 'Carrossel',
      horario: '10h',
      arte: 'Fotos do produto | Fundo neutro | Detalhes em evidencia | Overlay laranja sutil',
      conteudo: `SLIDE 1: "Uniforme de Academia 💪 — feito para quem da o maximo"
SLIDE 2: [foto frente]
SLIDE 3: [foto detalhe logo]
SLIDE 4: [foto equipe usando]
SLIDE 5: "Material dry-fit | Sublimacao total | Pedido min. 10 pecas | 📲 ${EMPRESA.whatsapp}"`,
      legenda: `Uniforme de academia do jeito certo! 💪🧡

Dry-fit de qualidade, sublimacao total, cores vibrantes que nao desbotam — tudo com a identidade da sua academia estampada com orgulho.

Sua equipe e seus alunos merecem vestir sua marca com orgulho.

📲 Orcamento: ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade} | Pedido min. 10 pecas

#UniformeDeAcademia #PassoaPassoUniformes #Academia #CrossFit #UniformePersonalizado`,
      dica: 'Sabado de manha e otimo para atingir donos de academia — estao no trabalho cedo.'
    },
    {
      formato: 'Carrossel',
      horario: '10h',
      arte: 'Uniforme corporativo em destaque | Fundo claro | Estilo editorial clean',
      conteudo: `SLIDE 1: "Uniforme corporativo que transmite profissionalismo 🏢"
SLIDE 2: [foto do uniforme]
SLIDE 3: [detalhe do bordado/estampa]
SLIDE 4: "Sua empresa merece uma identidade visual que impresses"
SLIDE 5: "📲 ${EMPRESA.whatsapp} | Pedido min. 10 pecas"`,
      legenda: `Primeira impressao conta — e o uniforme faz toda a diferenca. 🧡

Um time bem vestido transmite profissionalismo, unidade e cuidado com a imagem da empresa.

A Passo a Passo cria uniformes corporativos que representam a sua marca do jeito certo.

📲 Orcamento: ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade} | +30 anos de mercado

#UniformeEmpresarial #PassoaPassoUniformes #IdentidadeCorporativa #Profissionalismo`,
      dica: 'Posts de uniforme corporativo atraem decisores B2B — use linguagem profissional e direta.'
    },
    {
      formato: 'Post unico',
      horario: '10h30',
      arte: 'Uniforme de formatura em destaque | Fundo laranja ou preto',
      conteudo: `"UNIFORME DE FORMATURA 🎓

O uniforme que marca essa data para sempre.
Personalizado. Com o estilo da sua turma.

Desafio Formandos 2026 — ate ${CAMPANHA_ATIVA.prazo}
📲 Link na bio"`,
      legenda: `Formandos 2026, o uniforme dos sonhos da turma pode ser realidade! 🎓🧡

Personalizado com as cores e o estilo que voces escolherem — com o cuidado de quem faz isso ha 30 anos no Vale dos Sinos.

E ainda: participe do Desafio Formandos 2026 e concorra a ${CAMPANHA_ATIVA.premio}!

Prazo: ${CAMPANHA_ATIVA.prazo}
📲 Link na bio para participar

#Formandos2026 #UniformeDeFormatura #PassoaPassoUniformes #DesafioFormandos2026`,
      dica: 'Sabado de manha formandos estao ativos no Instagram — momento ideal para esse tipo de post.'
    },
    {
      formato: 'Carrossel',
      horario: '10h',
      arte: 'Uniforme esportivo colorido | Acao | Dinamismo visual',
      conteudo: `SLIDE 1: "Uniforme esportivo feito para vencer 🏆"
SLIDE 2: [foto do uniforme em acao]
SLIDE 3: "Sublimacao total | Numero e nome | Patrocinadores"
SLIDE 4: "Seu time merece se sentir campeao antes de entrar em campo"
SLIDE 5: "📲 ${EMPRESA.whatsapp} | Pedido min. 10 pecas"`,
      legenda: `Time que veste bem, joga bem! 🏆🧡

Uniforme esportivo com sublimacao total, nome, numero e espaco para patrocinadores — do jeito que o seu time merece.

Ha 30 anos a Passo a Passo veste times do Vale dos Sinos.

📲 Orcamento: ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#UniformeEsportivo #PassoaPassoUniformes #Time #Futebol #Esportes #UniformePersonalizado`,
      dica: 'Sabado e dia de jogo — timing perfeito para posts de uniforme esportivo.'
    },
    {
      formato: 'Carrossel',
      horario: '10h30',
      arte: 'Uniforme de saude | Branco + laranja | Estilo profissional',
      conteudo: `SLIDE 1: "Uniforme para saude e o que sua clinica precisa 🏥"
SLIDE 2: [foto do uniforme]
SLIDE 3: "Tecido adequado | Lavavel | Profissional"
SLIDE 4: "Sua equipe transmite confianca desde o primeiro olhar"
SLIDE 5: "📲 ${EMPRESA.whatsapp} | Pedido min. 10 pecas"`,
      legenda: `Na area da saude, profissionalismo comeca na aparencia. 🏥🧡

Um uniforme adequado transmite confianca, higiene e seriedade — qualidades essenciais para clinicas, consultórios e hospitais.

A Passo a Passo produz uniformes para saude com os tecidos e acabamentos certos.

📲 Orcamento: ${EMPRESA.whatsapp}
📍 ${EMPRESA.cidade}

#UniformeSaude #PassoaPassoUniformes #Clinica #Saude #UniformePersonalizado`,
      dica: 'Segmento saude busca fornecedores pelo Google — use essas palavras-chave nas hashtags.'
    }
  ]
};

// ===========================
// SELECIONAR TEMPLATE DO DIA
// Usa numero da semana para rotacionar variacoes
// ===========================
function getTemplateHoje() {
  const hoje = new Date();
  const diaSemana = hoje.getDay();
  const semanaDoAno = Math.floor((hoje - new Date(hoje.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
  const variacoes = TEMPLATES[diaSemana];
  const indice = semanaDoAno % variacoes.length;
  return { template: variacoes[indice], diaSemana, data: hoje };
}

function formatarData(data) {
  const dia = data.getDate();
  const mes = MESES_PT[data.getMonth()];
  const ano = data.getFullYear();
  const diaSemana = DIAS_PT[data.getDay()];
  return { dia, mes, ano, diaSemana };
}

// ===========================
// ENVIAR EMAIL
// ===========================
async function enviarEmail(template, dataInfo) {
  const { dia, mes, ano, diaSemana } = formatarData(dataInfo);

  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const assunto = `📱 Instagram — ${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} ${dia}/${mes} | Passo a Passo`;

  const conteudoFormatado = template.conteudo
    .split('\n')
    .map(linha => `<div style="margin:2px 0;">${linha || '&nbsp;'}</div>`)
    .join('');

  const legendaFormatada = template.legenda
    .split('\n')
    .map(linha => `<div style="margin:2px 0;">${linha || '&nbsp;'}</div>`)
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;background:#0A0A0A;color:#fff;margin:0;padding:0}
  .wrap{max-width:600px;margin:0 auto;padding:24px}
  .header{background:#C85A00;border-radius:12px 12px 0 0;padding:20px 24px}
  .header h1{font-size:18px;font-weight:800;margin:0;color:#fff}
  .header p{font-size:12px;color:rgba(255,255,255,0.8);margin:4px 0 0}
  .body{background:#111;border-radius:0 0 12px 12px;padding:24px}
  .badge{display:inline-block;background:rgba(200,90,0,0.2);border:1px solid rgba(200,90,0,0.4);color:#E06A10;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;margin-bottom:16px}
  .meta{display:flex;gap:16px;margin-bottom:20px;flex-wrap:wrap}
  .meta-item{background:#1A1A1A;border:1px solid rgba(200,90,0,0.3);border-radius:8px;padding:10px 14px;flex:1;min-width:120px}
  .meta-label{font-size:10px;color:#C85A00;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
  .meta-value{font-size:14px;font-weight:600;color:#fff}
  .section{background:#1A1A1A;border-radius:8px;padding:16px;margin-bottom:16px;border-left:3px solid #C85A00}
  .section h3{font-size:12px;color:#C85A00;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;font-weight:700}
  .section .content{font-size:13px;line-height:1.8;color:#E0E0E0}
  .dica{background:rgba(200,90,0,0.08);border:1px solid rgba(200,90,0,0.2);border-radius:8px;padding:14px;margin-top:16px}
  .dica-label{font-size:11px;color:#C85A00;font-weight:700;margin-bottom:6px}
  .dica-text{font-size:13px;color:#CACACA;line-height:1.6}
  .footer{text-align:center;margin-top:20px;font-size:11px;color:#4A4A4A}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>📱 Sugestão de Conteúdo — Instagram</h1>
    <p>${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}, ${dia} de ${mes} de ${ano} · Passo a Passo Uniformes</p>
  </div>
  <div class="body">
    <div class="badge">👔 REX — CEO AGENT</div>

    <div class="meta">
      <div class="meta-item">
        <div class="meta-label">Formato</div>
        <div class="meta-value">${template.formato}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Horário Ideal</div>
        <div class="meta-value">${template.horario}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Pilar</div>
        <div class="meta-value">${DIAS_PT[dataInfo.getDay()].toUpperCase()}</div>
      </div>
    </div>

    <div class="section">
      <h3>🎨 Arte / Visual</h3>
      <div class="content">${template.arte}</div>
    </div>

    <div class="section">
      <h3>📋 Estrutura do Conteúdo</h3>
      <div class="content">${conteudoFormatado}</div>
    </div>

    <div class="section">
      <h3>✍️ Legenda (pronta para copiar)</h3>
      <div class="content">${legendaFormatada}</div>
    </div>

    <div class="dica">
      <div class="dica-label">💡 Dica Estratégica do Dia</div>
      <div class="dica-text">${template.dica}</div>
    </div>
  </div>
  <div class="footer">
    Passo a Passo Uniformes · Novo Hamburgo, RS<br/>
    Gerado automaticamente por Rex, CEO Agent · AIOS System
  </div>
</div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Rex | Passo a Passo" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: assunto,
    html
  });

  console.log(`✅ Email enviado: ${assunto}`);
}

// ===========================
// MAIN
// ===========================
async function main() {
  console.log('👔 Rex — Selecionando conteúdo do dia...');

  const { template, diaSemana, data } = getTemplateHoje();
  const dataInfo = formatarData(data);

  console.log(`📅 ${dataInfo.diaSemana}, ${dataInfo.dia}/${dataInfo.mes} | Formato: ${template.formato} | ${template.horario}`);

  await enviarEmail(template, data);
  console.log('📧 Email entregue com sucesso!');
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
