export default function InputField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  ...props
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} {...props} />
      {error ? <small className="error">{error}</small> : null}
    </div>
  );
}
