import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks/useForm";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = "Nombre invalido";
  if (!values.email.includes("@")) errors.email = "Email invalido";
  if (values.password.length < 6) errors.password = "Minimo 6 caracteres";
  return errors;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { values, errors, handleChange, runValidation } = useForm(
    { name: "", email: "", password: "" },
    validate
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError("");
    if (!runValidation()) return;
    try {
      await register(values);
      navigate("/tickets");
    } catch (error) {
      setServerError(error.message);
    }
  }

  return (
    <div className="auth-container">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Crear cuenta</h1>
        <InputField label="Nombre" name="name" value={values.name} onChange={handleChange} error={errors.name} />
        <InputField label="Email" name="email" value={values.email} onChange={handleChange} error={errors.email} />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />
        {serverError ? <p className="error">{serverError}</p> : null}
        <Button type="submit">Registrarme</Button>
        <p>
          Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </form>
    </div>
  );
}
