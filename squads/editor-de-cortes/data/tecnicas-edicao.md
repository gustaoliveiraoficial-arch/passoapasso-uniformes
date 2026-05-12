# Base de Conhecimento: Técnicas de Edição de Vídeo

> Este arquivo contém as técnicas aprendidas para edição de vídeo de alta performance para redes sociais.
> Estudado de 4 vídeos do canal **Arthur o Editor | CAPCUT** (1,7M+ visualizações).
> Fontes: guia iniciante, IA do CapCut, ChatGPT+CapCut, Motion Design.

---

## 0. APRENDIZADOS DOS VÍDEOS DE REFERÊNCIA

### Do Vídeo 1 — Guia Completo para Iniciante (1,7M views)
- **Corte por Waveform:** Olhar a forma de onda do áudio na timeline para identificar onde há fala vs. silêncio — usar para cortes precisos
- **Divisão de clipes:** Tocar em "Dividir" no ponto exato → "Excluir" para remover — não arrastar
- **Keyframes para zoom dinâmico:** Criar ponto de início e fim de zoom, o CapCut anima automaticamente entre eles
- **Gráficos de curva entre keyframes:** Usar "Saída Cúbica" (Cubic Ease Out) para movimentos naturais que desaceleram no fim
- **Camadas (Layers):** Adicionar múltiplos vídeos, textos e imagens em camadas sobrepostas
- **Pinça na timeline:** Movimento de pinça (zoom) para aproximar/afastar a timeline e ter precisão nos cortes
- **J-Cut:** Técnica avançada onde o áudio do próximo clipe começa antes da imagem — transição mais suave

### Do Vídeo 2 — Nova IA do CapCut (Mar 2026)
- **AutoCut:** Função que detecta automaticamente cenas e divide vídeos longos em clips curtos — usar para takes brutos
- **Auto Captions:** Gera legendas sincronizadas automaticamente — apenas revisar e formatar
- **AI Design (capcut.com/tools/ai-design-social):** IA que cria vídeos completos a partir de texto/prompts
- **Script to Video Maker:** Inserir roteiro e IA gera vídeo estruturado com cenas, vozes e música
- **Remoção de fundo automática:** IA remove background sem chroma key
- **Estabilização automática:** IA corrige tremores da câmera automaticamente
- **Remoção de ruído:** IA limpa áudio automaticamente — usar para takes em ambientes imperfeitos
- **Text-to-Speech:** Conversão de texto em narração de voz natural integrada

### Do Vídeo 3 — ChatGPT + CapCut (35min de tutorial)
- **Prompt de elevação de design:** "Pegue meu design e eleve o nível para parecer que foi criado por uma equipe de US$100.000 — elegante, profissional e minimalista, como algo que a Apple lançaria"
- **Edição por transcrição:** No CapCut, selecionar "Edição baseada em transcrição" → editar o texto diretamente corta o vídeo automaticamente
- **ChatGPT para roteiros:** Gerar scripts estruturados no ChatGPT antes de filmar — mais coerência narrativa
- **ChatGPT para assets visuais:** Gerar fundos, cenários e imagens com IA → importar no CapCut
- **Troca de cenário:** Remover fundo no CapCut → substituir por cenário gerado pela IA

### Do Vídeo 4 — Motion Design no Celular (28min)
- **Decomposição em projetos menores:** Criar projetos separados para cada elemento animado → exportar → combinar no projeto final
- **Blend Mode "Escurecer" (Darken):** Remove fundo branco de elementos — `Selecionar layer > Juntar > Escurecer`
- **Typewriter Effect:** Animação de entrada de texto estilo digitação — em Texto > Animações de entrada
- **Transformar > Avançado:** Para posicionamento preciso em X e Y de elementos pequenos — mais preciso que arrastar
- **Duplicar na preview:** Segurar elemento na pré-visualização para duplicar e reposicionar
- **Exportação Motion Design:** 1080p, 60fps, Bit rate = "Melhor qualidade de imagem", desativar "Ultra HD com IA"

---

---

## 1. HOOK — Os Primeiros 3 Segundos

### Conceito
O hook é o elemento mais crítico de qualquer vídeo para redes sociais. O algoritmo e o usuário decidem em 1-3 segundos se vão continuar assistindo.

### Tipos de Hook Eficazes

**Hook Visual:**
- Começar no meio da ação (in medias res)
- Movimento de câmera agressivo
- Close-up extremo no rosto/objeto
- Contraste visual forte

**Hook de Texto:**
- Pergunta provocadora: "Você está fazendo isso errado..."
- Afirmação chocante: "Perdi R$50.000 porque não sabia isso"
- Promessa: "Em 60 segundos você vai aprender..."
- Números: "3 erros que estão matando suas vendas"

**Hook de Áudio:**
- Frase impactante nos primeiros segundos
- Beat drop da música na abertura
- Sound effect chamativo

---

## 2. ESTRUTURA DE VÍDEO VIRAL

### Fórmula dos 60 Segundos
```
[0-3s]   HOOK — Para o scroll
[3-15s]  PROBLEMA/CONTEXTO — Cria identificação
[15-45s] SOLUÇÃO/CONTEÚDO — Entrega valor
[45-60s] CTA — Converte engajamento
```

### Variação: Fórmula da Curiosidade
```
[0-3s]   Mostre o resultado final (spoiler)
[3-20s]  "Deixa eu te mostrar como..."
[20-50s] Passo a passo
[50-60s] "Salva esse vídeo e me segue"
```

---

## 3. RITMO E CORTES

### Regra do Ritmo
- Máximo 4-6 segundos por corte em vídeos dinâmicos
- Cortes no downbeat da música (momento do "pump")
- Variar o ritmo: rápido → lento → rápido (cria emoção)

### Tipos de Corte

**Corte Seco (Hard Cut):**
- Uso: Energia alta, transição direta
- Quando: Entre cenas de mesmo contexto
- Efeito: Dinamismo e urgência

**Jump Cut:**
- Uso: Remover pausas e "ums" do apresentador
- Como: Cortar dentro do mesmo take removendo silêncios
- Efeito: Ritmo acelerado e polido

**Cut on Action:**
- Uso: Cortar enquanto há movimento em quadro
- Efeito: Transição natural e fluida

**L-Cut / J-Cut:**
- L-Cut: Áudio do próximo clipe começa antes do vídeo
- J-Cut: Vídeo do próximo clipe começa antes do áudio
- Efeito: Transição suave e profissional

---

## 4. LEGENDAS (CAPTIONS)

### Por que são essenciais
- 85% dos vídeos de redes sociais são assistidos sem som
- Legendas aumentam o tempo de retenção em 40%
- Acessibilidade e alcance ampliado

### Estilo Profissional
```
Fonte: Montserrat Bold / Inter Bold / Arial Black
Tamanho: 60-80px (proporcional ao frame)
Cor principal: Branco (#FFFFFF)
Borda: Preta, 2-3px ou sombra preta
Posição: 15-20% do fundo da tela
Alinhamento: Centralizado
Animação: Pop in / Scale In 0.1-0.2s
```

### Destaque de Palavras-Chave
- Palavras de alto impacto: cor amarela (#FFD700) ou vermelha (#FF3333)
- Números e dados: negrito + cor diferente
- CTA: fonte maior + cor vibrante

### Auto Captions no CapCut
1. Text → Auto Captions
2. Selecionar idioma: Português
3. Ajustar timing manualmente onde necessário
4. Formatar todas as legendas de uma vez (selecionar tudo → formatação em lote)

---

## 5. ZOOM E MOVIMENTO

### Ken Burns Effect (fotos/frames estáticos)
- Início: Scale 100%, posição central
- Fim: Scale 115%, leve movimento para lado
- Duração: lenta (combina com narração)

### Dynamic Zoom (in/out)
- Zoom in: início do take com energia
- Zoom out: revelação ou conclusão
- Velocidade: rápida para impacto (0.3s), lenta para drama (1-2s)

### Camera Shake
- Efeito de câmera na mão
- Simula energia e autenticidade
- Usar com moderação (máx. 1-2x por vídeo)

---

## 6. EFEITOS VISUAIS

### Essenciais para Redes Sociais

**Flash Transition:**
- Entre cenas de alta energia
- Duração: 2-4 frames (0.1s)
- Cor: branco ou conforme a marca

**Glitch Effect:**
- Momentos de surpresa ou virada
- Duração: 0.3-0.5s
- Não exagerar — uso pontual

**Blur Background:**
- Destacar o sujeito principal
- Estilo cinematográfico
- CapCut: Background → Blur level 3-5

**Color Grading Padrão Redes Sociais:**
```
Contraste: +15 (mais definição)
Saturação: +10 (cores mais vibrantes)
Brilho: +5 (mais luminoso)
Nitidez: +10 (mais definido)
Temperatura: levemente quente (+5)
```

---

## 7. ÁUDIO E MÚSICA

### Hierarquia de Áudio
1. Voz: 100% (base)
2. Música: 25-30% da voz
3. Sound effects: 50-70% pontualmente

### Escolha da Música
- Energia combina com o tema do vídeo
- BPM combina com o ritmo dos cortes
- Sem copyright ou licenciada
- CapCut: Audio → Music → Commercial Safe

### Técnicas de Áudio
- Fade in nos primeiros 1-2s
- Fade out nos últimos 2-3s
- Duck da música durante falas importantes
- Sound effect de "whoosh" nas transições
- Aplicar normalização de volume na voz

### Remoção de Ruídos (CapCut)
- Audio → Noise Reduction
- Ideal para takes gravados em ambientes imperfeitos

---

## 8. VELOCIDADE E TIMING

### Slow Motion
- Momentos de impacto ou emoção
- 50% da velocidade original (0.5x)
- Precisa de takes gravados em 60fps para qualidade

### Speed Ramp
- Início: velocidade normal
- Meio: desacelera no pico de ação
- Final: acelera novamente
- Efeito: dramático e cinematográfico

### Timelapse
- Processos longos acelerados
- 2x-8x dependendo da duração original

---

## 9. FORMATOS E EXPORTAÇÃO

### Especificações por Plataforma

| Plataforma | Proporção | Resolução | FPS | Duração Ideal |
|-----------|-----------|-----------|-----|---------------|
| Reels (Instagram) | 9:16 | 1080x1920 | 30fps | 15-60s |
| TikTok | 9:16 | 1080x1920 | 30fps | 15-60s |
| YouTube Shorts | 9:16 | 1080x1920 | 30fps | até 60s |
| YouTube Normal | 16:9 | 1920x1080 | 30fps | livre |
| Feed Instagram | 1:1 | 1080x1080 | 30fps | até 60s |

### Configurações de Exportação CapCut
```
Resolução: 1080p (mínimo para redes sociais)
Frame Rate: 30fps
Codec: H.264
Formato: MP4
Bitrate: Alto
```

---

## 10. ERROS COMUNS A EVITAR

- ❌ Começar com "Olá, tudo bem?" — perde o hook
- ❌ Silêncio de mais de 1 segundo — usuário vai embora
- ❌ Take longo sem corte (mais de 8s) — perde atenção
- ❌ Legenda impossível de ler (fonte pequena, sem contraste)
- ❌ Música muito alta cobrindo a voz
- ❌ Efeitos em excesso — distrai do conteúdo
- ❌ Não ter CTA — desperdiça a audiência gerada
- ❌ Vídeo muito escuro ou com ruído excessivo
