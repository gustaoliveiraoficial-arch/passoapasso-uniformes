# SalesBoard Pro — Painel de Vendas

Painel de vendas em tempo real com ranking, roleta de prêmios e dashboard de métricas.
Conecta direto ao Google Sheets via Google Apps Script — sem servidor, sem mensalidade.

---

## O que está incluso

| Arquivo | Descrição |
|---|---|
| `index.html` | O app completo (abrir no navegador) |
| `google-apps-script.gs` | Código para conectar ao Google Sheets |
| `LEIA-ME.md` | Este guia |

---

## Como usar

### 1. Abrir o app
Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Edge, Firefox).
O app já funciona em modo demonstração sem nenhuma configuração.

### 2. Configurar seus vendedores
Clique no ícone ⚙️ no canto superior direito.
- Cadastre os nomes e cores de cada vendedor
- Defina a meta individual de cada um
- Defina a meta total do período
- Defina o valor mínimo para qualificar na roleta

### 3. Conectar ao Google Sheets (opcional — para dados reais)

**Passo a passo:**

1. Crie uma planilha Google
2. Renomeie a aba para `Vendas`
3. Monte o cabeçalho na linha 1:
   ```
   Data | Vendedor1 | Vendedor2 | Vendedor3
   ```
   Use os mesmos nomes cadastrados nas Configurações.
4. Preencha as linhas com as vendas diárias:
   ```
   2025-04-01 | 1500 | 2300 | 800
   2025-04-02 | 2100 | 1800 | 950
   ```
5. Acesse **Extensões → Apps Script**
6. Apague o código existente e cole o conteúdo de `google-apps-script.gs`
7. Salve (Ctrl+S)
8. Clique em **Implantar → Nova implantação**
   - Tipo: **Aplicativo da Web**
   - Executar como: **Eu**
   - Acesso: **Qualquer pessoa**
9. Clique em **Implantar**, autorize e copie a URL gerada
10. Cole a URL nas Configurações do app e clique em Salvar

O painel atualiza automaticamente a cada 30 segundos.

---

## Funcionalidades

- **Ranking com pódio** — Top 3 em destaque com ouro, prata e bronze
- **Barra de progresso individual** — Percentual de cada vendedor em relação à sua meta
- **Roleta de prêmios** — Sorteio animado para vendedores qualificados
- **Dashboard de métricas** — Total vendido, meta, dias úteis restantes, ritmo necessário
- **Som de nova venda** — Notificação sonora automática ao detectar nova venda
- **Som personalizado** — Faça upload do seu próprio MP3/WAV
- **Auto-refresh 30s** — Dados sempre atualizados
- **100% offline** — Funciona sem internet (modo demo); requer internet só para buscar dados do Sheets

---

## Requisitos

- Navegador moderno (Chrome 90+, Edge 90+, Firefox 90+)
- Conta Google (para usar com Google Sheets)
- Nenhuma instalação, nenhum servidor, nenhuma mensalidade

---

*SalesBoard Pro — Todos os direitos reservados*
