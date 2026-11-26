# moxule-components

Component library for m-ox to use.

## Scripts

- `npm run dev`: Build in watch mode
- `npm run demo`: Run Vite sample page locally
- `npm run demo:build`: Build Vite sample page
- `npm run demo:preview`: Preview built Vite sample page
- `npm run build`: Build ESM and CJS bundles with type declarations
- `npm run typecheck`: Run TypeScript checks
- `npm test`: Run tests once

## Quick start

```bash
npm install
npm run build
```

## First component

`Button` is exported from the package root:

```tsx
import { Button } from "moxule-components";

export function Example() {
  return <Button variant="primary">Click me</Button>;
}
```

## Theming

Use `ThemeProvider` to control color mode (`light` or `dark`) and theme flavor (`primary`, `secondary`, `tertiary`, `blue`, `red`, `green`, `purple`, or `pink`).

Font styling presets are also available:

- `fontStyle="clear"` -> Cantarell display font
- `fontStyle="playful"` -> DynaPuff display font
- `fontStyle="stark"` -> Martel display font
- `fontStyle="bizarre"` -> Loved by the King display font

Body text defaults to Gudea. Header, toolbar logo, and footer use the display font.

Many components also accept semantic `color` values (for example `primary`, `secondary`, `tertiary`, `blue`, `red`, `green`, `purple`, `pink`) so you can apply a specific theme palette per component.

```tsx
import { Button, ThemeProvider } from "moxule-components";

export function Example() {
  return (
    <ThemeProvider mode="dark" theme="secondary">
      <Button variant="primary">Primary action</Button>
      <Button variant="secondary">Secondary action</Button>
      <Button variant="ghost">Ghost action</Button>
    </ThemeProvider>
  );
}
```

You can also override individual tokens for a custom brand theme:

```tsx
<ThemeProvider
  mode="light"
  theme="primary"
  customTokens={{
    buttonPrimaryBg: "#0057ff",
    buttonPrimaryText: "#ffffff",
    fontDisplay: '"Inter", sans-serif',
    fontBody: '"Source Sans 3", sans-serif'
  }}
>
  <Button>Custom brand button</Button>
</ThemeProvider>
```

  ## Toolbar

  Use `Toolbar` when you need a reusable app header with a left logo and right-side wrapped actions.

  ```tsx
  import { Toolbar } from "moxule-components";

  function Logo() {
    return <strong>Moxule</strong>;
  }

  function LogOutButton() {
    return <button type="button">Log out</button>;
  }

  function UserMenu() {
    return <button type="button">User menu</button>;
  }

  export function Example() {
    return (
      <Toolbar logo={<Logo />}>
        <LogOutButton />
        <UserMenu />
      </Toolbar>
    );
  }
  ```

## Footer

Use `Footer` for bottom page navigation/actions with either centered content or evenly split sections.

- `position="natural"` keeps footer in normal document flow (good for long pages).
- `position="static"` fixes footer to the viewport bottom.

```tsx
import { Footer } from "moxule-components";

export function FooterExamples() {
  return (
    <>
      <Footer layout="centered" position="static">
        <a href="#about">About</a>
        <a href="#terms">Terms</a>
        <a href="#privacy">Privacy</a>
      </Footer>

      <Footer layout="split" position="natural">
        <span>Column one</span>
        <span>Column two</span>
        <span>Column three</span>
      </Footer>
    </>
  );
}
```

## Toggle

Use `Toggle` as a reusable switch control with a classic sliding bubble.

```tsx
import { Toggle } from "moxule-components";

function ThemeSwitch() {
  const [checked, setChecked] = useState(false);

  return (
    <Toggle
      checked={checked}
      onCheckedChange={setChecked}
      ariaLabel="Toggle dark mode"
    />
  );
}
```

## Card

Use `Card` for reusable surface items tied to the theme.

```tsx
import { Card, Header, Text } from "moxule-components";

export function ExampleCard() {
  return (
    <Card>
      <Header variant="h4">Card title</Header>
      <Text variant="sm" sx={{ marginTop: "0.5rem" }}>
        Card body content.
      </Text>
    </Card>
  );
}
```

## Image

Use `Image` for consistent image rendering with library prop conventions.

```tsx
import { Image } from "moxule-components";

export function Logo() {
  return (
    <Image
      src="/favicon.png"
      alt="Brand logo"
      width={32}
      height={32}
      sx={{ borderRadius: "999px", objectFit: "cover" }}
    />
  );
}
```

## Dropdown

Use `Dropdown` for selecting from a list of options.

```tsx
import { Dropdown } from "moxule-components";

const options = [
  { label: "Blue", value: "blue" },
  { label: "Primary", value: "primary" }
];

export function ThemePicker() {
  const [theme, setTheme] = useState("blue");

  return (
    <Dropdown
      aria-label="Theme selector"
      options={options}
      value={theme}
      onChange={setTheme}
    />
  );
}
```

## PageShell

Use `PageShell` for full-page structure with toolbar/content/footer and bottom offset for fixed/static footers. Its background is neutral gray in light mode and charcoal in dark mode across all themes, keeping themed solid cards visually distinct.

```tsx
import { Footer, Layout, PageShell, Toolbar } from "moxule-components";

export function ExamplePage() {
  return (
    <PageShell footerOffset="xl">
      <Toolbar left={<div>Brand</div>} />
      <Layout margin="lg" contentWidth="md" style={{ flex: 1 }}>
        Main content
      </Layout>
      <Footer layout="centered" position="static">
        Footer links
      </Footer>
    </PageShell>
  );
}
```
