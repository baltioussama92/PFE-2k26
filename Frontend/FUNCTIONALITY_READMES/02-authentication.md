# Fonctionnalité - Authentification

## Frontend concerné

- `src/components/auth/AuthModal.jsx`
- `src/services/authService.ts`
- `src/App.jsx` (vérification session via `/api/auth/me`)

## Endpoints Backend requis

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Contrat de données attendu

- Login/Register réponse: `{ token, role, user }`
- `user` doit contenir au minimum: `id`, `fullName|name`, `email`, `role`

## Checkpoints sécurité

- Hash mot de passe (`BCrypt` ou équivalent)
- JWT signé avec expiration
- Vérifier utilisateur `banned` au login et sur requêtes protégées
- `GET /api/auth/me` réservé aux utilisateurs authentifiés
- Réponses d'erreur explicites sans fuite d'informations sensibles
