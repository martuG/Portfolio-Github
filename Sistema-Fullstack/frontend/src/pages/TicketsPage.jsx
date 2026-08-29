import { useEffect, useState } from "react";
import { apiRequest } from "../api/http";
import { useAuth } from "../context/AuthContext";
import TicketFilters from "../components/TicketFilters";
import TicketTable from "../components/TicketTable";
import TicketFormModal from "./TicketsTicketFormModal.jsx";
import Button from "../components/ui/Button";

const initialFilters = { search: "", status: "", priority: "", page: 1, limit: 5 };

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
    </svg>
  );
}

export default function TicketsPage() {  const { token, user } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState("");
  const [editingTicket, setEditingTicket] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  function loadTickets(nextFilters = filters) {
    const query = new URLSearchParams(nextFilters).toString();
    apiRequest(`/tickets?${query}`, { token })
      .then((res) => {
        setTickets(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filters.page]);

  function handleFilterChange(event) {
    const { name, value } = event.target;
    const next = { ...filters, [name]: value, page: 1 };
    setFilters(next);
    loadTickets(next);
  }

  function handleResetFilters() {
    setFilters(initialFilters);
    loadTickets(initialFilters);
  }

  function handleFollowUp(ticket) {
    setEditingTicket({
      ...ticket,
      status: ticket.status === "open" ? "in_progress" : ticket.status
    });
  }

  async function handleCloseTicket(id) {
    if (!window.confirm("¿Cerrar este ticket?")) return;
    setError("");
    try {
      await apiRequest(`/tickets/${id}`, { method: "PUT", body: { status: "closed" }, token });
      loadTickets();
    } catch (err) {
      setError(err.message);
    }
  }

  function closeModal(reload = false) {
    setEditingTicket(null);
    setIsCreating(false);
    if (reload) loadTickets();
  }

  return (
    <div>
      <div className="row space-between">
        <h2>Tickets</h2>
        <Button onClick={() => setIsCreating(true)}>Nuevo ticket</Button>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <TicketFilters filters={filters} onChange={handleFilterChange} onReset={handleResetFilters} />
      <TicketTable
        tickets={tickets}
        user={user}
        onFollowUp={handleFollowUp}
        onCloseTicket={handleCloseTicket}
      />
      {pagination ? (
        <div className="row pagination">
          <Button
            className="small icon"
            aria-label="Pagina anterior"
            disabled={pagination.page <= 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
          >
            <ArrowLeftIcon />
          </Button>
          <span>
            Pagina {pagination.page} de {pagination.totalPages || 1}
          </span>
          <Button
            className="small icon"
            aria-label="Pagina siguiente"
            disabled={pagination.page >= (pagination.totalPages || 1)}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: Math.min(pagination.totalPages || 1, prev.page + 1)
              }))
            }
          >
            <ArrowRightIcon />
          </Button>
        </div>
      ) : null}
      {isCreating ? (
        <TicketFormModal token={token} user={user} ticket={null} onClose={closeModal} />
      ) : null}
      {editingTicket ? (
        <TicketFormModal token={token} user={user} ticket={editingTicket} onClose={closeModal} />
      ) : null}
    </div>
  );
}
