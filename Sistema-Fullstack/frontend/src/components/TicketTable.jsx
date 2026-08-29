import Button from "./ui/Button";
import { canManageTicketStatus, canMutateTicket } from "../utils/permissions";

const PRIORITY_CONFIG = {
  low: { label: "Baja", dotClass: "priority-dot--low" },
  medium: { label: "Media", dotClass: "priority-dot--medium" },
  high: { label: "Alta", dotClass: "priority-dot--high" }
};

function PriorityIndicator({ priority }) {
  const config = PRIORITY_CONFIG[priority] || {
    label: priority,
    dotClass: "priority-dot--unknown"
  };

  return (
    <span className="priority-indicator" title={config.label}>
      <span className={`priority-dot ${config.dotClass}`} aria-hidden="true" />
      <span className="visually-hidden">{config.label}</span>
    </span>
  );
}

const STATUS_CONFIG = {
  open: { label: "Abierto", badgeClass: "status-badge--open" },
  in_progress: { label: "En progreso", badgeClass: "status-badge--in-progress" },
  closed: { label: "Cerrado", badgeClass: "status-badge--closed" }
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    badgeClass: "status-badge--unknown"
  };

  return <span className={`status-badge ${config.badgeClass}`}>{config.label}</span>;
}

export default function TicketTable({ tickets, user, onFollowUp, onCloseTicket }) {
  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titulo</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Reportado por</th>
            <th>Asignado a</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            const canFollow = canMutateTicket(user, ticket) && ticket.status !== "closed";
            const canClose = canManageTicketStatus(user) && ticket.status !== "closed";

            return (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>
                  <StatusBadge status={ticket.status} />
                </td>
                <td>
                  <PriorityIndicator priority={ticket.priority} />
                </td>
                <td>{ticket.reporter_name}</td>
                <td>{ticket.assignee_name || "-"}</td>
                <td>
                  {canFollow || canClose ? (
                    <div className="table-actions">
                      {canFollow ? (
                        <Button className="small" onClick={() => onFollowUp(ticket)}>
                          Seguir
                        </Button>
                      ) : null}
                      {canClose ? (
                        <Button className="small danger" onClick={() => onCloseTicket(ticket.id)}>
                          Cerrar
                        </Button>
                      ) : null}
                    </div>
                  ) : (
                    <span className="muted">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
