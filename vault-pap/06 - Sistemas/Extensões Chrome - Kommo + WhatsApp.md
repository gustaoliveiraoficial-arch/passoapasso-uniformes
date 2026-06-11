# 🔌 Extensões Chrome — Kommo Chat Pro + WhatsApp Kommo Bridge

> Duas extensões Chrome criadas para otimizar o atendimento no Kommo CRM e integrar o WhatsApp Web com o funil de vendas.

---

## 1. Kommo Chat Pro (`kommo-extension/`)

### O que faz
Melhora a interface do Kommo CRM com foco em velocidade de atendimento via chat.

### Funcionalidades
| Recurso | Descrição |
|---------|-----------|
| **Modo Chat Focado** | Oculta os campos CRM desnecessários e expande a área de conversa |
| **Enter para enviar** | Como o WhatsApp — Shift+Enter quebra linha |
| **Auto-foco no chat** | Cursor já vai para o campo de texto ao abrir uma conversa |
| **Botão 💬 nos cards** | Aparece ao passar o mouse em qualquer card do Kanban |
| **Overlay de chat** | Abre o chat em modal centralizado (88vw × 88vh) sem sair do Kanban |
| **Colunas externas** | 💰 PIX / ⚠️ Problema / ✏️ Esboço — gerenciadas pela extensão, fora do CRM |
| **Painel 📋 Listas** | Botão na toolbar abre painel com abas mostrando leads de cada coluna |
| **Badge ⏰** | Alerta vermelho pulsante em leads sem resposta há +10h |
| **Toolbar arrastável** | Barra de ferramentas flutuante, posição salva automaticamente |
| **Atalhos de teclado** | Alt+C, Alt+F, Alt+E, Alt+R, Alt+↑/↓ |

### Colunas Externas
As três colunas são gerenciadas localmente pela extensão (não criam abas no CRM):
- **💰 PIX** — lead aguardando pagamento
- **⚠️ Problema** — lead com problema a resolver
- **✏️ Esboço** — layout a criar

### Instalação
1. `chrome://extensions/` → Modo desenvolvedor → Carregar sem compactação
2. Selecionar pasta `kommo-extension/`
3. Acessar `passoapassouniformes2025.kommo.com`

### Arquivos
```
kommo-extension/
├── manifest.json    — Manifest v3, host: *.kommo.com
├── content.js       — Lógica principal (colunas, overlay, toolbar, atalhos)
├── styles.css       — Estilos injetados no Kommo
├── popup.html       — Interface do popup da extensão
└── popup.js         — Toggles de configuração
```

### Detalhes técnicos
- **Envio de mensagem:** `InputEvent('input')` + `KeyboardEvent Ctrl+Enter` (Kommo usa contenteditable)
- **Colunas salvas em:** `chrome.storage.local` (chave `kcp_custom_cols`)
- **Overlay:** iframe same-origin (`*.kommo.com`) — funciona sem CORS
- **SPA detection:** `MutationObserver` monitora mudanças de URL

---

## 2. WhatsApp Kommo Bridge (`whatsapp-kommo/`)

### O que faz
Integra o WhatsApp Web com o Kommo CRM. Detecta o contato da conversa aberta, busca o lead no Kommo e permite mover para qualquer etapa do funil sem sair do WhatsApp.

### Funcionalidades
| Recurso | Descrição |
|---------|-----------|
| **Detecção automática** | Lê o número de telefone da conversa aberta (4 métodos de fallback) |
| **Busca no Kommo** | Busca o lead pelo número via API v4 (múltiplas variantes de formato) |
| **Etapa atual visível** | Mostra ● ponto colorido + nome da etapa atual abaixo do nome do lead |
| **Select de etapas** | Dropdown com todas as etapas do funil — escolheu, moveu |
| **Busca manual** | Campo para digitar número quando não detecta automaticamente |
| **Auto-detect subdomínio** | Se Kommo estiver aberto em outra aba, detecta o subdomínio sozinho |
| **Sem token manual** | Usa cookies de sessão do Kommo — só precisa estar logado |

### Fluxo de uso
1. Abrir conversa individual no WhatsApp Web
2. Clicar no botão **K** vermelho (canto direito da tela)
3. Painel abre → busca lead pelo número
4. Escolher nova etapa no dropdown → lead movido no Kommo na hora

### Configuração (primeira vez)
- Clicar no **K** → campo de subdomínio aparece → digitar `passoapassouniformes2025` → Enter
- **OU** abrir o popup da extensão (ícone na barra do Chrome) → preencher subdomínio → Salvar
- Se o Kommo estiver aberto em outra aba: detecta automático

### Etapas favoritas (opcional)
No popup da extensão:
1. Clicar **Carregar etapas do Kommo**
2. Marcar apenas as etapas mais usadas
3. **Salvar** — só essas aparecem no dropdown

### Instalação (qualquer computador)
1. Copiar pasta `whatsapp-kommo/` (pen drive, Drive, etc.)
2. `chrome://extensions/` → Modo desenvolvedor → Carregar sem compactação
3. Selecionar a pasta
4. Configurar subdomínio na primeira abertura

### Arquivos
```
whatsapp-kommo/
├── manifest.json    — Manifest v3, host: web.whatsapp.com + *.kommo.com
├── background.js    — Service worker: proxy para API Kommo (evita CORS)
├── content.js       — UI injetada no WhatsApp Web
├── styles.css       — Estilos do painel lateral
├── popup.html       — Configuração de subdomínio e etapas favoritas
└── popup.js         — Lógica do popup
```

### Detalhes técnicos
- **API Kommo:** chamadas via background service worker com `credentials: 'include'` (usa sessão do browser)
- **Detecção de número:** 4 métodos — `[aria-selected] data-id`, `[data-id]` nas mensagens, título da conversa, subtítulo
- **Variantes de telefone:** testa com/sem `55`, `+55` para cobrir formatos BR
- **Subdomínio:** detectado via `chrome.tabs.query` nas abas abertas do Kommo
- **Permissões:** `storage`, `tabs`

---

## A Lapidas / TODO

- [ ] Kommo Chat Pro: sincronizar colunas externas entre computadores (via API ou backend)
- [ ] Kommo Chat Pro: notificação sonora/visual quando badge ⏰ aparecer
- [ ] WhatsApp Bridge: buscar por nome do contato além do número
- [ ] WhatsApp Bridge: histórico dos últimos leads movidos
- [ ] WhatsApp Bridge: mostrar valor e nome do contato Kommo junto ao lead
- [ ] Ambas: empacotar como `.crx` para instalação mais fácil

---

## Links
- [[Mapa de Sistemas]]
- [[CRM - Bitrix24]]
- Pasta Kommo: `C:\...\PassoaPasso\kommo-extension\`
- Pasta WhatsApp: `C:\...\PassoaPasso\whatsapp-kommo\`
