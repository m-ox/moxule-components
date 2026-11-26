import { useState } from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { Drawer } from "../Drawer/Drawer";
import { Modal, type ModalProps } from "./Modal";

function Example(props: Partial<ModalProps> = {}) {
  const [open, setOpen] = useState(false);
  return <>
    <button onClick={() => setOpen(true)}>Show modal</button>
    <Modal
      title="Confirm changes"
      description="Review before continuing."
      open={open}
      onOpenChange={setOpen}
      footer={<button onClick={() => setOpen(false)}>Continue</button>}
      {...props}
    >Message content</Modal>
  </>;
}

describe("Modal", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it("opens with accessible content and actions, then gently closes and restores focus", () => {
    const onDismiss = vi.fn();
    const { container } = render(<Example onDismiss={onDismiss} />);
    const trigger = screen.getByRole("button", { name: "Show modal" });
    trigger.focus();
    fireEvent.click(trigger);
    const modal = screen.getByRole("dialog", { name: "Confirm changes" });
    expect(modal).toHaveAccessibleDescription("Review before continuing.");
    expect(modal).toHaveAttribute("aria-modal", "true");
    expect(modal).toHaveAttribute("data-mx-size", "md");
    expect(modal).toHaveClass("mx-modal");
    expect(within(modal).getByRole("button", { name: "Close modal" })).toHaveFocus();
    expect(container.querySelectorAll("[style]")).toHaveLength(0);
    fireEvent.click(within(modal).getByRole("button", { name: "Continue" }));
    expect(modal).toHaveAttribute("data-mx-state", "closing");
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(240));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onDismiss).toHaveBeenCalledOnce();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("forwards size, native attributes, accessible name, classes, and explicit overrides", () => {
    render(<Modal open onOpenChange={() => undefined} title="Title" aria-label="Custom name" id="custom-modal" size="lg" class="custom" sx={{ padding: "2rem" }} style={{ padding: "1rem" }}>Content</Modal>);
    const modal = screen.getByRole("dialog", { name: "Custom name" });
    expect(modal).toHaveAttribute("id", "custom-modal");
    expect(modal).toHaveAttribute("data-mx-size", "lg");
    expect(modal).toHaveClass("mx-modal", "custom");
    expect(modal).toHaveStyle({ padding: "1rem" });
  });

  it("closes on native Escape with reduced-motion preferences respected", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
    const onDismiss = vi.fn();
    render(<Example onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole("button", { name: "Show modal" }));
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("shares scroll locking correctly with an underlying drawer", () => {
    function Nested() {
      const [drawerOpen, setDrawerOpen] = useState(true);
      const [modalOpen, setModalOpen] = useState(false);
      return <Drawer title="Navigation" open={drawerOpen} onOpenChange={setDrawerOpen}>
        <button onClick={() => setModalOpen(true)}>Show modal</button>
        <Modal title="Nested confirmation" open={modalOpen} onOpenChange={setModalOpen}>Details</Modal>
      </Drawer>;
    }
    render(<Nested />);
    const trigger = screen.getByRole("button", { name: "Show modal" });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getAllByRole("dialog")).toHaveLength(2);
    fireEvent(screen.getByRole("dialog", { name: "Nested confirmation" }), new Event("cancel", { cancelable: true }));
    act(() => vi.advanceTimersByTime(240));
    expect(screen.getByRole("dialog", { name: "Navigation" })).toHaveAttribute("data-mx-state", "open");
    expect(document.body.style.overflow).toBe("hidden");
    expect(trigger).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "Close drawer" }));
    act(() => vi.advanceTimersByTime(240));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });
});
