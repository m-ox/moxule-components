import { act, fireEvent, render, screen } from "@testing-library/react";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

  it("shows descriptive help after hovering and closes when the pointer leaves", () => {
    render(<Tooltip content="Make selected text bold."><button>Bold</button></Tooltip>);
    fireEvent.mouseEnter(screen.getByRole("button"));
    act(() => vi.advanceTimersByTime(249));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("tooltip")).toHaveTextContent("Make selected text bold.");
    fireEvent.mouseLeave(screen.getByRole("button").parentElement!);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens immediately on keyboard focus, preserves descriptions, and dismisses with Escape", () => {
    render(<><p id="hint">Existing hint.</p><Tooltip content="Additional help."><button aria-describedby="hint">Action</button></Tooltip></>);
    const button = screen.getByRole("button");
    act(() => button.focus());
    expect(screen.getByRole("tooltip")).toHaveTextContent("Additional help.");
    expect(button).toHaveAccessibleDescription("Existing hint. Additional help.");
    fireEvent.keyDown(button, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute("aria-describedby", "hint");
  });

  it("stays open for pointer movement into the tooltip and while its trigger is focused", () => {
    render(<Tooltip content="Help"><button>Action</button></Tooltip>);
    const button = screen.getByRole("button");
    act(() => button.focus());
    fireEvent.mouseEnter(screen.getByRole("tooltip"));
    fireEvent.blur(button, { relatedTarget: document.body });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.mouseLeave(button.parentElement!);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("keeps child actions intact and supports disabling tooltips", () => {
    const onClick = vi.fn();
    const { rerender } = render(<Tooltip content="Help"><button onClick={onClick}>Action</button></Tooltip>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
    rerender(<Tooltip content="Help" disabled><button>Action</button></Tooltip>);
    act(() => screen.getByRole("button").focus());
    fireEvent.mouseEnter(screen.getByRole("button"));
    act(() => vi.advanceTimersByTime(500));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("clears a pending hover timer when unmounted", () => {
    const { unmount } = render(<Tooltip content="Help"><button>Action</button></Tooltip>);
    fireEvent.mouseEnter(screen.getByRole("button"));
    unmount();
    act(() => vi.advanceTimersByTime(500));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
