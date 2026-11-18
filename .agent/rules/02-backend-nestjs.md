---
description: Backend rules for NestJS, TypeORM Migrations, Seeding, and OOP Subject Management
globs: backend/**/*
---

# Backend Rules (NestJS + TypeORM + PostgreSQL)

1. **Mandatory OOP for Subject Management**:
   - Do NOT handle subjects purely as raw database columns or plain objects.
   - Create dedicated OOP domain classes in `src/scores/domain/` (e.g., abstract/base `Subject` class, concrete subject classes or `SubjectRegistry`, and `ExamGroup` / `GroupASubject` classes) that encapsulate:
     - Subject metadata (code, Vietnamese/English display name).
     - Score validation (0 to 10).
     - Score level classification (`>=8`, `6-8`, `4-6`, `<4`).
     - Group total calculation (e.g., Group A = Math + Physics + Chemistry).
2. **Migrations & Seeder (No `synchronize: true`)**:
   - Manage database tables using TypeORM **Migrations** (`src/database/migrations/`).
   - Implement a CLI-runnable **Seeder** (`src/database/seeds/`) that streams `diem_thi_thpt_2024.csv` using `csv-parser` and inserts in batches of 3,000–5,000 rows via `QueryBuilder` with `.orIgnore()`.
3. **Database Performance (>1M rows)**:
   - Index `sbd` as Primary Key for instant lookup.
   - Create a composite or partial index on `(toan, vat_li, hoa_hoc)` where all three are NOT NULL to make the Top 10 Group A query instantaneous.
   - Use SQL `COUNT` / `CASE WHEN` aggregations for the 4-level report rather than loading 1M rows into memory, then map results through the OOP Subject domain layer.
4. **Validation**:
   - Enable global `ValidationPipe` in `main.ts` (`whitelist: true`, `transform: true`).
   - Validate `sbd` input format and throw `NotFoundException` if no record exists.