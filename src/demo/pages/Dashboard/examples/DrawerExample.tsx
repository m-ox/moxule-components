import { useState } from "react";
import { Button, Card, Drawer, Dropdown, Header, Text, type DrawerSide } from "../../../../index";

export function DrawerExample() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<DrawerSide>("right");
  return (
    <Card className="mx-demo-card" aria-labelledby="drawer-demo-title">
      <Header id="drawer-demo-title" variant="h3" className="mx-demo-control-title">Drawer</Header>
      <label htmlFor="drawer-side" className="mx-demo-label">Side</label>
      <Dropdown id="drawer-side" value={side} onChange={(value) => setSide(value as DrawerSide)} options={[{ label: "Left", value: "left" }, { label: "Right", value: "right" }]} className="mx-demo-select" />
      <Button className="mx-demo-spaced" onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer title="Drawer example" description="A soft panel for navigation or extra content." side={side} open={open} onOpenChange={setOpen}>
        <Text>Use the close button, Escape, or the backdrop to return to the page.</Text>
        <Button className="mx-demo-spaced" onClick={() => setOpen(false)}>Done</Button>
      </Drawer>
    </Card>
  );
}
