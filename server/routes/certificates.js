import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { mine } from "../controllers/certificateController.js";

const r = Router();
r.get("/my", protect, mine);
export default r;
