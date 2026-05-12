# ⚙️ Processos Operacionais

## Processo de Pedido (do zero à entrega)

```
LEAD ENTRA
    ↓
[1] QUALIFICAÇÃO — Entender necessidade, tipo, quantidade
    ↓
[2] PRODUTO — Definir modelo, estampas, cores
    ↓
[3] ORÇAMENTO — Valor, pagamento, prazo
    ↓ (aprovado?)
[4] FICHA TÉCNICA — Grade de tamanhos, arte aprovada, data
    ↓
[5] FORMALIZAÇÃO — Dados do cliente, confirmação de produção
    ↓
PRODUÇÃO
    ↓
ENTREGA
    ↓
PÓS-VENDA / RECOMPRA
```

**Ferramenta:** `fluxo-pedido.html` — wizard digital que guia todo este fluxo

---

## Processo de Arte / Layout

| Etapa | Ação | Responsável |
|-------|------|-------------|
| 1 | Cliente envia logo/referência | Cliente |
| 2 | Arte criada ou ajustada | Designer |
| 3 | Aprovação pelo cliente | Cliente |
| 4 | Arte finalizada para produção | Designer |
| 5 | Checklist arte finalista | Designer/QA |

**Checklist:** `checklist-arte-finalista.html` / `.pdf`

---

## Processo de Produção

| Etapa | Prazo estimado |
|-------|---------------|
| Arte aprovada → corte do tecido | 2–3 dias úteis |
| Corte → estamparia | 3–5 dias úteis |
| Estamparia → costura/acabamento | 3–5 dias úteis |
| Acabamento → controle de qualidade | 1–2 dias úteis |
| QA → separação por pedido | 1 dia útil |
| **Total estimado** | **10–16 dias úteis** |

---

## Processo de Marketing Diário

| Hora | Ação | Sistema |
|------|------|---------|
| 7h | Receber e-mail com stories do dia | `daily-stories.js` |
| 7h | Receber e-mail com post Instagram | `daily-instagram.js` |
| 8h | Postar stories (6 frames) | Manual / CapCut |
| 9h | Publicar post no feed | Manual |
| 14h | Engajamento e respostas | Manual |
| 18h | Story da tarde (bastidores/produto) | Manual |

---

## Processo de Entrada de Lead (Meta Ads)

```
Meta Ads → Lead preenchido
    → Webhook (automático, <1 min)
    → Bitrix24 (contato + deal criado)
    → Equipe comercial notificada
    → Primeiro contato em até 5 min
```

---

## Checklist Pré-Entrega

- [ ] Quantidade conferida com pedido
- [ ] Tamanhos conferidos com a grade
- [ ] Arte/estampa conferida (posição, cor)
- [ ] Acabamento sem defeitos
- [ ] Nome do cliente na embalagem
- [ ] Nota fiscal emitida
- [ ] Data de entrega confirmada com cliente
