import { useState } from "react";
import {
  Banner,
  Button,
  Card,
  CheckboxGroup,
  Dropdown,
  Footer,
  Header,
  Image,
  Layout,
  Link,
  PageShell,
  RadioGroup,
  Section,
  Text,
  Toggle,
  Toolbar,
  ThemeToggle,
  ThemeProvider,
  type FontStyleName,
  type ThemeName,
  type ThemeMode
} from "../index";

const fontStylePreview = [
  { name: "clear" },
  { name: "playful" },
  { name: "stark" },
  { name: "bizarre" }
] as const;

const themeOptions = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Tertiary", value: "tertiary" },
  { label: "Blue", value: "blue" },
  { label: "Red", value: "red" },
  { label: "Green", value: "green" },
  { label: "Purple", value: "purple" },
  { label: "Pink", value: "pink" }
] as const;

export function App() {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [fontStyle, setFontStyle] = useState<FontStyleName>("playful");
  const [theme, setTheme] = useState<ThemeName>("primary");
  const [buttonPresses, setButtonPresses] = useState(0);
  const [componentSize, setComponentSize] = useState("medium");
  const [density, setDensity] = useState("comfortable");
  const [notifications, setNotifications] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <ThemeProvider
      mode={mode}
      theme={theme}
      fontStyle={fontStyle}
      data-demo-density={density}
      data-demo-size={componentSize}
      className="mx-demo"
    >
      <PageShell>
        <Toolbar
          left={
            <div className="mx-demo-brand">
              <Image
                src="/src/demo/favicon.ico"
                alt="Moxules logo"
                width={26}
                height={26}
                className="mx-demo-logo"
              />
              <strong className="mx-demo-brand-name">Moxules</strong>
            </div>
          }
          right={
            <ThemeToggle onModeChange={setMode} />
          }
        />

        <Layout margin="lg" contentWidth="md" className="mx-demo-layout">
          <Section
            title="Component Library Demo"
            description="This page demonstrates the current moxule-components primitives. The top toolbar uses only the left logo slot, the center content is wrapped with Layout spacing, and the footer sits at the bottom."
            headingProps={{ className: "mx-demo-title" }}
            className="mx-demo-stack"
          >
            <Section
              title="Font Style Preview"
              description="Quick QA snapshot for display font styles. Body text remains Gudea by default."
              headingLevel="h3"
              headingProps={{ className: "mx-demo-section-title" }}
              descriptionProps={{ variant: "sm", className: "mx-demo-description" }}
            >

              <div
                className="mx-demo-preview-grid"
              >
                {fontStylePreview.map((item) => (
                  <Card
                    key={item.name}
                    className="mx-demo-card"
                  >
                    <Header
                      variant="h4"
                      className="mx-demo-font"
                      data-demo-font={item.name}
                    >
                      {item.name}
                    </Header>
                    <Text variant="sm" className="mx-demo-card-copy">
                      The quick brown fox jumps over the lazy dog.
                    </Text>
                    <Button
                      size="sm"
                      variant={fontStyle === item.name ? "primary" : "secondary"}
                      className="mx-demo-spaced"
                      onClick={() => setFontStyle(item.name)}
                    >
                      {fontStyle === item.name ? "Selected" : `Use ${item.name}`}
                    </Button>
                  </Card>
                ))}
              </div>
            </Section>

            <Section
              title="Theme Color Preview"
              description="Select a default theme from the dropdown or click a card to apply it instantly."
              headingLevel="h3"
              headingProps={{ className: "mx-demo-section-title" }}
              descriptionProps={{ variant: "sm", className: "mx-demo-description" }}
            >

              <Dropdown
                aria-label="Theme selector"
                options={themeOptions.map((item) => ({ label: item.label, value: item.value }))}
                value={theme}
                onChange={(value) => setTheme(value as ThemeName)}
                className="mx-demo-theme-select"
              />

              <div
                className="mx-demo-preview-grid"
              >
                {themeOptions.map((item) => (
                  <Card key={item.value} color={item.value} className="mx-demo-card">
                    <Header variant="h4" color={item.value} className="mx-demo-theme-title">
                      {item.label}
                    </Header>
                    <Text variant="sm" color={item.value} className="mx-demo-card-copy">
                      Apply the {item.label.toLowerCase()} default color tokens.
                    </Text>
                    <Button
                      size="sm"
                      color={item.value}
                      variant={theme === item.value ? "primary" : "secondary"}
                      className="mx-demo-spaced"
                      onClick={() => setTheme(item.value)}
                    >
                      {theme === item.value ? "Selected" : `Use ${item.label}`}
                    </Button>
                  </Card>
                ))}
              </div>
            </Section>
            <Section
              title="General Components"
              description="Try the controls below with the current theme. Use Tab to move between controls, Space to select, and arrow keys to change radio or dropdown options."
              headingLevel="h3"
              headingProps={{ id: "general-components-title", className: "mx-demo-section-title" }}
              descriptionProps={{ variant: "sm", className: "mx-demo-description" }}
            >
              <div className="mx-demo-controls-grid">
                <Card className="mx-demo-card">
                  <Header variant="h4" className="mx-demo-control-title">Button</Header>
                  <div className="mx-demo-actions">
                    <Button onClick={() => setButtonPresses((count) => count + 1)}>Try button</Button>
                    <Button variant="secondary" disabled>Disabled</Button>
                  </div>
                  <Text role="status" variant="sm" className="mx-demo-button-status">
                    {buttonPresses === 0 ? "Ready to try." : `Button pressed ${buttonPresses} ${buttonPresses === 1 ? "time" : "times"}.`}
                  </Text>
                </Card>
                <Card className="mx-demo-card">
                  <Header variant="h4" className="mx-demo-control-title">Dropdown Select</Header>
                  <label htmlFor="component-size" className="mx-demo-label">Size</label>
                  <Text id="component-size-hint" variant="sm">Scale text across the preview.</Text>
                  <Dropdown
                    id="component-size"
                    name="componentSize"
                    aria-describedby="component-size-hint"
                    value={componentSize}
                    onChange={setComponentSize}
                    options={[
                      { label: "Small", value: "small" },
                      { label: "Medium", value: "medium" },
                      { label: "Large", value: "large" }
                    ]}
                    className="mx-demo-select"
                  />
                </Card>
                <Card className="mx-demo-card">
                  <Header variant="h4" className="mx-demo-control-title">Radio</Header>
                  <RadioGroup
                    name="density"
                    legend="Display density"
                    description="Adjust spacing across the preview."
                    options={[
                      { label: "Comfortable", value: "comfortable" },
                      { label: "Compact", value: "compact" }
                    ]}
                    value={density}
                    onChange={setDensity}
                  />
                </Card>
                <Card className="mx-demo-card">
                  <Header variant="h4" className="mx-demo-control-title">Checkbox</Header>
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
                <Card className="mx-demo-card" aria-labelledby="toggle-demo-title">
                  <Header id="toggle-demo-title" variant="h4" className="mx-demo-control-title">Toggle</Header>
                  <div className="mx-demo-toggle-examples">
                    <Toggle label="Enable sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    <Toggle label="Unavailable option" checked={false} onCheckedChange={() => undefined} disabled />
                  </div>
                </Card>
              </div>
              <div className="mx-demo-banner-examples" aria-labelledby="banner-demo-title">
                <Header id="banner-demo-title" variant="h4" className="mx-demo-theme-title">Banner</Header>
                <Banner role="note" variant="success" message="Your changes have been saved." />
                <Banner role="note" variant="warning" message="Please review your settings before continuing." />
                <Banner role="note" variant="error" message="Something went wrong. Please try again." />
                <Banner role="note" message="You can update these preferences at any time." />
                <Banner role="note" className="mx-demo-custom-banner" message="A custom accent with an optional close button." dismissible />
              </div>
            </Section>
          </Section>
        </Layout>

        <Footer layout="centered" position="natural">
          <Link href="#overview" color="inherit">Overview</Link>
          <Link href="#docs" color="inherit">Docs</Link>
          <Link href="#support" color="inherit">Support</Link>
        </Footer>
      </PageShell>
    </ThemeProvider>
  );
}
