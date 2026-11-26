import { useState } from "react";
import { Button, Card, Header, Text } from "../../../../index";

export function ButtonExample() {
  const [presses, setPresses] = useState(0);
  return (
    <Card className="mx-demo-card">
      <Header variant="h3" className="mx-demo-control-title">Button</Header>
      <div className="mx-demo-actions">
        <Button onClick={() => setPresses((count) => count + 1)}>Try button</Button>
        <Button variant="secondary" disabled>Disabled</Button>
      </div>
      <Text role="status" variant="sm" className="mx-demo-button-status">
        {presses === 0 ? "Ready to try." : `Button pressed ${presses} ${presses === 1 ? "time" : "times"}.`}
      </Text>
    </Card>
  );
}
