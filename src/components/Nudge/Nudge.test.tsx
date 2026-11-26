import { StrictMode } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Nudge } from "./Nudge";

describe("Nudge", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it("announces messages, accepts custom colors, and closes gently only once", () => {
    const onDismiss = vi.fn();
    render(<Nudge message="Saved" variant="success" color="#5f4a89" onDismiss={onDismiss} />);
    const nudge = screen.getByRole("status");
    expect(nudge).toHaveTextContent("Saved");
    expect(nudge).toHaveAttribute("data-mx-variant", "success");
    expect(nudge.style.getPropertyValue("--mx-banner-accent")).toBe("#5f4a89");
    const close = screen.getByRole("button", { name: "Dismiss notification" });
    expect(close).toHaveAttribute("type", "button");
    fireEvent.click(close);
    fireEvent.click(close);
    expect(nudge).toHaveAttribute("data-mx-dismissing", "true");
    expect(close).toBeDisabled();
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(240));
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    expect(onDismiss).toHaveBeenCalledOnce();
    act(() => vi.advanceTimersByTime(6000));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("pauses while hovered or focused and resumes with the remaining time", () => {
    const onDismiss = vi.fn();
    render(<Nudge message="Read me" duration={1000} onDismiss={onDismiss} />);
    const nudge = screen.getByRole("status");
    const close = screen.getByRole("button");
    act(() => vi.advanceTimersByTime(400));
    fireEvent.mouseEnter(nudge);
    fireEvent.focus(close);
    fireEvent.mouseLeave(nudge);
    act(() => vi.advanceTimersByTime(2000));
    expect(nudge).not.toHaveAttribute("data-mx-dismissing");
    fireEvent.blur(close, { relatedTarget: document.body });
    act(() => vi.advanceTimersByTime(599));
    expect(nudge).not.toHaveAttribute("data-mx-dismissing");
    act(() => vi.advanceTimersByTime(1));
    expect(nudge).toHaveAttribute("data-mx-dismissing", "true");
    act(() => vi.advanceTimersByTime(240));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("keeps errors and duration-zero messages until dismissed", () => {
    render(<><Nudge message="An error occurred" variant="error" /><Nudge message="A persistent message" duration={0} /></>);
    act(() => vi.advanceTimersByTime(60000));
    expect(screen.getByRole("alert")).toHaveTextContent("An error occurred");
    expect(screen.getByRole("status")).toHaveTextContent("A persistent message");
  });

  it("respects reduced motion and forwards interaction handlers", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
    const onMouseEnter = vi.fn();
    const onDismiss = vi.fn();
    render(<Nudge message="Hello" closeLabel="Close hello" onMouseEnter={onMouseEnter} onDismiss={onDismiss} />);
    fireEvent.mouseEnter(screen.getByRole("status"));
    expect(onMouseEnter).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "Close hello" }));
    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("supports controlled dismissal under StrictMode", () => {
    const onDismiss = vi.fn();
    render(<StrictMode><Nudge message="Closing" open={false} onDismiss={onDismiss} /></StrictMode>);
    act(() => vi.advanceTimersByTime(240));
    expect(screen.queryByText("Closing")).not.toBeInTheDocument();
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("cleans up automatic and exit timers on unmount", () => {
    const onDismiss = vi.fn();
    const { unmount } = render(<Nudge message="Hello" duration={1000} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole("button"));
    unmount();
    act(() => vi.advanceTimersByTime(2000));
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
