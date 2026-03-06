# Maskan Frontend Handoff Guide

This README explains what is already built in the frontend, how it works, and how to connect it to the backend when API development is finished.

---

## 1) Current Frontend Status

### Tech
- React 18 + TypeScript + Vite
- React Router v6
- Axios (already configured for API client)

### Design and UI
- Luxury beige/black/gold design system applied across pages/components.
- Reusable layout sections: Navbar, Footer, cards, forms, filter panel.
- Search bar layout is now 3 rows:
	1. Row 1: Location, Check-in, Check-out
	2. Row 2: Adults, Kids, Pets counters
	3. Row 3: Search button (centered)

### Routes already implemented
- `/` → HomePage
- `/search` → SearchResults
- `/property/:id` → PropertyDetails
- `/login` → Login
- `/register` → Register
- `/profile` → UserProfile
- `/add-property` → AddProperty

---

## 2) What Is Mock vs What Is Ready

### Already API-ready
- Full API scaffolding exists in `src/services` and typed contracts in `src/types`.
- Endpoint mapping matches backend controllers.
- Axios client includes auth token injection and error normalization.

### Still using mock/local behavior in pages
- `SearchResults.tsx`: uses local `mockProperties`.
- `PropertyDetails.tsx`: uses local `mockPropertyDetails`.
- `Login.tsx` / `Register.tsx`: simulated login/register and localStorage mock user.
- `UserProfile.tsx`: uses local `mockBookings` and `mockSaved`.
- `AddProperty.tsx`: form submits with alert only.

---

## 3) API Layer Structure (Already Created)

### Contracts
- `src/types/contracts.ts`
	- `LoginRequest`, `RegisterRequest`, `AuthResponse`
	- `PropertyRequest`, `PropertyResponse`, `PropertyQuery`
	- `BookingRequest`, `BookingResponse`, `BookingStatusUpdateRequest`
	- `ReviewRequest`, `ReviewResponse`
	- `MessageRequest`, `MessageResponse`
	- `UserDto`, `UpdateUserRoleRequest`
	- `Role`, `BookingStatus`

### API Client
- `src/services/apiClient.ts`
	- Base URL from `VITE_API_BASE_URL` (fallback: `http://localhost:8080/api`)
	- Token key from `VITE_AUTH_TOKEN_KEY` (fallback: `authToken`)
	- Request interceptor adds `Authorization: Bearer <token>`
	- Response interceptor converts axios errors to a typed `ApiError`

### Endpoints
- `src/services/endpoints.ts`
	- Central endpoint map:
		- `/auth/*`
		- `/properties/*`
		- `/bookings/*`
		- `/reviews/*`
		- `/messages/*`
		- `/admin/*`

### Services
- `src/services/authService.ts`
- `src/services/propertyService.ts`
- `src/services/bookingService.ts`
- `src/services/reviewService.ts`
- `src/services/messageService.ts`
- `src/services/adminService.ts`
- Barrel export: `src/services/index.ts`

---

## 4) Backend Integration Steps (for teammate)

### Step 1: Environment
1. Create `.env` in `Frontend/` (or copy `.env.example`).
2. Set:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_AUTH_TOKEN_KEY=authToken
```

### Step 2: Start apps
1. Backend running on `http://localhost:8080`.
2. Frontend dev server:

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

### Step 3: CORS on backend
Allow frontend origin (`http://localhost:3000`) for API routes.

### Step 4: Replace mocks page by page

#### A) Login page
- File: `src/pages/Login.tsx`
- Replace simulated timeout block with:
	- `await authService.login({ email, password })`
	- on success: navigate to `/`

#### B) Register page
- File: `src/pages/Register.tsx`
- Replace simulated timeout block with:
	- `await authService.register({ name, email, password, role: 'TENANT' })`

#### C) Search results page
- File: `src/pages/SearchResults.tsx`
- Read URL params (`location`, `checkIn`, `checkOut`, `adults`, `kids`, `pets`) and call:
	- `propertyService.list(query)`
- Remove `mockProperties` filtering once API response is used.

#### D) Property details page
- File: `src/pages/PropertyDetails.tsx`
- Use route param `id` and call:
	- `propertyService.getById(id)`
	- `reviewService.listByProperty(id)`
- Keep UI; map response fields as needed.

#### E) Add property page
- File: `src/pages/AddProperty.tsx`
- On submit call:
	- `propertyService.create({ title, location, price })`
- Current backend `PropertyRequest` only requires these 3 fields.

#### F) Profile page
- File: `src/pages/UserProfile.tsx`
- Replace `mockBookings` with:
	- `bookingService.getMine()`
- Saved properties can be connected when backend endpoint exists.

---

## 5) Backend Contract Notes

Current backend DTOs for property are minimal:
- Request: `title`, `location`, `price`
- Response: `id`, `title`, `location`, `price`, `ownerId`

Current UI cards/details also display fields like:
- `image`, `type`, `rating`, `description`, `amenities`, etc.

So teammate has 2 options:
1. Extend backend DTOs to include these UI fields (recommended).
2. Keep backend minimal and map fallback values on frontend.

---

## 6) Useful Commands

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

## 7) Quick Handoff Checklist

- [ ] Backend running and CORS enabled
- [ ] `.env` configured (`VITE_API_BASE_URL`)
- [ ] Login/Register wired to `authService`
- [ ] SearchResults wired to `propertyService.list`
- [ ] PropertyDetails wired to `propertyService.getById` + `reviewService`
- [ ] AddProperty wired to `propertyService.create`
- [ ] UserProfile bookings wired to `bookingService.getMine`
- [ ] Remove local mock arrays after API wiring

---

If backend endpoints change, update `src/services/endpoints.ts` first so all service calls stay centralized.
