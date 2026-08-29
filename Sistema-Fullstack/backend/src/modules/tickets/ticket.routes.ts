import { Router } from "express";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import { requirePermission } from "../../middlewares/auth.middleware.js";
import {
  createTicket,
  deleteTicket,
  getTicketById,
  listTickets,
  updateTicket
} from "./ticket.controller.js";
import {
  createTicketValidator,
  idParamValidator,
  listTicketsValidator,
  updateTicketValidator
} from "./ticket.validators.js";

const router = Router();

router.get("/", requirePermission("tickets:list"), listTicketsValidator, validateRequest, listTickets);
router.get("/:id", requirePermission("tickets:read"), idParamValidator, validateRequest, getTicketById);
router.post("/", requirePermission("tickets:create"), createTicketValidator, validateRequest, createTicket);
router.put("/:id", requirePermission("tickets:update"), updateTicketValidator, validateRequest, updateTicket);
router.delete("/:id", requirePermission("tickets:delete"), idParamValidator, validateRequest, deleteTicket);

export default router;
