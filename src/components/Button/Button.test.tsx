import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Press me</Button>);
    expect(screen.getByRole("button", { name: "Press me" })).toBeInTheDocument();
  });

  it("respects disabled state", () => {
    render(<Button disabled>Cannot press</Button>);
    expect(screen.getByRole("button", { name: "Cannot press" })).toBeDisabled();
  });

  it("applies standardized focus ring", () => {
    render(<Button>Focusable</Button>);
    const button = screen.getByRole("button", { name: "Focusable" });

    button.focus();

    expect(button).toHaveStyle("outline: 2px solid var(--mx-color-text, #1d3558)");
    expect(button).toHaveStyle("outline-offset: 2px");
  });
});
