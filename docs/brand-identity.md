# Identidade Visual — Passo a Passo Uniformes

## Direcao Criativa

**Referencia de mercado:** Reserva
**Arquetipo:** Artesa Apaixonada — experiente, moderna, confiante, gaucha
**Principio guia:** Premium acessivel. Sofisticado sem intimidar. Profissional sem ser frio.

**O que essa identidade DEVE transmitir:**
- Confiabilidade de 30 anos
- Modernidade e tecnologia
- Qualidade visivel
- Calor humano gaucho

**O que essa identidade NUNCA PODE parecer:**
- Infantil
- Barato
- Amador
- Generico (igual a qualquer outra confeccao)

---

## Sistema de Cores

### Cor Primaria — Laranja Queimado

```
Nome:     Passo Orange
Hex:      #C85A00
RGB:      200, 90, 0
HSL:      27°, 100%, 39%
Caracter: Energia + Maturidade + Confianca
```

> Laranja escuro (queimado) comunica experiencia e solidez.
> Diferente do laranja neon/brilhante que parece barato,
> o laranja queimado tem peso, autoridade e calor simultaneamente.

### Paleta Completa

#### Primarias
```
--color-brand-500:   #C85A00   (Passo Orange — cor principal)
--color-brand-600:   #A84A00   (hover, emphasis)
--color-brand-400:   #E06A10   (versao mais clara, acentos)
--color-brand-100:   #FDF0E6   (backgrounds sutis, badges)
```

#### Neutras (ancora do sistema)
```
--color-gray-950:    #0F0F0F   (textos principais — quase preto, nao preto puro)
--color-gray-800:    #1F1F1F   (textos secundarios escuros)
--color-gray-600:    #4A4A4A   (textos de apoio)
--color-gray-300:    #CACACA   (bordas, divisores)
--color-gray-100:    #F5F5F5   (backgrounds claros)
--color-white:       #FFFFFF   (base)
```

#### Acento — Dourado (sofisticacao)
```
--color-accent-500:  #8B6914   (Gold — para detalhes premium)
--color-accent-300:  #C49A30   (Gold claro — icones, highlights)
--color-accent-100:  #F7F0DC   (Gold palido — backgrounds especiais)
```

### Combinacoes de Uso

| Situacao | Fundo | Texto | Destaque |
|----------|-------|-------|----------|
| Hero do site | #0F0F0F | #FFFFFF | #C85A00 |
| Cards de produto | #FFFFFF | #0F0F0F | #C85A00 |
| CTA principal | #C85A00 | #FFFFFF | — |
| Badge premium | #F7F0DC | #8B6914 | — |
| Header dark | #1F1F1F | #FFFFFF | #C85A00 |
| Section alternada | #F5F5F5 | #0F0F0F | #C85A00 |

### Paleta Instagram (Posts)
```
Fundo escuro:   #0F0F0F + texto branco + acento laranja
Fundo claro:    #FFFFFF + texto escuro + acento laranja
Fundo marca:    #C85A00 + texto branco (posts de destaque)
```

---

## Tipografia

### Direcao
Inspirado em Reserva: fontes com personalidade mas altamente legiveis.
Sem serifas que parecem antigas. Sem fontes muito geometricas que parecem frias.

### Sistema Tipografico

#### Display / Headlines — Inter ou Sora
```
Familia:  Inter (Google Fonts — gratuita, premium quality)
Peso:     700 (Bold) para titulos
          800 (ExtraBold) para hero
Caracter: Moderna, confiante, legivel em qualquer tamanho
```

#### Body / Texto corrido — Inter
```
Familia:  Inter
Peso:     400 (Regular) para corpo
          500 (Medium) para subtitulos e labels
          600 (SemiBold) para emphasis
```

#### Acento / Destaque — opcional
```
Familia:  Playfair Display (Google Fonts)
Uso:      APENAS para citacoes, slogans e momentos de emocao
          Ex: "30 anos de historia" em Playfair cria contraste elegante
Peso:     400 Italic ou 700 Bold
```

### Escala Tipografica

```
--text-xs:    12px / 1.5  (labels, badges, captions)
--text-sm:    14px / 1.5  (texto secundario, rodapes)
--text-base:  16px / 1.6  (corpo de texto principal)
--text-lg:    18px / 1.5  (subtitulos, intro paragraphs)
--text-xl:    20px / 1.4  (headings menores, cards)
--text-2xl:   24px / 1.3  (section headings)
--text-3xl:   30px / 1.2  (page headings)
--text-4xl:   36px / 1.1  (hero subtitles)
--text-5xl:   48px / 1.0  (hero headlines)
--text-6xl:   64px / 1.0  (super hero — mobile: 40px)
```

---

## Espacamento e Grid

```
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
--space-20:  80px
--space-24:  96px

--radius-sm:  4px   (inputs, badges)
--radius-md:  8px   (cards, botoes)
--radius-lg:  12px  (modais, paineis)
--radius-xl:  16px  (sections especiais)
--radius-full: 9999px (pills, avatars)

--container-max: 1280px
--container-pad: 24px (mobile) / 48px (desktop)
```

---

## Componentes Core

### Botao Principal (CTA)
```
Background:    #C85A00
Texto:         #FFFFFF
Font:          Inter 600, 16px
Padding:       14px 28px
Border-radius: 8px
Hover:         #A84A00 (escurece 15%)
Shadow:        0 4px 14px rgba(200, 90, 0, 0.30)

Texto do botao: sempre ACAO clara
Ex: "Solicitar Orcamento", "Ver Catalogo", "Falar no WhatsApp"
NUNCA: "Clique aqui", "Saiba mais" (generico)
```

### Botao Secundario
```
Background:    transparent
Texto:         #C85A00
Borda:         2px solid #C85A00
Font:          Inter 600, 16px
Padding:       12px 26px
Border-radius: 8px
Hover:         background #FDF0E6
```

### Card de Produto/Servico
```
Background:    #FFFFFF
Borda:         1px solid #CACACA
Border-radius: 12px
Padding:       24px
Shadow:        0 2px 8px rgba(0,0,0,0.08)
Hover shadow:  0 8px 24px rgba(0,0,0,0.12)
Acento:        linha superior 4px solid #C85A00 (cards premium)
```

### Badge / Tag
```
Variante padrao:  bg #FDF0E6, texto #C85A00, radius full
Variante premium: bg #F7F0DC, texto #8B6914
Variante escura:  bg #0F0F0F, texto #FFFFFF
```

---

## Iconografia e Ilustracoes

### Icones
- **Biblioteca:** Lucide Icons (clean, moderno, consistente)
- **Estilo:** Stroke 1.5px — nao muito fino (parece fragil), nao muito grosso (parece amador)
- **Tamanhos:** 16px (inline), 20px (padrao), 24px (destaque), 32px (feature icons)
- **Cor:** sempre a cor do contexto (laranja em fundo claro, branco em fundo escuro)

### Fotografia (direcao)
Quando tiver fotos profissionais:
- **Estilo:** Editorial, bem iluminado, alto contraste
- **Pessoas:** Sempre com uniforme, postura confiante, expressao natural (nao forcada)
- **Produto:** Foco na textura e detalhes do tecido
- **Cenario:** Ambiente de trabalho/escola/academia real — nao estudio artificial
- **Filtro:** Leve aumento de saturacao no laranja (reforcar a cor da marca)

### Nao usar:
- Banco de imagens genericas (pessoas sorindo forçado)
- Icones de diferentes estilos misturados
- Gradientes pesados
- Sombras excessivas
- Mais de 3 cores em um mesmo elemento

---

## Linguagem Visual — Resumo

| Elemento | Sim | Nao |
|----------|-----|-----|
| Tipografia | Inter Bold + Playfair acento | Comic Sans, fontes decorativas |
| Espacamento | Generoso, ar entre elementos | Tudo apertado, sufocado |
| Cores | Laranja queimado + preto + branco + gold | Arco-iris, muitas cores |
| Fotos | Editorial, reais, com produto | Stock generica, clipart |
| Icones | Lucide, estilo unico | Mistura de estilos |
| Layout | Grid estruturado, alinhamento perfeito | Elementos soltos, desalinhados |
| CTA | Direto, acao clara, laranja | Botoes cinza, texto vago |

---

## Aplicacoes Digitais

### Site (Homepage)
```
HERO:
- Fundo: #0F0F0F ou foto escura com overlay
- Headline: Inter 800, 56px, branco
- Subheadline: Inter 400, 20px, #CACACA
- CTA: botao laranja + botao outline branco
- Elemento de credibilidade: "+30 anos | Beira Rio | Ortobom | Monaco"

SECAO SERVICOS:
- Fundo: #FFFFFF
- Cards com borda laranja no topo
- Icones Lucide laranja

SECAO HISTORIA/PROPOSITO:
- Fundo: #C85A00
- Texto branco
- Quote em Playfair: historia da enchente

SECAO PORTFOLIO:
- Fundo: #F5F5F5
- Grid de fotos de uniformes
- Hover com overlay laranja + nome do cliente

FOOTER:
- Fundo: #0F0F0F
- Logo branca
- Links brancos/cinza
- WhatsApp CTA em destaque laranja
```

### Instagram (Identidade Visual)
```
FEED: alternancia de 3 tipos de post
  1. Post escuro: fundo #0F0F0F + texto branco + detalhe laranja
  2. Post claro: fundo #FFFFFF + texto escuro + detalhe laranja
  3. Post marca: fundo #C85A00 + texto branco (momentos de destaque)

STORIES: moldura laranja ou preta, tipografia Inter Bold
HIGHLIGHTS: capas minimalistas com icone Lucide + cor da categoria
REELS: abertura com logo + laranja, encerramento com CTA
```

### WhatsApp Business
```
Foto de perfil: logo em fundo laranja escuro
Nome: "Passo a Passo Uniformes"
Descricao: "Uniformes personalizados | +30 anos | NH e regiao | Pedido min. 10 pecas"
Mensagem de saudacao: tom proximo e direto (ver brand-positioning.md)
```

---

## Design Tokens (CSS Variables)

```css
:root {
  /* === BRAND COLORS === */
  --pp-orange-100: #FDF0E6;
  --pp-orange-400: #E06A10;
  --pp-orange-500: #C85A00;
  --pp-orange-600: #A84A00;

  --pp-gold-100: #F7F0DC;
  --pp-gold-300: #C49A30;
  --pp-gold-500: #8B6914;

  /* === NEUTRALS === */
  --pp-gray-50:  #FAFAFA;
  --pp-gray-100: #F5F5F5;
  --pp-gray-300: #CACACA;
  --pp-gray-600: #4A4A4A;
  --pp-gray-800: #1F1F1F;
  --pp-gray-950: #0F0F0F;
  --pp-white:    #FFFFFF;

  /* === SEMANTIC === */
  --pp-color-primary:      var(--pp-orange-500);
  --pp-color-primary-dark: var(--pp-orange-600);
  --pp-color-text:         var(--pp-gray-950);
  --pp-color-text-muted:   var(--pp-gray-600);
  --pp-color-bg:           var(--pp-white);
  --pp-color-bg-alt:       var(--pp-gray-100);
  --pp-color-border:       var(--pp-gray-300);
  --pp-color-accent:       var(--pp-gold-500);

  /* === TYPOGRAPHY === */
  --pp-font-sans:    'Inter', system-ui, sans-serif;
  --pp-font-display: 'Playfair Display', Georgia, serif;

  /* === SPACING === */
  --pp-space-1: 4px;
  --pp-space-2: 8px;
  --pp-space-4: 16px;
  --pp-space-6: 24px;
  --pp-space-8: 32px;
  --pp-space-12: 48px;
  --pp-space-16: 64px;
  --pp-space-20: 80px;

  /* === RADIUS === */
  --pp-radius-sm: 4px;
  --pp-radius-md: 8px;
  --pp-radius-lg: 12px;
  --pp-radius-full: 9999px;

  /* === SHADOWS === */
  --pp-shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
  --pp-shadow-md: 0 4px 16px rgba(0,0,0,0.12);
  --pp-shadow-brand: 0 4px 14px rgba(200, 90, 0, 0.30);
}
```

---

## Checklist de Qualidade Visual

Antes de publicar qualquer peca:

- [ ] Usa apenas as cores do sistema (sem cores aleatorias)
- [ ] Tipografia e Inter ou Playfair (nada mais)
- [ ] Espacamento generoso — nada sufocado
- [ ] CTA tem texto de acao clara
- [ ] Imagens sao de qualidade (nao pixeladas, nao stock generica)
- [ ] Logo visivel e nao distorcida
- [ ] Legivel em mobile (texto nao muito pequeno)
- [ ] Contraste adequado (texto claro em fundo escuro e vice-versa)
- [ ] Nao parece "barato" — checar com olhar critico

---

*Documento criado por Uma (UX Design Expert) em 2026-03-05*
*Referencia: Reserva (premium acessivel, moderno, confiante)*
*Status: DRAFT v1 — aguarda: logo atual, codigo hex exato do laranja, catalogo PDF*
*Proximo passo: wireframes do site e landing page formandos*
