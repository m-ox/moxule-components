import {
  forwardRef,
  useId,
  type CSSProperties,
  type FieldsetHTMLAttributes,
  type ReactNode
} from "react";
import { Checkbox } from "../Checkbox/Checkbox";

export interface CheckboxOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
  required?: boolean;
}

export interface CheckboxGroupProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "children" | "onChange" | "defaultValue"> {
  legend: ReactNode;
  options: readonly CheckboxOption[];
  description?: ReactNode;
  value?: readonly string[];
  defaultValue?: readonly string[];
  onChange?: (value: string[]) => void;
  sx?: CSSProperties;
  class?: string;
}

export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(function CheckboxGroup({
  legend,
  options,
  description,
  name,
  value,
  defaultValue,
  onChange,
  disabled,
  form,
  sx,
  class: classProp,
  className,
  style,
  "aria-describedby": ariaDescribedBy,
  ...props
}, ref) {
  const generatedId = useId();
  const groupName = name ?? `mx-checkbox-group-${generatedId}`;
  const descriptionId = description != null ? `${generatedId}-description` : undefined;
  const describedBy = [descriptionId, ariaDescribedBy].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset
      {...props}
      ref={ref}
      name={groupName}
      disabled={disabled}
      form={form}
      className={["mx-checkbox-group", className, classProp].filter(Boolean).join(" ")}
      aria-describedby={describedBy}
      style={{ ...sx, ...style }}
    >
      <legend className="mx-checkbox-group-legend">{legend}</legend>
      {descriptionId ? <p id={descriptionId} className="mx-checkbox-group-description">{description}</p> : null}
      <div className="mx-checkbox-group-options">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            name={groupName}
            form={form}
            label={option.label}
            value={option.value}
            checked={value !== undefined ? value.includes(option.value) : undefined}
            defaultChecked={value === undefined ? defaultValue?.includes(option.value) : undefined}
            disabled={disabled || option.disabled}
            required={option.required}
            onChange={(event) => {
              if (value !== undefined) {
                const selected = new Set(value);
                if (event.target.checked) selected.add(option.value);
                else selected.delete(option.value);
                onChange?.([...selected]);
              } else {
                const group = event.currentTarget.closest(".mx-checkbox-group")!;
                const inputs = group.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
                onChange?.(Array.from(inputs).filter((input) => input.name === groupName && input.checked).map((input) => input.value));
              }
            }}
          />
        ))}
      </div>
    </fieldset>
  );
});
