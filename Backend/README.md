# House Rental Backend (Spring Boot)

Production-ready REST API for a house renting and sharing platform with JWT auth, role-based access, and PostgreSQL persistence.

## Tech Stack
- Java 17, Spring Boot 3 (Web, Data JPA, Security, Validation)
- PostgreSQL
- JWT (jjwt 0.12.x)
- Maven, Lombok

## Features
- JWT authentication (register/login)
- Roles: ADMIN, OWNER, TENANT
- Property management (OWNER/ADMIN CRUD)
- Booking system (TENANT creates; OWNER/ADMIN updates status)
- Review system (TENANT reviews properties)
- Messaging (user-to-user inbox/outbox)
- Admin user management (list/update role/delete)
- Global validation and error handling

## Prerequisites
- JDK 17+
- Maven 3.9+ (or use provided coordinates)
- PostgreSQL database

## Configuration
Set environment variables (recommended):
- `SPRING_DATASOURCE_URL` (e.g. `jdbc:postgresql://localhost:5432/houserental`)
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET` (base64 or 32+ chars)
- `JWT_EXPIRATION_MS` (e.g. `86400000`)
- `SERVER_PORT` (optional)

Default values are in `src/main/resources/application.properties`. Override via env vars for non-dev use.

## Build and Run
```bash
mvn -DskipTests package
java -jar target/house-rental-0.0.1-SNAPSHOT.jar
```
Or run directly:
```bash
mvn spring-boot:run
```

## Roles and Access
- TENANT: create bookings, create reviews, view own bookings, send messages
- OWNER: manage own properties, update booking status for their properties, send messages
- ADMIN: full access to admin endpoints and all properties/bookings

## Core Endpoints (prefixed with `/api`)
- Auth: `POST /auth/register`, `POST /auth/login`
- Properties: `GET /properties`, `GET /properties/{id}`, `POST /properties` (OWNER/ADMIN), `PUT /properties/{id}` (OWNER/ADMIN), `DELETE /properties/{id}` (OWNER/ADMIN)
- Bookings: `POST /bookings` (TENANT), `PUT /bookings/{id}/status` (OWNER/ADMIN), `GET /bookings/me` (TENANT)
- Reviews: `POST /reviews` (TENANT), `GET /reviews/property/{propertyId}`
- Messages: `POST /messages`, `GET /messages/inbox`, `GET /messages/outbox`
- Admin: `GET /admin/users`, `PUT /admin/users/{id}/role`, `DELETE /admin/users/{id}`

## Example cURL
Register:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"Passw0rd!","role":"TENANT"}'
```
Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Passw0rd!"}'
```
Create property (OWNER/ADMIN):
```bash
curl -X POST http://localhost:8080/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Cozy Loft","location":"Paris","price":1200}'
```

## Error Handling
Validation errors return 400 with field messages; missing entities return 404; unexpected errors return 500.

## Notes
- JWT is stateless; include `Authorization: Bearer <token>` for protected routes.
- Passwords are stored with BCrypt.
- Hibernate DDL auto is `update` by default; adjust for production migrations.
