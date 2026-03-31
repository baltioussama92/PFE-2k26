# Admin User Details - Backend Requirements by Page

This frontend now includes an admin user details workspace with tabs/pages:
- Overview
- History
- Chats
- Listings
- Bookings
- Earnings
- Security (edit name/email, change password, delete account)

Below is what backend should expose so each page is fully accurate and persistent.

## Overview
Current frontend can compute partial stats from existing admin endpoints.

Backend needed:
- `GET /api/admin/users/{userId}/overview`
- Response fields:
  - `userId`
  - `listingsCount`
  - `bookingsAsGuestCount`
  - `bookingsAsHostCount`
  - `paidBookingsCount`
  - `pendingBookingsCount`
  - `totalEarnings`
  - `totalSpent`

## History
Current frontend builds a synthetic timeline from listings/bookings/payments. It is not a full audit trail.

Backend needed:
- `GET /api/admin/users/{userId}/history?limit=50&cursor=...`
- Response fields per event:
  - `id`
  - `type` (ACCOUNT_CREATED, PROFILE_UPDATED, BOOKING_CREATED, BOOKING_CANCELLED, LISTING_CREATED, PAYMENT_COMPLETED, etc.)
  - `description`
  - `metadata`
  - `createdAt`

## Chats
Current frontend can only try conversation access via existing conversation API; this is not full user chat history for admin moderation.

Backend needed:
- `GET /api/admin/users/{userId}/messages?limit=50&cursor=...`
- Optional filters:
  - `direction=incoming|outgoing|all`
  - `withUserId`
- Response fields per message:
  - `id`
  - `senderId`
  - `receiverId`
  - `content`
  - `createdAt`
  - `conversationId`
  - `isDeleted`
  - `moderationFlags`

## Listings
Current frontend filters listings by `hostId` when available. If listing payload does not reliably include `hostId`, data can be incomplete.

Backend needed:
- `GET /api/admin/users/{userId}/listings`
- Response fields:
  - `id`
  - `title`
  - `location`
  - `status`
  - `createdAt`
  - `pricePerNight`
  - `rating`

## Bookings
Current frontend only shows bookings where user is guest. Host-side bookings connected to user-owned listings are not fully represented in one place.

Backend needed:
- `GET /api/admin/users/{userId}/bookings?role=guest|host|all`
- Response fields:
  - `id`
  - `listingId`
  - `listingTitle`
  - `guestId`
  - `hostId`
  - `checkInDate`
  - `checkOutDate`
  - `status`
  - `totalPrice`
  - `createdAt`

## Earnings
Current frontend computes earnings by matching host listings to bookings. This can drift from financial truth.

Backend needed:
- `GET /api/admin/users/{userId}/earnings`
- Response fields:
  - `totalEarnings`
  - `currency`
  - `paidBookingsCount`
  - `pendingPayoutCount`
  - `lastPayoutAt`
  - `monthlyBreakdown[]`

## Security - Edit Name/Email
Current frontend change is local-only and not persisted server-side.

Backend needed:
- `PATCH /api/admin/users/{userId}`
- Request:
  - `fullName`
  - `email`
- Response:
  - updated user payload
- Validation:
  - email uniqueness
  - role/permission checks

## Security - Change Password
Current frontend change is local-only.

Backend needed:
- `PATCH /api/admin/users/{userId}/password`
- Request:
  - `newPassword`
  - optionally `forceResetOnNextLogin`
- Response:
  - `success`
  - optional security event id

## Security - Delete Account
Current frontend delete is local-only in UI state.

Backend needed:
- `DELETE /api/admin/users/{userId}`
- Behavior to define:
  - soft delete vs hard delete
  - cascade strategy for listings/bookings/messages
  - anonymization policy
- Response:
  - `success`
  - `deletedAt`

## Optional Permissions Endpoint
To conditionally show admin controls and avoid frontend hardcoded behavior:
- `GET /api/admin/users/{userId}/permissions`
- Response example:
  - `canEditProfile`
  - `canChangePassword`
  - `canDeleteAccount`
  - `canViewMessages`
  - `canModerateListings`
