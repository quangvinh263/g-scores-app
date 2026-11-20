# G-Scores

G-Scores is a full-stack admission-score analytics application for the 2024 Vietnamese national high-school examination

## Live Demo

- **Live Application:** https://g-scores-app-three.vercel.app/
- **Backend API:** https://g-scores-app-ydap.onrender.com/api
- **Backend Health:** https://g-scores-app-ydap.onrender.com/api/health

> **Note:** The backend is hosted on Render's free tier and spins down after 15 minutes of inactivity. The first request may take 30–50 seconds while the server completes its cold start. If data loading is initially slow, please wait a moment and refresh the page.

## Features

- **Score Lookup:** Search detailed subject scores and performance levels by 8-digit registration number (`SBD`).
- **Score Distribution Reports:** Visualize candidate score distributions across four levels (*Excellent* $\ge 8.0$, *Good* $6.0 - < 8.0$, *Average* $4.0 - < 6.0$, *Weak* $< 4.0$) for all 9 subjects.
- **Admission Group Leaderboards:** Compare Top 10 highest-scoring candidates across groups **A**, **A01**, **B**, **C**, and **D01**.
- **Personalization & UI:** Responsive layout with Light, Dark, and System theme modes, plus persistent default admission group settings stored in `localStorage`.

## Tech Stack

- **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL
- **Frontend:** React, Vite, TypeScript, Ant Design, Tailwind CSS, Recharts
- **Infrastructure:** Docker Compose, Nginx, GitHub Actions CI

## Architecture & Engineering Highlights

The backend follows a modular, feature-based architecture with pure OOP domain modeling in `backend/src/scores/domain/`:

- `Subject` validates 0–10 scores and classifies each subject score into one of the four performance tiers.
- `ExamGroup` (Abstract Class) encapsulates combination validation and total-score calculation contracts.
- `GroupA` and `StandardExamGroup` implement concrete combination behaviors following the Open/Closed Principle.
- `SubjectRegistry` & `ExamGroupRegistry` manage subject metadata and admission groups (`A`, `A01`, `B`, `C`, `D01`) without coupling business rules to controllers or queries.

Database schema and indexes are managed through TypeORM migrations (`1700000000000-CreateScoresTable`). Large-scale CSV ingestion uses a Node.js streaming seeder inserting 3,000-row batches to keep memory usage low.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend liveness status |
| `GET` | `/api/health/ready` | PostgreSQL readiness status |
| `GET` | `/api/scores/:sbd` | Detailed scores and levels for an 8-digit registration number |
| `GET` | `/api/scores/report/levels` | Candidate counts grouped by subject and score level |
| `GET` | `/api/scores/top?group=A` | Top 10 candidates for group `A`, `A01`, `B`, `C`, or `D01` |
| `GET` | `/api/scores/top/group-a` | Top 10 candidates for Group A |

## Run with Docker

### 1. Start all services

For production-style environment overrides, copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

```bash
docker compose up --build -d
```

Services & default ports:
- **Frontend (Nginx):** http://localhost:8080
- **Backend API:** http://localhost:3000
- **PostgreSQL:** `localhost:5432` (`DB_NAME=gscores_db`, `DB_USERNAME=admin`, `DB_PASSWORD=password123`)

### 2. Seed the dataset

The backend container automatically runs pending TypeORM migrations on startup. To populate the 1,061,605 records locally, place `diem_thi_thpt_2024.csv` inside `backend/data/` (create the folder if it does not exist), copy it into the running backend container, and execute the seeder:

```bash
docker compose cp backend/data/diem_thi_thpt_2024.csv backend:/app/data/diem_thi_thpt_2024.csv
docker compose exec backend npm run seed
```

If the CSV was present when the backend image was built, it is already available in `/app/data` and the copy step can be skipped.

> The `.csv` dataset and `.env` files are intentionally excluded from Git. Do not commit them.

## Run Manually (Local Development)

### 1. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 2. Configure & start the Backend

Copy `backend/.env.example` to `backend/.env`, place `diem_thi_thpt_2024.csv` in the dataset path, then run:

```bash
cd backend
npm install
npm run migration:run
npm run seed
npm run start:dev
```

The API will be available at `http://localhost:3000/api`.

### 3. Configure & start the Frontend

Copy `frontend/.env.example` to `frontend/.env` (`VITE_API_URL=http://localhost:3000/api`), then run:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will start at `http://localhost:5173`.

## PostgreSQL SSL & Production Configuration

- **Frontend (Vercel):** Deployed from `frontend/` with `VITE_API_URL=https://g-scores-app-ydap.onrender.com/api`.
- **Backend (Render) & Managed PostgreSQL:** Configure `DB_SSL=true` (and optional `DB_SSL_CA` PEM bundle). Keep `DB_SSL=false` for local Docker PostgreSQL.
- **CORS:** Set `CORS_ORIGIN` in the backend deployment to an exact origin without a trailing slash:
  ```env
  CORS_ORIGIN=https://g-scores-app-three.vercel.app
  ```

## Testing & Validation

```bash
# Backend unit tests, lint & build
cd backend
npm run lint
npm test -- --runInBand
npm run build

# Frontend lint & build
cd ../frontend
npm run lint
npm run build
```