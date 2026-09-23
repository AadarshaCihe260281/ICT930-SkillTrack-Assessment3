# SkillTrack Database Design — Supabase PostgreSQL

SkillTrack uses Supabase as the hosted PostgreSQL data layer. Express communicates with the database through `@supabase/supabase-js`.

## Main tables

- **users** — learner/admin identity, bcrypt password hash, role and learning goal.
- **courses** — course title, description, category, instructor, difficulty, duration, rating, image and skills.
- **lessons** — ordered lessons belonging to courses.
- **enrollments** — user/course relationship, progress and completion state.
- **lesson_progress** — individual lesson completion records.
- **quizzes** — quiz definition and passing score.
- **quiz_questions** — question options and correct option.
- **quiz_results** — authenticated user's quiz attempts and results.
- **achievements** — achievement definitions.
- **user_achievements** — achievements awarded to users.
- **certificates** — persistent certificate records issued after course completion.

Foreign keys and unique constraints enforce relationships and prevent duplicate enrolments, lesson progress records, achievement awards and certificates for the same user/course combination.
