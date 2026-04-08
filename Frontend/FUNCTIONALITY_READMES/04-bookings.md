# Fonctionnalité - Réservations (Bookings)

## Frontend concerné

- `src/services/bookingService.ts`
- pages `BookingsPage`, `HostBookingsPage`, admin bookings

## Endpoints Backend requis

- `POST /api/bookings`
- `GET /api/bookings/me`
- `GET /api/bookings/owner`
- `PATCH /api/bookings/{id}/status`
- `PUT /api/bookings/{id}/status` (compatibilité Frontend existant)
- `DELETE /api/bookings/{id}`

## Checkpoints sécurité

- Création booking: rôle locataire (`GUEST|TENANT`)
- Mise à jour statut: `HOST|PROPRIETOR|ADMIN` et vérifier droits sur la réservation
- Suppression: propriétaire de réservation ou admin
- Empêcher transitions de statut invalides
