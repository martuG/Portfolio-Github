import { asyncHandler } from "../../utils/asyncHandler.js";
import { userRepository } from "./user.repository.js";

export const listAgents = asyncHandler(async (_req, res) => {
  const agents = await userRepository.findAgents();
  res.json({ ok: true, data: agents });
});
