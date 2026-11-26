import { Card, Dropdown, Section, Text, ThemeToggle, type FontStyleName, type ThemeName } from "../../../index";
import { useDemoPreferences, type DemoSize } from "../../DemoProvider";

const fonts = ["clear", "playful", "stark", "bizarre"];
const themes = ["primary", "secondary", "tertiary", "blue", "red", "green", "purple", "pink"];
const options = (values: string[]) => values.map((value) => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }));

export function PreferencesPage() {
  const { theme, setTheme, fontStyle, setFontStyle, size, setSize, setMode } = useDemoPreferences();
  return (
    <Section title="Preferences" headingLevel="h1" headingProps={{ className: "mx-demo-title" }}
      description="A few small changes to make things feel like you." className="mx-demo-focused-page">
      <Card aria-label="Appearance preferences" className="mx-demo-preferences-card">
        <div className="mx-demo-preferences-fields">
          <div>
            <label htmlFor="preference-font" className="mx-demo-label">Font style</label>
            <Dropdown id="preference-font" value={fontStyle} onChange={(value) => setFontStyle(value as FontStyleName)} options={options(fonts)} />
          </div>
          <div>
            <label htmlFor="preference-theme" className="mx-demo-label">Theme color</label>
            <Dropdown id="preference-theme" value={theme} onChange={(value) => setTheme(value as ThemeName)} options={options(themes)} />
          </div>
          <div>
            <label htmlFor="preference-size" className="mx-demo-label">Text size</label>
            <Dropdown id="preference-size" value={size} onChange={(value) => setSize(value as DemoSize)} options={options(["small", "medium", "large"])} />
          </div>
        </div>
        <ThemeToggle label="Dark mode" onModeChange={setMode} />
        <Text variant="sm">Changes apply everywhere and are remembered for this tab's session.</Text>
      </Card>
    </Section>
  );
}
