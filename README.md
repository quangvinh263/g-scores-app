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

### PostgreSQL SSL

The backend supports SSL for managed PostgreSQL providers through these variables:

```env
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
# Optional PEM certificate bundle, with \n between lines:
DB_SSL_CA="-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
```

For local Docker PostgreSQL, keep `DB_SSL=false`. For managed databases, enable SSL and provide
`DB_SSL_CA` when the provider requires a custom certificate authority. Set
`DB_SSL_REJECT_UNAUTHORIZED=false` only for development environments or providers that do not
provide a verifiable certificate chain.

Docker Compose defaults use `DB_SSL=false` for local PostgreSQL. Override the backend database
variables when deploying to a managed PostgreSQL provider:

```bash
DB_HOST=your-managed-host \
DB_PORT=5432 \
DB_NAME=gscores_db \
DB_USERNAME=your_username \
DB_PASSWORD=your_password \
DB_SSL=true \
DB_SSL_REJECT_UNAUTHORIZED=true \
docker compose up --build -d
```

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

For Docker/Nginx deployment, set `VITE_API_URL=/api`. For a separate frontend deployment such
as Vercel, set `VITE_API_URL=https://g-scores-app-ydap.onrender.com/api`.

## Production Configuration

The deployed frontend is hosted on Vercel and the NestJS backend is hosted on Render:

- Frontend: `g-scores-app-three.vercel.app`
- Backend: `g-scores-app-ydap.onrender.com`
- Database: managed PostgreSQL with SSL enabled

Ensure the backend deployment has `DB_SSL=true`, `DB_SSL_REJECT_UNAUTHORIZED=true`, and the
database credentials and optional `DB_SSL_CA` configured by the hosting provider.

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

- **Live Application:** https://g-scores-app-three.vercel.app/
- **Backend API:** https://g-scores-app-ydap.onrender.com/api
- **Backend Health:** https://g-scores-app-ydap.onrender.com/api/health
