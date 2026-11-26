import type { ButtonHTMLAttributes, ReactNode } from "react";

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
  ariaLabel = "Toggle",
  label,
  labelPosition = "right",
  thumbOnIcon,
  thumbOffIcon,
  sx,
  class: classProp,
  className,
  style,
  disabled,
  ...props
}: ToggleProps) {
  const toggleButton = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      className={["mx-toggle", className, classProp].filter(Boolean).join(" ")}
      onClick={(event) => { event.currentTarget.focus(); onCheckedChange(!checked); }}
      style={{ ...sx, ...style }}
      {...props}
    >
      <span className="mx-toggle-track">
        <span className="mx-toggle-thumb">{checked ? thumbOnIcon : thumbOffIcon}</span>
      </span>
    </button>
  );
  if (!label) return toggleButton;
  return (
    <span className="mx-toggle-wrapper">
      {labelPosition === "left" ? <span className="mx-toggle-label">{label}</span> : null}
      {toggleButton}
      {labelPosition === "right" ? <span className="mx-toggle-label">{label}</span> : null}
    </span>
  );
}
