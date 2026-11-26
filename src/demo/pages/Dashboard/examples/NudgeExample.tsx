import { useState } from "react";
import { Button, Card, Dropdown, Header, Text, useNudges, type NudgeOptions } from "../../../../index";

const examples: Array<{ label: string; value: string; notification: NudgeOptions }> = [
  { label: "Success", value: "success", notification: { variant: "success", message: "Your changes have been saved." } },
  { label: "Warning", value: "warning", notification: { variant: "warning", message: "Please review your settings before continuing." } },
  { label: "Error", value: "error", notification: { variant: "error", message: "Something went wrong. Please try again." } },
  { label: "Neutral", value: "neutral", notification: { variant: "neutral", message: "You have a new notification." } },
  { label: "Theme color", value: "theme", notification: { color: "var(--mx-button-primary-bg)", message: "A little nudge in your current theme color." } },
  { label: "Purple", value: "purple", notification: { color: "#5f4a89", message: "A little purple nudge." } },
  { label: "Pink", value: "pink", notification: { color: "#dd9aaa", message: "A little pink nudge." } },
  { label: "Blue", value: "blue", notification: { color: "#255fc7", message: "A little blue nudge." } }
];

export function NudgeExample() {
  const [type, setType] = useState("success");
  const { nudge } = useNudges();
  return (
    <Card className="mx-demo-card" aria-labelledby="nudge-demo-title">
      <Header id="nudge-demo-title" variant="h3" className="mx-demo-control-title">Notifications</Header>
      <Text id="nudge-demo-hint" variant="sm">Send a little nudge to the bottom-right corner.</Text>
      <label htmlFor="nudge-type" className="mx-demo-label mx-demo-spaced">Nudge type</label>
      <Dropdown id="nudge-type" aria-describedby="nudge-demo-hint" options={examples} value={type} onChange={setType} className="mx-demo-select" />
      <Button className="mx-demo-spaced" onClick={() => nudge(examples.find((item) => item.value === type)!.notification)}>Show nudge</Button>
    </Card>
  );
}
