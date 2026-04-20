# Frontend Remaining Work

Last update: 2026-04-20

This file keeps only pending frontend work.

## Pending Integration Work

1. Replace admin placeholder datasets with real backend APIs when delivered
- `src/admin/pages/Reports.tsx`
- `src/admin/pages/Payments.tsx`
- `src/admin/pages/Settings.tsx`
- `src/admin/pages/Dashboard.tsx`

2. Validate full host verification submission flow
- Confirm all required fields, upload validations, and backend error handling in real usage.

3. End-to-end regression pass
- Run user + host + admin full scenarios after backend admin modules are delivered.

## Optional Cleanup

1. Rename legacy method names ending with `FrontendOnly`
- Location: `src/admin/services/adminApi.ts`
- Reason: methods already call backend, current naming is misleading.

2. Improve consistent loading/empty/error states in secondary admin panels once real APIs are connected.
