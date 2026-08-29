import { useState } from "react";

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function runValidation() {
    const result = validate ? validate(values) : {};
    setErrors(result);
    return Object.keys(result).length === 0;
  }

  return { values, setValues, errors, setErrors, handleChange, runValidation };
}
