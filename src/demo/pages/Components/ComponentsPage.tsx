import { Section } from "../../../index";
import { GeneralComponents } from "../Dashboard/sections/GeneralComponents";

export function ComponentsPage() {
  return <Section title="Components" headingLevel="h1" headingProps={{ className: "mx-demo-title" }} className="mx-demo-stack"><GeneralComponents /></Section>;
}
