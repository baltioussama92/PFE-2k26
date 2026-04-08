# Fonctionnalité - Admin Panel

## Frontend concerné

- `src/admin/pages/*`
- `src/admin/services/adminApi.ts`

## Endpoints Backend requis

### Déjà utilisés
- `GET /api/admin/users`
- `PUT /api/admin/users/{id}/block`
- `GET /api/admin/bookings`
- `GET /api/admin/pending-listings`
- `PUT /api/admin/properties/{id}/verify`
- `GET /api/admin/users/{userId}/overview`
- `GET /api/admin/users/{userId}/history`
- `GET /api/admin/users/{userId}/messages`
- `GET /api/admin/users/{userId}/listings`
- `GET /api/admin/users/{userId}/bookings`
- `GET /api/admin/users/{userId}/earnings`
- `PATCH /api/admin/users/{userId}`
- `PATCH /api/admin/users/{userId}/password`
- `DELETE /api/admin/users/{userId}`
- `GET /api/admin/users/{userId}/permissions`
- `PATCH /api/admin/guest-verifications/{userId}/approve`
- `PATCH /api/admin/guest-verifications/{userId}/reject`
- `GET /api/dashboard/admin/summary`

### Manquants détectés (Host Demands)
- `GET /api/admin/host-demands`
- `GET /api/admin/host-demands/{demandId}`
- `PUT /api/admin/host-demands/{demandId}/approve`
- `PUT /api/admin/host-demands/{demandId}/reject`

## Checkpoints sécurité

- Toutes les routes admin doivent être `ROLE_ADMIN`
- Audit trail recommandé pour actions sensibles (ban/delete/approve/reject)
- Validation des payloads admin (mot de passe, raison de rejet)
- Vérification d'existence des ressources avant mutation
