import { Button, Card, Dropdown, Header, Section, Text, type ThemeName } from "../../../../index";
import { useDemoPreferences } from "../../../DemoProvider";

const themeOptions: Array<{ label: string; value: ThemeName }> = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Tertiary", value: "tertiary" },
  { label: "Blue", value: "blue" },
  { label: "Red", value: "red" },
  { label: "Green", value: "green" },
  { label: "Purple", value: "purple" },
  { label: "Pink", value: "pink" }
];

export function ThemeColorPreview() {
  const { theme, setTheme } = useDemoPreferences();
  return (
    <Section
      id="theme-colors"
      title="Theme Color Preview"
      description="Select a default theme from the dropdown or click a card to apply it instantly."
      headingLevel="h2"
      headingProps={{ className: "mx-demo-section-title" }}
      descriptionProps={{ variant: "sm", className: "mx-demo-description" }}
    >
      <Dropdown aria-label="Theme selector" options={themeOptions} value={theme} onChange={(value) => setTheme(value as ThemeName)} className="mx-demo-theme-select" />
      <div className="mx-demo-preview-grid">
        {themeOptions.map((item) => (
          <Card key={item.value} color={item.value} className="mx-demo-card">
            <Header variant="h3" color={item.value} className="mx-demo-theme-title">{item.label}</Header>
            <Text variant="sm" color={item.value} className="mx-demo-card-copy">Apply the {item.label.toLowerCase()} default color tokens.</Text>
            <Button size="sm" color={item.value} variant={theme === item.value ? "primary" : "secondary"} className="mx-demo-spaced" onClick={() => setTheme(item.value)}>
              {theme === item.value ? "Selected" : `Use ${item.label}`}
            </Button>
          </Card>
        ))}
      </div>
    </Section>
  );
}
