import { Router } from "express";
import { mine, enroll, progress } from "../controllers/enrollmentController.js";
import { protect } from "../middleware/auth.js";
const r = Router();
r.use(protect);
r.get("/my", mine);
r.post("/", enroll);
r.put("/:courseId/progress", progress);
export default r;
