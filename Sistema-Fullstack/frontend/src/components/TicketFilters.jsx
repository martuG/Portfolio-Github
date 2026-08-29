import InputField from "./ui/InputField";
import SelectField from "./ui/SelectField";
import Button from "./ui/Button";

export default function TicketFilters({ filters, onChange, onReset }) {
  return (
    <div className="card filters">
      <InputField
        label="Buscar"
        name="search"
        value={filters.search}
        onChange={onChange}
        placeholder="Titulo o descripcion"
      />
      <SelectField
        label="Estado"
        name="status"
        value={filters.status}
        onChange={onChange}
        options={[
          { value: "", label: "Todos" },
          { value: "open", label: "Abierto" },
          { value: "in_progress", label: "En progreso" },
          { value: "closed", label: "Cerrado" }
        ]}
      />
      <SelectField
        label="Prioridad"
        name="priority"
        value={filters.priority}
        onChange={onChange}
        options={[
          { value: "", label: "Todas" },
          { value: "low", label: "Baja" },
          { value: "medium", label: "Media" },
          { value: "high", label: "Alta" }
        ]}
      />
      <div className="field field-action">
        <label aria-hidden="true" className="filters-label-spacer">
          Prioridad
        </label>
        <Button className="compact" onClick={onReset}>
          Limpiar filtros
        </Button>
      </div>
    </div>  );
}
