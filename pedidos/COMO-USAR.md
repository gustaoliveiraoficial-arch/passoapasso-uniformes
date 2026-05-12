# Sistema de Pedidos — Passo a Passo Uniformes

## 1. Configurar Firebase

1. Acesse https://console.firebase.google.com
2. Crie um projeto (ou use um existente)
3. Ative o **Firestore Database** (em modo de produção ou teste)
4. Ative o **Storage**
5. Em Configurações do Projeto → Suas Apps → Web App, copie os dados do Firebase
6. Cole no arquivo `.env.local`

### Regras do Firestore (Cole no Console Firebase):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pedidos/{pedidoId} {
      allow read, write: if true;
    }
  }
}
```

### Regras do Storage:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

> **Nota:** Estas regras são abertas (para uso interno). Em produção, adicione autenticação.

## 2. Rodar o sistema

```bash
cd pedidos
npm run dev
```

Acesse: http://localhost:3001

## 3. Fluxo do pedido

### Status 1: DADOS (Vendedor)
- Cria novo pedido em `/novo-pedido`
- Preenche: dados do cliente, produto, vendedor, número do pedido
- Clica em Salvar → pedido aparece no painel

### Status 2: TAMANHOS (Vendedor ou Cliente)
- No painel do pedido, clique em "Avançar → 2. Tamanhos"
- Um link é gerado para o **cliente** preencher os próprios tamanhos
- O link `/tamanhos/[token]` só permite preencher tamanhos — sem acesso a preços ou produto
- Vendedor também pode preencher direto na tela do pedido

### Status 3: ARQUIVOS (Arte-Finalista)
- No painel do pedido, clique em "Avançar → 3. Arquivos"  
- Copie o link arte-finalista em `/arquivos/[id]`
- Arte-finalista envia: layout PNG/JPG + vetores PDF/CDR/AI

### Status 4: CONFIRMAÇÃO PARA PRODUÇÃO
- Visualização do pedido no formato impresso (A4 deitado)
- Layout da camiseta à direita
- Botão "Exportar PDF" gera o arquivo

## 4. Painel (Dashboard)

- Exibe todos os pedidos em formato de planilha
- Filtro por status e busca por nome/número
- Links de ação para cada pedido

## 5. Personalizar catálogo

Edite `src/lib/catalog.ts` para adicionar/remover:
- Modelos
- Materiais por modelo
- Cores por material

## 6. Deploy

Para hospedar online (ex: Vercel):
1. `npm run build`
2. Configure as variáveis de ambiente no painel da Vercel
3. Deploy automático via GitHub
