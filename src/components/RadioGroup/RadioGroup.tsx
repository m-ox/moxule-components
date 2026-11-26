import {
  forwardRef,
  useId,
  type CSSProperties,
  type FieldsetHTMLAttributes,
  type ReactNode
} from "react";
import { Radio } from "../Radio/Radio";

export interface RadioOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "children" | "onChange" | "defaultValue"> {
  legend: ReactNode;
  options: readonly RadioOption[];
  description?: ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  sx?: CSSProperties;
  class?: string;
}

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup({
  legend,
  options,
  description,
  name,
  value,
  defaultValue,
  onChange,
  disabled,
  required,
  form,
  sx,
  class: classProp,
  className,
  style,
  "aria-describedby": ariaDescribedBy,
  ...props
}, ref) {
  const generatedId = useId();
  const groupName = name ?? `mx-radio-group-${generatedId}`;
  const descriptionId = description != null ? `${generatedId}-description` : undefined;
  const describedBy = [descriptionId, ariaDescribedBy].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset
      {...props}
      ref={ref}
      name={groupName}
      disabled={disabled}
      form={form}
      className={["mx-radio-group", className, classProp].filter(Boolean).join(" ")}
      aria-describedby={describedBy}
      style={{ ...sx, ...style }}
    >
      <legend className="mx-radio-group-legend">{legend}</legend>
      {descriptionId ? <p id={descriptionId} className="mx-radio-group-description">{description}</p> : null}
      <div className="mx-radio-group-options">
        {options.map((option) => (
          <Radio
            key={option.value}
            name={groupName}
            form={form}
            label={option.label}
            value={option.value}
            checked={value !== undefined ? value === option.value : undefined}
            defaultChecked={value === undefined ? defaultValue === option.value : undefined}
            disabled={disabled || option.disabled}
            required={required}
            onChange={(event) => {
              if (event.target.checked) onChange?.(option.value);
            }}
          />
        ))}
      </div>
    </fieldset>
  );
});
