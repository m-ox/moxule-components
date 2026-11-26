import { useRef } from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { NudgeProvider, useNudges } from "./NudgeProvider";

function Controls() {
  const { nudge, dismiss, dismissAll } = useNudges();
  const last = useRef("");
  return <>
    <button onClick={() => { last.current = nudge({ message: "Saved", variant: "success", duration: 0 }); }}>Add success</button>
    <button onClick={() => nudge({ message: "Failed", variant: "error" })}>Add error</button>
    <button onClick={() => nudge("Hello")}>Add message</button>
    <button onClick={() => dismiss(last.current)}>Dismiss latest</button>
    <button onClick={dismissAll}>Dismiss all</button>
  </>;
}

describe("NudgeProvider", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("stacks independent messages in a themed corner without stealing focus", () => {
    const { container } = render(<ThemeProvider theme="pink" mode="dark"><NudgeProvider position="top-left"><Controls /></NudgeProvider></ThemeProvider>);
    const trigger = screen.getByRole("button", { name: "Add success" });
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Add error" }));
    const viewport = screen.getByRole("region", { name: "Notifications" });
    expect(viewport).toHaveAttribute("data-mx-position", "top-left");
    expect(viewport.closest(".mx-theme")).toHaveAttribute("data-mx-theme", "pink");
    expect(within(viewport).getAllByRole("listitem")).toHaveLength(3);
    expect(within(viewport).getAllByText("Saved")).toHaveLength(2);
    expect(within(viewport).getByRole("alert")).toHaveTextContent("Failed");
    expect(trigger).toHaveFocus();
    expect(container.querySelectorAll("[style]")).toHaveLength(0);
    fireEvent.click(within(viewport).getAllByRole("button")[0]);
    act(() => vi.advanceTimersByTime(240));
    expect(within(viewport).getAllByRole("listitem")).toHaveLength(2);
    expect(within(viewport).getAllByText("Saved")).toHaveLength(1);
  });

  it("supports dismissing by ID and clearing the stack", () => {
    render(<NudgeProvider><Controls /></NudgeProvider>);
    const viewport = screen.getByRole("region", { name: "Notifications" });
    fireEvent.click(screen.getByRole("button", { name: "Add success" }));
    fireEvent.click(screen.getByRole("button", { name: "Add error" }));
    fireEvent.click(screen.getByRole("button", { name: "Dismiss latest" }));
    act(() => vi.advanceTimersByTime(240));
    expect(within(viewport).queryByText("Saved")).not.toBeInTheDocument();
    expect(within(viewport).getByText("Failed")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Dismiss all" }));
    act(() => vi.advanceTimersByTime(240));
    expect(within(viewport).queryAllByRole("listitem")).toHaveLength(0);
  });

  it("supports plain messages and a provider default duration", () => {
    render(<NudgeProvider duration={1000}><Controls /></NudgeProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Add message" }));
    expect(screen.getByRole("status")).toHaveTextContent("Hello");
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(240));
    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  });
});
