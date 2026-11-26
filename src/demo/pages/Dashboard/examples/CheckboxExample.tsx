import { useState } from "react";
import { Card, CheckboxGroup, Header } from "../../../../index";

export function CheckboxExample() {
  const [notifications, setNotifications] = useState<string[]>([]);
  return (
    <Card className="mx-demo-card">
      <Header variant="h3" className="mx-demo-control-title">Checkbox</Header>
      <CheckboxGroup
        name="notifications"
        legend="Notifications"
        options={[
          { label: "Enable notifications", value: "enabled" },
          { label: "Unavailable option", value: "unavailable", disabled: true }
        ]}
        value={notifications}
        onChange={setNotifications}
      />
    </Card>
  );
}
