import { render, screen } from "@testing-library/react";
import { Button } from "../components/Button/Button";
import { Card } from "../components/Card/Card";
import { Link } from "../components/Link/Link";
import { ThemeProvider } from "./ThemeProvider";
import { themeTokens, type ThemeName } from "./theme";
import { toCssVariables } from "./cssVariables";

describe("generated theme styles", () => {
  for (const theme of Object.keys(themeTokens) as ThemeName[]) {
    for (const mode of ["light", "dark"] as const) {
      it(`matches ${theme}/${mode} tokens without inline declarations`, () => {
        const tokens = themeTokens[theme][mode];
        const { container } = render(
          <ThemeProvider theme={theme} mode={mode} data-testid="theme">
            <Card color={theme} data-testid="card"><Button color={theme}>Action</Button><Link href="#details" color={theme}>Details</Link></Card>
          </ThemeProvider>
        );
        const css = getComputedStyle(screen.getByTestId("theme"));
        for (const [property, value] of Object.entries(toCssVariables(tokens))) {
          expect(css.getPropertyValue(property), `${theme}/${mode} ${property}`).toBe(value);
        }
        expect(screen.getByTestId("card")).toHaveStyle({ backgroundColor: tokens.surface });
        expect(screen.getByRole("button")).toHaveStyle({ backgroundColor: tokens.buttonPrimaryBg, color: tokens.buttonPrimaryText });
        expect(screen.getByRole("link")).toHaveStyle({ color: tokens.buttonGhostText });
        expect(container.querySelectorAll("[style]")).toHaveLength(0);
      });
    }
  }

  it("keeps explicit overrides ahead of stylesheet defaults", () => {
    render(<ThemeProvider><Button color="red" sx={{ padding: "2rem" }} style={{ padding: "1rem", color: "#123456" }}>Override</Button></ThemeProvider>);
    expect(screen.getByRole("button")).toHaveStyle({ padding: "1rem", color: "#123456" });
  });
});
