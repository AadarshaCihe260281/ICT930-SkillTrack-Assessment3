# SkillTrack — Assessment 3

## Project Overview

SkillTrack is a full-stack education and training platform developed as an extension of the Assessment 2 frontend project.

Assessment 3 adds a backend REST API, Supabase PostgreSQL database, authentication, CRUD operations, quiz functionality, and persistent user learning data.

## Technology Stack

* React + Vite
* React Router
* Node.js
* Express.js
* Supabase PostgreSQL
* JavaScript
* JWT Authentication
* bcryptjs
* REST API
* HTML5 and CSS3

## Installation Instructions

1. Clone the repository.
2. Install the required dependencies:

```bash
npm install
```

3. Create a `.env` file and add the required Supabase, JWT and API configuration.
4. Set up the database using the provided `skilltrack_supabase.sql` file.
5. Start the application:

```bash
npm run dev
```

## Key Features

* Responsive learning platform
* Course catalogue and course details
* User registration and login
* JWT authentication
* Student and administrator roles
* Course enrolment
* Learning progress tracking
* Dashboard
* Quiz and quiz results
* Achievements and certificates
* Admin course CRUD operations
* Supabase PostgreSQL database
* REST API integration
* Loading and error handling
* Dark mode

## Design Decisions

The existing Assessment 2 React frontend was retained and extended with a Node.js and Express backend.

Supabase PostgreSQL was used as the persistent database. The React frontend communicates with the Express REST API, while the backend communicates with Supabase.

This structure separates the frontend, backend and database layers and allows user and course information to be stored persistently.

## GitHub Repository

**GitHub URL:**
`[PASTE YOUR ASSESSMENT 3 GITHUB URL HERE]`

## Individual Contribution

**Aadarsha Neupane — CIHE260281**

This project was completed individually. I contributed 100% of the project, including planning, frontend development, backend development, database integration, authentication, CRUD functionality, testing, debugging and documentation.
