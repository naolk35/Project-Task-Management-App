# Project & Task Management App

[![CI](https://github.com/naolk35/Project-Task-Management-App/actions/workflows/ci.yml/badge.svg)](https://github.com/naolk35/Project-Task-Management-App/actions/workflows/ci.yml)

A monorepo-style workspace with a backend API and frontend client.

## Overview

- Backend: Express + Sequelize + TypeScript
- Frontend: React + Redux Toolkit + TypeScript (Vite)

## Project Structure

```
/backend
  src/
/frontend
  src/
```

## Prerequisites

- Node.js 18+
- pnpm, npm, or yarn
- MySQL (for backend Sequelize)

## Setup

### Backend

1. Create `backend/.env`:

```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=app_db
DB_USER=root
DB_PASSWORD=
# Or use DATABASE_URL=mysql://user:pass@host:3306/db
# Optional: schema file for YAML migrations
SCHEMA_FILE=./backend/schema.yml
```

2. Install and run:

```
cd backend
npm install
npm run dev
```

Run YAML schema migration:

```
npm run migrate --prefix backend
```

### Frontend

```
cd frontend
npm install
npm run dev
```

Optionally create `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:4000/api
```

### Docker (Compose)

Ensure Docker Desktop is installed. Then from the repo root:

```
docker-compose up --build
```

Services:

- DB (MySQL 8): `localhost:3306`
- Backend: `http://localhost:4000`
- Frontend: `http://localhost:3000`

## Scripts

- Root: `npm start` (runs frontend and backend concurrently), `npm run migrate`
- Backend: `npm run dev`, `npm run build`, `npm start`, `npm run migrate`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## API

Base URL: `http://localhost:4000`

- GET `/health` – healthcheck
- GET `/api` – base API route
- POST `/api/auth/register` – register user

  Request:

  ```json
  {
    "name": "Admin",
    "email": "admin@example.com",
    "password": "Pass123!",
    "role": "admin"
  }
  ```

  Response:

  ```json
  {
    "token": "<jwt>",
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
  ```

- POST `/api/auth/login` – login

  Request:

  ```json
  { "email": "admin@example.com", "password": "Pass123!" }
  ```

  Response:

  ```json
  {
    "token": "<jwt>",
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
  ```

- Users (admin only): `/api/users` – CRUD
- Projects: `/api/projects` – list by role; admin/manager can create/update/delete
- Tasks: `/api/tasks` – admin/manager CRUD; employees can update status on assigned tasks

Auth header for protected endpoints:

```
Authorization: Bearer <token>
```

## Screenshots

Place images in `/screenshots` and reference them here:

- Login: `./screenshots/login.png`
- Dashboard: `./screenshots/dashboard.png`
- Project/Tasks: `./screenshots/projects-tasks.png`

## Notes

- Architecture: Express API (TypeScript) + Sequelize (MySQL) + React (Vite) + Redux Toolkit + RTK Query
- Security: JWT-based auth; `authenticateJwt` middleware protects `/api/*`
- Roles: `admin`, `manager`, `employee` with route/controller checks
- Decisions: RTK Query for data fetching/caching; Vite for fast dev; Docker for local stack
- Adjust CORS and environment variables as needed.
