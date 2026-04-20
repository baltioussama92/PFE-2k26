# Admin Workspace Backend Gaps

Date: 2026-04-20
Owner: Backend teammate
Context: Admin workspace frontend is redesigned and now expects broader operational data.

## 1) What is already available and connected

These backend APIs already exist and are usable by admin frontend:

- `GET /api/admin/users`
- `PUT /api/admin/users/{id}/block`
- `GET /api/admin/bookings`
- `GET /api/admin/pending-listings`
- `PUT /api/admin/properties/{id}/verify`
- `GET /api/admin/growth-metrics`
- `GET /api/admin/users/{userId}/overview`
- `GET /api/admin/users/{userId}/history`
- `GET /api/admin/users/{userId}/messages`
- `GET /api/admin/users/{userId}/listings`
- `GET /api/admin/users/{userId}/bookings?role=all`
- `GET /api/admin/users/{userId}/earnings`
- `PATCH /api/admin/users/{userId}`
- `PATCH /api/admin/users/{userId}/password`
- `DELETE /api/admin/users/{userId}`
- `GET /api/admin/users/{userId}/permissions`
- `PATCH /api/admin/guest-verifications/{userId}/approve`
- `PATCH /api/admin/guest-verifications/{userId}/reject`
- `GET /api/admin/host-demands`
- `GET /api/admin/host-demands/{demandId}`
- `PUT /api/admin/host-demands/{demandId}/approve`
- `PUT /api/admin/host-demands/{demandId}/reject`
- `GET /api/dashboard/admin/summary`

## 2) Frontend-side wiring done now

Completed in frontend:

- Host demands are now fetched from backend (no longer mock-only by default).
- Host demand approve/reject actions now call backend endpoints.

## 3) Missing backend capabilities (to implement)

The admin UI still contains areas with placeholder/generated data because APIs are missing.

### Priority A (core moderation and operations)

1. Reports and disputes module
- Need entity/tables for reports and dispute cases.
- Need endpoints:
  - `GET /api/admin/reports`
  - `GET /api/admin/reports/{id}`
  - `PATCH /api/admin/reports/{id}/status` (open, investigating, resolved, closed)
  - `POST /api/admin/reports/{id}/actions` (warn, suspend, ban, refund, close_case)
- Required fields (minimum):
  - `id`, `createdAt`, `reporterId`, `targetType`, `targetId`, `reason`, `severity`, `status`
  - `evidence` (array of urls)
  - `internalNotes` (array or thread)
  - `decision` (final action + actor + timestamp)

2. Chat moderation module
- Need flagged conversations source and moderation actions.
- Endpoints:
  - `GET /api/admin/chat/flagged`
  - `GET /api/admin/chat/flagged/{conversationId}`
  - `POST /api/admin/chat/moderation-actions` (mute, warn, suspend, ban)
- Suggested response fields:
  - `conversationId`, `participants`, `flaggedMessages[]`, `severity`, `lastFlagAt`, `status`

3. Support ticket module
- Need support tickets and assignment lifecycle.
- Endpoints:
  - `GET /api/admin/support/tickets`
  - `GET /api/admin/support/tickets/{id}`
  - `PATCH /api/admin/support/tickets/{id}` (assign, escalate, resolve, close)
  - `POST /api/admin/support/tickets/{id}/messages`
- Suggested fields:
  - `id`, `requesterId`, `subject`, `priority`, `status`, `assigneeId`, `createdAt`, `updatedAt`
  - `messages[]` for chat-like panel

### Priority B (finance and analytics completeness)

4. Revenue and payment operations
- Current frontend computes part of finance from bookings; missing explicit payout/refund domain.
- Endpoints:
  - `GET /api/admin/finance/summary`
  - `GET /api/admin/finance/payouts`
  - `GET /api/admin/finance/refunds`
  - `GET /api/admin/finance/payments/history`
  - `GET /api/admin/finance/invoices/{invoiceId}/download`
  - `GET /api/admin/finance/export?format=csv|pdf`

5. Analytics datasets
- Dashboard currently uses partial backend data + placeholder chart series.
- Endpoints:
  - `GET /api/admin/analytics/revenue-trend?from=&to=&groupBy=month`
  - `GET /api/admin/analytics/booking-trend?from=&to=&groupBy=month`
  - `GET /api/admin/analytics/user-growth?from=&to=&groupBy=month`
  - `GET /api/admin/analytics/top-cities?from=&to=&limit=10`
  - `GET /api/admin/analytics/conversion-rate?from=&to=`
  - `GET /api/admin/analytics/most-active-hosts?from=&to=&limit=10`
  - `GET /api/admin/analytics/complaint-categories?from=&to=`

### Priority C (platform management)

6. Platform settings persistence
- Current settings are frontend localStorage only.
- Endpoints:
  - `GET /api/admin/settings`
  - `PUT /api/admin/settings`
- Suggested fields:
  - `commissionPercentage`, `currency`, `language`
  - `emailNotifications`, `inAppNotifications`
  - `enableSmartPricing`, `enableNewHostOnboarding`
  - `maintenanceMode`
  - `branding` (`logoUrl`, optional `brandName`)
  - `emailConfig`, `smsConfig` (or secure references)

7. Content management (CMS)
- Home banners, FAQ, terms, privacy, footer/contact are currently local placeholders.
- Endpoints:
  - `GET /api/admin/content`
  - `PUT /api/admin/content`
- Suggested fields:
  - `homeBanner`, `faq`, `terms`, `privacyPolicy`, `footerContact`

8. Notifications builder and scheduling
- Announcement/email/push/maintenance scheduling currently not persisted.
- Endpoints:
  - `GET /api/admin/notifications/templates`
  - `POST /api/admin/notifications/send`
  - `POST /api/admin/notifications/schedule`
  - `GET /api/admin/notifications/history`

## 4) Security and policy notes

All new endpoints should be admin-only:
- Add `@PreAuthorize("hasRole('ADMIN')")` at controller level or method level.

Audit fields strongly recommended for each mutation:
- `actedBy`, `actedAt`, `reason`, `metadata`.

## 5) Suggested implementation order

1. Reports/disputes APIs
2. Chat moderation APIs
3. Support ticket APIs
4. Settings persistence APIs
5. Finance payout/refund APIs
6. Analytics endpoints
7. CMS and notification scheduling

## 6) Frontend integration checkpoints after backend work

After backend completes each module, frontend can remove placeholder/mock logic in:
- `Frontend/src/admin/pages/Reports.tsx`
- `Frontend/src/admin/pages/Payments.tsx`
- `Frontend/src/admin/pages/Settings.tsx`
- `Frontend/src/admin/pages/Dashboard.tsx`
- `Frontend/src/admin/services/adminApi.ts`

