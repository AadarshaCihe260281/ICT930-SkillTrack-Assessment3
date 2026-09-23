# SkillTrack Assessment 3 Architecture

## Three-layer architecture

1. **Presentation layer** — React/Vite pages, reusable components, routing and application state.
2. **Application layer** — Node.js/Express REST API, validation, authentication, authorization and business logic.
3. **Data layer** — Supabase-hosted PostgreSQL database accessed by the Express server through `@supabase/supabase-js`.

## Data flow

Browser → React service layer → Express REST endpoint → Supabase PostgreSQL → Express JSON response → React state/UI.

Authentication uses bcrypt for password hashing and application JWTs for protected Express routes. Admin course CRUD is restricted by a server-side role check.
