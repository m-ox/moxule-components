import { fireEvent, render, screen } from "@testing-library/react";
import { MenuButton } from "./MenuButton";

it("labels its drawer action, communicates expanded state, and forwards button props", () => {
  const onClick = vi.fn();
  const { rerender } = render(<MenuButton aria-controls="menu-panel" onClick={onClick} />);
  const button = screen.getByRole("button", { name: "Open menu" });
  expect(button).toHaveAttribute("type", "button");
  expect(button).toHaveAttribute("aria-expanded", "false");
  expect(button).toHaveAttribute("aria-haspopup", "dialog");
  expect(button).toHaveAttribute("aria-controls", "menu-panel");
  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledOnce();
  rerender(<MenuButton open disabled aria-label="Navigation menu" />);
  expect(screen.getByRole("button", { name: "Navigation menu" })).toHaveAttribute("aria-expanded", "true");
  expect(button).toBeDisabled();
});
