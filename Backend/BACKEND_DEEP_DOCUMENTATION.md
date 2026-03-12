# Backend Deep Documentation (File-by-File)

Ce document explique l’architecture, les flux métier et le rôle de **chaque fichier principal** du backend.

## 1) Vue d’ensemble

- Stack: Java 17, Spring Boot 3.2.5, Spring Security (JWT), MongoDB, Maven.
- Style d’architecture: `Controller -> Service -> Repository -> MongoDB`.
- Packages applicatifs: `com.maskan.api.*`.
- Classe de démarrage: `com.example.houserental.HouseRentalApplication` (scanne aussi `com.maskan.api`).

---

## 2) Fichiers racine (workspace)

### `pom.xml`
Rôle: définit les dépendances et la version du projet.
- `spring-boot-starter-web` (REST)
- `spring-boot-starter-data-mongodb` (MongoDB)
- `spring-boot-starter-security` (auth)
- `spring-boot-starter-validation` (Bean Validation)
- `jjwt-*` (génération/validation JWT)
- `lombok` (réduction du boilerplate)

### `README.md`
Rôle: guide rapide de démarrage (Java, Mongo, commande Maven).

### `API_DOCUMENTATION.md`
Rôle: doc API fonctionnelle pour frontend/consommateurs.

### `POSTMAN_TESTING_GUIDE.md`
Rôle: plan de tests Postman (auth, listings, bookings, etc.).

### `mvnw` / `mvnw.cmd`
Rôle: wrapper Maven pour exécuter le projet sans installation Maven globale.

---

## 3) Démarrage et configuration

### `src/main/java/com/example/houserental/HouseRentalApplication.java`
Rôle: point d’entrée Spring Boot.
- `@SpringBootApplication(scanBasePackages = {"com.example.houserental", "com.maskan.api"})`
- `@EnableMongoRepositories(basePackages = "com.maskan.api.repository")`
- Lance l’application via `SpringApplication.run(...)`.

### `src/main/resources/application.properties`
Rôle: configuration runtime.
- MongoDB URI / database
- `jwt.secret` / `jwt.expiration-ms`
- CORS origin
- Port serveur

### `src/main/java/com/maskan/api/config/WebConfig.java`
Rôle: configuration CORS MVC globale sur `/api/**`.
- Autorise plusieurs origines localhost.
- Méthodes HTTP: GET/POST/PUT/PATCH/DELETE/OPTIONS.

### `src/main/java/com/maskan/api/config/DatabaseChecker.java`
Rôle: vérification de la connexion Mongo au démarrage (`CommandLineRunner`).
- Fait un `userRepository.count()`.
- Log succès/échec de connexion.

### `src/main/java/com/maskan/api/config/package-info.java`
Rôle: documentation du package `config`.

---

## 4) Couche sécurité (`security`)

### `SecurityConfig.java`
Rôle: configuration Spring Security.
- Désactive CSRF (API stateless)
- Session stateless
- Routes publiques:
  - `/api/auth/**`
  - `/api/listings/**`
  - `/api/reviews/**`
- Toutes les autres routes nécessitent auth.
- Ajoute `JwtAuthenticationFilter` avant `UsernamePasswordAuthenticationFilter`.
- Déclare `PasswordEncoder` (BCrypt), `AuthenticationProvider`, `AuthenticationManager`.

### `JwtAuthenticationFilter.java`
Rôle: lit le header `Authorization: Bearer <token>`.
- Extrait le JWT
- Extrait le username (email)
- Charge l’utilisateur via `UserDetailsService`
- Valide le token
- Injecte l’authentification dans le `SecurityContext`

### `JwtService.java`
Rôle: utilitaire JWT.
- `generateToken(UserDetails)`
- `extractUsername(token)`
- `isTokenValid(token, userDetails)`
- Gestion de la clé signée (base64 ou fallback UTF-8 min 32 bytes)

### `CustomUserDetailsService.java`
Rôle: adaptation `User` (Mongo) vers `UserDetails` Spring Security.
- Recherche user par email
- Authority: `ROLE_<ROLE>`
- Compte désactivé si `banned=true`

### `security/package-info.java`
Rôle: documentation du package sécurité.

---

## 5) Entités Mongo (`entity`)

### `User.java` (`users`)
- Champs: `id`, `name`, `email` (unique), `password`, `role`, `createdAt`, `isVerified`, `banned`.
- Helpers alias: `getFullName/setFullName` mappés sur `name`.

### `Role.java`
- Enum: `ADMIN`, `HOST`, `GUEST`.

### `Property.java` (`properties`)
- Champs: `id`, `title`, `description`, `location`, `pricePerNight`, `images`, `hostId`, `createdAt`.
- Helpers alias: `getPrice/setPrice` mappés sur `pricePerNight`.

### `Booking.java` (`bookings`)
- Champs: `id`, `listingId`, `guestId`, `checkInDate`, `checkOutDate`, `status`.
- Helpers alias: `getStartDate/getEndDate`.

### `BookingStatus.java`
- Enum: `PENDING`, `CONFIRMED`, `CANCELLED`.

### `Review.java` (`reviews`)
- Champs: `id`, `listingId`, `guestId`, `rating` (1..5), `comment`, `createdAt`.

### `Message.java` (`messages`)
- Champs: `id`, `senderId`, `receiverId`, `content`, `createdAt`.

### `entity/package-info.java`
Rôle: documentation du package entités.

---

## 6) Repositories (`repository`)

### `UserRepository.java`
- `findByEmail(String)`
- `existsByEmail(String)`

### `PropertyRepository.java`
- `findByHostId(String)`

### `BookingRepository.java`
- `findByGuestId(String)`
- `findByListingIdIn(List<String>)`

### `ReviewRepository.java`
- `findByListingId(String)`

### `MessageRepository.java`
- `findByReceiverIdOrderByCreatedAtDesc(String)`
- `findBySenderIdOrderByCreatedAtDesc(String)`

### `repository/package-info.java`
Rôle: documentation du package repository.

---

## 7) DTOs (`dto`)

## DTO d’authentification
### `LoginRequest.java`
- Entrée login: `email`, `password`.

### `AuthResponse.java`
- Sortie auth: `token`, `role`, `user`.

### `UserDto.java`
- DTO user API: `id`, `fullName`, `email`, `password(write-only)`, `role`, `createdAt`, `isVerified`, `banned`.
- Sert aussi comme payload d’inscription dans `AuthController.register`.

## DTO listings
### `PropertyRequest.java`
- Entrée création/MAJ listing: `title`, `description`, `location`, `pricePerNight`, `images`.

### `PropertyResponse.java`
- Sortie listing: `id`, `title`, `description`, `location`, `pricePerNight`, `images`, `hostId`, `createdAt`.

## DTO bookings
### `BookingRequest.java`
- Entrée réservation: `listingId`, `checkInDate`, `checkOutDate`.

### `BookingStatusUpdateRequest.java`
- Entrée changement statut booking: `status`.

### `BookingResponse.java`
- Sortie booking: `id`, `checkInDate`, `checkOutDate`, `status`, `listingId`, `guestId`.

## DTO reviews
### `ReviewRequest.java`
- Entrée review: `listingId`, `rating`, `comment`.

### `ReviewResponse.java`
- Sortie review: `id`, `rating`, `comment`, `guestId`, `listingId`, `createdAt`.

## DTO messages
### `MessageRequest.java`
- Entrée message: `receiverId`, `content`.

### `MessageResponse.java`
- Sortie message: `id`, `senderId`, `receiverId`, `content`, `createdAt`.

## DTO user/admin
### `UpdateUserProfileRequest.java`
- Entrée update profil: `fullName`.

### `UpdateUserRoleRequest.java`
- DTO rôle admin (`role`) — présent mais non branché dans un endpoint actuel.

### `RegisterRequest.java`
- DTO inscription (`name`, `email`, `password`, `role`) — présent mais non utilisé par le contrôleur actuel (qui prend `UserDto`).

### `dto/package-info.java`
Rôle: documentation du package DTO.

---

## 8) Contrôleurs REST (`controller`)

### `AuthController.java` (`/api/auth`)
- `POST /register` -> créer user + JWT
- `POST /login` -> auth + JWT
- `GET /me` -> profil courant

### `UserController.java` (`/api/users`)
- `GET /me` -> profil user connecté
- `PUT /me` -> modifier nom utilisateur

### `PropertyController.java` (`/api/listings`)
- `GET /` -> liste publique
- `GET /search` -> recherche par filtres
- `GET /{id}` -> détail listing
- `POST /` (HOST)
- `PUT /{id}` (HOST/ADMIN)
- `DELETE /{id}` (HOST/ADMIN)

### `BookingController.java` (`/api/bookings`)
- `POST /` (GUEST)
- `PUT /{id}/status` (HOST/ADMIN)
- `DELETE /{id}` (GUEST propriétaire ou ADMIN)
- `GET /me` (GUEST)
- `GET /owner` (HOST/ADMIN)

### `ReviewController.java` (`/api/reviews`)
- `POST /` (GUEST)
- `GET /listing/{listingId}` (public)

### `MessageController.java` (`/api/messages`)
- `POST /` (auth)
- `GET /inbox` (auth)
- `GET /sent` (auth)

### `AdminController.java` (`/api/admin` + `@PreAuthorize(ADMIN)`)
- `GET /users`
- `PUT /users/{id}/ban`
- `GET /bookings`

### `controller/package-info.java`
Rôle: documentation du package controllers.

---

## 9) Services (contrats + implémentations)

## Interfaces (`service`)
- `AuthService`: register/login/getCurrentUser
- `UserService`: getMe/updateMe
- `PropertyService`: CRUD + search listings
- `BookingService`: create/updateStatus/cancel + lectures guest/owner/admin
- `ReviewService`: create/listByProperty
- `MessageService`: send/inbox/sent
- `AdminService`: listUsers/ban/listBookings

### `service/package-info.java`
Rôle: documentation package services.

## Implémentations (`service/impl`)
### `AuthServiceImpl.java`
- Validation email unique
- Interdit auto-inscription en `ADMIN`
- Encode mot de passe BCrypt
- Génère JWT
- Mapping `User <-> UserDto`

### `UserServiceImpl.java`
- Lit le user courant par email
- Met à jour `name` depuis `fullName`

### `PropertyServiceImpl.java`
- Crée/met à jour/supprime un listing
- Contrôle d’accès: hôte propriétaire ou admin
- Recherche Mongo dynamique via `MongoTemplate` et `Criteria`

### `BookingServiceImpl.java`
- Validation dates (checkout >= checkin)
- Création booking en `PENDING`
- Changement de statut réservé au host propriétaire du listing ou admin
- Annulation réservée au guest propriétaire ou admin
- Listes my/owner/all

### `ReviewServiceImpl.java`
- Crée review liée au listing et guest
- Liste reviews par listing

### `MessageServiceImpl.java`
- Envoi message entre utilisateurs
- Inbox/sent triés par date décroissante

### `AdminServiceImpl.java`
- Liste users
- Ban user (`banned=true`)
- Liste globale des bookings

### `service/impl/package-info.java`
Rôle: documentation package implémentations.

---

## 10) Gestion des erreurs (`exception`)

### `NotFoundException.java`
- Exception métier simple pour ressources non trouvées.

### `GlobalExceptionHandler.java`
- Centralise la traduction des exceptions en réponses JSON.
- Gère: validation (400), bad request (400), unauthorized (401), not found (404), forbidden (403), erreur générique (500).

### `exception/package-info.java`
Rôle: documentation package exceptions.

---

## 11) Tests

### `src/test/java/com/example/houserental/HouseRentalApplicationTests.java`
- Test minimal `contextLoads()`.
- Vérifie que le contexte Spring démarre.

---

## 12) Fichiers générés/build

### `target/**`
- Contient classes compilées, sources générées, outputs de build/test.
- Non modifiable manuellement en général (généré par Maven).

---

## 13) Flux fonctionnels clés (lecture rapide)

## Inscription/Connexion
1. `AuthController` reçoit payload
2. `AuthServiceImpl` valide et persiste user (`UserRepository`)
3. `JwtService` génère token
4. Retour `AuthResponse`

## Requête protégée
1. Header `Authorization: Bearer <JWT>`
2. `JwtAuthenticationFilter` valide token
3. `SecurityContext` est alimenté
4. `@PreAuthorize` décide l’accès

## Création réservation
1. `BookingController.create`
2. `BookingServiceImpl.createBooking`
3. Vérifie listing + dates + guest
4. Sauvegarde `Booking` en `PENDING`

---

## 14) Points d’attention techniques

- `RegisterRequest` existe mais n’est pas utilisé par l’endpoint actuel d’inscription.
- `UpdateUserRoleRequest` existe mais aucun endpoint actuel ne l’exploite.
- `entity/package-info.java` mentionne "JPA entities" alors que le projet utilise MongoDB.
- Le filtre de recherche listings construit un critère `price` alors que le champ entité est `pricePerNight` (à vérifier/fixer si la recherche prix ne retourne pas le bon résultat).
- Le endpoint `/api/listings/search` accepte un paramètre `available` mais la logique actuelle n’utilise pas ce filtre.

---

## 15) Ordre recommandé pour comprendre le code

1. `HouseRentalApplication` + `application.properties`
2. `SecurityConfig`, `JwtAuthenticationFilter`, `JwtService`
3. Contrôleurs (`controller/*`)
4. Interfaces service (`service/*`)
5. Implémentations (`service/impl/*`)
6. Entités (`entity/*`) puis repositories (`repository/*`)
7. `GlobalExceptionHandler`

Ce parcours suit le flux d’une requête HTTP réelle, du transport jusqu’à la persistence.
