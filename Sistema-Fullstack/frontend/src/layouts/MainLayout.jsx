import { Link, NavLink } from "react-router-dom";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { canViewDashboard } from "../utils/permissions";

const ROLE_LABELS = {
  admin: "Administrador",
  agent: "Agente",
  user: "Usuario"
};

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
    </svg>
  );
}

export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo">
          Tickets
        </Link>
        <nav>
          {canViewDashboard(user?.role) ? <NavLink to="/dashboard">Dashboard</NavLink> : null}
          <NavLink to="/tickets">Gestion de tickets</NavLink>
        </nav>
        <div className="session">
          <span>
            Hola {user?.name}
          </span>
          <Button className="secondary icon" aria-label="Salir" onClick={logout}>
            <LogoutIcon />
          </Button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
