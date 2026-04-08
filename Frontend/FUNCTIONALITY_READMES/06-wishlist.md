# Fonctionnalité - Wishlist

## Frontend concerné

- `src/services/wishlistService.ts`
- page `WishlistPage`

## Endpoints Backend requis

- `GET /api/wishlist`
- `POST /api/wishlist/{listingId}`
- `DELETE /api/wishlist/{listingId}`

## Checkpoints sécurité

- Routes authentifiées uniquement
- Vérifier existence du listing avant ajout/suppression
- Prévenir les doublons d'ajout en wishlist
