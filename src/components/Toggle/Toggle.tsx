import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { getFocusRingStyles } from "../../system/focus";

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

const wrapperStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem"
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--mx-font-body, sans-serif)",
  fontSize: "0.95rem",
  lineHeight: 1.2
};

const trackStyle: React.CSSProperties = {
  width: "2.8rem",
  height: "1.55rem",
  borderRadius: "999px",
  border: "1px solid var(--mx-color-border, #9ab5e8)",
  display: "inline-flex",
  alignItems: "center",
  padding: "0.12rem",
  transition: "background-color 180ms ease, border-color 180ms ease"
};

const thumbStyle: React.CSSProperties = {
  width: "1.15rem",
  height: "1.15rem",
  borderRadius: "50%",
  backgroundColor: "#ffffff",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
  transition: "transform 180ms ease"
};

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
  onFocus,
  onBlur,
  ...props
}: ToggleProps) {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const mergedClassName = ["mx-toggle", className, classProp].filter(Boolean).join(" ");
  const thumbIcon = checked ? thumbOnIcon : thumbOffIcon;

  const toggleButton = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      className={mergedClassName}
      onClick={(event) => {
        event.currentTarget.focus();
        onCheckedChange(!checked);
      }}
      onFocus={(event) => {
        setIsFocusVisible(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setIsFocusVisible(false);
        onBlur?.(event);
      }}
      style={{
        border: 0,
        background: "transparent",
        borderRadius: "999px",
        color: "inherit",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        padding: 0,
        opacity: disabled ? 0.5 : 1,
        ...getFocusRingStyles(isFocusVisible),
        ...sx,
        ...style
      }}
      {...props}
    >
      <span
        className="mx-toggle-track"
        style={{
          ...trackStyle,
          backgroundColor: checked ? "var(--mx-button-primary-bg, #1f5ed8)" : "#d8e0ef",
          borderColor: checked ? "var(--mx-button-primary-bg, #1f5ed8)" : "var(--mx-color-border, #9ab5e8)"
        }}
      >
        <span
          className="mx-toggle-thumb"
          style={{
            ...thumbStyle,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: checked ? "var(--mx-button-primary-bg, #1f5ed8)" : "var(--mx-color-text, #0f172a)",
            transform: checked ? "translateX(1.18rem)" : "translateX(0)"
          }}
        >
          {thumbIcon}
        </span>
      </span>
    </button>
  );

  if (!label) {
    return toggleButton;
  }

  return (
    <span className="mx-toggle-wrapper" style={wrapperStyle}>
      {labelPosition === "left" ? <span style={labelStyle}>{label}</span> : null}
      {toggleButton}
      {labelPosition === "right" ? <span style={labelStyle}>{label}</span> : null}
    </span>
  );
}
