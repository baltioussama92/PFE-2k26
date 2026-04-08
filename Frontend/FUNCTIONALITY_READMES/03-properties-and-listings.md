# Fonctionnalité - Propriétés / Listings

## Frontend concerné

- `src/services/propertyService.ts`
- Pages: explorer, property details, add property, my properties
- Upload image admin: `src/admin/services/adminApi.ts` -> `/api/uploads/images`

## Endpoints Backend requis

- `GET /api/listings`
- `GET /api/listings/search`
- `GET /api/listings/{id}`
- `GET /api/listings/owner/me`
- `POST /api/listings`
- `PUT /api/listings/{id}`
- `DELETE /api/listings/{id}`
- `POST /api/uploads/images`

## Checkpoints sécurité

- `POST/PUT/DELETE` listings: rôles `HOST|PROPRIETOR|ADMIN`
- Upload image: authentifié + rôle hôte/admin
- Contrôle ownership sur update/delete listing
- Validation stricte des médias uploadés (taille, type MIME, extension)
