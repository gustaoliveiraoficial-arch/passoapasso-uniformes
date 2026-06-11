# Captação de Leads B2B — Passo a Passo Uniformes
## Como continuar a pesquisa

---

## Comandos rápidos

```bash
# Gerar novo PDF com os leads já coletados:
cd lead-capture
node gerar_pdf.js

# Abrir o PDF gerado:
start leads-passoapasso-2026-06-05.pdf
```

---

## Status da coleta (atualizado em 05/06/2026)

### ✅ Já pesquisado
| Categoria | Cidades | Leads |
|---|---|---|
| Escola | NH, São Leopoldo, Sapiranga | 28 |
| Academia / Fitness | NH, São Leopoldo, Canoas | 19 |
| Segurança Privada | NH, São Leopoldo | 20 |
| Saúde / Clínica | NH, São Leopoldo | 14 |
| Indústria / Fábrica | NH, São Leopoldo | 14 |
| Construtora / Engenharia | NH | 7 |
| Transportadora / Logística | NH | 7 |
| Limpeza / Conservação | NH | 6 |
| Veterinária / Pet | NH | 7 |
| Concessionária / Automóveis | NH | 5 |
| Supermercado / Atacado | NH | 5 |
| Restaurante | NH, Sapiranga, Campo Bom | 8 |
| Hotel / Pousada | NH | 5 |
| Clube / Esporte | NH | 2 |
| **TOTAL** | | **142 leads / 113 com telefone** |

---

### ⏳ Pendente — próximas buscas

```
Escolas         → Canoas, Gravataí, Cachoeirinha, Campo Bom, Parobé, Taquara
Academias       → Canoas (completo), Gravataí, Cachoeirinha
Saúde/Clínica   → Canoas, Gravataí, Cachoeirinha
Segurança       → Canoas, Gravataí
Indústria       → Canoas, Gravataí, Campo Bom, Sapiranga
Construtoras    → São Leopoldo, Canoas
Farmácias       → NH, São Leopoldo
Padarias        → NH, São Leopoldo
Contabilidades  → NH, São Leopoldo
Escritórios     → NH, São Leopoldo
Cooperativas    → Toda a região
Oficinas mec.   → NH, São Leopoldo
```

---

## Como pedir para o Claude continuar

Cole este prompt na próxima conversa:

```
Continuar captação de leads B2B da Passo a Passo.
Arquivo de referência: lead-capture/CONTINUAR.md
Leads já coletados estão em: lead-capture/leads_coletados.json

Próximo passo: pesquisar no Google Maps as categorias pendentes
listadas em CONTINUAR.md, adicionar ao leads_coletados.json
e gerar novo PDF com node gerar_pdf.js
```

---

## Como adicionar novos leads manualmente

Edite `leads_coletados.json` e adicione no final do array:

```json
{
  "nome": "Nome da Empresa",
  "categoria": "Categoria",
  "endereco": "Rua X, 123",
  "telefone": "(51) 99999-9999",
  "cidade": "Novo Hamburgo"
}
```

Depois rode `node gerar_pdf.js` para atualizar o PDF.

---

## Categorias válidas (use exatamente assim)
- Escola
- Academia / Fitness
- Restaurante / Alimentação
- Restaurante / Bar
- Saúde / Clínica
- Segurança Privada
- Construtora / Engenharia
- Transportadora / Logística
- Indústria / Fábrica
- Limpeza / Conservação
- Hotel / Pousada
- Veterinária / Pet
- Concessionária / Automóveis
- Supermercado / Atacado
- Clube / Esporte
- Farmácia
- Padaria / Panificação
- Contabilidade / Escritório
- Cooperativa
- Empresa
