# SkillTrack — Assessment 3 (Supabase Version)

## Project overview

SkillTrack is a full-stack education and training platform continued from the Assessment 2 frontend. Assessment 3 extends the application with a Node.js/Express REST API, Supabase PostgreSQL persistence, authentication, CRUD operations, enrolment and progress persistence, quiz results, achievements and certificate data.

## Technology stack

- React + Vite
- React Router
- Node.js + Express
- Supabase PostgreSQL
- `@supabase/supabase-js`
- JWT authentication
- bcryptjs password hashing
- RESTful API
- HTML/CSS/JavaScript

## Architecture

React/Vite provides the presentation layer. Express provides the application/API layer and handles validation, JWT authentication, role checks and business logic. Supabase provides hosted PostgreSQL persistence through its Data API. The Supabase service-role key is used only by the Express server and is never exposed to the browser.

## Installation instructions

### 1. Requirements

Install Node.js/npm and create a free Supabase project.

### 2. Create the Supabase database

In the Supabase Dashboard, open **SQL Editor**, create a new query, paste the complete `skilltrack_supabase.sql` file and run it.

The script creates the application tables, relationships, constraints, triggers and achievement seed data.

### 3. Get Supabase credentials

In Supabase, open **Project Settings → API** and copy:

- Project URL
- Secret/service-role server key

Keep the secret/service-role key private. Do not put it in React code and do not commit it to GitHub.

### 4. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in:

```env
PORT=5000
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_KEY
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api
```

### 5. Install dependencies

```bash
npm install
```

### 6. Seed the existing SkillTrack catalogue

```bash
npm run seed
```

This imports the existing `src/data/courses.json` catalogue and its lessons into Supabase and creates/updates the development admin account:

- Email: `admin@skilltrack.local`
- Password: `Admin123!`

Change the password before any real deployment.

### 7. Run the application

```bash
npm run dev
```

The Express API runs on `http://localhost:5000` and Vite normally runs on `http://localhost:5173`. If Vite selects another port, the API uses permissive development CORS, so the frontend can still communicate with it.

### 8. Check the API

Open:

`http://localhost:5000/api/health`

Expected response:

```json
{"status":"ok","service":"SkillTrack API","database":"Supabase PostgreSQL"}
```

## Key features

- Responsive SkillTrack learning interface
- Course catalogue and course details
- Express REST API backed by Supabase PostgreSQL
- Student registration and login
- JWT authentication
- bcrypt password hashing
- Student/admin roles
- Admin course CRUD
- Course enrolment
- Persistent lesson progress
- Dashboard statistics
- Database-backed quiz questions and results
- Achievement persistence
- Persistent certificates after course completion
- Loading, validation and error states
- Reusable React components
- Client-side routing
- Dark mode

## Useful API endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/courses` (admin)
- `PUT /api/courses/:id` (admin)
- `DELETE /api/courses/:id` (admin)
- `GET /api/enrollments/my`
- `POST /api/enrollments`
- `POST /api/enrollments/:courseId/progress`
- `GET /api/dashboard`
- `GET /api/quiz`
- `POST /api/quiz/submit`
- `GET /api/quiz/results`
- `GET /api/certificates/my`

## Security notes

The browser only communicates with the Express API. The Supabase service-role key is server-side only. User passwords are stored as bcrypt hashes. JWTs are used for protected application routes, and course administration is restricted to users with the `admin` role.

For production, use a strong JWT secret, rotate server secrets when necessary, configure a specific CORS origin, use HTTPS, and change/remove the development admin credentials.

## Deployment

The existing Assessment 2 frontend remains available at `https://ict-930-skill-track.vercel.app/`. For the Assessment 3 full-stack deployment, deploy the Express API separately, configure its Supabase environment variables, deploy/configure the React frontend with the production `VITE_API_URL`, and verify the production database and authentication flows.
