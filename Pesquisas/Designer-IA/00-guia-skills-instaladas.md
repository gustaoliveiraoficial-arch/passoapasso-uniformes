# Guia — Skills SamurAIGPT Instaladas

**Instalado em:** 2026-04-30
**Fonte:** https://github.com/SamurAIGPT/Generative-Media-Skills

## Skills disponíveis no Claude Code

| Skill | Para que serve |
|-------|---------------|
| `muapi-media-generation` | Gerar imagens a partir de texto (text-to-image) |
| `muapi-media-editing` | Editar imagem existente com prompt (image-to-image) |
| `muapi-nano-banana` | Gerar imagens 2K com raciocínio avançado |
| `muapi-logo-creator` | Criar logos vetoriais minimalistas |
| `muapi-ui-design` | Mockups de UI mobile/web |
| `muapi-photo-pack-generator` | Gerar pacotes de fotos para produto |
| `muapi-cinema-director` | Direção cinematográfica — cenas e vídeos |
| `muapi-seedance-2` | Vídeo cinematic com sincronização áudio |
| `muapi-social-media-video` | Vídeos para redes sociais |
| `muapi-youtube-shorts` | Vídeos curtos para YouTube |
| `muapi-workflow` | Workflows encadeados de geração |
| `muapi-platform` | Setup, auth e configuração |

## Configuração necessária (IMPORTANTE)

Antes de usar, precisa de API Key do muapi.ai:

```bash
muapi auth configure
# Ou direto:
muapi auth configure --api-key "SUA_KEY_AQUI"
```

Pegue sua key em: https://muapi.ai/dashboard

## Modelos disponíveis para vestuário/produto

Os mais úteis para camisetas e peças com estampa:

| Modelo | Uso ideal |
|--------|-----------|
| `flux-kontext-pro` | Editar peça existente + aplicar estampa |
| `flux-dev` | Gerar produto do zero com prompt |
| `hidream-fast` | Geração rápida de mockup |
| `flux-schnell` | Mais rápido, boa qualidade |

## Como usar no Claude Code

```bash
# Gerar imagem
muapi image generate "camiseta branca com logo minimalista na frente" --model flux-dev

# Editar peça existente com estampa do cliente
muapi image edit "aplique este logo na frente da camiseta, centralizado" \
  --image "URL_DA_PECA_EM_BRANCO" --model flux-kontext-pro

# Baixar resultado automaticamente
muapi image generate "camiseta preta com estampa geométrica" \
  --model flux-dev --download ./resultados
```

## Links úteis
- [[prompts-testados/]] — Prompts que funcionaram bem
- [[resultados/]] — Resultados documentados
- [[01-aprendizados.md]] — O que aprendemos com o uso
