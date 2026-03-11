# House Rental Backend

Backend REST API for a house renting platform (Airbnb-like) using Spring Boot, JWT, and MongoDB.

## Stack
- Java 17
- Spring Boot 3
- Spring Security + JWT
- MongoDB
- Maven

## Quick Start
1. Set Java 17 and `JAVA_HOME`.
2. Ensure MongoDB is running locally.
3. Run:

```bash
./mvnw spring-boot:run
```

## Default MongoDB Configuration
From `src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/rental_platform
spring.data.mongodb.database=rental_platform
```

## API Documentation
- Full frontend developer docs: `API_DOCUMENTATION.md`
- Postman testing guide: `POSTMAN_TESTING_GUIDE.md`

## Main Endpoint Groups
- `/api/auth/*`
- `/api/users/*`
- `/api/listings/*`
- `/api/bookings/*`
- `/api/reviews/*`
- `/api/messages/*`
- `/api/admin/*`
