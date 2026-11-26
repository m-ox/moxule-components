import type { CSSProperties, SelectHTMLAttributes } from "react";

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

export function Dropdown({
  options,
  value,
  onChange,
  sx,
  class: classProp,
  className,
  style,
  ...props
}: DropdownProps) {
  return (
    <span
      className="mx-dropdown-wrapper"
      data-mx-disabled={props.disabled || undefined}
      hidden={props.hidden}
      style={{ width: style?.width ?? sx?.width, maxWidth: style?.maxWidth ?? sx?.maxWidth }}
    >
      <select
        className={["mx-dropdown", className, classProp].filter(Boolean).join(" ")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{ ...sx, ...style }}
        {...props}
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {!props.multiple && (!props.size || props.size <= 1) ? (
        <svg
          className="mx-dropdown-caret"
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 12 8"
          style={{ color: style?.color ?? sx?.color }}
        >
          <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
}
