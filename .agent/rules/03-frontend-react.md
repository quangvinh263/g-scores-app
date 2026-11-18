---
description: Frontend rules for React Hooks, Ant Design, Tailwind CSS v4, and Charts
globs: frontend/**/*
---

# Frontend Rules (React + AntD + Tailwind v4)

1. **Typography & Theme**:
   - Load Google Font **Rubik** in `index.html` and configure it as the default font family in Tailwind CSS and Ant Design `ConfigProvider`.
   - Keep the G-Scores structural identity (Header, Sidebar navigation for `Dashboard`, `Search Scores`, `Reports`, `Settings`, and Main Content cards) while elevating the visual aesthetics (clean shadows, harmonious color palette, clear data hierarchy).
2. **React Hooks & Architecture**:
   - Use modern React Hooks (`useState`, `useEffect`, custom hooks like `useScoreSearch`, `useScoreReport`) cleanly separating API state from UI components.
3. **Core Views**:
   - **Search Scores**: Input registration number (`sbd`), validate before calling API, show loading `Spin`, error `Alert`, and detailed subject score cards/table.
   - **Reports**: Interactive bar/grouped chart (`Recharts`) displaying student counts across the 4 score levels (`>= 8`, `6 - <8`, `4 - <6`, `< 4`) filterable or grouped by subject.
   - **Dashboard**: Summary metrics + **Top 10 Group A (Math, Physics, Chemistry)** leaderboard table with rank badges and total scores.
4. **Tailwind v4 & Responsive**:
   - Use Tailwind CSS v4 canonical classes (e.g., `bg-linear-to-b`).
   - Ensure full responsiveness across Desktop, Tablet, and Mobile (collapsible mobile drawer/header menu for navigation).