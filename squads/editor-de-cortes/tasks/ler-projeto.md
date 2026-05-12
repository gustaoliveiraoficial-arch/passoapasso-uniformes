---
task: Ler Projeto de Vídeo
responsavel: "@leitor-pasta"
responsavel_type: agent
atomic_layer: task
elicit: false
Entrada: |
  - pasta_projeto: Caminho absoluto para a pasta do projeto de vídeo
Saida: |
  - projeto_mapeado: Objeto JSON com takes e roteiro estruturado
  - caminho_json: Caminho do arquivo projeto-mapeado.json gerado
Checklist:
  - "[ ] Verificar se pasta existe"
  - "[ ] Escanear arquivos de vídeo (mp4, mov, avi, webm)"
  - "[ ] Localizar arquivo de roteiro"
  - "[ ] Parsear roteiro em estrutura JSON"
  - "[ ] Mapear cenas com takes correspondentes"
  - "[ ] Salvar projeto-mapeado.json na pasta"
  - "[ ] Validar completude do mapeamento"
---

# Task: Ler Projeto de Vídeo

## Descrição
Analisa a pasta de um projeto de vídeo, lê o roteiro e mapeia os takes para cada cena.

## Execução

### Passo 1: Verificar pasta
```
Verificar se {pasta_projeto} existe e contém arquivos
```

### Passo 2: Escanear takes
```
Listar todos os arquivos com extensão: .mp4, .mov, .avi, .webm, .mkv
Ordenar por nome alfabético (take-01, take-02, etc.)
```

### Passo 3: Localizar roteiro
```
Buscar por (em ordem de prioridade):
1. roteiro.md
2. roteiro.txt
3. script.md
4. script.txt
5. README.md (se contiver estrutura de roteiro)
```

### Passo 4: Parsear roteiro
```
Extrair por seção "## Cena N":
- take: arquivo de vídeo
- texto: fala ou narração
- instrucoes_edicao: como editar
- transicao: tipo de transição
- efeito: efeito visual
- musica: trilha sonora
```

### Passo 5: Gerar projeto-mapeado.json
```json
{
  "projeto": "nome-da-pasta",
  "caminho": "/caminho/completo",
  "criado_em": "2026-04-04T10:00:00Z",
  "takes": [...],
  "roteiro": {
    "titulo": "...",
    "duracao_alvo": "...",
    "formato": "Reels|Shorts|TikTok",
    "cenas": [...]
  }
}
```

## Erros Comuns

| Erro | Solução |
|------|---------|
| Pasta não encontrada | Verificar caminho absoluto |
| Nenhum take encontrado | Confirmar extensões dos arquivos |
| Roteiro ausente | Criar roteiro.md na pasta antes de executar |
| Cena sem take mapeado | Verificar nomes dos arquivos no roteiro |
