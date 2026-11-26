import { Card, Header, RadioGroup } from "../../../../index";
import { useDemoPreferences, type DemoDensity } from "../../../DemoProvider";

export function RadioExample() {
  const { density, setDensity } = useDemoPreferences();
  return (
    <Card className="mx-demo-card">
      <Header variant="h3" className="mx-demo-control-title">Radio</Header>
      <RadioGroup
        name="density"
        legend="Display density"
        description="Adjust spacing across the preview."
        options={[
          { label: "Comfortable", value: "comfortable" },
          { label: "Compact", value: "compact" }
        ]}
        value={density}
        onChange={(value) => setDensity(value as DemoDensity)}
      />
    </Card>
  );
}
