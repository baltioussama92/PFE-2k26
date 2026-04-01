# Host + Guest Verification Backend Implementation Guide

This README is for backend implementation of both:
- Host verification (user wants to publish properties)
- Guest verification (user identity trust before bookings)

It is written to match the current project stack:
- Spring Boot 3
- MongoDB
- JWT + method security
- Existing package structure in `com.maskan.api`

## 1. What exists right now

### Existing relevant backend pieces
- Role system exists: `ADMIN`, `HOST`, `GUEST` (see `entity/Role.java`).
- User entity exists with `isVerified` and `banned` flags.
- Upload infrastructure exists:
  - `POST /api/uploads/images` (`PropertyImageController`)
  - Static serving from `/uploads/**` (`WebConfig`)
- Admin endpoints exist in `AdminController`.
- Host demands admin requirements already documented in:
  - `Backend/HOST_DEMANDS_BACKEND_README.md`

### Existing frontend host verification form data
Current host verification page collects:
- Full name, email, phone (+ OTP in UI mock)
- Government ID file
- Selfie file
- Property proof document + proof type
- Property title, address, type
- Property images (min 3)
- IBAN + account holder
- Terms acceptance

## 2. Goal architecture

Use a dedicated verification workflow entity (recommended), not direct role switching.

### Flow summary
1. User submits verification request (host or guest).
2. Request status starts as `PENDING`.
3. Admin reviews request:
   - `APPROVED`: user verification flags updated (and role updated for host flow)
   - `REJECTED`: store reason, allow resubmission
4. Frontend can poll/get latest verification status.

## 3. Data model (MongoDB)

Create a new entity (recommended name):
- `VerificationRequest` in `entity/VerificationRequest.java`

### Suggested enums
- `VerificationType`: `HOST`, `GUEST`
- `VerificationStatus`: `PENDING`, `APPROVED`, `REJECTED`
- `DocumentType`: `GOVERNMENT_ID`, `SELFIE`, `PROPERTY_PROOF`, `PROPERTY_IMAGE`, `PROOF_OF_ADDRESS`

### Suggested document sub-object
- `VerificationDocument`
  - `documentType`
  - `fileName`
  - `fileUrl`
  - `mimeType`
  - `size`
  - `uploadedAt`

### Suggested VerificationRequest fields
- `id`
- `userId`
- `userEmail`
- `verificationType`
- `status`
- `submittedAt`
- `updatedAt`
- `reviewedAt`
- `reviewedByAdminId`
- `rejectionReason`
- `documents` (`List<VerificationDocument>`)
- `payload` (`Map<String, Object>` for flexible extra fields)

For host-specific payload keys:
- `fullName`, `phone`, `proofType`
- `propertyTitle`, `propertyAddress`, `propertyType`
- `iban`, `accountHolder`
- `confirmOwnership`, `acceptTerms`

For guest-specific payload keys:
- `fullName`, `phone`
- `acceptTerms`
- optional `travelPurpose` / `countryOfResidence` if needed later

## 4. Repository

Create:
- `repository/VerificationRequestRepository.java`

Suggested methods:
- `List<VerificationRequest> findByStatus(VerificationStatus status)`
- `List<VerificationRequest> findByVerificationType(VerificationType type)`
- `Optional<VerificationRequest> findTopByUserIdAndVerificationTypeOrderBySubmittedAtDesc(String userId, VerificationType type)`
- `boolean existsByUserIdAndVerificationTypeAndStatus(String userId, VerificationType type, VerificationStatus status)`

## 5. DTOs

Create in `dto/`:

### User submission DTOs
- `SubmitHostVerificationRequest`
  - `fullName`, `phone`, `proofType`, `propertyTitle`, `propertyAddress`, `propertyType`, `iban`, `accountHolder`, `confirmOwnership`, `acceptTerms`
- `SubmitGuestVerificationRequest`
  - `fullName`, `phone`, `acceptTerms`

### Common response DTO
- `VerificationResponse`
  - `id`, `userId`, `verificationType`, `status`, `submittedAt`, `updatedAt`, `rejectionReason`, `documents`, `payloadSummary`

### Admin decision DTOs
- `ReviewVerificationRequest`
  - `decision` (`APPROVE` or `REJECT`)
  - `reason` (required when reject)
- `VerificationDecisionResponse`
  - `success`, `message`, `verification`

## 6. API endpoints

Base path suggestion: `/api/verifications`

### User endpoints
- `POST /api/verifications/host`
  - Auth required
  - `multipart/form-data`
  - Fields:
    - text fields from `SubmitHostVerificationRequest`
    - files: `governmentId`, `selfie`, `propertyProof`, `propertyImages[]`
- `POST /api/verifications/guest`
  - Auth required
  - `multipart/form-data`
  - files: `governmentId`, `selfie` (optional proof-of-address if required)
- `GET /api/verifications/me?type=HOST|GUEST`
  - Returns latest status for current user and type
- `GET /api/verifications/me/history?type=HOST|GUEST`
  - Optional list/history endpoint

### Admin endpoints
Put these in `AdminController` or a dedicated `AdminVerificationController`.
- `GET /api/admin/verifications?type=HOST|GUEST&status=PENDING|APPROVED|REJECTED`
- `GET /api/admin/verifications/{id}`
- `PUT /api/admin/verifications/{id}/approve`
- `PUT /api/admin/verifications/{id}/reject`

## 7. Service logic rules

Create service:
- `VerificationService` + `impl/VerificationServiceImpl`

### Submission rules
- User must be authenticated.
- Reject if there is already an active `PENDING` request of same type.
- Validate file type and max size.
- Validate required files:
  - HOST: governmentId + selfie + propertyProof + at least 3 property images
  - GUEST: governmentId + selfie
- Validate text fields and required checkboxes.

### Approval rules
- Only admin can approve/reject.
- On host approval:
  - Update user role to `HOST`.
  - Optionally set user `isVerified = true`.
- On guest approval:
  - Keep role as `GUEST`.
  - Set guest verification marker (see section 8).
- Store reviewer metadata (`reviewedByAdminId`, `reviewedAt`).

### Rejection rules
- Rejection reason required.
- Keep audit trail.
- Allow user to submit a new request after rejection.

## 8. User verification flags (important)

Current `User` has only `isVerified` (generic). For clarity, add explicit flags:
- `hostVerificationStatus` (`PENDING|APPROVED|REJECTED|NOT_SUBMITTED`)
- `guestVerificationStatus` (`PENDING|APPROVED|REJECTED|NOT_SUBMITTED`)

If you want minimal changes now, keep statuses only in `VerificationRequest`, but explicit flags on `User` make frontend checks much easier.

## 9. File storage strategy

You can reuse current local upload mechanism.

### Recommended update
Create a dedicated upload helper/service for documents:
- `VerificationFileStorageService`

Store files under separated folders:
- `/uploads/verification/host/{verificationId}/...`
- `/uploads/verification/guest/{verificationId}/...`

Validate:
- Allowed mime types: `image/jpeg`, `image/png`, `application/pdf`
- Max size per file (for example 5MB)
- Optional antivirus scan hook (future)

Do not store raw binaries in Mongo documents; store metadata + URL.

## 10. Security and compliance

- All user verification endpoints require JWT.
- Admin review endpoints require `@PreAuthorize("hasRole('ADMIN')")`.
- Never expose sensitive bank details in admin list endpoint by default.
- Mask IBAN in responses (for example, show last 4 chars only).
- Log decision actions for audit.
- Add rate limit on submission endpoint to prevent abuse.

## 11. Validation checklist

### Host submission validation
- `fullName` not blank
- valid phone
- required files present
- `propertyImages.length >= 3`
- `accountHolder` equals `fullName` (case-insensitive, trimmed)
- valid IBAN format
- `confirmOwnership = true`
- `acceptTerms = true`

### Guest submission validation
- `fullName` not blank
- valid phone
- governmentId + selfie present
- `acceptTerms = true`

## 12. Suggested controller signatures (example)

```java
@PostMapping(value = "/api/verifications/host", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@PreAuthorize("isAuthenticated()")
public ResponseEntity<VerificationResponse> submitHostVerification(
    @AuthenticationPrincipal UserDetails principal,
    @Valid @ModelAttribute SubmitHostVerificationRequest request,
    @RequestPart("governmentId") MultipartFile governmentId,
    @RequestPart("selfie") MultipartFile selfie,
    @RequestPart("propertyProof") MultipartFile propertyProof,
    @RequestPart("propertyImages") List<MultipartFile> propertyImages
)
```

```java
@PutMapping("/api/admin/verifications/{id}/approve")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<VerificationDecisionResponse> approve(@PathVariable String id)
```

```java
@PutMapping("/api/admin/verifications/{id}/reject")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<VerificationDecisionResponse> reject(
    @PathVariable String id,
    @Valid @RequestBody ReviewVerificationRequest request
)
```

## 13. Frontend integration contract (recommended response shape)

### Submit response
```json
{
  "id": "67f1...",
  "verificationType": "HOST",
  "status": "PENDING",
  "submittedAt": "2026-04-01T11:20:30Z",
  "message": "Verification request submitted successfully"
}
```

### Admin list item
```json
{
  "id": "67f1...",
  "userId": "66a2...",
  "userName": "Jean Dupont",
  "userEmail": "jean@example.com",
  "verificationType": "HOST",
  "status": "PENDING",
  "submittedAt": "2026-04-01T11:20:30Z",
  "idVerificationStatus": "PENDING",
  "propertyTitle": "Appartement 2 chambres",
  "propertyAddress": "Casablanca",
  "documentUrls": {
    "governmentId": "http://localhost:8080/uploads/...",
    "selfie": "http://localhost:8080/uploads/..."
  }
}
```

## 14. Implementation plan (order of work)

1. Add enums and entities (`VerificationRequest`, `VerificationDocument`).
2. Add repository.
3. Add DTOs and validation annotations.
4. Add file storage service for verification docs.
5. Add `VerificationService` implementation.
6. Add user controller endpoints (`/api/verifications/*`).
7. Add admin review endpoints.
8. Add unit/service tests.
9. Add Postman collection for host + guest verification.
10. Integrate frontend to real endpoints.

## 15. Testing scenarios

- User submits HOST verification with all required docs -> `PENDING`.
- User submits HOST verification without required file -> `400`.
- User submits duplicate pending HOST request -> `409`.
- Admin approves HOST request -> user role changes to `HOST`.
- Admin rejects HOST request without reason -> `400`.
- User submits GUEST verification -> admin can approve/reject.
- Non-admin cannot call admin verification endpoints -> `403`.

## 16. Notes for this codebase

- Some controllers already reference extra role aliases like `PROPRIETOR` and `TENANT` in `@PreAuthorize`; align role naming to avoid confusion.
- Keep naming consistent between frontend and backend statuses (`pending/approved/rejected` vs uppercase enum values).
- Reuse existing CORS and upload configuration patterns.

---

If needed, I can also generate the first backend skeleton classes (entity/repository/controller/service interfaces) directly so your teammate only fills business logic.
