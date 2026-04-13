# Backend Status

_Last update: 2026-04-13_

## ✅ Ce qui est prêt

### APIs core
- Auth: register, login, me.
- Users: profil courant (read/update), search.
- Listings: CRUD + search + advanced search + listings owner.
- Bookings: création, mes bookings, bookings host, update status, suppression.
- Messages: envoi, inbox/sent, conversations.
- Wishlist: endpoints CRUD disponibles.
- Reviews: create + list by listing.
- Dashboard: tenant/host/admin summary.
- Connections: request/accept/pending/list.

### Verification
- Guest verification prête (OTP email/téléphone + identité).
- Host verification prête côté API (`POST /api/verifications/host`, status endpoint).

### Admin
- Gestion users (list, ban/block, update, password, delete).
- Bookings admin, pending listings, verify listing.
- User details admin: overview, history, messages, listings, bookings, earnings, permissions.
- Guest verifications: approve/reject.
- Host demands: list/details/approve/reject.

## ⏳ Ce qui reste à préparer

### À confirmer / finaliser
- Vérifier que tous les endpoints attendus par le frontend admin ne passent plus par fallback mock.
- Exécuter une validation E2E complète sur tous les endpoints “ready”.

### Optionnel (selon scope produit)
- API dédiée paiements admin (au lieu de données dérivées des bookings).
- API dédiée reports/modération admin.
- API de persistance des settings admin.

## 🎯 Prochaines actions backend
1. Vérification Postman complète (happy path + erreurs).
2. Ajouter/compléter tests d’intégration pour endpoints admin critiques.
3. Documenter officiellement les APIs optionnelles retenues (payments/reports/settings).
