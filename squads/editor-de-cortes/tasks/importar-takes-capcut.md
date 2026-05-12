---
task: Importar Takes no CapCut
responsavel: "@editor-capcut"
responsavel_type: agent
atomic_layer: task
elicit: false
mcp_required:
  - playwright
Entrada: |
  - projeto_mapeado: JSON com lista de takes e roteiro
  - nome_projeto: Nome do projeto a criar no CapCut
Saida: |
  - projeto_capcut_id: ID do projeto criado no CapCut
  - takes_importados: Lista de takes importados com sucesso
Checklist:
  - "[ ] Abrir CapCut no Chrome via Playwright"
  - "[ ] Criar novo projeto com nome correto"
  - "[ ] Selecionar proporção (9:16 para vertical, 16:9 para horizontal)"
  - "[ ] Importar cada take da lista"
  - "[ ] Confirmar que todos os takes aparecem na media pool"
  - "[ ] Organizar takes na timeline conforme ordem do roteiro"
---

# Task: Importar Takes no CapCut

## Descrição
Abre o CapCut via Chrome (Playwright) e importa todos os takes do projeto na ordem correta.

## Execução via Playwright

### Passo 1: Abrir CapCut
```javascript
// Navegar para CapCut Web
await browser_navigate({ url: "https://www.capcut.com/editor" })
// OU se tiver app desktop, usar URL local
await browser_navigate({ url: "capcut://editor" })
```

### Passo 2: Criar Novo Projeto
```
1. Clicar em "+ New Project" ou "Criar projeto"
2. Selecionar proporção:
   - 9:16 (Portrait) para Reels, TikTok, Shorts
   - 16:9 (Landscape) para YouTube
   - 1:1 (Square) para feed Instagram
3. Confirmar criação
```

### Passo 3: Importar Takes
```
Para cada take na lista:
1. Clicar em "Import" / "+" na media pool
2. Navegar até a pasta do projeto
3. Selecionar o arquivo de vídeo
4. Confirmar importação
5. Verificar que aparece na media pool
```

### Passo 4: Organizar na Timeline
```
Para cada cena no roteiro (em ordem):
1. Localizar take correspondente na media pool
2. Arrastar para a timeline
3. Posicionar após o take anterior
```

### Passo 5: Verificação
```
Confirmar que:
- Todos os N takes aparecem na timeline
- Ordem está correta conforme roteiro
- Nenhum take está duplicado ou faltando
```

## Seletores CSS do CapCut (Web)

```css
/* Botão de novo projeto */
[data-testid="new-project-btn"]
button:contains("New Project")

/* Importar mídia */
[data-testid="import-media"]
.upload-btn
input[type="file"]

/* Timeline */
.timeline-container
.track-item

/* Media pool */
.media-pool
.clip-item
```

## Fallback: Erro de Importação

Se um take não importar:
1. Verificar se o arquivo existe no caminho correto
2. Verificar se o formato é suportado (mp4, mov)
3. Tentar converter para mp4 H.264 se necessário
4. Reportar ao @revisor-video se persistir
