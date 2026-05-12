# 💻 Mapa de Sistemas

> Visão geral de todos os sistemas digitais criados para a Passo a Passo Uniformes.

---

## 🛒 Sistemas de Venda

| Sistema | Arquivo/Pasta | Stack | Status |
|---------|--------------|-------|--------|
| **Fluxo de Pedido** | `fluxo-pedido.html` | HTML + Vanilla JS | ✅ Ativo |
| **Ficha de Pedido** | `ficha-pedido.html` | HTML + Vanilla JS | ✅ Ativo |
| **Tabela de Preços** | `tabela-precos/` | React + Vite + Firebase | ✅ Ativo |
| **Editor de Tabela** | `tabela-precos-editor/` | React + Vite + Firebase | ✅ Ativo |
| **Tabela Príncipe da Paz** | `tabela-principe-da-paz.html` | HTML | ✅ Ativo |

---

## 🌐 Sites e Landing Pages

| Site | Pasta | Stack | Deploy |
|------|-------|-------|--------|
| **Site Oficial** | `site-oficial/` | Next.js 16 + React 19 + Tailwind 4 | Vercel |
| **E-commerce** | `site-ecommerce/` | HTML + Tailwind 3 | Surge/Netlify |
| **Landing Formandos** | `site/landing-formandos/` | HTML + Netlify Forms | Netlify |
| **Landing Camiseta PV** | `site/landing-camiseta-pv/` | HTML | — |
| **Uniformes Empresariais** | `site/uniformes-empresariais/` | HTML | — |
| **Ficha Técnica (site)** | `site/ficha-tecnica/` | HTML | — |
| **Home** | `site/home/` | HTML | — |

---

## 📊 Dashboards e Painéis

| Sistema | Pasta | Stack | Deploy |
|---------|-------|-------|--------|
| **Painel de Vendas v1** | `painel-vendas-comercial/` | HTML + Google Sheets + Firebase | Surge.sh |
| **Painel de Vendas v2** | `painel-vendas-comercial-app/` | Firebase SDK + Cloud Functions | Firebase Hosting |
| **Relatório CRM Abril** | `relatorio-crm-abril-2026.html` | HTML | — |
| **Análise Funil** | `analise-estrategica-funil-abril-2026.html` | HTML | — |
| **Leads Sem Resposta** | `leads-sem-resposta.html` | HTML | — |

---

## 🤖 Automações e Integrações

| Sistema | Pasta | Stack | Função |
|---------|-------|-------|--------|
| **Meta → Bitrix24** | `scripts/integrations/meta-bitrix/` | Node.js + Express | Leads Meta → CRM |
| **Posts Instagram** | `scripts/daily-instagram.js` | Node.js + Nodemailer | Conteúdo diário |
| **Stories Diários** | `scripts/daily-stories.js` | Node.js + PDFKit | Stories PDF |
| **Editor de Vídeo** | `squads/editor-de-cortes/` | Playwright + CapCut | Edição automática |
| **Google Apps Script** | `google-apps-script.gs` | GAS | Sheets → Firebase |

---

## 🗄️ Infraestrutura

| Serviço | Uso |
|---------|-----|
| **Firebase Realtime DB** | Painel de vendas, tabela de preços |
| **Firebase Cloud Functions** | Notificações push |
| **Firebase Hosting** | Deploy frontend |
| **Vercel** | Site oficial (Next.js) |
| **Surge.sh** | Deploy rápido HTML |
| **Netlify** | Landing formandos (Forms) |
| **Google Sheets** | Input de vendas |
| **Bitrix24** | CRM |
| **Meta Business** | Ads + Lead Gen |

---

## 🔑 Variáveis de Ambiente

Arquivo: `.env.example`

Principais:
- `META_PAGE_ACCESS_TOKEN` — Meta Ads
- `BITRIX24_WEBHOOK_URL` — CRM
- `GMAIL_USER` / `GMAIL_APP_PASSWORD` — E-mail automático
- `DEEPSEEK_API_KEY` / `OPENAI_API_KEY` — LLMs
- `EXA_API_KEY` — Web search
- `RAILWAY_TOKEN` / `VERCEL_TOKEN` — Deploy

---

## Links Relacionados
- [[Painel de Vendas]]
- [[CRM - Bitrix24]]
- [[Instagram - Sistema de Conteúdo]]
