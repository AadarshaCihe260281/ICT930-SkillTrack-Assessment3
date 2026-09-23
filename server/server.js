import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import auth from "./routes/auth.js";
import courses from "./routes/courses.js";
import enrollments from "./routes/enrollments.js";
import quiz from "./routes/quiz.js";
import dashboard from "./routes/dashboard.js";
import certificates from "./routes/certificates.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (req, res) => res.json({ status: "ok", service: "SkillTrack API", database: "Supabase PostgreSQL" }));
app.use("/api/auth", auth);
app.use("/api/courses", courses);
app.use("/api/enrollments", enrollments);
app.use("/api/quiz", quiz);
app.use("/api/dashboard", dashboard);
app.use("/api/certificates", certificates);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
connectDB().then(() => app.listen(port, () => console.log(`API running on http://localhost:${port}`))).catch(err => {
  console.error("Database connection failed:", err.message);
  process.exit(1);
});
