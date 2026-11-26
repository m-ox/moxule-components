import { useState } from "react";
import {
  Button,
  Card,
  Dropdown,
  Footer,
  Header,
  Image,
  Layout,
  PageShell,
  Text,
  Toggle,
  Toolbar,
  ThemeProvider,
  type FontStyleName,
  type ThemeName,
  type ThemeMode
} from "../index";

const fontStylePreview = [
  { name: "clear", family: '"Cantarell", sans-serif', letterSpacing: "0.01em" },
  { name: "playful", family: '"DynaPuff", sans-serif', letterSpacing: "0.01em" },
  { name: "stark", family: '"Martel", serif', letterSpacing: "0.01em" },
  { name: "bizarre", family: '"Loved by the King", cursive', letterSpacing: "0.06em" }
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
  const [logoBroken, setLogoBroken] = useState(false);

  return (
    <ThemeProvider
      mode={mode}
      theme={theme}
      fontStyle={fontStyle}
      style={{ minHeight: "100vh" }}
    >
      <PageShell footerOffset="xl">
        <Toolbar
          left={
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {logoBroken ? (
                <span
                  aria-hidden="true"
                  style={{
                    width: "1.65rem",
                    height: "1.65rem",
                    borderRadius: "999px",
                    border: "1px solid currentColor",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: 700
                  }}
                >
                  M
                </span>
              ) : (
                <Image
                  src="/src/demo/favicon.ico"
                  alt="Moxules logo"
                  width={26}
                  height={26}
                  onError={() => setLogoBroken(true)}
                  sx={{
                    width: "1.65rem",
                    height: "1.65rem",
                    borderRadius: "999px",
                    objectFit: "cover",
                    border: "1px solid currentColor"
                  }}
                />
              )}
              <strong style={{ letterSpacing: "0.02em" }}>Moxules</strong>
            </div>
          }
          right={
            <Toggle
              checked={mode === "dark"}
              onCheckedChange={(isDark) => setMode(isDark ? "dark" : "light")}
              ariaLabel="Toggle dark mode"
            />
          }
        />

        <Layout margin="lg" contentWidth="md" style={{ flex: 1, paddingBlock: "2.5rem" }}>
          <section style={{ display: "grid", gap: "1.25rem" }}>
            <Header variant="h2" sx={{ fontSize: "2rem", lineHeight: 1.2 }}>
              Component Library Demo
            </Header>
            <Text>
              This page demonstrates the current moxule-components primitives. The top toolbar
              uses only the left logo slot, the center content is wrapped with Layout spacing,
              and the footer sits at the bottom.
            </Text>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <Header variant="h3" sx={{ fontSize: "1.2rem" }}>
                Font Style Preview
              </Header>
              <Text variant="sm" sx={{ lineHeight: 1.5 }}>
                Quick QA snapshot for display font styles. Body text remains Gudea by default.
              </Text>

              <div
                style={{
                  display: "grid",
                  gap: "0.75rem",
                  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))"
                }}
              >
                {fontStylePreview.map((item) => (
                  <Card
                    key={item.name}
                  >
                    <Header
                      variant="h4"
                      sx={{
                        fontFamily: item.family,
                        letterSpacing: item.letterSpacing,
                        fontSize: "1.35rem",
                        lineHeight: 1.2
                      }}
                    >
                      {item.name}
                    </Header>
                    <Text variant="sm" sx={{ marginTop: "0.5rem", lineHeight: 1.45 }}>
                      The quick brown fox jumps over the lazy dog.
                    </Text>
                    <Button
                      size="sm"
                      variant={fontStyle === item.name ? "primary" : "secondary"}
                      sx={{ marginTop: "0.75rem" }}
                      onClick={() => setFontStyle(item.name)}
                    >
                      {fontStyle === item.name ? "Selected" : `Use ${item.name}`}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <Header variant="h3" sx={{ fontSize: "1.2rem" }}>
                Theme Color Preview
              </Header>
              <Text variant="sm" sx={{ lineHeight: 1.5 }}>
                Select a default theme from the dropdown or click a card to apply it instantly.
              </Text>

              <Dropdown
                aria-label="Theme selector"
                options={themeOptions.map((item) => ({ label: item.label, value: item.value }))}
                value={theme}
                onChange={(value) => setTheme(value as ThemeName)}
                sx={{ width: "220px" }}
              />

              <div
                style={{
                  display: "grid",
                  gap: "0.75rem",
                  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))"
                }}
              >
                {themeOptions.map((item) => (
                  <Card key={item.value} color={item.value}>
                    <Header variant="h4" color={item.value} sx={{ fontSize: "1.2rem", lineHeight: 1.2 }}>
                      {item.label}
                    </Header>
                    <Text variant="sm" color={item.value} sx={{ marginTop: "0.5rem", lineHeight: 1.45 }}>
                      Apply the {item.label.toLowerCase()} default color tokens.
                    </Text>
                    <Button
                      size="sm"
                      color={item.value}
                      variant={theme === item.value ? "primary" : "secondary"}
                      sx={{ marginTop: "0.75rem" }}
                      onClick={() => setTheme(item.value)}
                    >
                      {theme === item.value ? "Selected" : `Use ${item.label}`}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </Layout>

        <Footer layout="centered" position="static">
          <a href="#overview">Overview</a>
          <a href="#docs">Docs</a>
          <a href="#support">Support</a>
        </Footer>
      </PageShell>
    </ThemeProvider>
  );
}
