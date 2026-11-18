---
description: Workflow to implement a full-stack feature safely
---

1. **Analyze**: Read the user's requirement and inspect existing files in `backend/src` and `frontend/src` to avoid duplicate logic.
2. **Backend First**:
   - Create/update Entity, DTO, Service, and Controller in `backend/src`.
   - Run `npm run build` inside `/backend` to ensure zero TypeScript compilation errors.
3. **Frontend Second**:
   - Update API client in `frontend/src/services` and build UI components in `frontend/src`.
   - Run `npm run build` inside `/frontend` to verify JSX and Tailwind/AntD types.
4. **Summary**: Provide a concise summary of created endpoints, components, and how to test them.