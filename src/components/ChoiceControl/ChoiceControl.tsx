import {
  forwardRef,
  useId,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode
} from "react";

export interface ChoiceControlProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children" | "size"> {
  label: ReactNode;
  sx?: CSSProperties;
  class?: string;
}

export const ChoiceControl = forwardRef<
  HTMLInputElement,
  ChoiceControlProps & { type: "radio" | "checkbox" }
>(
  function ChoiceControl(
    { label, type, id, disabled, class: classProp, className, sx, style, onFocus, onBlur, ...props },
    ref
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <label
        htmlFor={inputId}
        className={`mx-${type}-label`}
        data-mx-disabled={disabled || undefined}
      >
        <span className={`mx-${type}-control`}>
          <input
            {...props}
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={[`mx-${type}`, className, classProp].filter(Boolean).join(" ")}
            onFocus={onFocus}
            onBlur={onBlur}
            style={{ ...sx, ...style }}
          />
        </span>
        <span>{label}</span>
      </label>
    );
  }
);
