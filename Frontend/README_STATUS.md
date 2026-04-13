# Frontend Status

_Last update: 2026-04-13_

## ✅ Ce qui est prêt

### App principale
- Build frontend opérationnel.
- Client API partagé branché sur `VITE_API_BASE_URL` (fallback `http://localhost:8080`).
- Injection automatique du token JWT + gestion 401/403.

### Pages et flows prêts
- Public: Home, Explorer, Property Details.
- Auth: login/register/me.
- User: Profile, Settings (base), Favorites, Bookings, Messages.
- Host: Add Property, My Properties, Host Bookings.
- Verification invité: flow connecté au backend.
- Admin: Dashboard, Users, User Details, Listings, Bookings, Guest Verifications.

### Admin User Details (connecté backend)
- Tabs connectés: Overview, History, Chats, Listings, Bookings, Earnings, Security.
- Actions sécurité connectées: update profil, change password, delete account.

## ⏳ Ce qui reste à préparer

### Intégration à finaliser
- Host Verification page: connecter la soumission au backend réel si encore simulée.
- Host Demands côté admin: supprimer tout mock/fallback restant si présent.

### Nettoyage technique
- Renommer les méthodes frontend encore suffixées `FrontendOnly` (elles appellent déjà le backend, mais le nom est trompeur).
- Vérifier uniformité loading/error states sur les pages secondaires.

### Optionnel (selon décision produit)
- Paiements admin dédiés (si backend dédié est créé).
- Reports admin dédiés (si backend dédié est créé).
- Settings admin persistés backend (si API dédiée est créée).

## 🎯 Prochaines actions frontend
1. Finaliser Host Verification (submit réel + gestion succès/erreur).
2. Nettoyer les derniers mocks/fallbacks admin.
3. Lancer validation E2E front-back (scénarios utilisateur + admin).
4. Harmoniser naming et états UI (loading/error).
