import { useState, type CSSProperties, type SelectHTMLAttributes } from "react";
import { getFocusRingStyles } from "../../system/focus";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "onChange"> {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  sx?: CSSProperties;
  class?: string;
}

const selectStyle: CSSProperties = {
  border: "1px solid var(--mx-color-border, #cbd5e1)",
  borderRadius: "10px",
  backgroundColor: "var(--mx-color-surface, #ffffff)",
  color: "var(--mx-color-text, #0f172a)",
  appearance: "none",
  paddingRight: "2.25rem",
  backgroundImage:
    "linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%)",
  backgroundPosition: "calc(100% - 1rem) calc(50% - 1px), calc(100% - 0.72rem) calc(50% - 1px)",
  backgroundSize: "6px 6px, 6px 6px",
  backgroundRepeat: "no-repeat",
  padding: "0.5rem 0.75rem",
  fontFamily: "var(--mx-font-body, sans-serif)",
  fontSize: "0.95rem",
  lineHeight: 1.2,
  outline: "none"
};

export function Dropdown({
  options,
  value,
  onChange,
  sx,
  class: classProp,
  className,
  style,
  onFocus,
  onBlur,
  ...props
}: DropdownProps) {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const mergedClassName = ["mx-dropdown", className, classProp].filter(Boolean).join(" ");

  return (
    <select
      className={mergedClassName}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={(event) => {
        setIsFocusVisible(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setIsFocusVisible(false);
        onBlur?.(event);
      }}
      style={{
        ...selectStyle,
        ...getFocusRingStyles(isFocusVisible),
        ...sx,
        ...style
      }}
      {...props}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          style={{
            backgroundColor: "var(--mx-color-surface, #ffffff)",
            color: "var(--mx-color-text, #0f172a)"
          }}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
