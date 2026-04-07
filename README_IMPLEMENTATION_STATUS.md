# PFE-2k26 Implementation Status (Frontend + Backend)

Last updated: 2026-04-07

This file summarizes:
- Frontend pages that are done
- Whether their backend endpoints are working
- What is not ready yet
- Backend APIs that are ready vs missing
- What you still need to build

Note: status is based on code scan (routes, controllers, services), not full runtime QA.

## 1) Frontend Pages Status

| Area | Page | Status | Endpoint Status | Notes |
|---|---|---|---|---|
| Public | Home (`/`) | Done | Working | Uses listings/search flow via services |
| Public | Explorer (`/explorer`) | Done | Working | Uses `/api/listings` and `/api/listings/search` |
| Public | Property Details (`/property/:id`) | Done | Working | Uses `/api/listings/{id}` + reviews |
| Auth | Auth Modal (login/register) | Done | Working | `/api/auth/login`, `/api/auth/register`, `/api/auth/me` |
| User | Profile (`/profile`) | Done | Working | `/api/users/me` read/update |
| User | Settings (`/settings`) | Done | Mostly Working | Core auth/profile is wired |
| User | Wishlist (`/favorites`) | Done | Working | `/api/wishlist` endpoints |
| User | Bookings (`/bookings`) | Done | Working | `/api/bookings` endpoints |
| User | Messages (`/messages`) | Done | Working | `/api/messages/*` endpoints |
| Host | Add Property (`/add-property`) | Done | Working | `/api/listings` create + upload support |
| Host | My Properties (`/my-properties`) | Done | Working | `/api/listings/owner/me` |
| Host | Host Bookings (`/host-bookings`) | Done | Working | `/api/bookings/owner` |
| Guest Verification | Guest Verification (`/guest-verification`) | Done | Working | `/api/verifications/guest/*` |
| Host Verification | Host Verification (`/host-verification`) | Partial | Not Ready (real backend flow missing) | Submit currently simulated in frontend |
| Admin | Admin Dashboard (`/admin/dashboard`) | Done | Working | Uses admin summary/bookings/users data |
| Admin | Users (`/admin/users`) | Done | Working | `/api/admin/users`, block/ban |
| Admin | User Details (`/admin/users/:userId`) | Done | Working | Overview/history/chats/listings/bookings/earnings/security |
| Admin | Guest Verifications (`/admin/guest-verifications`) | Done | Working | approve/reject endpoints exist |
| Admin | Listings (`/admin/listings`) | Done | Working | pending listings + verify listing |
| Admin | Bookings (`/admin/bookings`) | Done | Working | `/api/admin/bookings` |
| Admin | Payments (`/admin/payments`) | Partial | No dedicated payments API | Derived from bookings data |
| Admin | Reports (`/admin/reports`) | Partial | No dedicated reports API | Built from pending listings + fallback data |
| Admin | Settings (`/admin/settings`) | Partial | Not backend-persisted | Saved in localStorage only |
| Admin | Host Demands (`/admin/host-demands`) | Partial | Not Ready (backend endpoints missing) | Currently mock/fallback in `adminApi` |

## 2) Backend API Status

## Ready Backend APIs

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Users
- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/users/search`

### Listings
- `GET /api/listings`
- `GET /api/listings/{id}`
- `POST /api/listings`
- `PUT /api/listings/{id}`
- `DELETE /api/listings/{id}`
- `GET /api/listings/owner/me`
- `GET /api/listings/search`
- `GET /api/listings/search/advanced`

### Uploads
- `POST /api/uploads/images`

### Bookings
- `POST /api/bookings`
- `GET /api/bookings/me`
- `GET /api/bookings/owner`
- `PATCH /api/bookings/{id}/status`
- `DELETE /api/bookings/{id}`

### Reviews
- `POST /api/reviews`
- `GET /api/reviews/listing/{listingId}`

### Messages
- `POST /api/messages`
- `GET /api/messages/inbox`
- `GET /api/messages/sent`
- `GET /api/messages/conversations`
- `GET /api/messages/conversations/{userId}`

### Wishlist
- `GET /api/wishlist`
- `POST /api/wishlist/{listingId}`
- `DELETE /api/wishlist/{listingId}`

### Dashboard
- `GET /api/dashboard/tenant/summary`
- `GET /api/dashboard/host/summary`
- `GET /api/dashboard/admin/summary`

### Connections
- `POST /api/connections/request`
- `PATCH /api/connections/{id}/accept`
- `GET /api/connections/pending`
- `GET /api/connections`

### Guest Verification
- `GET /api/verifications/guest/status`
- `POST /api/verifications/guest/email/send-otp`
- `POST /api/verifications/guest/email/verify-otp`
- `POST /api/verifications/guest/phone/send-otp`
- `POST /api/verifications/guest/phone/verify-otp`
- `POST /api/verifications/guest/identity`

### Admin
- `GET /api/admin/users`
- `PUT /api/admin/users/{id}/ban`
- `PUT /api/admin/users/{id}/block`
- `GET /api/admin/bookings`
- `GET /api/admin/pending-listings`
- `PUT /api/admin/properties/{id}/verify`
- `GET /api/admin/growth-metrics`
- `GET /api/admin/stats`
- `GET /api/admin/users/{userId}/overview`
- `GET /api/admin/users/{userId}/history`
- `GET /api/admin/users/{userId}/messages`
- `GET /api/admin/users/{userId}/listings`
- `GET /api/admin/users/{userId}/bookings`
- `GET /api/admin/users/{userId}/earnings`
- `PATCH /api/admin/users/{userId}`
- `PATCH /api/admin/users/{userId}/password`
- `DELETE /api/admin/users/{userId}`
- `GET /api/admin/users/{userId}/permissions`
- `PATCH /api/admin/guest-verifications/{userId}/approve`
- `PATCH /api/admin/guest-verifications/{userId}/reject`

## Not Ready / Missing Backend APIs

### Host Demands (required by Admin Host Demands page)
- `GET /api/admin/host-demands`
- `GET /api/admin/host-demands/{demandId}`
- `PUT /api/admin/host-demands/{demandId}/approve`
- `PUT /api/admin/host-demands/{demandId}/reject`

### Host Verification user flow (required by Host Verification page)
No implemented host verification endpoints were found in backend controllers.
Suggested:
- `POST /api/verifications/host` (multipart)
- `GET /api/verifications/me?type=HOST`
- optional admin review endpoints for host verification if separated from host-demands flow

### Optional but currently absent dedicated APIs
- Dedicated admin payments endpoint (if you do not want payments derived from bookings)
- Dedicated admin reports endpoint (if you want real abuse/report moderation data)
- Backend-persisted admin settings endpoint

## 3) What You Need To Build Next

1. Implement Host Demands backend endpoints and persistence model.
2. Replace Host Demands frontend mock/fallback calls with real API calls.
3. Implement Host Verification backend submission endpoint (multipart docs + property images).
4. Replace Host Verification page simulated submit with real API integration.
5. Decide if Admin Payments should stay derived from bookings or become a dedicated payments module.
6. Decide if Admin Reports should stay synthesized or become a dedicated reports module.
7. Add backend settings API if admin settings must persist for all admins/users.
8. Run end-to-end API tests (Postman) for all ready endpoints and add regression tests for new endpoints.

## 4) Quick Readiness Summary

- Core rental platform (auth, listings, bookings, messages, wishlist, dashboard): READY.
- Guest verification flow: READY.
- Admin user management and user details tabs: READY.
- Host demands workflow: FRONTEND UI READY, BACKEND NOT READY.
- Host verification submission workflow: UI PARTIAL, BACKEND NOT READY.
