import { Section } from "../../../../index";
import { ButtonExample } from "../examples/ButtonExample";
import { DropdownExample } from "../examples/DropdownExample";
import { RadioExample } from "../examples/RadioExample";
import { CheckboxExample } from "../examples/CheckboxExample";
import { ToggleExample } from "../examples/ToggleExample";
import { NudgeExample } from "../examples/NudgeExample";
import { DrawerExample } from "../examples/DrawerExample";
import { ModalExample } from "../examples/ModalExample";
import { BannerExamples } from "../examples/BannerExamples";

export function GeneralComponents() {
  return (
    <Section
      id="general-components"
      title="General Components"
      description="Try the controls below with the current theme. Use Tab to move between controls, Space to select, and arrow keys to change radio or dropdown options."
      headingLevel="h2"
      headingProps={{ id: "general-components-title", className: "mx-demo-section-title" }}
      descriptionProps={{ variant: "sm", className: "mx-demo-description" }}
    >
      <div className="mx-demo-controls-grid">
        <ButtonExample />
        <DropdownExample />
        <RadioExample />
        <CheckboxExample />
        <ToggleExample />
        <NudgeExample />
        <DrawerExample />
        <ModalExample />
      </div>
      <BannerExamples />
    </Section>
  );
}
