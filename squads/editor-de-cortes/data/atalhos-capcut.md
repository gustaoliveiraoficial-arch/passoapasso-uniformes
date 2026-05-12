# Atalhos do CapCut — Referência Rápida

## Desktop (Windows/Mac)

| Ação | Windows | Mac |
|------|---------|-----|
| Play / Pause | Espaço | Espaço |
| Cortar clipe no playhead | Ctrl+B | Cmd+B |
| Desfazer | Ctrl+Z | Cmd+Z |
| Refazer | Ctrl+Shift+Z | Cmd+Shift+Z |
| Selecionar tudo | Ctrl+A | Cmd+A |
| Copiar | Ctrl+C | Cmd+C |
| Colar | Ctrl+V | Cmd+V |
| Deletar clipe selecionado | Delete | Delete |
| Exportar | Ctrl+E | Cmd+E |
| Separar áudio do vídeo | Ctrl+Shift+D | Cmd+Shift+D |
| Zoom in na timeline | Ctrl + Scroll Up | Cmd + Scroll |
| Zoom out na timeline | Ctrl + Scroll Down | Cmd + Scroll |
| Ir para início | Home | Home |
| Ir para fim | End | End |
| Frame anterior | ← (seta) | ← |
| Próximo frame | → (seta) | → |
| Aumentar velocidade | ] | ] |
| Diminuir velocidade | [ | [ |
| Adicionar marcador | M | M |
| Renomear clipe | F2 | Enter |

## Web (Chrome)

| Ação | Atalho |
|------|--------|
| Play / Pause | Espaço |
| Cortar | B |
| Desfazer | Ctrl+Z |
| Exportar | Ctrl+E |

## Seletores Playwright para Automação

```javascript
// Botões principais
const selectors = {
  newProject: '[data-testid="new-project-btn"], button.new-project, .create-project',
  importMedia: '.import-btn, [data-testid="import"], button:has-text("Import")',
  addText: '.text-tool, [data-testid="text-btn"], button:has-text("Text")',
  export: '.export-btn, [data-testid="export"], button:has-text("Export")',
  audio: '.audio-tab, [data-testid="audio"]',
  effects: '.effects-tab, [data-testid="effects"]',
  transitions: '.transitions-btn',
  timeline: '.timeline, .track-container',
  playButton: '.play-btn, button[aria-label="Play"]',
  splitClip: '.split-btn, button[aria-label="Split"]',
}
```
