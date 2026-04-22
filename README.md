# Cinema Monorepo

This monorepo contains a cinema management system with 4 main parts:

- `backend`: Spring Boot API (Java 21, Gradle, Liquibase, PostgreSQL)
- `docker`: Docker Compose setup for PostgreSQL + backend container + frontend container
- `frontend`: Nx monorepo (customer-facing Next.js app + Vite dashboard)
- `scripts`: helper scripts for local backend/frontend startup and local configuration

## 1. Directory Structure

```text
.
├── backend/             # Spring Boot 4 API
├── docker/              # Docker Compose + secrets + backend/db config
├── frontend/            # Nx monorepo (apps + libs)
├── scripts/             # Local startup/config scripts
└── README.md
```

## 2. Core Technologies

- Backend:
  - Spring Boot `4.0.5`
  - Java `21`
  - Spring Data JPA, Spring Security, Liquibase
  - PostgreSQL driver
  - OpenAPI UI (`springdoc-openapi`)
- Frontend:
  - Nx workspace
  - Next.js `16` + React `19` (`apps/cinema`)
  - Vite + React `19` (`apps/dashboard`)
  - Tailwind CSS + shared libraries in `libs/ui`, `libs/shared`
- Local Infrastructure:
  - Docker Compose (Postgres 16 + backend + frontend)

## 3. Environment Requirements

Make sure these are installed:

- Java 21
- Node.js 24.15.0 + npm 11.21.1
- Docker + Docker Compose

## 4. Running The Project

### Option A - Run Backend + Database with Docker (Fastest)

1. Prepare PostgreSQL secrets:

- `docker/secrets/db/postgres_user.txt`
- `docker/secrets/db/postgres_password.txt`

1. From the `docker` directory, run:

```bash
cd docker
docker compose up --build -d
```

1. Check services:

- PostgreSQL: `localhost:5432`
- Backend API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/api/swagger-ui/index.html`

1. Stop services:

```bash
docker compose down
```

### Option B - Run Backend Locally + Database in Docker

1. Start database with Docker:

```bash
cd docker
docker compose up -d cinemax-db
```

1. Start backend locally from repo root:

```bash
cd backend
./gradlew bootRun
```

Notes:

- `backend/src/main/resources/application.yaml` contains shared configuration only (port, context path, Liquibase, ...)
- Local datasource URL/username/password are configured in `scripts/configs/application.yaml`

### Option C - Run Backend Locally with Script (Remote Debug Enabled)

The script `scripts/start-dev.sh` will:

- Build `bootJar`
- Load external config from `scripts/configs/application.yaml`
- Run the jar with remote debug enabled by default

Run:

```bash
cd scripts
./start-dev.sh
```

Supported environment variables:

- `DEBUG` (default: `true`)
- `DEBUG_PORT` (default: `7080`)
- `DEBUG_SUSPEND` (default: `n`)

Example (disable debug):

```bash
DEBUG=false ./start-dev.sh
```

## 5. Running Frontend

### Option A - From The Frontend Workspace

From the `frontend` directory:

```bash
cd frontend
npm install
```

Main commands:

```bash
npm run dev            # start cinema app (Next.js)
npm run dev:cinema     # start cinema app only (port 3000)
npm run dev:dashboard  # start dashboard app only (port 4200)
npm run dev:all        # start cinema + dashboard together

npm run build
npm run lint
```

Default URLs:

- Cinema app: `http://localhost:3000`
- Dashboard app: `http://localhost:4200`

### Option B - Use The Startup Script

You can start a frontend application from the repository root scripts directory using:

```bash
./scripts/start-fe-dev.sh <app-name>
```

Examples:

```bash
./scripts/start-fe-dev.sh cinema
./scripts/start-fe-dev.sh dashboard
```

This script will:

- Move into the `frontend` workspace
- Install dependencies only if `node_modules` does not exist
- Run `npm run dev:<app-name>`

## 6. Frontend-Backend Integration

The frontend is already structured for fast development in the Nx monorepo.

- When integrating with real APIs, point frontend services to backend at `http://localhost:8080/api`
- Backend context path is `/api`

## 7. Quick Build/Test

Backend:

```bash
cd backend
./gradlew test
./gradlew bootJar
```

Frontend:

```bash
cd frontend
npm run build
npm run lint
```

## 8. Operational Notes

- Docker Compose in this repo mounts backend config from `docker/configs/backend/application.yaml`
- Secrets are injected into the backend container via Docker secrets and mapped to:
  - `spring.datasource.username`
  - `spring.datasource.password`
- The `cinemax` schema is created by `docker/init-database.sql`
