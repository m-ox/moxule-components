import { forwardRef, useId, type CSSProperties, type InputHTMLAttributes, type ReactNode } from "react";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "children"> {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  sx?: CSSProperties;
  class?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput({
  label, description, error, id, type = "text", sx, class: classProp, className, style,
  "aria-describedby": describedBy, "aria-invalid": invalid, ...props
}, ref) {
  const generated = useId();
  const inputId = id ?? `${generated}-input`;
  const hasError = error != null && error !== false && error !== "";
  return (
    <div className="mx-text-input-field">
      <label htmlFor={inputId} className="mx-text-input-label">{label}</label>
      {description != null ? <div id={`${inputId}-description`} className="mx-text-input-description">{description}</div> : null}
      <input {...props} ref={ref} id={inputId} type={type}
        className={["mx-text-input", className, classProp].filter(Boolean).join(" ")}
        style={{ ...sx, ...style }} aria-invalid={hasError ? true : invalid}
        aria-describedby={[description != null ? `${inputId}-description` : undefined, hasError ? `${inputId}-error` : undefined, describedBy].filter(Boolean).join(" ") || undefined} />
      {hasError ? <div id={`${inputId}-error`} className="mx-text-input-description" role="alert">{error}</div> : null}
    </div>
  );
});
