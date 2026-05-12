---
task: Pipeline Completo de Edição de Vídeo
responsavel: "@editor-capcut"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - pasta_projeto: Caminho absoluto para a pasta do projeto
  - qualidade: Qualidade de exportação (opcional, default: 1080p)
Saida: |
  - video_final: Caminho do vídeo exportado
  - relatorio: Relatório completo da edição
Checklist:
  - "[ ] FASE 1: Ler projeto (leitor-pasta)"
  - "[ ] FASE 2: Importar takes no CapCut"
  - "[ ] FASE 3: Aplicar edição conforme roteiro"
  - "[ ] FASE 4: Exportar vídeo final"
  - "[ ] FASE 5: Revisão de qualidade"
---

# Task: Pipeline Completo de Edição de Vídeo

## Descrição
Orquestra o fluxo completo de edição de uma pasta de projeto, do início ao vídeo final exportado.

## Uso

```bash
@editor-capcut
*editar-pasta /caminho/para/meu-video
```

## Fluxo de Execução

```
📂 FASE 1 — LEITURA DO PROJETO (@leitor-pasta)
   ↓ ler-projeto.md
   ↓ Output: projeto-mapeado.json

🎬 FASE 2 — IMPORTAÇÃO NO CAPCUT (@editor-capcut)
   ↓ importar-takes-capcut.md
   ↓ Output: takes na timeline do CapCut

✂️ FASE 3 — EDIÇÃO CONFORME ROTEIRO (@editor-capcut)
   ↓ aplicar-edicao-roteiro.md
   ↓ Output: projeto editado no CapCut

📤 FASE 4 — EXPORTAÇÃO (@editor-capcut)
   ↓ exportar-video.md
   ↓ Output: video-final.mp4

✅ FASE 5 — REVISÃO DE QUALIDADE (@revisor-video)
   ↓ Checklist de qualidade
   ↓ Output: APROVADO ou REVISAR
```

## Exemplo de Uso em Batch (múltiplas pastas)

Para editar todos os projetos numa pasta:

```
Pastas detectadas:
1. /videos/video-produto-01/
2. /videos/video-produto-02/
3. /videos/video-depoimento-01/

Processar em sequência? [S/n]
```

## Relatório Final

```
╔══════════════════════════════════════╗
║     RELATÓRIO DE EDIÇÃO COMPLETA     ║
╠══════════════════════════════════════╣
║ Projeto: nome-do-video               ║
║ Takes utilizados: 5/6                ║
║ Duração final: 0:58                  ║
║ Exportado em: video-final.mp4        ║
║ Tamanho: 87MB                        ║
║ Qualidade: 1080p 30fps               ║
╠══════════════════════════════════════╣
║ REVISÃO: ✅ APROVADO (Score: 92/100) ║
╚══════════════════════════════════════╝
```
