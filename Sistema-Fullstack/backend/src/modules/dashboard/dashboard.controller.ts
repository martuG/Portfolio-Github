import { asyncHandler } from "../../utils/asyncHandler.js";
import { dashboardRepository } from "./dashboard.repository.js";

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const stats = await dashboardRepository.getStats();
  res.json({ ok: true, data: stats });
});
