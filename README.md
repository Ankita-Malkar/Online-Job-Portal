# JobPortal — Full Stack Application

Spring Boot + Angular + MySQL job portal with role-based access (Admin, Employer, Employee).

---

##  Quick Start

### Prerequisites
| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| MySQL | 8.0+ |
| Angular CLI | 17+ |

---

## 🗄️ Step 1 — Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the init script
source /path/to/database/init.sql
```

Or manually:
```sql
CREATE DATABASE IF NOT EXISTS job_portal;
```

The **admin user** is seeded automatically:
- **Email:** `admin@jobportal.com`
- **Password:** `admin123`

---

##  Step 2 — Backend (Spring Boot)

### Configure your MySQL password

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/job_portal?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD   ← change this
```

### Run the backend
```bash
cd backend
mvn spring-boot:run
```

Backend starts at: **http://localhost:8083**

Swagger UI: **http://localhost:8083/swagger-ui/index.html**

---

## Step 3 — Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

Frontend starts at: **http://localhost:4200**

The proxy config (`proxy.conf.json`) automatically forwards all `/api` calls to `http://localhost:8083`.

---

## User Roles & Test Accounts

| Role | Email | Password | What they can do |
|------|-------|----------|-----------------|
| **Admin** | admin@jobportal.com | admin123 | Manage categories, view all jobs/users/apps |
| **Employer** | Register at `/auth/register` → select Employer | your choice | Post jobs, view applications, update status |
| **Employee** | Register at `/auth/register` → select Job Seeker | your choice | Browse & apply for jobs, manage profile |

---

## API Endpoints

### Auth
| Method | URL | Access |
|--------|-----|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/profile/{userId}` | Authenticated |
| PUT | `/api/auth/profile/update` | Authenticated |

### Jobs
| Method | URL | Access |
|--------|-----|--------|
| GET | `/api/job/all` | Public |
| GET | `/api/job/{id}` | Authenticated |
| POST | `/api/job/add` | EMPLOYER |
| DELETE | `/api/job/delete/{id}` | EMPLOYER |
| GET | `/api/job/employer/{userId}` | Authenticated |

### Categories
| Method | URL | Access |
|--------|-----|--------|
| GET | `/api/job/category` | Public |
| POST | `/api/job/category/add?name=X` | ADMIN |
| DELETE | `/api/job/category/delete/{id}` | ADMIN |

### Applications
| Method | URL | Access |
|--------|-----|--------|
| POST | `/api/application/apply` | EMPLOYEE |
| GET | `/api/application/user/{userId}` | Authenticated |
| GET | `/api/application/job/{jobId}` | Authenticated |
| GET | `/api/application/all` | Authenticated |
| PUT | `/api/application/cancel/{id}` | EMPLOYEE |
| PUT | `/api/application/status/{id}?status=X` | Authenticated |

### Skills / Education / Experience
| Method | URL |
|--------|-----|
| POST | `/api/auth/skill/add` |
| GET | `/api/auth/skill/{userId}` |
| DELETE | `/api/auth/skill/{id}` |
| POST | `/api/auth/education/add` |
| GET | `/api/auth/education/{userId}` |
| DELETE | `/api/auth/education/{id}` |
| POST | `/api/auth/experience/add` |
| GET | `/api/auth/experience/{userId}` |
| DELETE | `/api/auth/experience/{id}` |

---

## JWT Auth Flow

1. User logs in → backend returns `{ token, userId, email, role }`
2. Token stored in `localStorage`
3. JWT interceptor adds `Authorization: Bearer <token>` to every request
4. Role guard redirects to correct dashboard based on role

-
