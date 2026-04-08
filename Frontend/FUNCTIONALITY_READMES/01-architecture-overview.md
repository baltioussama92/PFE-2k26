# Architecture Frontend - Vue d'ensemble

## Stack et structure

- Framework: React + Vite
- Routage: `react-router-dom`
- Data access: `axios` via `src/api/apiClient.ts` + quelques appels `fetch`
- Design: Tailwind + composants UI internes

## Organisation principale

- `src/App.jsx`: point d'entrée des routes publiques, dashboard, admin
- `src/pages/*`: pages utilisateur (home, profile, bookings, settings...)
- `src/services/*`: services API orientés domaine
- `src/admin/*`: interface admin (pages + service `adminApi.ts`)
- `src/api/endpoints.ts`: contrat centralisé des routes Backend

## Authentification et session

- Token JWT stocké dans `localStorage` (`authToken`)
- Intercepteur Axios ajoute `Authorization: Bearer <token>`
- Sur `401/403`, session vidée et redirection vers login

## Contrat global attendu du Backend

- Base API: `/api`
- Réponses JSON cohérentes pour toutes les routes métier
- Codes HTTP stricts (`2xx`, `401`, `403`, `404`, `422`)
- Contrat stable entre DTO Backend et `src/utils/contracts`

## Checkpoints sécurité globaux

- Validation serveur de tous les payloads (jamais faire confiance au Frontend)
- Contrôle d'autorisation par rôle sur les routes sensibles
- Interdiction d'accès aux ressources d'un autre utilisateur
- Rate limiting recommandé sur auth et OTP
- Journalisation des actions admin (ban, suppression, validation)
