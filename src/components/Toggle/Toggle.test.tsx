import { fireEvent, render, screen } from "@testing-library/react";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("renders as a switch and reflects checked state", () => {
    render(<Toggle checked={true} onCheckedChange={() => undefined} ariaLabel="Theme mode" />);

    const toggle = screen.getByRole("switch", { name: "Theme mode" });
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("calls onCheckedChange with inverted value when clicked", () => {
    const onCheckedChange = vi.fn();
    render(<Toggle checked={false} onCheckedChange={onCheckedChange} ariaLabel="Theme mode" />);

    fireEvent.click(screen.getByRole("switch", { name: "Theme mode" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("shows rounded focus ring on focus", () => {
    render(<Toggle checked={false} onCheckedChange={() => undefined} ariaLabel="Theme mode" />);

    const toggle = screen.getByRole("switch", { name: "Theme mode" });
    fireEvent.focus(toggle);

    expect(toggle).toHaveStyle("border-radius: 999px");
    expect(toggle).toHaveStyle("outline: 2px solid var(--mx-button-primary-bg, #1f5ed8)");
    expect(toggle).toHaveStyle("box-shadow: 0 0 0 4px rgba(31, 94, 216, 0.28)");
  });
});
