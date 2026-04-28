# API Endpoints to Implement for Frontend Pages

The frontend now includes placeholder pages for several routes. The following backend endpoints should be implemented (or confirmed) so the frontend can interact with them:

- `POST /auth/forgot-password` — accept an email and send a password reset token/link.
- `POST /auth/reset-password` — accept token and new password, verify token and update user password.
- `GET /notifications/me` — return a list of notifications for the current user (pagination/filtering optional).
- `POST /notifications/:id/read` — mark a notification as read for the current user.
- `POST /reports` — allow users to submit reports about users or properties. (Admin already exposes `/admin/reports` for review.)
- `GET /bookings/:id` — return booking details for the confirmation page (if not already available).

Notes:
- If any of the above already exist under different paths, please add mappings or update the frontend `src/api/endpoints.ts` accordingly.
- Provide expected request/response contracts (JSON fields, auth requirements) so frontend can be wired.
