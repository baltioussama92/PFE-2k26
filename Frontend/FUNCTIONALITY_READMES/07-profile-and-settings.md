# Fonctionnalité - Profil & Paramètres utilisateur

## Frontend concerné

- `src/pages/ProfilePage.jsx` (update profil)
- `src/pages/SettingsPage.*`
- `src/services/userService.ts` (recherche utilisateurs)

## Endpoints Backend requis

- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/users/search?q=...`

## Checkpoints sécurité

- `users/me` limité à l'utilisateur authentifié
- Validation serveur des champs modifiables (fullName/avatar)
- Recherche utilisateurs accessible uniquement authentifié
- Éviter exposition de données sensibles dans le DTO utilisateur
