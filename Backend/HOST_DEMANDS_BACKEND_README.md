# Host Demands Backend Requirements

This file documents what already exists in backend APIs and what must be added so the admin Host Demands page can use real data (no mock fallback).

## 1) Endpoint Audit

### Existing endpoints (already in backend)

- `GET /api/listings`
- `GET /api/listings/{id}`
- `PUT /api/listings/{id}`
- `DELETE /api/listings/{id}`
- `GET /api/admin/users`
- `GET /api/admin/users/{userId}/overview`
- `GET /api/admin/users/{userId}/history`
- `GET /api/admin/users/{userId}/messages`
- `GET /api/admin/users/{userId}/listings`
- `GET /api/admin/users/{userId}/bookings`
- `GET /api/admin/users/{userId}/earnings`
- `GET /api/admin/users/{userId}/permissions`

### Missing endpoints (required for Host Demands page)

- `GET /api/admin/host-demands`
- `GET /api/admin/host-demands/{demandId}`
- `PUT /api/admin/host-demands/{demandId}/approve`
- `PUT /api/admin/host-demands/{demandId}/reject`

## 2) Data Contract Needed by Frontend

Each host demand item should provide at least:

- `id` (string, Mongo ObjectId)
- `userId` (string)
- `userName` (string)
- `userEmail` (string)
- `status` (`pending | approved | rejected`)
- `createdAt` (ISO date string)
- `updatedAt` (ISO date string, optional)
- `profilePicture` (string URL, optional)
- `bio` (string, optional)
- `proposedLocation` (string)
- `proposedPrice` (number)
- `housePictures` (string[] of URLs)
- `idDocumentFront` (string URL)
- `idDocumentBack` (string URL, optional)
- `idVerificationStatus` (`pending | verified | rejected`)
- `notes` (string, optional)
- `rejectionReason` (string, optional)

## 3) Suggested DTOs

Create DTOs under `com.maskan.api.dto`:

- `HostDemandResponse`
- `RejectHostDemandRequest` with:
  - `reason` (required)
- `HostDemandDecisionResponse` with:
  - `success` (boolean)
  - `message` (string)
  - `demand` (`HostDemandResponse`)

## 4) Suggested Controller Methods

Add methods in `AdminController` (all with `@PreAuthorize("hasRole('ADMIN')")`):

- `GET /host-demands` -> list all demands (filter by status optional query param)
- `GET /host-demands/{demandId}` -> one demand details
- `PUT /host-demands/{demandId}/approve` -> approve host demand
- `PUT /host-demands/{demandId}/reject` -> reject host demand with reason

Example signatures:

- `ResponseEntity<List<HostDemandResponse>> hostDemands(@RequestParam(required = false) String status)`
- `ResponseEntity<HostDemandResponse> hostDemandById(@PathVariable String demandId)`
- `ResponseEntity<HostDemandDecisionResponse> approveHostDemand(@PathVariable String demandId)`
- `ResponseEntity<HostDemandDecisionResponse> rejectHostDemand(@PathVariable String demandId, @Valid @RequestBody RejectHostDemandRequest request)`

## 5) Suggested Persistence Model

Add entity `HostDemand` with fields:

- `id`, `userId`, `status`, `createdAt`, `updatedAt`
- profile fields (`profilePicture`, `bio`)
- verification fields (`idDocumentFront`, `idDocumentBack`, `idVerificationStatus`)
- listing proposal fields (`proposedLocation`, `proposedPrice`, `housePictures`)
- decision fields (`notes`, `rejectionReason`, `reviewedByAdminId`, `reviewedAt`)

Add repository:

- `HostDemandRepository extends MongoRepository<HostDemand, String>`
- optional helpers: `findByStatus(...)`, `findByUserId(...)`

## 6) Service Rules

- Only one active `pending` demand per user at a time.
- Approve flow should:
  - mark demand as `approved`
  - update user role to host/proprietor (your current role naming)
  - store `reviewedByAdminId` and `reviewedAt`
- Reject flow should:
  - mark demand as `rejected`
  - require non-empty rejection reason
  - store reason and reviewer metadata

## 7) Frontend Integration After Backend Is Ready

In `Frontend/src/admin/services/adminApi.ts`, replace current TODO mock logic with real calls:

- `getHostDemands()` -> `GET /api/admin/host-demands`
- `approveHostDemand(id)` -> `PUT /api/admin/host-demands/{id}/approve`
- `rejectHostDemand(id, reason)` -> `PUT /api/admin/host-demands/{id}/reject`

Also add endpoint builders in `Frontend/src/api/endpoints.ts` under `admin`:

- `hostDemands: '/admin/host-demands'`
- `hostDemandById: (id) => '/admin/host-demands/' + id`
- `approveHostDemand: (id) => '/admin/host-demands/' + id + '/approve'`
- `rejectHostDemand: (id) => '/admin/host-demands/' + id + '/reject'`

## 8) Quick Test Cases

- Admin can list all pending host demands.
- Admin can open details and see profile, ID files, and house images.
- Admin can approve and user becomes host/proprietor.
- Admin can reject with reason.
- Non-admin gets 403 on all host-demand admin endpoints.
