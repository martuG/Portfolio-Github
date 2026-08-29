import { AppError } from "../../utils/AppError.js";
import { ticketRepository } from "./ticket.repository.js";
import { userRepository } from "../users/user.repository.js";
import { User } from "../../types/user.js";
import {
  canDeleteTicket,
  canViewAllTickets,
  canViewTicket,
  getAllowedUpdateFields
} from "../../utils/permissions.js";

async function resolveAssigneeId(assigneeName: string | null | undefined) {
  if (assigneeName === undefined) return undefined;
  if (assigneeName === null || assigneeName.trim() === "") return null;

  const assignee = await userRepository.findByName(assigneeName.trim());
  if (!assignee) throw new AppError("Usuario asignado no encontrado", 404);
  if (assignee.role !== "agent") {
    throw new AppError("Solo se puede asignar a agentes", 400);
  }
  return assignee.id;
}

export const ticketService = {
  async createTicket(payload: any, user: User) {
    const assigneeId = await resolveAssigneeId(payload.assigneeName);
    const result = await ticketRepository.create({
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      reporterId: user.id,
      assigneeId: assigneeId ?? null
    });
    return ticketRepository.findById(result.insertId);
  },

  listTickets(filters: any, user: User) {
    const scopedFilters = { ...filters };
    if (!canViewAllTickets(user)) {
      scopedFilters.reporterId = user.id;
    }
    return ticketRepository.findAll(scopedFilters);
  },

  async getById(id: number, user: User) {
    const ticket = await ticketRepository.findById(id);
    if (!ticket) throw new AppError("Ticket no encontrado", 404);
    if (!canViewTicket(user, ticket)) {
      throw new AppError("No tienes permisos para ver este ticket", 403);
    }
    return ticket;
  },

  async updateTicket(id: number, payload: any, user: User) {
    const ticket = await ticketRepository.findById(id);
    if (!ticket) throw new AppError("Ticket no encontrado", 404);

    const allowedFields = getAllowedUpdateFields(user, ticket);
    if (!allowedFields.size) {
      throw new AppError("No tienes permisos para editar este ticket", 403);
    }

    const fields: Record<string, unknown> = {};
    if (payload.title !== undefined && allowedFields.has("title")) fields.title = payload.title;
    if (payload.description !== undefined && allowedFields.has("description")) {
      fields.description = payload.description;
    }
    if (payload.status !== undefined && allowedFields.has("status")) fields.status = payload.status;
    if (payload.priority !== undefined && allowedFields.has("priority")) {
      fields.priority = payload.priority;
    }
    if (payload.assigneeName !== undefined && allowedFields.has("assigneeName")) {
      fields.assignee_id = await resolveAssigneeId(payload.assigneeName);
    }

    if (!Object.keys(fields).length) {
      throw new AppError("No hay campos permitidos para actualizar", 400);
    }

    await ticketRepository.update(id, fields);
    return this.getById(id, user);
  },

  async deleteTicket(id: number, user: User) {
    const ticket = await ticketRepository.findById(id);
    if (!ticket) throw new AppError("Ticket no encontrado", 404);
    if (!canDeleteTicket(user)) {
      throw new AppError("No tienes permisos para eliminar este ticket", 403);
    }
    await ticketRepository.remove(id);
  }
};
