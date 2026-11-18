# G-Scores Assignment Specifications (Golden Owl)

## 1. Core Features (Must Have)
- **Data Ingestion (Migration & Seeder)**:
  - Convert `diem_thi_thpt_2024.csv` into PostgreSQL via code located in the repository using TypeORM **Migrations** and a **Seeder** script.
- **Score Lookup**:
  - Search and display detailed subject scores by Registration Number (`sbd`).
  - Strict input validation (non-empty, valid format) and clear error handling when `sbd` is not found.
- **Score Level Report (Chart)**:
  - Categorize student scores into 4 levels per subject:
    1. `>= 8.0` (Excellent)
    2. `>= 6.0 and < 8.0` (Good)
    3. `>= 4.0 and < 6.0` (Average)
    4. `< 4.0` (Weak)
  - Render statistics of student counts across these 4 levels by subject using interactive Charts.
- **Top 10 Group A Leaderboard**:
  - List the top 10 students with the highest total score in **Group A**: Math (`toan`), Physics (`vat_li`), and Chemistry (`hoa_hoc`).

## 2. Technical & Architectural Mandates
- **Backend (NestJS + TypeScript + TypeORM + PostgreSQL)**:
  - **MANDATORY OOP**: Must apply Object-Oriented Programming principles (classes, encapsulation, inheritance/polymorphism) to model and manage Subjects and Subject Groups (e.g., `Subject` classes, `GroupA` calculation logic, score level classification).
  - Form/DTO validation (`class-validator`) and strict business logic tightening.
  - Database schema must be managed via TypeORM Migrations (disable `synchronize: true` in production/submission).
- **Frontend (React + TypeScript + React Hooks + Ant Design + Tailwind CSS v4)**:
  - Must use React Hooks (`useState`, `useEffect`, `useMemo`, custom hooks).
  - Font: Google Font **Rubik** (recommended).
  - Visual polish: Enhance the `mockup-ui.png` layout to look clean and modern while preserving the core structure.

## 3. Bonus Features (Nice to Have)
- Full **Responsive Design** (Desktop, Tablet, Mobile).
- **Docker** setup (`Dockerfile` for backend/frontend + `docker-compose.yml` to run the entire stack).
- Live deployment + comprehensive root `README.md` with setup instructions and demo link.