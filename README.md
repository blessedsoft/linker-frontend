# DevOps Bootcamp Linker

Monorepo for the Linker demo app: a NestJS backend, a Next.js frontend, and a PostgreSQL database, all wired together via Docker Compose.

**Services**
- `db`: Postgres 16 (data persisted in a named volume)
- `backend`: NestJS API (Prisma + Cloudinary + NextAuth)
- `frontend`: Next.js UI

**Quick Start (Docker Compose)**
1. Copy the example environment file and update values as needed.
   ```bash
   cp .env.example .env
   ```
2. Build and start all services.
   ```bash
   docker compose up --build
   ```
3. Open the apps.
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`

**Environment Variables (root .env)**
These values are loaded automatically by Docker Compose in `docker-compose.yml`.

| Variable | Purpose | Default |
| --- | --- | --- |
| `POSTGRES_DB` | Database name | `DATABASE` |
| `POSTGRES_USER` | Database user | `postgres` |
| `POSTGRES_PASSWORD` | Database password | `changeme` |
| `POSTGRES_PORT` | Host port for Postgres | `5432` |
| `BACKEND_PORT` | Host port for backend | `3001` |
| `NEXTAUTH_SECRET` | NextAuth secret | `changeme` |
| `NEXTAUTH_URL` | NextAuth base URL | `http://localhost:3000` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `changeme` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `changeme` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `changeme` |
| `FRONTEND_PORT` | Host port for frontend | `3000` |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL | `http://localhost:3001/api` |

**Local Development (no Docker)**
Run the services separately if you prefer. You will need a local Postgres instance and the per-service `.env` files inside each app.

Backend:
1. `cd devops-bootcamp-linker-backend`
2. `npm install`
3. Create `.env` (see the backend README for required variables).
4. Run migrations: `npm run prisma:migrate`
5. Start: `npm run dev`

Frontend:
1. `cd devops-bootcamp-linker-frontend`
2. `npm install`
3. Create `.env` (see the frontend README for required variables).
4. Start: `npm run dev`

**Repository Layout**
- `devops-bootcamp-linker-backend` NestJS API
- `devops-bootcamp-linker-frontend` Next.js UI
- `docker-compose.yml` Root orchestrator
- `.env` Root runtime configuration (ignored by git)
- `.env.example` Safe template for configuration

**Notes**
- Resetting the database volume will remove all data. Use `docker compose down -v` if you need a clean DB.
- Keep secrets out of git; only commit `.env.example`.
