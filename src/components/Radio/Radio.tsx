import { forwardRef } from "react";
import { ChoiceControl, type ChoiceControlProps } from "../ChoiceControl/ChoiceControl";

export interface RadioProps extends ChoiceControlProps {}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(props, ref) {
  return <ChoiceControl {...props} type="radio" ref={ref} />;
});
