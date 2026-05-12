---
task: Exportar Vídeo Final
responsavel: "@editor-capcut"
responsavel_type: agent
atomic_layer: task
elicit: false
mcp_required:
  - playwright
Entrada: |
  - pasta_projeto: Caminho da pasta onde salvar o vídeo exportado
  - qualidade: Qualidade de exportação (1080p, 4K) - default: 1080p
  - formato: Formato de saída (mp4) - default: mp4
Saida: |
  - video_exportado: Caminho completo do arquivo video-final.mp4
  - tamanho_arquivo: Tamanho em MB do arquivo exportado
Checklist:
  - "[ ] Clicar em Export no CapCut"
  - "[ ] Selecionar qualidade 1080p (ou 4K se solicitado)"
  - "[ ] Selecionar formato MP4"
  - "[ ] Confirmar nome do arquivo como video-final"
  - "[ ] Selecionar pasta do projeto como destino"
  - "[ ] Aguardar exportação completar"
  - "[ ] Verificar que o arquivo foi salvo corretamente"
  - "[ ] Registrar caminho e tamanho do arquivo"
---

# Task: Exportar Vídeo Final

## Descrição
Exporta o vídeo editado do CapCut em alta qualidade para a pasta do projeto.

## Execução

### Passo 1: Iniciar Exportação
```
1. Clicar no botão "Export" (canto superior direito)
2. Aguardar painel de exportação abrir
```

### Passo 2: Configurações de Exportação
```
Qualidade: 1080p (recomendado para redes sociais)
Frame Rate: 30fps (ou 60fps se o take original for 60fps)
Formato: MP4
Codec: H.264
Bitrate: Alto (recomendado)
```

### Passo 3: Nome e Destino
```
Nome do arquivo: video-final
Destino: {pasta_projeto}/video-final.mp4
```

### Passo 4: Confirmar e Aguardar
```
Clicar em "Export" / "Confirm"
Aguardar barra de progresso (pode levar 2-10 minutos)
Não fechar o browser durante exportação
```

### Passo 5: Verificação
```
1. Confirmar que video-final.mp4 existe na pasta
2. Verificar tamanho do arquivo (deve ser > 5MB para vídeo de 60s)
3. Verificar duração do arquivo corresponde ao esperado
```

## Destinos de Exportação

```
Pasta raiz do projeto: {pasta_projeto}/video-final.mp4

Estrutura esperada após exportação:
{pasta_projeto}/
├── take-01.mp4
├── take-02.mp4
├── roteiro.md
├── projeto-mapeado.json
└── video-final.mp4  ← EXPORTADO
```
