import { render, screen } from "@testing-library/react";
import { Button } from "../components/Button/Button";
import { ThemeProvider } from "./ThemeProvider";

describe("ThemeProvider", () => {
  it("applies mode and theme markers", () => {
    render(
      <ThemeProvider mode="dark" theme="tertiary" data-testid="theme-root">
        <Button>Action</Button>
      </ThemeProvider>
    );

    const root = screen.getByTestId("theme-root");
    expect(root).toHaveAttribute("data-mx-mode", "dark");
    expect(root).toHaveAttribute("data-mx-theme", "tertiary");
  });

  it("supports custom token overrides", () => {
    render(
      <ThemeProvider customTokens={{ buttonPrimaryBg: "#ff0000" }} data-testid="theme-root">
        <Button>Action</Button>
      </ThemeProvider>
    );

    const root = screen.getByTestId("theme-root");
    expect(root).toHaveStyle("--mx-button-primary-bg: #ff0000");
    expect(root).toHaveStyle("--mx-page-shell-bg: #ffeff7");
  });
});
