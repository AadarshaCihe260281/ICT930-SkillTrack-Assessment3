import { Router } from "express";
import { dashboard } from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";
const r = Router();
r.get("/", protect, dashboard);
export default r;
