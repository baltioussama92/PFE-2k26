# Frontend Readiness and Backend Connection Status

This document explains what is currently ready in the frontend, what is working end-to-end, and what is connected to the backend APIs.

## Current State Summary

- Frontend build is working.
- Core API integration is active through a shared API client.
- Admin User Details workspace is connected to dedicated backend endpoints for overview, history, chats, listings, bookings, earnings, permissions, and security actions.
- Some labels in code still include "FrontendOnly" in method names, but these methods now call backend endpoints.

## Environment and API Wiring

- Base URL is read from `VITE_API_BASE_URL` (fallback: `http://localhost:8080`).
- Frontend sends requests to `{baseUrl}/api/...`.
- JWT bearer token is attached automatically when stored.
- On `401` or `403`, token and local auth state are cleared and user is redirected to login.

## What Is Ready and Working

### Global API Layer

- READY: Shared API client with `GET`, `POST`, `PUT`, `PATCH`, `DELETE` methods.
- READY: Centralized endpoint map for auth, users, listings, bookings, messages, dashboard, admin.
- WORKING: Auth token injection for protected backend routes.

### Admin User Details Page

Status: READY and CONNECTED to backend.

The page loads all major datasets in parallel and renders tab-specific sections:

- WORKING: Overview tab
- WORKING: History tab
- WORKING: Chats tab
- WORKING: Listings tab
- WORKING: Bookings tab
- WORKING: Earnings tab
- WORKING: Security tab (profile update, password change, delete account)

## Detailed Backend Connectivity (Admin User Details)

### 1) Overview

- Frontend call: `adminApi.getUserEarningsSummary(userId)`
- Backend endpoints used:
  - `GET /api/admin/users/{userId}/overview`
  - `GET /api/admin/users/{userId}/earnings`
- Status: CONNECTED and WORKING
- Data used in UI:
  - Listings count
  - Paid bookings
  - Pending bookings
  - Total earnings
  - Total spent

### 2) History

- Frontend call: `adminApi.getUserHistory(userId)`
- Backend endpoint used:
  - `GET /api/admin/users/{userId}/history?limit=100`
- Status: CONNECTED and WORKING
- Data shown:
  - Event type label
  - Description
  - Event timestamp

### 3) Chats

- Frontend call: `adminApi.getUserConversation(userId)`
- Backend endpoint used:
  - `GET /api/admin/users/{userId}/messages?limit=100&direction=all`
- Status: CONNECTED and WORKING
- Note:
  - UI respects `canViewMessages` from permissions endpoint.

### 4) Listings

- Frontend call: `adminApi.getUserListings(userId)`
- Backend endpoint used:
  - `GET /api/admin/users/{userId}/listings`
- Status: CONNECTED and WORKING
- Data shown:
  - Title
  - Location
  - Listing status

### 5) Bookings

- Frontend call: `adminApi.getUserBookings(userId)`
- Backend endpoint used:
  - `GET /api/admin/users/{userId}/bookings?role=all`
- Status: CONNECTED and WORKING
- Data shown:
  - Listing title
  - Dates
  - Booking status

### 6) Earnings

- Frontend call: `adminApi.getUserEarningsSummary(userId)`
- Backend endpoints used:
  - `GET /api/admin/users/{userId}/overview`
  - `GET /api/admin/users/{userId}/earnings`
- Status: CONNECTED and WORKING
- Data shown:
  - Total earnings
  - Paid bookings
  - Pending payouts (mapped as pending bookings in UI)
  - Owned listings count

### 7) Security - Edit Profile

- Frontend call: `adminApi.updateUserProfileFrontendOnly(user, payload)`
- Backend endpoint used:
  - `PATCH /api/admin/users/{userId}`
- Status: CONNECTED and WORKING
- Note:
  - Method name includes "FrontendOnly" but this now persists server-side.

### 8) Security - Change Password

- Frontend call: `adminApi.changeUserPasswordFrontendOnly(userId, newPassword)`
- Backend endpoint used:
  - `PATCH /api/admin/users/{userId}/password`
- Status: CONNECTED and WORKING
- Note:
  - Method name includes "FrontendOnly" but this now persists server-side.

### 9) Security - Delete Account

- Frontend call: `adminApi.deleteUserFrontendOnly(userId)`
- Backend endpoint used:
  - `DELETE /api/admin/users/{userId}`
- Status: CONNECTED and WORKING
- Note:
  - Method name includes "FrontendOnly" but this now persists server-side.

### 10) Permissions

- Frontend call: `adminApi.getUserPermissions(userId)`
- Backend endpoint used:
  - `GET /api/admin/users/{userId}/permissions`
- Status: CONNECTED and WORKING
- Used for:
  - Showing/hiding access to messages and security actions.

## Backend Endpoints Confirmed Present

The backend controller currently exposes all required Admin User Details endpoints under `/api/admin/users/{userId}/...` including:

- `/overview`
- `/history`
- `/messages`
- `/listings`
- `/bookings`
- `/earnings`
- `PATCH /users/{userId}`
- `PATCH /users/{userId}/password`
- `DELETE /users/{userId}`
- `/permissions`

## Known Naming Cleanup (Non-Blocking)

- In frontend admin API service, these method names are outdated and can be renamed for clarity:
  - `updateUserProfileFrontendOnly`
  - `changeUserPasswordFrontendOnly`
  - `deleteUserFrontendOnly`

They already call real backend endpoints and are functionally correct.

## Quick Verification Checklist

1. Start backend on port `8080`.
2. Start frontend and ensure `VITE_API_BASE_URL` points to backend.
3. Login as an admin user.
4. Open Admin -> Users -> User Details.
5. Validate each tab loads backend data:
   - Overview, History, Chats, Listings, Bookings, Earnings.
6. Validate security actions:
   - Update profile
   - Change password
   - Delete account

## Source of Truth in Code

- Frontend endpoint map: `src/api/endpoints.ts`
- Frontend admin data service: `src/admin/services/adminApi.ts`
- Frontend admin details page: `src/admin/pages/UserDetails.tsx`
- Frontend HTTP client and auth wiring: `src/api/apiClient.ts`
- Backend admin controller: `../Backend/src/main/java/com/maskan/api/controller/AdminController.java`
