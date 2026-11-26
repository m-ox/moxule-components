import { fireEvent, render, screen } from "@testing-library/react";
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

    fireEvent.focus(button);

    expect(button).toHaveStyle("outline: 2px solid var(--mx-button-primary-bg, #1f5ed8)");
    expect(button).toHaveStyle("box-shadow: 0 0 0 4px rgba(31, 94, 216, 0.28)");
  });
});
