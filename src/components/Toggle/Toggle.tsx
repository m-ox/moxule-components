import { useId, type ButtonHTMLAttributes, type ReactNode } from "react";

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  ariaLabel?: string;
  label?: ReactNode;
  labelPosition?: "left" | "right";
  thumbOnIcon?: ReactNode;
  thumbOffIcon?: ReactNode;
  sx?: React.CSSProperties;
  class?: string;
}

export function Toggle({
  checked,
  onCheckedChange,
  ariaLabel,
  label,
  labelPosition = "right",
  thumbOnIcon,
  thumbOffIcon,
  sx,
  class: classProp,
  className,
  style,
  disabled,
  id,
  onClick,
  ...props
}: ToggleProps) {
  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const hasLabel = label != null && label !== false;
  const toggleButton = (
    <button
      id={buttonId}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? (hasLabel ? undefined : "Toggle")}
      disabled={disabled}
      className={["mx-toggle", className, classProp].filter(Boolean).join(" ")}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          event.currentTarget.focus();
          onCheckedChange(!checked);
        }
      }}
      style={{ ...sx, ...style }}
      {...props}
    >
      <span className="mx-toggle-track">
        <span className="mx-toggle-thumb">{checked ? thumbOnIcon : thumbOffIcon}</span>
      </span>
    </button>
  );
  if (!hasLabel) return toggleButton;
  return (
    <span className="mx-toggle-wrapper">
      {labelPosition === "left" ? <label htmlFor={buttonId} className="mx-toggle-label">{label}</label> : null}
      {toggleButton}
      {labelPosition === "right" ? <label htmlFor={buttonId} className="mx-toggle-label">{label}</label> : null}
    </span>
  );
}
