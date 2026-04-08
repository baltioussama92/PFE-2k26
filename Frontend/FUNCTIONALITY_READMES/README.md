# Frontend Functionality READMEs

Ce dossier décrit l'architecture fonctionnelle du Frontend et les besoins exacts côté Backend (endpoints + sécurité).

## Fonctionnalités couvertes

1. `01-architecture-overview.md`
2. `02-authentication.md`
3. `03-properties-and-listings.md`
4. `04-bookings.md`
5. `05-messaging-and-connections.md`
6. `06-wishlist.md`
7. `07-profile-and-settings.md`
8. `08-guest-verification.md`
9. `09-admin-panel.md`

## Résumé des gaps détectés

- Endpoint manquant: `GET /api/admin/host-demands`
- Endpoint manquant: `GET /api/admin/host-demands/{demandId}`
- Endpoint manquant: `PUT /api/admin/host-demands/{demandId}/approve`
- Endpoint manquant: `PUT /api/admin/host-demands/{demandId}/reject`
- Incohérence méthode HTTP: le Frontend appelle aussi `PUT /api/bookings/{id}/status` (en plus de `PATCH`).
