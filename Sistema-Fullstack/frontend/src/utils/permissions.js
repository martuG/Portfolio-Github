export const ROLE_MATRIX = {
  "tickets:list": { admin: true, agent: true, user: true },
  "tickets:read": { admin: true, agent: true, user: true },
  "tickets:create": { admin: true, agent: true, user: true },
  "tickets:update": { admin: true, agent: true, user: true },
  "tickets:delete": { admin: true, agent: true, user: false },
  "dashboard:stats": { admin: true, agent: true, user: false },
  "users:listAgents": { admin: true, agent: true, user: false }
};

export function hasPermission(role, permission) {
  if (!role) return false;
  return ROLE_MATRIX[permission]?.[role] === true;
}

export function isStaff(role) {
  return role === "admin" || role === "agent";
}

export function canViewDashboard(role) {
  return hasPermission(role, "dashboard:stats");
}

export function canMutateTicket(user, ticket) {
  if (!user) return false;
  if (isStaff(user.role)) return true;
  return ticket.reporter_id === user.id;
}

export function canEditTicketFields(user) {
  return Boolean(user) && isStaff(user.role);
}

export function canManageTicketStatus(user) {
  return Boolean(user) && isStaff(user.role);
}
