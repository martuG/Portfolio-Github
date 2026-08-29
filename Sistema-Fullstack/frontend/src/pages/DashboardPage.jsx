import { useEffect, useState } from "react";
import { apiRequest } from "../api/http";
import { useAuth } from "../context/AuthContext";

const PRIORITY_LABELS = {
  low: "Baja",
  medium: "Media",
  high: "Alta"
};

const PRIORITY_CLASS = {
  low: "priority-dot--low",
  medium: "priority-dot--medium",
  high: "priority-dot--high"
};

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z" />
    </svg>
  );
}

function OpenIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

function ClosedIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div className={`dashboard-stat-card dashboard-stat-card--${accent}`}>
      <div className="dashboard-stat-card__icon">{icon}</div>
      <div className="dashboard-stat-card__body">
        <span className="dashboard-stat-card__label">{label}</span>
        <span className="dashboard-stat-card__value">{value}</span>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-skeleton dashboard-skeleton--title" />
        <div className="dashboard-skeleton dashboard-skeleton--subtitle" />
      </div>
      <div className="dashboard-stats">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="dashboard-skeleton dashboard-skeleton--card" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/dashboard/stats", { token })
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message));
  }, [token]);

  if (error) return <p className="error">{error}</p>;
  if (!stats) return <DashboardSkeleton />;

  const { totals, byPriority, topAssignees } = stats;
  const maxPriority = Math.max(...byPriority.map((item) => item.total), 1);
  const closedRate = totals.total > 0 ? Math.round((totals.closed / totals.total) * 100) : 0;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Tablero general</h2>
          <p className="dashboard-subtitle">Resumen del estado de los tickets</p>
        </div>
        <div className="dashboard-rate">
          <span className="dashboard-rate__value">{closedRate}%</span>
          <span className="dashboard-rate__label">resueltos</span>
        </div>
      </header>

      <section className="dashboard-stats" aria-label="Totales por estado">
        <StatCard label="Total tickets" value={totals.total} icon={<TicketIcon />} accent="total" />
        <StatCard label="Abiertos" value={totals.open} icon={<OpenIcon />} accent="open" />
        <StatCard label="En progreso" value={totals.inProgress} icon={<ProgressIcon />} accent="progress" />
        <StatCard label="Cerrados" value={totals.closed} icon={<ClosedIcon />} accent="closed" />
      </section>

      <div className="dashboard-panels">
        <section className="card dashboard-panel" aria-label="Distribución por prioridad">
          <h3 className="dashboard-panel__title">Cantidad de tickets por prioridad</h3>
          <ul className="dashboard-priority-list">
            {byPriority.map((item) => (
              <li key={item.priority} className="dashboard-priority-item">
                <div className="dashboard-priority-item__header">
                  <span className="dashboard-priority-item__label">
                    <span
                      className={`priority-dot ${PRIORITY_CLASS[item.priority] || "priority-dot--unknown"}`}
                    />
                    {PRIORITY_LABELS[item.priority] || item.priority}
                  </span>
                  <span className="dashboard-priority-item__count">{item.total}</span>
                </div>
                <div className="dashboard-bar">
                  <div
                    className={`dashboard-bar__fill dashboard-bar__fill--${item.priority}`}
                    style={{ width: `${(item.total / maxPriority) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card dashboard-panel" aria-label="Top asignados">
          <h3 className="dashboard-panel__title">Usuarios con más tickets asignados</h3>
          {topAssignees?.length ? (
            <ol className="dashboard-assignees">
              {topAssignees.map((assignee, index) => (
                <li key={assignee.id} className="dashboard-assignee">
                  <span className="dashboard-assignee__rank">{index + 1}</span>
                  <span className="dashboard-assignee__name">{assignee.name}</span>
                  <span className="dashboard-assignee__count">{assignee.total}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="dashboard-empty">Sin asignaciones todavía</p>
          )}
        </section>
      </div>
    </div>
  );
}
