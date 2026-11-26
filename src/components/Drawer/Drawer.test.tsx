import { StrictMode, useRef, useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Drawer, type DrawerProps } from "./Drawer";

function Example(props: Partial<DrawerProps> = {}) {
  const [open, setOpen] = useState(false);
  return <>
    <button onClick={() => setOpen(true)}>Open panel</button>
    <Drawer title="Settings" description="Edit your preferences." open={open} onOpenChange={setOpen} {...props}>
      <label htmlFor="drawer-name">Name</label><input id="drawer-name" />
    </Drawer>
  </>;
}

function openPanel() {
  const trigger = screen.getByRole("button", { name: "Open panel" });
  trigger.focus();
  fireEvent.click(trigger);
  return trigger;
}

describe("Drawer", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it.each(["left", "right"] as const)("opens a labelled %s modal and returns focus after closing", (side) => {
    const onDismiss = vi.fn();
    const { container } = render(<Example side={side} onDismiss={onDismiss} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const trigger = openPanel();
    const drawer = screen.getByRole("dialog", { name: "Settings" });
    expect(drawer).toHaveAttribute("data-mx-side", side);
    expect(drawer).toHaveAttribute("aria-modal", "true");
    expect(drawer).toHaveAccessibleDescription("Edit your preferences.");
    expect(document.body.style.overflow).toBe("hidden");
    const close = screen.getByRole("button", { name: "Close drawer" });
    expect(close).toHaveFocus();
    expect(container.querySelectorAll("[style]")).toHaveLength(0);
    fireEvent.click(close);
    expect(drawer).toHaveAttribute("data-mx-state", "closing");
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(240));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
    expect(trigger).toHaveFocus();
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("handles the native Escape cancel event and respects closeOnEscape", () => {
    const { rerender } = render(<Example closeOnEscape={false} />);
    openPanel();
    const drawer = screen.getByRole("dialog");
    const cancel = new Event("cancel", { cancelable: true });
    fireEvent(drawer, cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(drawer).toHaveAttribute("data-mx-state", "open");
    rerender(<Example closeOnEscape />);
    fireEvent(drawer, new Event("cancel", { cancelable: true }));
    act(() => vi.advanceTimersByTime(240));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes only on backdrop clicks and supports opting out", () => {
    const { rerender } = render(<Example closeOnBackdrop={false} />);
    openPanel();
    const drawer = screen.getByRole("dialog");
    vi.spyOn(drawer, "getBoundingClientRect").mockReturnValue({ left: 100, right: 400, top: 0, bottom: 700 } as DOMRect);
    fireEvent.click(drawer, { clientX: 20, clientY: 20 });
    expect(drawer).toHaveAttribute("data-mx-state", "open");
    rerender(<Example />);
    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(drawer, { clientX: 200, clientY: 300 });
    expect(drawer).toHaveAttribute("data-mx-state", "open");
    fireEvent.click(drawer, { clientX: 20, clientY: 20 });
    act(() => vi.advanceTimersByTime(240));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("supports initial focus and reduced motion", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
    function FocusExample() {
      const [open, setOpen] = useState(false);
      const input = useRef<HTMLInputElement>(null);
      return <><button onClick={() => setOpen(true)}>Open panel</button><Drawer title="Search" open={open} onOpenChange={setOpen} initialFocusRef={input}><input ref={input} aria-label="Search term" /></Drawer></>;
    }
    render(<FocusExample />);
    openPanel();
    expect(screen.getByRole("textbox", { name: "Search term" })).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "Close drawer" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("cleans up pending closes and restores the previous scroll style on unmount", () => {
    document.body.style.overflow = "scroll";
    const onDismiss = vi.fn();
    const { unmount } = render(<Example onDismiss={onDismiss} />);
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: "Close drawer" }));
    unmount();
    act(() => vi.advanceTimersByTime(240));
    expect(onDismiss).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toBe("scroll");
    document.body.style.overflow = "";
  });

  it("can reopen during an exit and works with StrictMode", () => {
    const onOpenChange = vi.fn();
    const onDismiss = vi.fn();
    const { rerender, unmount } = render(<StrictMode><Drawer title="Panel" open onOpenChange={onOpenChange} onDismiss={onDismiss}>Content</Drawer></StrictMode>);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
    expect(onOpenChange).not.toHaveBeenCalled();
    rerender(<StrictMode><Drawer title="Panel" open={false} onOpenChange={onOpenChange} onDismiss={onDismiss}>Content</Drawer></StrictMode>);
    act(() => vi.advanceTimersByTime(100));
    rerender(<StrictMode><Drawer title="Panel" open onOpenChange={onOpenChange} onDismiss={onDismiss}>Content</Drawer></StrictMode>);
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole("dialog")).toHaveAttribute("data-mx-state", "open");
    expect(onDismiss).not.toHaveBeenCalled();
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
