# Project: G-Scores (Golden Owl Web Dev Intern Assignment)

## Project Specifications
- Always read `.agent/specs/requirements.md` before implementing any feature to ensure all Must-Have, Technical (OOP, Migrations, Seeder), and Nice-to-Have criteria are satisfied.

## Repository Structure
- `/backend`: NestJS + TypeScript + TypeORM + PostgreSQL (Port 3000, prefix `/api`).
- `/frontend`: React (Vite) + TypeScript + Ant Design v5 + Tailwind CSS v4 + Recharts.

## Core Commands
- Start DB: `docker compose up -d`
- Backend Dev: `cd backend && npm run start:dev`
- Backend Build: `cd backend && npm run build`
- Run Migrations: `cd backend && npm run migration:run`
- Run Seeder: `cd backend && npm run seed`
- Frontend Dev: `cd frontend && npm run dev`
- Frontend Build: `cd frontend && npm run build`

## Critical Rules
1. Follow `.agent/rules/02-backend-nestjs.md` for all backend work (strictly enforce OOP for subject management and TypeORM migrations).
2. Follow `.agent/rules/03-frontend-react.md` for all frontend work.
3. Never commit `.csv` datasets or `.env` files. Always run `npm run build` in the affected workspace after making changes.