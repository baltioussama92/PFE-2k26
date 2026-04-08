# Fonctionnalité - Vérification invité (KYC)

## Frontend concerné

- `src/services/guestVerificationService.ts`
- `src/pages/GuestVerificationPage.jsx`

## Endpoints Backend requis

- `GET /api/verifications/guest/status`
- `POST /api/verifications/guest/email/send-otp`
- `POST /api/verifications/guest/email/verify-otp`
- `POST /api/verifications/guest/phone/send-otp`
- `POST /api/verifications/guest/phone/verify-otp`
- `POST /api/verifications/guest/identity` (multipart)

## Checkpoints sécurité

- Auth obligatoire
- Validation OTP + expiration (production)
- Validation stricte des fichiers uploadés
- Tracer les changements de statut de vérification
- Rejet explicite avec raison côté admin
