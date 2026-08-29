import { Router } from "express";
import { listAgents } from "./user.controller.js";
import { requirePermission } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/agents", requirePermission("users:listAgents"), listAgents);

export default router;
