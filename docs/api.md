# SkillTrack REST API

## Authentication
`POST /api/auth/register` and `POST /api/auth/login` return a JWT. Protected requests use:

```http
Authorization: Bearer <token>
```

## Courses
Public read operations:
- `GET /api/courses`
- `GET /api/courses/:id`

Admin CRUD operations:
- `POST /api/courses`
- `PUT /api/courses/:id`
- `DELETE /api/courses/:id`

## Learning
Authenticated operations:
- `GET /api/enrollments/my`
- `POST /api/enrollments`
- `PUT /api/enrollments/:courseId/progress`

## Quiz
- `GET /api/quiz`
- `POST /api/quiz/submit`
- `GET /api/quiz/results`

## Dashboard
- `GET /api/dashboard`
