# CRM — Bitrix24

## Integração Ativa

O Bitrix24 recebe leads **automaticamente** via webhook do Meta Ads.

### Fluxo automático:
```
Meta Ads (Facebook/Instagram) 
    → Formulário de Lead 
    → Webhook (scripts/integrations/meta-bitrix/) 
    → Bitrix24 (Contato + Deal criado)
```

### Scripts envolvidos:
| Arquivo | Função |
|---------|--------|
| `index.js` | Servidor Express que recebe webhook |
| `meta-api.js` | Busca dados do lead no Meta |
| `bitrix-api.js` | Cria contato + deal no Bitrix |
| `field-mapper.js` | Mapeia campos Meta → Bitrix |

### Variáveis de ambiente necessárias:
```
META_PAGE_ACCESS_TOKEN=
META_VERIFY_TOKEN=
BITRIX24_WEBHOOK_URL=
BITRIX24_DEAL_STAGE=NEW
TICKET_MEDIO_ALUNO=80
```

---

## Pipeline de Vendas (estágios)

| Estágio | Descrição |
|---------|-----------|
| `NOVO` | Lead recém chegado (automático) |
| `QUALIFICANDO` | Etapa 1 — em contato |
| `PROPOSTA` | Orçamento enviado |
| `NEGOCIAÇÃO` | Em negociação de valor/prazo |
| `FECHADO` | Pedido confirmado |
| `PRODUÇÃO` | Em produção |
| `ENTREGUE` | Pedido entregue |
| `PERDIDO` | Lead não convertido |

---

## Relatórios Gerados
- `relatorio-crm-abril-2026.html` — Funil detalhado
- `analise-estrategica-funil-abril-2026.html` — Análise estratégica
- `leads-sem-resposta.html` — Leads sem follow-up
