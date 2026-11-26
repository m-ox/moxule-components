import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MarkdownEditor } from "./MarkdownEditor";

describe("MarkdownEditor", () => {
  it("formats selected source, preserves the selection, and supports undo/redo", () => {
    const onChange = vi.fn();
    render(<MarkdownEditor defaultValue="Hello world" onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: "Markdown" }) as HTMLTextAreaElement;
    input.setSelectionRange(6, 11);
    fireEvent.click(screen.getByRole("button", { name: "Bold" }));
    expect(input).toHaveValue("Hello **world**");
    expect(input.selectionStart).toBe(8);
    expect(input.selectionEnd).toBe(13);
    expect(input).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith("Hello **world**");
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(input).toHaveValue("Hello world");
    fireEvent.keyDown(input, { key: "z", ctrlKey: true, shiftKey: true });
    expect(input).toHaveValue("Hello **world**");
  });

  it("groups tools into compact menus that format the existing selection", () => {
    render(<MarkdownEditor defaultValue={"one\ntwo"} />);
    const input = screen.getByRole("textbox") as HTMLTextAreaElement;
    input.setSelectionRange(0, 7);
    fireEvent.change(screen.getByRole("combobox", { name: "List" }), { target: { value: "task-list" } });
    expect(input).toHaveValue("- [ ] one\n- [ ] two");
    expect(screen.getByRole("combobox", { name: "List" })).toHaveValue("");
    input.setSelectionRange(6, 9);
    fireEvent.change(screen.getByRole("combobox", { name: "Insert" }), { target: { value: "link" } });
    expect(input.value).toContain("[one](https://example.com)");
    expect(input.value.slice(input.selectionStart, input.selectionEnd)).toBe("https://example.com");
    expect(within(screen.getByRole("toolbar")).getAllByRole("button")).toHaveLength(4);
  });

  it("switches between raw Markdown and rendered preview without changing source", () => {
    const markdown = "# Hello\n\n**A story**";
    render(<MarkdownEditor defaultValue={markdown} />);
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    const preview = screen.getByRole("region", { name: "Markdown preview" });
    expect(within(preview).getByRole("heading", { name: "Hello" })).toBeInTheDocument();
    expect(within(preview).getByText("A story").tagName).toBe("STRONG");
    fireEvent.click(screen.getByRole("button", { name: "Write" }));
    expect(screen.getByRole("textbox")).toHaveValue(markdown);
  });

  it("saves a Markdown snapshot and keeps newer edits marked unsaved", async () => {
    let finish!: () => void;
    const onSave = vi.fn(() => new Promise<void>((resolve) => { finish = resolve; }));
    render(<MarkdownEditor onSave={onSave} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "**First draft**" } });
    fireEvent.keyDown(input, { key: "s", ctrlKey: true });
    expect(onSave).toHaveBeenCalledWith("**First draft**");
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
    fireEvent.change(input, { target: { value: "**Newer draft**" } });
    await act(async () => finish());
    expect(screen.getByRole("status")).toHaveTextContent("Saved. Newer changes are unsaved.");
    expect(input).toHaveValue("**Newer draft**");
  });

  it("keeps content on save failure and allows retrying", async () => {
    const onSave = vi.fn().mockRejectedValueOnce(new Error("Storage unavailable")).mockResolvedValue(undefined);
    render(<MarkdownEditor defaultValue="Keep this draft" onSave={onSave} />);
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't save");
    expect(screen.getByRole("textbox")).toHaveValue("Keep this draft");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Saved."));
    expect(onSave).toHaveBeenCalledTimes(2);
  });

  it("supports read-only content, native form fields, and externally loaded values", () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<form data-testid="form"><MarkdownEditor name="post" value="Original" onChange={onChange} textareaProps={{ required: true }} /></form>);
    expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("post")).toBe("Original");
    expect(container.querySelectorAll("[style]")).toHaveLength(0);
    rerender(<MarkdownEditor value="Loaded document" readOnly onChange={onChange} />);
    expect(screen.getByRole("textbox")).toHaveValue("Loaded document");
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: "Bold" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(screen.getByRole("region", { name: "Markdown preview" })).toHaveTextContent("Loaded document");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("describes tools on keyboard focus and keeps native dropdown keys available", () => {
    render(<MarkdownEditor />);
    const bold = screen.getByRole("button", { name: "Bold" });
    act(() => bold.focus());
    expect(screen.getByRole("tooltip")).toHaveTextContent("Make selected text bold");
    fireEvent.keyDown(bold, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "Italic" })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("button", { name: "Italic" }), { key: "ArrowRight" });
    const format = screen.getByRole("combobox", { name: "Format" });
    expect(format).toHaveFocus();
    const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true });
    fireEvent(format, event);
    expect(event.defaultPrevented).toBe(false);
  });
});
