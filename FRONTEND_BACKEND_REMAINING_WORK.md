# PFE-2k26 — Travail restant (Frontend + Backend)

Dernière mise à jour: 2026-04-23
Objectif: finaliser la plateforme en **full backend réel** (sans mock/demo data).

---

## 1) Résumé exécutif

Le backend couvre déjà la majorité des APIs métier. Le principal blocage est l’intégration frontend: plusieurs pages admin/user utilisent encore des données statiques, des toasts demo, ou du localStorage à la place des endpoints backend déjà disponibles.

---

## 2) Backend — Ce qui reste à préparer

## 2.1 Endpoints manquants (priorité haute)

1. **Changement mot de passe utilisateur connecté**
   - Besoin: endpoint user self-service (ex: `PATCH /api/users/me/password`)
   - Pourquoi: `SettingsPage` simule encore la mise à jour mot de passe.

2. **Préférences utilisateur persistées** (optionnel mais recommandé)
   - Exemples: langue, devise, préférences notification
   - Pourquoi: actuellement stockées côté client uniquement.

## 2.2 Robustesse et production readiness

1. **Validation DTO stricte** sur payloads admin workspace (status/action/format)
2. **Normalisation des erreurs** (codes + messages cohérents côté API)
3. **Pagination/filtrage** pour listes admin volumineuses (reports/tickets/history)
4. **Audit log** systématique des actions admin sensibles
5. **Tests d’intégration** sur endpoints admin workspace

---

## 3) Frontend — Ce qui reste à préparer

## 3.1 Remplacer les mocks/demo par APIs réelles (priorité haute)

1. **Profile page**
   - Retirer `profileMockData` et brancher:
   - bookings (`/bookings/me`, `/bookings/owner`), wishlist (`/wishlist`), reviews (`/reviews/...`), stats host.

2. **HostVerificationPage**
   - Remplacer la simulation submit par vrai `multipart/form-data` vers `/api/verifications/host`.
   - Remplacer OTP mock par flow réel email/phone déjà disponible.

3. **Admin Reports**
   - Utiliser endpoints backend:
   - reports/disputes, chat moderation, support tickets (list/detail/actions/messages).

4. **Admin Payments**
   - Brancher finance summary/payouts/refunds/history.
   - Brancher téléchargement invoice + exports CSV/PDF réels.

5. **Admin Settings**
   - Remplacer localStorage par APIs backend:
   - settings, content management, notification templates/send/schedule/history.

## 3.2 Corrections techniques nécessaires

1. **Méthode HTTP incohérente sur update status booking**
   - Front envoie `PUT` dans certains appels admin.
   - Backend expose `PATCH /api/bookings/{id}/status`.
   - Action: unifier tous les appels frontend en `PATCH`.

2. **Endpoints admin workspace non centralisés dans `endpoints.ts`**
   - Ajouter les routes manquantes pour éviter les URLs inline et fiabiliser les appels.

3. **Retirer tous les toasts “(demo)”**
   - `Reports.tsx`, `Payments.tsx`, `Users.tsx`, etc.

4. **Retirer les compteurs mock UI**
   - Ex: unread notifications mock dans navbar/topbar.

---

## 4) Priorités d’implémentation (ordre recommandé)

## Sprint A — Bloquants fonctionnels
1. Corriger incohérences HTTP + centralisation endpoints frontend
2. Brancher Admin Reports (reports/chat/support)
3. Brancher Admin Payments (finance/export/invoice)
4. Brancher HostVerificationPage (submit réel)

## Sprint B — Expérience complète utilisateur
1. Brancher Profile page sans mock
2. Implémenter endpoint password self-service backend + intégration SettingsPage
3. Persister préférences user (si retenu)

## Sprint C — Qualité & mise en production
1. Tests E2E parcours Guest/Host/Admin
2. Tests backend d’intégration admin workspace
3. Nettoyage final (suppression fichiers mock/demo inutilisés)

---

## 5) Critères de fin (Definition of Done)

- Aucune page critique n’utilise de `mock`, `demo`, ou données statiques pour la logique métier.
- Tous les boutons d’action admin déclenchent des opérations backend réelles.
- Les endpoints critiques ont une gestion d’erreur cohérente (UI + API).
- Les principaux parcours sont validés en E2E:
  - Auth/register/login
  - Listing/search/bookings/payments
  - Profile guest/host
  - Admin moderation/finance/settings

---

## 6) Fichiers frontend à traiter en priorité

- `Frontend/src/admin/pages/Reports.tsx`
- `Frontend/src/admin/pages/Payments.tsx`
- `Frontend/src/admin/pages/Settings.tsx`
- `Frontend/src/pages/ProfilePage.jsx`
- `Frontend/src/pages/HostVerificationPage.jsx`
- `Frontend/src/admin/services/adminApi.ts`
- `Frontend/src/api/endpoints.ts`
- `Frontend/src/pages/SettingsPage.tsx`

## 7) Fichiers backend à traiter en priorité

- `Backend/src/main/java/com/maskan/api/controller/UserController.java`
- `Backend/src/main/java/com/maskan/api/controller/AdminWorkspaceController.java`
- `Backend/src/main/java/com/maskan/api/service/impl/AdminWorkspaceServiceImpl.java`
- (tests) `Backend/src/test/java/**`

---

## 8) Notes

- Le backend admin workspace est déjà largement présent: priorité à l’intégration frontend réelle.
- Garder ce document comme source de vérité de pilotage jusqu’au go-live.
