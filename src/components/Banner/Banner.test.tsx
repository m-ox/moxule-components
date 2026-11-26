import { createRef } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Banner, type BannerVariant } from "./Banner";

describe("Banner", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
  it.each<BannerVariant>(["success", "warning", "error", "neutral"])("renders a %s message with announcement semantics", (variant) => {
    const { container } = render(<Banner variant={variant} message="Changes saved." />);
    const banner = screen.getByRole(variant === "error" ? "alert" : "status");
    expect(banner).toHaveTextContent("Changes saved.");
    expect(banner).toHaveAttribute("data-mx-variant", variant);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.querySelectorAll("[style]")).toHaveLength(0);
    expect(banner).toHaveStyle({ border: "0px", boxShadow: "none" });
  });

  it("accepts rich messages, a custom accent, native attributes, and a ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Banner ref={ref} message={<strong>Heads up</strong>} color="#5f4a89" role="note" aria-label="Notice" class="custom" />);
    const banner = screen.getByRole("note", { name: "Notice" });
    expect(ref.current).toBe(banner);
    expect(banner).toHaveClass("mx-banner", "custom");
    expect(banner.style.getPropertyValue("--mx-banner-accent")).toBe("#5f4a89");
    expect(screen.getByText("Heads up").tagName).toBe("STRONG");
  });

  it("offers a focusable borderless close button that dismisses without submitting a form", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(<form onSubmit={onSubmit}><Banner message="Dismiss me" dismissible onDismiss={onDismiss} closeLabel="Close notice" /></form>);
    const close = screen.getByRole("button", { name: "Close notice" });
    expect(close).toHaveAttribute("type", "button");
    expect(close).toHaveStyle({ border: "0px", boxShadow: "none" });
    close.focus();
    expect(close).toHaveFocus();
    fireEvent.click(close);
    expect(screen.getByText("Dismiss me").closest(".mx-banner")).toHaveAttribute("data-mx-dismissing", "true");
    expect(close).toBeDisabled();
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(240));
    expect(screen.queryByText("Dismiss me")).not.toBeInTheDocument();
    expect(onDismiss).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("dismisses without requiring a callback", () => {
    vi.useFakeTimers();
    render(<Banner message="Dismiss me" dismissible />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss banner" }));
    act(() => vi.advanceTimersByTime(240));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("dismisses immediately when reduced motion is preferred", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
    const onDismiss = vi.fn();
    render(<Banner message="Dismiss me" dismissible onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss banner" }));
    expect(screen.queryByText("Dismiss me")).not.toBeInTheDocument();
    expect(onDismiss).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("cancels pending dismissal on unmount", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    const { unmount } = render(<Banner message="Dismiss me" dismissible onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss banner" }));
    unmount();
    act(() => vi.advanceTimersByTime(240));
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
