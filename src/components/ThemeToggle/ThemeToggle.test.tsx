import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "../../theme/ThemeProvider";
import type { ThemeMode } from "../../theme/theme";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  it("reads the provider's mode and changes between light and dark", () => {
    function Example() {
      const [mode, setMode] = useState<ThemeMode>("light");
      return <ThemeProvider mode={mode} data-testid="theme"><ThemeToggle onModeChange={setMode} /></ThemeProvider>;
    }
    const { container } = render(<Example />);
    const toggle = screen.getByRole("switch", { name: "Toggle dark mode" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(container.querySelectorAll("[style]")).toHaveLength(0);
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(screen.getByTestId("theme")).toHaveAttribute("data-mx-mode", "dark");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(screen.getByTestId("theme")).toHaveAttribute("data-mx-mode", "light");
  });

  it("supports an explicit mode outside the provider", () => {
    const onModeChange = vi.fn();
    render(<ThemeToggle mode="dark" onModeChange={onModeChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onModeChange).toHaveBeenCalledWith("light");
  });

  it("uses a visible label as the accessible name and supports clicking it", () => {
    const onModeChange = vi.fn();
    render(<ThemeToggle label="Use dark colors" mode="light" onModeChange={onModeChange} />);
    expect(screen.getByRole("switch", { name: "Use dark colors" })).toBeInTheDocument();
    fireEvent.click(screen.getByText("Use dark colors"));
    expect(onModeChange).toHaveBeenCalledWith("dark");
  });

  it("preserves caller click handlers and supports cancellation", () => {
    const onModeChange = vi.fn();
    const onClick = vi.fn((event) => event.preventDefault());
    render(<ThemeToggle onModeChange={onModeChange} onClick={onClick} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onModeChange).not.toHaveBeenCalled();
  });

  it("respects disabled state", () => {
    const onModeChange = vi.fn();
    render(<ThemeToggle disabled onModeChange={onModeChange} />);
    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);
    expect(toggle).toBeDisabled();
    expect(onModeChange).not.toHaveBeenCalled();
  });
});
