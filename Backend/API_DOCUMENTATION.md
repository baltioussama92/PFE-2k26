# House Rental Platform - Backend API Documentation

## 1) Project Overview
This backend exposes a REST API for a house renting platform (Airbnb-like) with:
- Java 17 + Spring Boot
- Spring Security + JWT authentication
- MongoDB persistence
- Role-based authorization (`ADMIN`, `HOST`, `GUEST`)

Architecture follows:
- `Controller` → HTTP contract
- `Service` → business rules
- `Repository` → MongoDB access
- `Entity`/`DTO` → data model and API payloads

## 2) Authentication Flow
1. Frontend calls `POST /api/auth/register` to create an account.
2. Frontend calls `POST /api/auth/login` to authenticate.
3. Backend returns JWT token.
4. Frontend sends token for protected endpoints:

```http
Authorization: Bearer <token>
```

## 3) API Base URL
- Local: `http://localhost:8080`
- API prefix: `/api`

## 4) Endpoint Descriptions

## Authentication
### `POST /api/auth/register`
Create a new user (default role is `GUEST` if role is omitted).

Request:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "GUEST"
}
```

Response `201 Created`:
```json
{
  "token": "JWT_TOKEN",
  "role": "GUEST",
  "user": {
    "id": "65f0b6...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "GUEST",
    "createdAt": "2026-03-11T10:10:10Z",
    "isVerified": true,
    "banned": false
  }
}
```

### `POST /api/auth/login`
Authenticate existing user.

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response `200 OK`:
```json
{
  "token": "JWT_TOKEN",
  "role": "GUEST",
  "user": {
    "id": "65f0b6...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "GUEST",
    "createdAt": "2026-03-11T10:10:10Z",
    "isVerified": true,
    "banned": false
  }
}
```

## Users
### `GET /api/users/me`
Get current authenticated user profile.

Response `200 OK`:
```json
{
  "id": "65f0b6...",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "GUEST",
  "createdAt": "2026-03-11T10:10:10Z",
  "isVerified": true,
  "banned": false
}
```

### `PUT /api/users/me`
Update current user profile.

Request:
```json
{
  "fullName": "John D."
}
```

Response `200 OK`:
```json
{
  "id": "65f0b6...",
  "fullName": "John D.",
  "email": "john@example.com",
  "role": "GUEST",
  "createdAt": "2026-03-11T10:10:10Z",
  "isVerified": true,
  "banned": false
}
```

## Listings
### `GET /api/listings`
Public endpoint to list all listings.

### `GET /api/listings/{id}`
Public endpoint to get one listing.

### `POST /api/listings` (HOST only)
Create listing.

Request:
```json
{
  "title": "Modern Studio",
  "description": "Near city center",
  "pricePerNight": 80,
  "location": "Casablanca",
  "images": [
    "https://example.com/1.jpg",
    "https://example.com/2.jpg"
  ]
}
```

Response `201 Created`:
```json
{
  "id": "listing-001",
  "title": "Modern Studio",
  "description": "Near city center",
  "pricePerNight": 80,
  "location": "Casablanca",
  "images": [
    "https://example.com/1.jpg",
    "https://example.com/2.jpg"
  ],
  "hostId": "host-123",
  "createdAt": "2026-03-11T10:10:10Z"
}
```

### `PUT /api/listings/{id}` (HOST/ADMIN)
Update listing.

### `DELETE /api/listings/{id}` (HOST/ADMIN)
Delete listing.

## Bookings
### `POST /api/bookings`
Create booking (`GUEST` only).

Request:
```json
{
  "listingId": "listing-001",
  "checkInDate": "2026-04-01",
  "checkOutDate": "2026-04-05"
}
```

Response `200 OK`:
```json
{
  "id": "booking-001",
  "listingId": "listing-001",
  "guestId": "guest-001",
  "checkInDate": "2026-04-01",
  "checkOutDate": "2026-04-05",
  "status": "PENDING"
}
```

### `GET /api/bookings/me`
Get authenticated guest booking history.

### `PUT /api/bookings/{id}/status`
Accept/Reject booking (`HOST` or `ADMIN`).

Request:
```json
{
  "status": "CONFIRMED"
}
```

### `DELETE /api/bookings/{id}`
Cancel booking (`GUEST` owner or `ADMIN`).

## Reviews
### `POST /api/reviews`
Leave review (`GUEST` only).

Request:
```json
{
  "listingId": "listing-001",
  "rating": 5,
  "comment": "Excellent stay"
}
```

### `GET /api/reviews/listing/{listingId}`
Public endpoint to fetch listing reviews.

## Messages
### `POST /api/messages`
Send message.

Request:
```json
{
  "receiverId": "user-002",
  "content": "Hi, is this listing available next week?"
}
```

### `GET /api/messages/inbox`
Get received messages.

### `GET /api/messages/sent`
Get sent messages.

## Admin
### `GET /api/admin/users`
List all users (`ADMIN` only).

### `PUT /api/admin/users/{id}/ban`
Ban a user (`ADMIN` only).

### `GET /api/admin/bookings`
Monitor all bookings (`ADMIN` only).

## 5) Authentication Requirements
- Public endpoints: `/api/auth/**`, `GET /api/listings/**`, `GET /api/reviews/**`
- All other endpoints require JWT
- Role checks are enforced with Spring Security method authorization

## 6) Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2026-03-11T10:10:10Z",
  "status": 400,
  "message": "Validation failed"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2026-03-11T10:10:10Z",
  "status": 401,
  "message": "Invalid authentication credentials"
}
```

### 403 Forbidden
```json
{
  "timestamp": "2026-03-11T10:10:10Z",
  "status": 403,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "timestamp": "2026-03-11T10:10:10Z",
  "status": 404,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2026-03-11T10:10:10Z",
  "status": 500,
  "message": "Unexpected error"
}
```
