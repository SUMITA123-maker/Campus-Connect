# Campus Connect — College Event Management System

## Tech Stack
- **Backend**: Java 17, Spring Boot 3.2, Spring Security + JWT, JPA (Hibernate), MySQL 8
- **Frontend**: React 18, Bootstrap 5, React-Bootstrap, React Router v6, Axios
- **Database**: MySQL (JPA auto-generates all tables — no SQL scripts needed)

---

## Quick Start

### Prerequisites
- Java 17+, Maven 3.8+
- Node.js 18+, npm 9+
- MySQL 8 running locally

---

### Backend Setup

1. Update DB credentials in:
   `campus-connect-backend/src/main/resources/application.properties`
   ```
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   ```

2. **First run** — let Hibernate create all tables:
   ```
   spring.jpa.hibernate.ddl-auto=create
   ```
   After first run, switch to `update` to preserve data.

3. Run the backend:
   ```bash
   cd campus-connect-backend
   mvn spring-boot:run
   ```
   Backend starts at: http://localhost:8080

---

### Frontend Setup

```bash
cd campus-connect-frontend
npm install
npm start
```
Frontend starts at: http://localhost:3000

---

## Creating Admin Account

Admin accounts must be seeded directly into the DB:
```sql
-- After backend starts (tables created by JPA):
INSERT INTO users (full_name, email, password, role, active)
VALUES ('Admin User', 'admin@campus.com',
  '$2a$10$yourBcryptHashedPassword', 'ADMIN', 1);

INSERT INTO admins (id, admin_code) VALUES (LAST_INSERT_ID(), 'ADMIN001');
```

Or use a `@PostConstruct` data seeder bean (recommended for dev).

---

## JPA Inheritance (JOINED Strategy)

```
users (base table)
  ├── students  (student-specific columns)
  ├── organizers (organizer-specific columns)
  └── admins    (admin-specific columns)
```

Tables auto-created by `spring.jpa.hibernate.ddl-auto=update`

---

## API Base URL
All APIs are at: `http://localhost:8080/api`

### Key Endpoints
| Method | Path | Role |
|--------|------|------|
| POST | /api/auth/login | Public |
| POST | /api/auth/register/student | Public |
| POST | /api/auth/register/organizer | Public |
| GET  | /api/events/public | Public |
| POST | /api/organizer/events | Organizer |
| GET  | /api/admin/events/pending | Admin |
| PATCH | /api/admin/events/{id}/approve | Admin |
| POST | /api/organizer/events/{id}/attendance/bulk | Organizer |
| POST | /api/admin/events/{id}/certificates/generate | Admin |
| GET  | /api/student/certificates/{id}/download | Student |

---

## Project Structure

```
campus-connect/
├── campus-connect-backend/     ← Spring Boot application
│   └── src/main/java/com/campusconnect/
│       ├── entity/             ← JPA Entities (User, Event, ...)
│       ├── enums/              ← EventStatus, UserRole, ...
│       ├── repository/         ← Spring Data JPA Repos
│       ├── service/            ← Business Logic
│       ├── controller/         ← REST Controllers
│       ├── config/             ← JWT, Security, CORS
│       ├── dto/                ← Request/Response DTOs
│       └── exception/          ← Global Error Handler
│
└── campus-connect-frontend/    ← React application
    └── src/
        ├── pages/              ← public / student / organizer / admin
        ├── components/         ← layout, common, forms
        ├── api/                ← Axios API calls
        └── context/            ← AuthContext (JWT state)
```
