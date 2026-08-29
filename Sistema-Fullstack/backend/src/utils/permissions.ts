import { Role, User } from "../types/user.js";
import { canAccess } from "../config/roleMatrix.js";

export function isStaff(role: Role): boolean {
  return role === "admin" || role === "agent";
}

export function hasRole(user: User, ...roles: Role[]): boolean {
  return roles.includes(user.role);
}

export function canViewAllTickets(user: User): boolean {
  return isStaff(user.role);
}

export function canViewTicket(user: User, ticket: { reporter_id: number }): boolean {
  if (canViewAllTickets(user)) return true;
  return ticket.reporter_id === user.id;
}

export function canMutateTicket(user: User, ticket: { reporter_id: number }): boolean {
  if (isStaff(user.role)) return true;
  return ticket.reporter_id === user.id;
}

export function canDeleteTicket(user: User): boolean {
  return canAccess(user.role, "tickets:delete");
}

export function getAllowedUpdateFields(
  user: User,
  ticket: { reporter_id: number }
): Set<string> {
  if (isStaff(user.role)) {
    return new Set(["title", "description", "status", "priority", "assigneeName"]);
  }
  if (ticket.reporter_id === user.id) {
    return new Set(["title", "description"]);
  }
  return new Set();
}
