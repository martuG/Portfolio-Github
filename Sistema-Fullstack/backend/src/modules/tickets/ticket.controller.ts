import { asyncHandler } from "../../utils/asyncHandler.js";
import { ticketService } from "./ticket.service.js";

export const createTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.createTicket(req.body, req.user);
  res.status(201).json({ ok: true, data: ticket });
});

export const listTickets = asyncHandler(async (req, res) => {
  const data = await ticketService.listTickets(req.query, req.user);
  res.json({ ok: true, ...data });
});

export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await ticketService.getById(Number(req.params.id), req.user);
  res.json({ ok: true, data: ticket });
});

export const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.updateTicket(Number(req.params.id), req.body, req.user);
  res.json({ ok: true, data: ticket });
});

export const deleteTicket = asyncHandler(async (req, res) => {
  await ticketService.deleteTicket(Number(req.params.id), req.user);
  res.json({ ok: true, message: "Ticket eliminado" });
});
