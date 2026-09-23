import { Router } from "express";
import { getQuiz, submit, myResults } from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";
const r = Router();
r.get("/", getQuiz);
r.post("/submit", protect, submit);
r.get("/results", protect, myResults);
export default r;
