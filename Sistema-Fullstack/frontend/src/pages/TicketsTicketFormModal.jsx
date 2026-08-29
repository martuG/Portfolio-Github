import { useEffect, useState } from "react";
import { apiRequest } from "../api/http";
import InputField from "../components/ui/InputField";
import SelectField from "../components/ui/SelectField";
import Button from "../components/ui/Button";
import { useForm } from "../hooks/useForm";
import { canEditTicketFields } from "../utils/permissions";

function validate(values) {
  const errors = {};
  if (values.title.trim().length < 4) errors.title = "Minimo 4 caracteres";
  if (values.description.trim().length < 10) errors.description = "Minimo 10 caracteres";
  return errors;
}

export default function TicketFormModal({ token, user, ticket, onClose }) {
  const [serverError, setServerError] = useState("");
  const [agents, setAgents] = useState([]);
  const isStaff = canEditTicketFields(user);
  const { values, errors, handleChange, runValidation } = useForm(
    {
      title: ticket?.title || "",
      description: ticket?.description || "",
      status: ticket?.status || "open",
      priority: ticket?.priority || "medium",
      assigneeName: ticket?.assignee_name || ""
    },
    validate
  );

  useEffect(() => {
    if (!isStaff) return;
    apiRequest("/users/agents", { token })
      .then((res) => setAgents(res.data))
      .catch((err) => setServerError(err.message));
  }, [isStaff, token]);

  const assigneeOptions = [
    { value: "", label: "Sin asignar" },
    ...agents.map((agent) => ({ value: agent.name, label: agent.name }))
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    if (!runValidation()) return;
    setServerError("");

    const payload = {
      title: values.title,
      description: values.description
    };

    if (isStaff) {
      payload.status = values.status;
      payload.priority = values.priority;
      payload.assigneeName = values.assigneeName.trim() || null;
    }

    try {
      if (ticket) {
        await apiRequest(`/tickets/${ticket.id}`, { method: "PUT", body: payload, token });
      } else {
        await apiRequest("/tickets", {
          method: "POST",
          body: { title: values.title, description: values.description, priority: values.priority },
          token
        });
      }
      onClose(true);
    } catch (error) {
      setServerError(error.message);
    }
  }

  return (
    <div className="modal-backdrop">
      <form className="card modal" onSubmit={handleSubmit}>
        <h3>{ticket ? "Seguir ticket" : "Crear ticket"}</h3>
        <InputField label="Titulo" name="title" value={values.title} onChange={handleChange} error={errors.title} />
        <div className="field">
          <label htmlFor="description">Descripcion</label>
          <textarea id="description" name="description" value={values.description} onChange={handleChange} rows={4} />
          {errors.description ? <small className="error">{errors.description}</small> : null}
        </div>
        {isStaff ? (
          <>
            <SelectField
              label="Estado"
              name="status"
              value={values.status}
              onChange={handleChange}
              options={[
                { value: "open", label: "Abierto" },
                { value: "in_progress", label: "En progreso" },
                { value: "closed", label: "Cerrado" }
              ]}
            />
            <SelectField
              label="Prioridad"
              name="priority"
              value={values.priority}
              onChange={handleChange}
              options={[
                { value: "low", label: "Baja" },
                { value: "medium", label: "Media" },
                { value: "high", label: "Alta" }
              ]}
            />
            <SelectField
              label="Asignado a"
              name="assigneeName"
              value={values.assigneeName}
              onChange={handleChange}
              options={assigneeOptions}
            />
          </>
        ) : null}
        {!ticket && !isStaff ? (
          <SelectField
            label="Prioridad"
            name="priority"
            value={values.priority}
            onChange={handleChange}
            options={[
              { value: "low", label: "Baja" },
              { value: "medium", label: "Media" },
              { value: "high", label: "Alta" }
            ]}
          />
        ) : null}
        {serverError ? <p className="error">{serverError}</p> : null}
        <div className="row">
          <Button type="submit" className="success">
            Guardar
          </Button>
          <Button className="secondary" onClick={() => onClose(false)}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
