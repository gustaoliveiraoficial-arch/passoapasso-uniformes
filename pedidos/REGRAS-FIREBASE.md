# Configuração Firebase — Cole estas regras no Console

## Firestore Rules
Acesse: Firebase Console → Firestore Database → Regras

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

## Storage Rules
Acesse: Firebase Console → Storage → Regras

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

## Índice Firestore (necessário para a listagem)
Acesse: Firebase Console → Firestore Database → Índices → Adicionar índice

- Coleção: `pedidos`
- Campo 1: `createdAt` — Crescente (Ascending)
- Modo de consulta: Coleção

Ou aguarde o link de erro aparecer no console do navegador quando listar pedidos pela primeira vez — ele gera o índice automaticamente.
