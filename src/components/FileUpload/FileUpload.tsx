import { forwardRef, useId, type CSSProperties, type InputHTMLAttributes, type ReactNode } from "react";

export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "children"> {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  onFilesChange?: (files: File[]) => void;
  sx?: CSSProperties;
  class?: string;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload({
  label, description, error, onFilesChange, onChange, id, sx, class: classProp, className, style,
  "aria-describedby": describedBy, "aria-invalid": invalid, ...props
}, ref) {
  const generated = useId();
  const inputId = id ?? `${generated}-files`;
  const hasError = error != null && error !== false && error !== "";
  return <div className="mx-text-input-field">
    <label htmlFor={inputId} className="mx-text-input-label">{label}</label>
    {description != null ? <div id={`${inputId}-description`} className="mx-text-input-description">{description}</div> : null}
    <input {...props} ref={ref} id={inputId} type="file"
      className={["mx-file-upload", className, classProp].filter(Boolean).join(" ")}
      style={{ ...sx, ...style }} aria-invalid={hasError ? true : invalid}
      aria-describedby={[description != null ? `${inputId}-description` : undefined, hasError ? `${inputId}-error` : undefined, describedBy].filter(Boolean).join(" ") || undefined}
      onChange={(event) => { onChange?.(event); if (!event.defaultPrevented) onFilesChange?.(Array.from(event.currentTarget.files ?? [])); }} />
    {hasError ? <div id={`${inputId}-error`} className="mx-text-input-description" role="alert">{error}</div> : null}
  </div>;
});
