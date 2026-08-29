import { Router } from "express";
import { getDashboardStats } from "./dashboard.controller.js";
import { requirePermission } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/stats", requirePermission("dashboard:stats"), getDashboardStats);

export default router;
