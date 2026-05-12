# Squad: Editor de Cortes ✂️

Squad de automação de edição de vídeo no CapCut via browser (Chrome + Playwright).

## O que faz

Cada pasta de vídeo é um projeto. O squad lê os takes e o roteiro, abre o CapCut no Chrome, faz toda a edição e exporta o vídeo final automaticamente.

## Estrutura de Pasta de Projeto

```
/pasta-do-video/
├── take-01.mp4       ← takes gravados
├── take-02.mp4
├── take-03.mp4
└── roteiro.md        ← script com instruções por cena
```

## Como usar

```bash
# Ativar o agente principal
@editor-capcut

# Editar um projeto completo
*editar-pasta /caminho/para/pasta-do-video

# Editar com qualidade específica
*editar-pasta /caminho/pasta --qualidade 4K
```

## Agentes

| Agente | Nome | Função |
|--------|------|--------|
| `@leitor-pasta` | Luca 📂 | Lê e mapeia a pasta do projeto |
| `@editor-capcut` | Cortex ✂️ | Editor principal no CapCut |
| `@revisor-video` | Vera 🎬 | Revisão de qualidade final |

## Requisito

- CapCut aberto e logado no Chrome
- Playwright MCP ativo

## Template de Roteiro

Veja `templates/roteiro-template.md` para o formato esperado.

## Base de Conhecimento

- `data/tecnicas-edicao.md` — Técnicas de edição aprendidas
- `data/atalhos-capcut.md` — Atalhos e seletores do CapCut
