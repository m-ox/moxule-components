import { useState } from "react";
import { Card, Header, Toggle } from "../../../../index";

export function ToggleExample() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  return (
    <Card className="mx-demo-card" aria-labelledby="toggle-demo-title">
      <Header id="toggle-demo-title" variant="h3" className="mx-demo-control-title">Toggle</Header>
      <div className="mx-demo-toggle-examples">
        <Toggle label="Enable sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
        <Toggle label="Unavailable option" checked={false} onCheckedChange={() => undefined} disabled />
      </div>
    </Card>
  );
}
