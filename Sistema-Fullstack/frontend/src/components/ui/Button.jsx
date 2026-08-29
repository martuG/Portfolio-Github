export default function Button({
  children,
  type = "button",
  onClick,
  className = "",
  "aria-label": ariaLabel,
  ...rest
}) {
  return (
    <button
      className={`btn ${className}`}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </button>
  );
}
