# Guest Account Verification Backend Guide

This document is for backend implementation only.
Frontend is already wired to call these endpoints.

## Scope
Build guest verification flow with 3 levels:
- Level 1: Email verified
- Level 2: Phone verified
- Level 3: Identity verified (admin approval)

The flow must allow browsing without full verification and block booking until Level 3 is approved.

## Required User Fields
Add these fields to `User` entity:
- `emailVerified` (boolean, default `false`)
- `phoneVerified` (boolean, default `false`)
- `identityStatus` (enum: `NOT_VERIFIED`, `PENDING`, `APPROVED`, `REJECTED`)
- `identityRejectionReason` (nullable string)
- `verificationLevel` (int or computed):
  - `0` none
  - `1` email only
  - `2` email + phone
  - `3` identity approved

## OTP Tables / Collections
Create OTP storage for email and SMS codes.

Suggested table/collection: `verification_otps`
- `id`
- `userId`
- `channel` (`EMAIL`, `PHONE`)
- `target` (email or phone)
- `codeHash` (never store plain OTP)
- `expiresAt`
- `attemptCount`
- `maxAttempts`
- `used` (boolean)
- `createdAt`

Rules:
- OTP expires in 5 minutes
- max 5 verify attempts
- max resend: 3 per 15 minutes per channel
- invalidate previous OTP when sending a new one

## Identity Verification Storage
Create `guest_identity_verifications`:
- `id`
- `userId`
- `governmentIdUrl`
- `governmentIdMimeType`
- `governmentIdSize`
- `selfieUrl`
- `selfieMimeType`
- `selfieSize`
- `status` (`PENDING`, `APPROVED`, `REJECTED`)
- `rejectionReason` (nullable)
- `submittedAt`
- `reviewedAt` (nullable)
- `reviewedBy` (nullable)

## Endpoints Expected By Frontend
Base: `/api/verifications/guest`

### 1) Get Guest Verification Status
`GET /status`

Response example:
```json
{
  "emailVerified": true,
  "phoneVerified": true,
  "identityStatus": "pending",
  "verificationLevel": 2,
  "rejectionReason": null
}
```

### 2) Send Email OTP
`POST /email/send-otp`

Request:
```json
{
  "email": "user@example.com"
}
```

Response: `204` or success JSON.

### 3) Verify Email OTP
`POST /email/verify-otp`

Request:
```json
{
  "otp": "123456"
}
```

On success:
- set `user.emailVerified = true`
- recalculate `verificationLevel`
- return same status payload as `/status`

### 4) Send Phone OTP
`POST /phone/send-otp`

Request:
```json
{
  "phone": "+216XXXXXXXX"
}
```

### 5) Verify Phone OTP
`POST /phone/verify-otp`

Request:
```json
{
  "otp": "123456"
}
```

On success:
- set `user.phoneVerified = true`
- store normalized phone on user if required
- recalculate `verificationLevel`
- return status payload

### 6) Submit Identity Documents
`POST /identity` (`multipart/form-data`)

Parts:
- `governmentId` (required)
- `selfie` (required)

On success:
- create identity request with `PENDING`
- set `user.identityStatus = PENDING`
- return status payload

## Admin Review Endpoints (Recommended)
Base: `/api/admin/verifications/guest`

- `GET /pending`
- `GET /{verificationId}`
- `PUT /{verificationId}/approve`
- `PUT /{verificationId}/reject`

Reject request body:
```json
{
  "reason": "Image is blurry, please upload a clearer ID"
}
```

Approval side effects:
- set `user.identityStatus = APPROVED`
- set `user.verificationLevel = 3`

Rejection side effects:
- set `user.identityStatus = REJECTED`
- set `user.identityRejectionReason`
- keep booking blocked

## Booking Enforcement
In booking creation endpoint (`POST /api/bookings`), enforce:
- `emailVerified == true`
- `phoneVerified == true`
- `identityStatus == APPROVED`

If not satisfied, return `403` with a message like:
`"Guest verification required before booking"`

## Validation and Security
- Validate mime type: `image/jpeg`, `image/png`, `application/pdf`
- Max upload size: 5MB per file
- Virus scan hook recommended before persisting file
- Encrypt sensitive fields where applicable
- Add OTP rate limiting (IP + user + channel)
- Avoid duplicate verified accounts for same email/phone
- Audit log all approve/reject actions

## File Storage
Use current upload infrastructure (`/uploads/**`) or S3-compatible bucket.
Store only URLs and metadata in DB.

Suggested path pattern:
- `/uploads/verifications/guest/{userId}/{timestamp}-government-id.ext`
- `/uploads/verifications/guest/{userId}/{timestamp}-selfie.ext`

## Spring Boot Package Plan
- `entity/IdentityStatus.java`
- `entity/VerificationOtp.java`
- `entity/GuestIdentityVerification.java`
- `repository/VerificationOtpRepository.java`
- `repository/GuestIdentityVerificationRepository.java`
- `dto/verification/...`
- `service/GuestVerificationService.java`
- `service/impl/GuestVerificationServiceImpl.java`
- `controller/GuestVerificationController.java`
- `controller/AdminGuestVerificationController.java`

## Suggested DTOs
- `SendOtpRequest { email?, phone? }`
- `VerifyOtpRequest { otp }`
- `GuestVerificationStatusResponse`
- `RejectVerificationRequest { reason }`

## Frontend Dependency Notes
Frontend already calls these exact paths:
- `/api/verifications/guest/status`
- `/api/verifications/guest/email/send-otp`
- `/api/verifications/guest/email/verify-otp`
- `/api/verifications/guest/phone/send-otp`
- `/api/verifications/guest/phone/verify-otp`
- `/api/verifications/guest/identity`

Return `identityStatus` values in lowercase (`not_verified`, `pending`, `approved`, `rejected`) or adapt frontend mapping.

## Quick Test Checklist
1. Register guest -> all statuses unverified.
2. Verify email OTP -> level becomes 1.
3. Verify phone OTP -> level becomes 2.
4. Submit identity docs -> status pending.
5. Admin approves -> status approved, level 3.
6. Booking succeeds only after step 5.
7. Admin rejects -> booking blocked, rejection reason shown.
