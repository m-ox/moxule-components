import { useRef } from "react";
import { Button } from "../Button/Button";
import { Dropdown } from "../Dropdown/Dropdown";
import { Tooltip } from "../Tooltip/Tooltip";
import type { MarkdownCommand } from "./formatting";

type ToolbarCommand = MarkdownCommand | "undo" | "redo";
const menus: ReadonlyArray<{ label: string; help: string; options: Array<{ label: string; value: MarkdownCommand }> }> = [
  { label: "Format", help: "Choose a heading, quote, strikethrough, or code format.", options: [
    { label: "Heading", value: "heading" },
    { label: "Strikethrough", value: "strike" },
    { label: "Blockquote", value: "quote" },
    { label: "Inline code", value: "inline-code" },
    { label: "Code block", value: "code-block" }
  ] },
  { label: "List", help: "Turn selected lines into a bulleted, numbered, or task list.", options: [
    { label: "Bulleted list", value: "bullet-list" },
    { label: "Numbered list", value: "ordered-list" },
    { label: "Task list", value: "task-list" }
  ] },
  { label: "Insert", help: "Insert a link, image, table, or horizontal rule.", options: [
    { label: "Link", value: "link" },
    { label: "Image", value: "image" },
    { label: "Table", value: "table" },
    { label: "Horizontal rule", value: "rule" }
  ] }
];

interface MarkdownToolbarProps {
  disabled: boolean;
  hidden: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onCommand: (command: ToolbarCommand) => void;
}

export function MarkdownToolbar({ disabled, hidden, canUndo, canRedo, onCommand }: MarkdownToolbarProps) {
  const root = useRef<HTMLDivElement>(null);
  const iconButton = (command: ToolbarCommand, label: string, content: string, help: string, unavailable = false) => (
    <Tooltip content={help}><Button size="sm" variant="ghost" className="mx-markdown-tool" aria-label={label}
      data-mx-command={command} disabled={disabled || unavailable}
      onMouseDown={(event) => event.preventDefault()} onClick={() => onCommand(command)}>{content}</Button></Tooltip>
  );

  return (
    <div ref={root} role="toolbar" aria-label="Markdown formatting" className="mx-markdown-toolbar" hidden={hidden}
      onKeyDown={(event) => {
        // Native selects keep their own arrow-key behavior; every control supports Tab.
        if (event.target instanceof HTMLSelectElement || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        const controls = Array.from(root.current?.querySelectorAll<HTMLButtonElement | HTMLSelectElement>("button:not(:disabled), select:not(:disabled)") ?? []);
        if (!controls.length) return;
        event.preventDefault();
        const index = controls.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === "Home" ? 0 : event.key === "End" ? controls.length - 1
          : (index + (event.key === "ArrowLeft" ? -1 : 1) + controls.length) % controls.length;
        controls[next].focus();
      }}>
      {iconButton("bold", "Bold", "B", "Make selected text bold. Ctrl/⌘ + B.")}
      {iconButton("italic", "Italic", "I", "Italicize selected text. Ctrl/⌘ + I.")}
      {menus.map((menu) => (
        <Tooltip key={menu.label} content={menu.help}><Dropdown aria-label={menu.label} className="mx-markdown-tool-select"
          value="" disabled={disabled}
          options={[{ label: menu.label, value: "" }, ...menu.options]}
          onChange={(value) => { if (value) onCommand(value as MarkdownCommand); }} /></Tooltip>
      ))}
      {iconButton("undo", "Undo", "↶", "Undo the last edit. Ctrl/⌘ + Z.", !canUndo)}
      {iconButton("redo", "Redo", "↷", "Restore the edit you undid. Ctrl/⌘ + Shift + Z.", !canRedo)}
    </div>
  );
}
