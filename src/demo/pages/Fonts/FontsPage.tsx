import { Card, Dropdown, Header, Section, Text, type FontStyleName } from "../../../index";
import { useDemoPreferences } from "../../DemoProvider";

export function FontsPage() {
  const { fontStyle, setFontStyle } = useDemoPreferences();
  return <Section title="Fonts" headingLevel="h1" headingProps={{ className: "mx-demo-title" }} className="mx-demo-focused-page">
    <label htmlFor="font-specimen">Display font</label>
    <Dropdown id="font-specimen" value={fontStyle} onChange={(value) => setFontStyle(value as FontStyleName)} options={["clear", "playful", "stark", "bizarre"].map((value) => ({ value, label: value }))} />
    <Card className="mx-demo-font-specimen">
      <Text variant="sm">The quick brown fox</Text>
      <Header variant="h2" className="mx-demo-specimen-title">A little character.</Header>
      <Text>Good typography gives every story room to breathe.</Text>
      <Text variant="sm">ABCDEFGHIJKLMNOPQRSTUVWXYZ · 0123456789</Text>
    </Card>
  </Section>;
}
