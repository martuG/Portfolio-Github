import { Role } from "../types/user.js";

export type Permission =
  | "tickets:list"
  | "tickets:read"
  | "tickets:create"
  | "tickets:update"
  | "tickets:delete"
  | "dashboard:stats"
  | "users:listAgents";

export type RoleAccess = Record<Role, boolean>;

/**
 * Matriz de permisos por endpoint.
 * true  = el rol puede llamar al endpoint
 * false = 403 Forbidden (aun con JWT valido)
 *
 * La autorizacion a nivel de recurso (p. ej. un usuario solo ve sus tickets)
 * se resuelve en el service, no en esta matriz.
 */
export const ROLE_MATRIX: Record<Permission, RoleAccess> = {
  "tickets:list": { admin: true, agent: true, user: true },
  "tickets:read": { admin: true, agent: true, user: true },
  "tickets:create": { admin: true, agent: true, user: true },
  "tickets:update": { admin: true, agent: true, user: true },
  "tickets:delete": { admin: true, agent: true, user: false },
  "dashboard:stats": { admin: true, agent: true, user: false },
  "users:listAgents": { admin: true, agent: true, user: false }
};

export const PERMISSION_ENDPOINTS: Record<Permission, { method: string; path: string }> = {
  "tickets:list": { method: "GET", path: "/api/tickets" },
  "tickets:read": { method: "GET", path: "/api/tickets/:id" },
  "tickets:create": { method: "POST", path: "/api/tickets" },
  "tickets:update": { method: "PUT", path: "/api/tickets/:id" },
  "tickets:delete": { method: "DELETE", path: "/api/tickets/:id" },
  "dashboard:stats": { method: "GET", path: "/api/dashboard/stats" },
  "users:listAgents": { method: "GET", path: "/api/users/agents" }
};

export function canAccess(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_MATRIX[permission][role] === true;
}

export function allowedRoles(permission: Permission): Role[] {
  return (Object.entries(ROLE_MATRIX[permission]) as [Role, boolean][])
    .filter(([, allowed]) => allowed)
    .map(([role]) => role);
}
