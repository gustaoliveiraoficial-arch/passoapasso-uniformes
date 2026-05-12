# 📱 Instagram — Sistema de Conteúdo

## Automação Ativa

**Script:** `scripts/daily-instagram.js` + `scripts/daily-stories.js`
**Execução:** `npm run instagram` / `npm run stories`
**Entrega:** E-mail diário às 7h com conteúdo pronto

---

## Pilares de Conteúdo

| Pilar | % | Exemplos |
|-------|---|---------|
| **Produto** | 30% | Novo modelo, processo de produção, detalhes técnicos |
| **Prova Social** | 25% | Depoimentos, entregas, clientes felizes |
| **Educação** | 20% | Dicas de uniformes, diferença de tecidos, cuidados |
| **Bastidores** | 15% | Produção, equipe, dia a dia |
| **Oferta/CTA** | 10% | Promoções, urgência, chamada para orçamento |

---

## Formatos

| Formato | Frequência | Ferramenta |
|---------|-----------|-----------|
| Post feed (carrossel) | 1x/dia | Canva + legenda automática |
| Stories | 6x/dia | PDF gerado automaticamente |
| Reels | 3x/semana | Editor CapCut (automação parcial) |

---

## Automação de Vídeo — Editor CapCut

**Squad:** `squads/editor-de-cortes/`
- Agente `@leitor-pasta` — lê roteiros em Markdown
- Agente `@editor-capcut` — edita vídeos no CapCut via Playwright
- Agente `@revisor-video` — revisa e exporta
- Base de conhecimento: atalhos CapCut, técnicas de edição

---

## Calendário de Datas Comemorativas Integradas

| Mês | Datas |
|-----|-------|
| Jan | Ano Novo, Dia do Estudante |
| Fev | Carnaval, Dia do Orgulho |
| Mar | Dia Internacional da Mulher |
| Abr | Páscoa, Dia do Trabalhador (preparação) |
| Mai | Dia das Mães, Dia do Trabalhador |
| Jun | Dia dos Namorados, Festa Junina |
| Jul | Dia do Amigo, recesso escolar |
| Ago | Dia dos Pais |
| Set | Dia do Cliente, Semana da Pátria |
| Out | Dia das Crianças, Halloween |
| Nov | Consciência Negra, Black Friday |
| Dez | Natal, Confraternizações |

---

## Análise de Performance

Pasta: `docs/instagram-analise/`
- Tracking por post (alcance, engajamento, conversão)
- Comparativo semanal/mensal
