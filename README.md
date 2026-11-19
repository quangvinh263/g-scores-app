# G-Scores

G-Scores is a full-stack admission-score analytics application for the 2024 Vietnamese national high-school examination.

## Features

- Search detailed scores by 8-digit registration number.
- View score distributions across Excellent, Good, Average, and Weak levels.
- Compare Top 10 candidates for admission groups A, A01, B, C, and D01.
- Use responsive Light, Dark, and System themes.
- Persist the default admission group and theme in browser local storage.

## Tech Stack

- **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL
- **Frontend:** React, Vite, TypeScript, Ant Design, Tailwind CSS, Recharts
- **Infrastructure:** Docker Compose, Nginx, GitHub Actions

## Architecture

The backend uses OOP domain classes in `backend/src/scores/domain/`:

- `Subject` validates scores and classifies each 0-10 subject score into one of four levels.
- `ExamGroup` encapsulates combination-total calculation.
- `GroupA` and `StandardExamGroup` provide concrete combination behavior.
- `SubjectRegistry` owns subject metadata.
- `ExamGroupRegistry` provides A, A01, B, C, and D01 groups.

Database schema changes are managed through TypeORM migrations. CSV ingestion uses a streaming seeder and 3,000-row batches.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend health status |
| `GET` | `/api/scores/:sbd` | Scores and levels for one registration number |
| `GET` | `/api/scores/report/levels` | Candidate counts by subject and score level |
| `GET` | `/api/scores/top?group=A` | Top 10 for A, A01, B, C, or D01 |
| `GET` | `/api/scores/top/group-a` | Legacy Top 10 Group A response |

## Run with Docker

```bash
docker compose up --build -d
```

Services:

- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- PostgreSQL: `localhost:5432`

PostgreSQL credentials:

- Database: `gscores_db`
- Username: `admin`
- Password: `password123`

The backend container starts migrations and then seeds the CSV dataset.

## Run Manually

### 1. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 2. Start the backend

Copy `backend/.env.example` to `backend/.env`, then:

```bash
cd backend
npm install
npm run migration:run
npm run seed
npm run start:dev
```

The backend runs at http://localhost:3000 with the `/api` prefix.

### 3. Start the frontend

Create `frontend/.env` from `frontend/.env.example`, then:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server normally runs at http://localhost:5173.

## Validation

```bash
cd backend
npm run lint
npm test -- --runInBand
npm run build

cd ../frontend
npm run lint
npm run build
```

## Live Demo

<!-- Replace this placeholder after deployment. -->
Live Demo: `https://YOUR-LIVE-DEMO-URL.example`
