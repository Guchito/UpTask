# UpTask

Full‑stack MERN (MongoDB, Express, React, Node.js) + TypeScript application to manage projects, tasks, team members, task notes and task lifecycle statuses.

## Main Features

- Account lifecycle: registration, email confirmation (6‑digit token), login, logout.
- Password recovery + reset token flow.
- Authenticated API with JWT.
- User profile & password change.
- Project CRUD (only manager can update/delete).
- Task CRUD inside projects.
- Task status workflow (history logged: pending → onHold → inProgress → underReview → completed).
- Notes per task (create/delete, author tagged).
- Team management: add/remove members by email or id.
- Role logic (manager vs team member) influences UI actions.
- Real‑time-ish UI via React Query cache invalidation.

## Tech Stack

### Backend
- Node.js / Express
- TypeScript
- MongoDB + Mongoose
- Authentication (JWT)
- Validation: express-validator
- Security / helpers: bcrypt, cors, dotenv
- Mailing: nodemailer
- Tooling: morgan, colors
- Domain models: Projects, Tasks, Notes, Users, Tokens

Key files:
- Server bootstrap: [backend/src/index.ts](backend/src/index.ts)
- Express app: [backend/src/server.ts](backend/src/server.ts)
- DB connection: [backend/src/config/db.ts](backend/src/config/db.ts)
- CORS config: [backend/src/config/cors.ts](backend/src/config/cors.ts)
- Nodemailer: [backend/src/config/nodemailer.ts](backend/src/config/nodemailer.ts)
- Project routes: [backend/src/routes/projectRoutes.ts](backend/src/routes/projectRoutes.ts)
- Models: [backend/src/models/Project.ts](backend/src/models/Project.ts), [backend/src/models/Task.ts](backend/src/models/Task.ts), [backend/src/models/Note.ts](backend/src/models/Note.ts), [backend/src/models/User.ts](backend/src/models/User.ts), [backend/src/models/Token.ts](backend/src/models/Token.ts)
- Controllers: [backend/src/controllers/ProjectController.ts](backend/src/controllers/ProjectController.ts), [backend/src/controllers/TaskController.ts](backend/src/controllers/TaskController.ts), [backend/src/controllers/TeamController.ts](backend/src/controllers/TeamController.ts)
- Middlewares: [backend/src/middleware/validation.ts](backend/src/middleware/validation.ts), [backend/src/middleware/project.ts](backend/src/middleware/project.ts), [backend/src/middleware/task.ts](backend/src/middleware/task.ts)
- Utilities: [backend/src/utils/token.ts](backend/src/utils/token.ts)
- Emails: [backend/src/emails/AuthEmail.ts](backend/src/emails/AuthEmail.ts)

### Frontend
- React 18 + TypeScript + Vite
- State & data fetching: @tanstack/react-query
- Forms: react-hook-form
- Schema validation & typing: Zod
- Styling: Tailwind CSS ([frontend/tailwind.config.js](frontend/tailwind.config.js)), PostCSS ([frontend/postcss.config.js](frontend/postcss.config.js))
- UI components: Headless UI, Heroicons, Chakra UI PinInput
- Notifications: react-toastify
- HTTP client: Axios
- Routing: React Router ([frontend/src/router.tsx](frontend/src/router.tsx))
- Auth & layouts: [frontend/src/layouts/AppLayout.tsx](frontend/src/layouts/AppLayout.tsx), [frontend/src/layouts/AuthLayout.tsx](frontend/src/layouts/AuthLayout.tsx)
- Query root: [frontend/src/main.tsx](frontend/src/main.tsx)
- Domain APIs: [frontend/src/api/ProjectAPI.ts](frontend/src/api/ProjectAPI.ts), [frontend/src/api/TaskAPI.ts](frontend/src/api/TaskAPI.ts), [frontend/src/api/NoteAPI.ts](frontend/src/api/NoteAPI.ts), [frontend/src/api/TeamAPI.ts](frontend/src/api/TeamAPI.ts), [frontend/src/api/AuthAPI.ts](frontend/src/api/AuthAPI.ts)
- Domain types: [frontend/src/types/index.ts](frontend/src/types/index.ts)
- Task status i18n: [frontend/src/locales/en.ts](frontend/src/locales/en.ts)

### Task Status Values
From [backend/src/models/Task.ts](backend/src/models/Task.ts) / [frontend/src/locales/en.ts](frontend/src/locales/en.ts):
pending | onHold | inProgress | underReview | completed

## Project Structure (Monorepo)

```
/backend   Express + Mongo + Auth API
/frontend  React + Vite client
```

## Installation

Clone repository:
```
git clone <https://github.com/Guchito/UpTask.git>
cd UpTask
```

### Full Inslall
```
npm run install:all
```

Or

### Backend Setup
```
cd backend
npm install
```

Create `.env` (example):
```
PORT=4000
DATABASE_URI=mongodb://localhost:27017/uptask
FRONTEND_URL=http://localhost:5173
JWT_SECRET=replace_with_strong_secret

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
```

Run (choose what matches your scripts):
```
npm run dev
# or
npx ts-node src/index.ts
```

API base (default): `http://localhost:4000/api`

### Frontend Setup
```
cd frontend
npm install
```

Run:
```
npm run dev
```

Open: http://localhost:5173

### Typical Concurrent Development
(From root if you add a script or use two terminals):
1. Terminal A: backend dev server
2. Terminal B: frontend `npm run dev`

## Core Flows

1. Register → Email token (6 digits) → Confirm account.
2. Login → Store JWT (localStorage key: AUTH_TOKEN).
3. Forgot password → Email reset token → Submit new password.
4. Create projects (manager role).
5. Add tasks; edit or delete (manager or authorized logic).
6. Change task status (logged chronologically).
7. Add/remove team members by email or id.
8. Add/delete notes per task.

## Query Invalidation Patterns
Examples:
- After project update: invalidate `['projects']` + `['editProject', projectId]` (see [frontend/src/views/projects/EditProjectForm.tsx](frontend/src/views/projects/EditProjectForm.tsx))
- After task create: invalidate `['project', projectId]` (see [frontend/src/components/tasks/AddTaskModal.tsx](frontend/src/components/tasks/AddTaskModal.tsx))
- After note mutations: invalidate `['task', taskId]` (see [frontend/src/components/notes/AddNoteForm.tsx](frontend/src/components/notes/AddNoteForm.tsx), [frontend/src/components/notes/NoteDetail.tsx](frontend/src/components/notes/NoteDetail.tsx))

## Selected API Endpoints

Base: `/api`

Projects:
- POST `/projects`
- GET `/projects`
- GET `/projects/:id`
- PUT `/projects/:id`
- DELETE `/projects/:id`

Tasks (nested):
- POST `/projects/:projectId/tasks`
- GET `/projects/:projectId/tasks/:taskId`
- PUT `/projects/:projectId/tasks/:taskId`
- DELETE `/projects/:projectId/tasks/:taskId`
- POST `/projects/:projectId/tasks/:taskId/status`

Team:
- POST `/projects/:projectId/team/find`
- GET `/projects/:projectId/team`
- POST `/projects/:projectId/team`
- DELETE `/projects/:projectId/team/:userId`

Notes:
- POST `/projects/:projectId/tasks/:taskId/notes`
- GET `/projects/:projectId/tasks/:taskId/notes`
- DELETE `/projects/:projectId/tasks/:taskId/notes/:noteId`

(Validation handled by middlewares like [backend/src/middleware/validation.ts](backend/src/middleware/validation.ts))

## Authentication

- JWT issued on login and stored client-side (removed on logout).
- Protected routes enforced via `authenticate` middleware (see usage in [backend/src/routes/projectRoutes.ts](backend/src/routes/projectRoutes.ts)).
- Token-based email confirmation and password reset via `Token` model ([backend/src/models/Token.ts](backend/src/models/Token.ts)) and emails in [backend/src/emails/AuthEmail.ts](backend/src/emails/AuthEmail.ts).

## Notes & Conventions

- Strong typing across layers with shared Zod schemas on frontend.
- Granular React Query keys enable partial refetch.
- Role checks: helper [frontend/src/utils/policies.ts](frontend/src/utils/policies.ts).
- Dates formatted via [frontend/src/utils/utils.ts](frontend/src/utils/utils.ts).

## Production Build (Frontend)
```
cd frontend
npm run build
npm run preview
```
Serve `dist/` behind a reverse proxy; point backend `FRONTEND_URL` to deployed origin.

## Future Improvements (Suggestions)

- Add integration tests.
- Add rate limiting & helmet for security.
- Introduce background queue for email sending.
- Add drag & drop for task status changes.

## License

Educational / internal use (add explicit license if needed).

---
Made with the listed technologies – happy building.