import { Card, Dropdown, Header, Text } from "../../../../index";
import { useDemoPreferences, type DemoSize } from "../../../DemoProvider";

export function DropdownExample() {
  const { size, setSize } = useDemoPreferences();
  return (
    <Card className="mx-demo-card">
      <Header variant="h3" className="mx-demo-control-title">Dropdown Select</Header>
      <label htmlFor="component-size" className="mx-demo-label">Size</label>
      <Text id="component-size-hint" variant="sm">Scale text across the preview.</Text>
      <Dropdown
        id="component-size"
        name="componentSize"
        aria-describedby="component-size-hint"
        value={size}
        onChange={(value) => setSize(value as DemoSize)}
        options={[
          { label: "Small", value: "small" },
          { label: "Medium", value: "medium" },
          { label: "Large", value: "large" }
        ]}
        className="mx-demo-select"
      />
    </Card>
  );
}
