import { forwardRef } from "react";
import { ChoiceControl, type ChoiceControlProps } from "../ChoiceControl/ChoiceControl";

export interface CheckboxProps extends ChoiceControlProps {}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  return <ChoiceControl {...props} type="checkbox" ref={ref} />;
});
