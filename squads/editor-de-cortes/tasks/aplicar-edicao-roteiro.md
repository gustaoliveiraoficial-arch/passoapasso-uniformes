---
task: Aplicar Edição Seguindo Roteiro
responsavel: "@editor-capcut"
responsavel_type: agent
atomic_layer: task
elicit: false
mcp_required:
  - playwright
Entrada: |
  - projeto_mapeado: JSON com roteiro detalhado por cena
  - takes_importados: Lista de takes já na timeline do CapCut
Saida: |
  - edicao_completa: Boolean confirmando edição finalizada
  - cenas_editadas: Lista de cenas com status de edição
Checklist:
  - "[ ] Para cada cena: fazer trim do take"
  - "[ ] Para cada cena: adicionar transição"
  - "[ ] Para cada cena: adicionar legenda sincronizada"
  - "[ ] Para cada cena: aplicar efeito visual se indicado"
  - "[ ] Para cada cena: ajustar velocidade se necessário"
  - "[ ] Adicionar trilha sonora geral"
  - "[ ] Ajustar volume: voz 100%, música 25-30%"
  - "[ ] Adicionar fade in/out na música"
  - "[ ] Aplicar color grading básico"
  - "[ ] Revisar timeline completa antes de exportar"
---

# Task: Aplicar Edição Seguindo Roteiro

## Descrição
Executa todas as edições no CapCut cena por cena, seguindo exatamente as instruções do roteiro.

## Princípios de Edição do Cortex

### A Regra dos 3 Segundos
Os primeiros 3 segundos definem se o vídeo vai ser assistido ou ignorado. Sempre:
- Use o momento mais impactante como abertura
- Corte agressivo ou frame chamativo
- Texto de hook visível imediatamente

### Ritmo Magnético
- Cortes no downbeat da música (no "bump" do beat)
- Nunca deixar um take com mais de 6s sem ação (legenda, zoom, corte)
- Variação de ritmo: alterna cortes rápidos e lentos para criar emoção

### Hierarquia Visual
1. Rosto do apresentador sempre visível
2. Legenda posicionada sem cobrir o rosto
3. Efeitos complementam, nunca distraem

## Execução por Cena

### Para cada cena do roteiro:

**1. Trim do Take**
```
1. Clicar no take na timeline
2. Arrastar a extremidade esquerda para remover início indesejado
3. Arrastar a extremidade direita para remover final indesejado
4. Tip: mantener apenas a fala + 0.2s de margem em cada lado
```

**2. Transição**
```
Se instrução = "corte seco":
  → Nenhuma transição (padrão)

Se instrução = "fade":
  → Clique entre dois clipes → Add Transition → Fade (0.3-0.5s)

Se instrução = "flash":
  → Add Transition → Flash (0.2s)

Se instrução = "deslize":
  → Add Transition → Slide Left/Right (0.3s)
```

**3. Legenda**
```
1. Posicionar playhead no início do take
2. Clicar em "Text" → "Add Text"
3. Digitar o texto da fala (ou usar Auto Captions)
4. Formatar:
   - Fonte: Montserrat Bold ou Arial Bold
   - Tamanho: 60-80px
   - Cor: Branco (#FFFFFF)
   - Sombra: Preta, 30% opacidade
   - Posição: Terço inferior ou superior
5. Ajustar duração para cobrir o take
```

**4. Destaque de Palavras-Chave**
```
Para palavras em destaque no roteiro:
1. Duplicar a legenda no mesmo momento
2. Isolar a palavra-chave
3. Mudar cor para amarelo/vermelho
4. Aumentar tamanho em 10%
5. Adicionar animação: Scale In (0.2s)
```

**5. Efeitos Visuais**
```
"Zoom in":
  → Keyframe: Scale 100% → 115% ao longo do take

"Zoom out":
  → Keyframe: Scale 115% → 100%

"Shake":
  → Effects → Basic → Shake (intensidade baixa)

"Glitch":
  → Effects → Basic → Glitch (0.5s no início do take)

"Blur background":
  → Background → Blur (nível 3-5)
```

**6. Velocidade**
```
"Slow motion (0.5x)":
  → Clique no take → Speed → 0.5x

"Acelerar (1.5x)":
  → Clique no take → Speed → 1.5x

"Rampa de velocidade":
  → Speed → Custom → adicionar keyframes
```

## Trilha Sonora

```
1. Clicar em "Audio" → "Music"
2. Se arquivo local: Import → selecionar arquivo
3. Se do CapCut: buscar por mood (energetic, motivational, etc.)
4. Arrastar para track de áudio abaixo da timeline de vídeo
5. Ajustar volume: -20dB (aprox. 20-30% do máximo)
6. Selecionar track → Volume → Enable
7. Início: Fade In 1-2 segundos
8. Final: Fade Out 2-3 segundos
9. Cortar no final do último take
```

## Color Grading Padrão

```
Ajustes básicos no CapCut:
- Brightness: +5
- Contrast: +15
- Saturation: +10
- Sharpness: +10
- Vignette: leve (opcional)

Para look "vibrante" (redes sociais):
- Temperature: levemente mais quente (+5)
- Tint: neutro
- Highlights: +5
- Shadows: -5
```

## Técnicas Avançadas do CapCut (aprendidas dos cursos)

### Usar AutoCut antes de editar manualmente
```
1. Selecionar o take bruto na timeline
2. Clicar em "AutoCut" (IA detecta silêncios)
3. Revisar os cortes sugeridos
4. Confirmar → serve como pré-edição
```

### Edição por Transcrição (para takes com muitas pausas)
```
1. Selecionar o take
2. Clicar em "Edição baseada em transcrição"
3. O CapCut mostra o texto falado
4. Selecionar e deletar as pausas e "ums" no texto
5. O vídeo é cortado automaticamente
```

### Aplicar Gráfico "Saída Cúbica" em todos os keyframes
```
Após criar qualquer keyframe de zoom ou movimento:
1. Clicar entre os dois keyframes
2. Selecionar "Gráficos"
3. Escolher "Saída Cúbica" (Cubic Ease Out)
→ Movimento natural, desacelera no fim
```

### Overlays com Blend Mode
```
Para adicionar elementos gráficos com fundo branco:
1. Adicionar como layer acima do vídeo
2. Selecionar layer → Juntar → Escurecer
→ Remove fundo branco automaticamente
```

### Auto Captions (legendas automáticas)
```
1. Clicar em "Texto" → "Auto Captions"
2. Selecionar idioma: Português
3. Aguardar geração
4. Selecionar todas as legendas → Formatar em lote:
   - Fonte: Montserrat Bold
   - Tamanho: 70px
   - Cor: Branco
   - Borda: Preta 2px
5. Revisar manualmente as que tiverem erros
```

## Verificação Final da Timeline

Antes de passar para exportação:
1. ▶️ Reproduzir vídeo completo do início ao fim
2. ✅ Verificar sincronização áudio/vídeo
3. ✅ Todas as legendas legíveis e corretas
4. ✅ Transições suaves
5. ✅ Música balanceada
6. ✅ Nenhum black frame entre takes
