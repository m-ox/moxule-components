import { Button, Card, Dropdown, Header, Section, Text, type ThemeName } from "../../../index";
import { useDemoPreferences } from "../../DemoProvider";

export function ThemesPage() {
  const { theme, setTheme } = useDemoPreferences();
  return <Section title="Themes" headingLevel="h1" headingProps={{ className: "mx-demo-title" }} className="mx-demo-focused-page">
    <label htmlFor="theme-preview">Color palette</label>
    <Dropdown id="theme-preview" value={theme} onChange={(value) => setTheme(value as ThemeName)} options={["primary", "secondary", "tertiary", "blue", "red", "green", "purple", "pink"].map((value) => ({ value, label: value }))} />
    <div className="mx-demo-palette" aria-label="Palette colors"><span /><span /><span /><span /></div>
    <Card className="mx-demo-theme-specimen">
      <Header variant="h2">A change of mood.</Header>
      <Text>See how your palette brings surfaces, text, and actions together.</Text>
      <div className="mx-demo-actions"><Button>Primary action</Button><Button variant="secondary">Secondary action</Button></div>
    </Card>
  </Section>;
}
