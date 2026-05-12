# 📊 Painel de Vendas — SalesBoard Pro

## O que é

Dashboard em tempo real para a equipe de vendas. Exibe ranking, metas, notificações de novas vendas e roleta de prêmios.

## Versões

| Versão | Pasta | Stack | Deploy |
|--------|-------|-------|--------|
| v1 (Standalone) | `painel-vendas-comercial/` | HTML + Vanilla JS + Google Sheets | Surge.sh |
| v2 (Firebase Native) | `painel-vendas-comercial-app/` | Firebase SDK + Cloud Functions | Firebase Hosting / Vercel |

## Funcionalidades

- 🏆 **Ranking** com pódio (ouro, prata, bronze) e lista completa
- 🎰 **Roleta de prêmios** animada para motivação
- 🔔 **Notificações push** via Firebase Cloud Messaging
- 📱 **PWA** — funciona como app no celular
- 📊 **Integração Google Sheets** (via Google Apps Script)
- ⚡ **Tempo real** — atualização automática das vendas

## Como registrar uma venda

1. Atualizar Google Sheets com os dados da venda
2. Google Apps Script sincroniza com Firebase
3. Painel atualiza automaticamente para todos os dispositivos
4. Notificação push enviada para a equipe

## Arquivo Google Apps Script
`google-apps-script.gs` — faz a ponte entre Sheets e Firebase

## Acesso
- Deploy: Surge.sh (v1) / Firebase Hosting (v2)
- PWA instalável no celular da equipe
