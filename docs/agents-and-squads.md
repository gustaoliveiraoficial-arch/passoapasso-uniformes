# Agentes e Squads IA — Passo a Passo Uniformes

## Visao Geral da Arquitetura

O sistema de agentes da Passo a Passo Uniformes e composto por agentes especializados
organizados em squads funcionais. Cada agente tem uma responsabilidade clara e atua
de forma autonoma ou colaborativa para automatizar os processos da empresa.

```
PASSO A PASSO UNIFORMES — AIOS SYSTEM
│
├── SQUAD FORMANDOS         # Mercado sazonal — prioridade alta
├── SQUAD COMERCIAL         # Atendimento e vendas B2B/B2C
├── SQUAD PRODUCAO          # Gestao interna de pedidos e producao
└── SQUAD MARKETING         # Conteudo, campanhas e marca
```

---

## SQUAD FORMANDOS

> Objetivo: Capturar, qualificar e converter turmas de formandos (3 ano e 8 ano) de forma automatizada e escalavel durante a temporada (Jan-Mai).

### Agente: FORMA (Captacao de Formandos)
```yaml
nome: FORMA
funcao: Captacao e qualificacao de turmas formandas
canal: WhatsApp + Landing Page
gatilho: Novo contato via formulario ou WhatsApp com palavras-chave
```
**Responsabilidades:**
- Recepcionar novos contatos de turmas via WhatsApp
- Qualificar: escola, ano, quantidade de alunos, data prevista
- Enviar catalogo de formaturas automaticamente
- Agendar conversa com consultor humano para fechamento
- Follow-up automatico (D+2, D+5, D+10) para leads sem resposta

**Mensagens automaticas:**
- Boas-vindas + apresentacao
- Envio do catalogo de formaturas
- Coleta de informacoes da turma (escola, quantidade, prazo)
- Follow-up de orcamento

---

### Agente: ORCA (Orcamentos de Formatura)
```yaml
nome: ORCA
funcao: Geracao e envio de orcamentos personalizados
canal: WhatsApp + Email
gatilho: Qualificacao completa pelo FORMA
```
**Responsabilidades:**
- Gerar orcamento com base em modelo, quantidade e personalizacao
- Enviar PDF de orcamento personalizado
- Registrar lead no CRM
- Notificar consultor humano quando orcamento enviado

---

## SQUAD COMERCIAL

> Objetivo: Atender todos os segmentos (escolas, empresas, esportes, saude, academia) com triagem automatica e escalada inteligente para humano quando necessario.

### Agente: ATTA (Atendimento Inicial)
```yaml
nome: ATTA
funcao: Primeiro contato e triagem de novos clientes
canal: WhatsApp Business
gatilho: Qualquer nova mensagem de numero desconhecido
```
**Responsabilidades:**
- Recepcionar novos clientes com mensagem personalizada
- Identificar segmento: escola / empresa / esporte / academia / saude / formandos
- Direcionar para o fluxo correto de cada segmento
- Responder perguntas frequentes (preco medio, prazo, pedido minimo)
- Escalar para humano quando necessidade for complexa

**Respostas automaticas para FAQs:**
- "Qual o pedido minimo?" → 10 pecas
- "Qual o prazo?" → A definir por producao (X dias uteis)
- "Voces entregam?" → Sim, raio de ~40km de Novo Hamburgo
- "Posso ver o catalogo?" → Envio automatico do catalogo digital

---

### Agente: SEGUE (Follow-up Comercial)
```yaml
nome: SEGUE
funcao: Acompanhamento de leads e oportunidades em aberto
canal: WhatsApp
gatilho: Lead sem resposta apos X dias
```
**Responsabilidades:**
- Follow-up automatico de orcamentos enviados sem retorno
- Reativacao de clientes inativos (sem pedido ha +6 meses)
- Lembrete de renovacao para clientes recorrentes (escolas no inicio do ano)
- Notificacao de novidades ou colecoes sazonais

---

### Agente: FECHO (Apoio ao Fechamento)
```yaml
nome: FECHO
funcao: Suporte ao momento de decisao e fechamento de pedido
canal: WhatsApp
gatilho: Cliente com orcamento aprovado pendente de confirmacao
```
**Responsabilidades:**
- Enviar link do simulador de uniforme
- Confirmar detalhes do pedido (modelo, cor, quantidade, personalizacao)
- Coletar aprovacao da arte
- Gerar ordem de pedido e encaminhar para producao

---

## SQUAD PRODUCAO

> Objetivo: Automatizar o fluxo interno de pedidos, status de producao e comunicacao com cliente durante a producao.

### Agente: PROD (Gestao de Pedidos)
```yaml
nome: PROD
funcao: Registro e acompanhamento de pedidos em producao
canal: Dashboard interno + WhatsApp (notificacoes ao cliente)
gatilho: Pedido confirmado pelo FECHO
```
**Responsabilidades:**
- Registrar pedido no sistema com todos os dados
- Criar checklist de producao para a equipe
- Atualizar status: Recebido > Em Producao > Pronto > Entregue
- Notificar cliente automaticamente nas transicoes de status
- Alertar equipe sobre prazos criticos

---

### Agente: ENTREGA (Logistica e Entrega)
```yaml
nome: ENTREGA
funcao: Coordenacao de retirada e entrega
canal: WhatsApp
gatilho: Pedido com status "Pronto"
```
**Responsabilidades:**
- Notificar cliente que pedido esta pronto
- Confirmar retirada ou agendar entrega
- Registrar entrega e coletar confirmacao do cliente
- Solicitar avaliacao/feedback apos entrega

---

## SQUAD MARKETING

> Objetivo: Automatizar producao de conteudo, gestao de campanhas e construcao de marca digital.

### Agente: CONTE (Conteudo e Redes Sociais)
```yaml
nome: CONTE
funcao: Criacao de sugestoes de conteudo para redes sociais
canal: Instagram, Facebook
gatilho: Semanal (calendario de conteudo)
```
**Responsabilidades:**
- Sugerir pautas de conteudo por segmento e sazonalidade
- Gerar legendas para posts
- Criar briefings para designer/fotografo
- Monitorar sazonalidade (formandos, inicio de ano letivo, copa, etc.)

---

### Agente: ADS (Gestao de Campanhas Meta)
```yaml
nome: ADS
funcao: Suporte a gestao e otimizacao de campanhas Meta Ads
canal: Meta Ads (Facebook + Instagram)
orcamento_mensal: R$1.500
gatilho: Semanal (relatorio) + alertas de performance
```
**Responsabilidades:**
- Monitorar performance das campanhas (CTR, CPC, conversoes)
- Alertar quando campanha esta abaixo do esperado
- Sugerir ajustes de audiencia e criativo
- Gerar relatorio semanal simplificado para gestao
- Segmentar campanhas por publico (formandos, escolas, empresas)

---

### Agente: REPUTA (Reputacao e Avaliacao)
```yaml
nome: REPUTA
funcao: Gestao de avaliações e reputacao online
canal: Google Meu Negocio, Facebook, Instagram
gatilho: Nova avaliacao recebida
```
**Responsabilidades:**
- Monitorar novas avaliacoes
- Gerar sugestao de resposta personalizada
- Solicitar avaliacao a clientes apos entrega
- Alertar em caso de avaliacao negativa

---

## Resumo dos Agentes

| Agente | Squad | Funcao | Prioridade |
|--------|-------|--------|-----------|
| **FORMA** | Formandos | Captacao de turmas formandas | ALTA |
| **ORCA** | Formandos | Orcamentos de formatura | ALTA |
| **ATTA** | Comercial | Atendimento e triagem inicial | ALTA |
| **SEGUE** | Comercial | Follow-up de leads | MEDIA |
| **FECHO** | Comercial | Apoio ao fechamento | MEDIA |
| **PROD** | Producao | Gestao de pedidos | MEDIA |
| **ENTREGA** | Producao | Logistica e entrega | MEDIA |
| **CONTE** | Marketing | Conteudo e redes sociais | BAIXA |
| **ADS** | Marketing | Campanhas Meta Ads | MEDIA |
| **REPUTA** | Marketing | Reputacao online | BAIXA |

---

## Fases de Implementacao

### FASE 1 — Ate Maio 2026 (Formandos First)
- Agente FORMA (captacao de formandos)
- Agente ATTA (atendimento inicial basico)
- Fluxo WhatsApp Business com respostas automaticas

### FASE 2 — Jun-Set 2026 (Comercial + Producao)
- Agente ORCA (orcamentos)
- Agente FECHO (fechamento)
- Agente PROD (gestao de pedidos)
- Agente SEGUE (follow-up)

### FASE 3 — Q4 2026 (Marketing + Escala)
- Agente ENTREGA
- Agente CONTE
- Agente ADS
- Agente REPUTA
- Integracao completa entre todos os agentes

---

## Stack Tecnico dos Agentes

| Componente | Tecnologia | Uso |
|------------|-----------|-----|
| LLM / IA | Claude API (Anthropic) | Cerebro de todos os agentes |
| Orquestracao | AIOS Framework (este sistema) | Coordenacao dos squads |
| WhatsApp | Evolution API + N8n | Canal de mensagens |
| CRM/Banco | Supabase | Dados de clientes e pedidos |
| Automacao | N8n | Workflows e integracoes |
| Dashboard | Next.js + Supabase | Painel de gestao para equipe |

---

*Documento criado por Atlas (Analyst) em 2026-03-05*
*Status: DRAFT v1 — a ser validado e detalhado com @architect e @pm*
