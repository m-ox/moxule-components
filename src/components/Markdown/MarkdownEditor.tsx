import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { Button } from "../Button/Button";
import { Text } from "../Typography/Text";
import { Markdown } from "./Markdown";
import { MarkdownToolbar } from "./MarkdownToolbar";
import { downloadMarkdown } from "./download";
import { formatMarkdown, type MarkdownCommand, type MarkdownSelection } from "./formatting";

export interface MarkdownEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange" | "defaultValue"> {
  value?: string;
  defaultValue?: string;
  onChange?: (markdown: string) => void;
  onSave?: (markdown: string) => void | Promise<void>;
  label?: ReactNode;
  description?: ReactNode;
  name?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  readOnly?: boolean;
  saveLabel?: string;
  downloadFileName?: string | false;
  textareaProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange" | "children" | "disabled" | "readOnly" | "name" | "rows" | "placeholder">;
  sx?: CSSProperties;
  class?: string;
}

interface History {
  entries: MarkdownSelection[];
  index: number;
}

export function MarkdownEditor({
  value,
  defaultValue = "",
  onChange,
  onSave,
  label = "Markdown",
  description,
  name,
  placeholder = "Start writing…",
  rows = 14,
  disabled = false,
  readOnly = false,
  saveLabel = "Save",
  downloadFileName = "document.md",
  textareaProps,
  sx,
  class: classProp,
  className,
  style,
  ...props
}: MarkdownEditorProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const content = value ?? internalValue;
  const [preview, setPreview] = useState(false);
  const [savedValue, setSavedValue] = useState(content);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [history, setHistory] = useState<History>(() => ({ entries: [{ value: content, start: 0, end: 0 }], index: 0 }));
  const historyRef = useRef(history);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const pendingSelection = useRef<MarkdownSelection>();
  const mounted = useRef(false);
  const saving = useRef(false);
  const generatedId = useId();
  const inputId = textareaProps?.id ?? `${generatedId}-input`;
  const descriptionId = `${generatedId}-description`;
  const hintId = `${generatedId}-hint`;
  const previewId = `${generatedId}-preview`;
  const editable = !disabled && !readOnly;

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  // An externally loaded document starts a fresh undo history.
  useEffect(() => {
    const current = historyRef.current;
    if (current.entries[current.index].value !== content) {
      const next = { entries: [{ value: content, start: 0, end: 0 }], index: 0 };
      historyRef.current = next;
      setHistory(next);
    }
  }, [content, history]);

  useLayoutEffect(() => {
    const selection = pendingSelection.current;
    if (selection && textarea.current?.value === selection.value) {
      textarea.current.focus();
      textarea.current.setSelectionRange(selection.start, selection.end);
      pendingSelection.current = undefined;
    }
  }, [content, history]);

  const publish = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
    if (!saving.current) setStatus("idle");
  };

  const update = (selection: MarkdownSelection, restoreSelection = true) => {
    if (!editable) return;
    const current = historyRef.current;
    const entries = current.entries.slice(0, current.index + 1);
    entries[entries.length - 1] = {
      value: content,
      start: Math.min(textarea.current?.selectionStart ?? 0, content.length),
      end: Math.min(textarea.current?.selectionEnd ?? 0, content.length)
    };
    if (selection.value !== content) entries.push(selection);
    const kept = entries.slice(-100);
    const next = { entries: kept, index: kept.length - 1 };
    historyRef.current = next;
    setHistory(next);
    if (restoreSelection) pendingSelection.current = selection;
    publish(selection.value);
  };

  const command = (action: MarkdownCommand | "undo" | "redo") => {
    if (!editable) return;
    if (action === "undo" || action === "redo") {
      const current = historyRef.current;
      const index = current.index + (action === "undo" ? -1 : 1);
      if (index < 0 || index >= current.entries.length) return;
      const next = { ...current, index };
      historyRef.current = next;
      setHistory(next);
      pendingSelection.current = next.entries[index];
      publish(next.entries[index].value);
      return;
    }
    const start = textarea.current?.selectionStart ?? content.length;
    const end = textarea.current?.selectionEnd ?? start;
    update(formatMarkdown(content, start, end, action));
  };

  const save = async () => {
    if (!onSave || !editable || saving.current) return;
    saving.current = true;
    setStatus("saving");
    const snapshot = content;
    try {
      await onSave(snapshot);
      if (mounted.current) {
        setSavedValue(snapshot);
        setStatus("saved");
      }
    } catch {
      if (mounted.current) setStatus("error");
    } finally {
      saving.current = false;
    }
  };

  const dirty = content !== savedValue;
  const statusMessage = status === "saving" ? "Saving…" : status === "error" ? "Couldn't save. Please try again."
    : status === "saved" ? dirty ? "Saved. Newer changes are unsaved." : "Saved."
      : dirty ? "Unsaved changes." : "Markdown is ready.";

  return (
    <div {...props} className={["mx-markdown-editor", className, classProp].filter(Boolean).join(" ")} style={{ ...sx, ...style }}>
      <label htmlFor={inputId} className="mx-markdown-editor-label">{label}</label>
      {description != null ? <Text id={descriptionId} variant="sm">{description}</Text> : null}
      <div className="mx-markdown-editor-surface">
        <div className="mx-markdown-editor-topbar">
          <MarkdownToolbar disabled={!editable} hidden={preview} canUndo={history.index > 0} canRedo={history.index < history.entries.length - 1} onCommand={command} />
          <div className="mx-markdown-editor-actions">
            <div role="group" aria-label="Editor view" className="mx-markdown-editor-actions mx-markdown-view-switch">
              <Button size="sm" variant={preview ? "ghost" : "secondary"} className="mx-markdown-view-button" aria-pressed={!preview} aria-controls={inputId} onClick={() => setPreview(false)}>Write</Button>
              <Button size="sm" variant={preview ? "secondary" : "ghost"} className="mx-markdown-view-button" aria-pressed={preview} aria-controls={previewId} onClick={() => setPreview(true)}>Preview</Button>
            </div>
            {downloadFileName !== false ? <Button size="sm" variant="secondary" aria-label="Download Markdown" disabled={disabled} onClick={() => downloadMarkdown(content, downloadFileName)}>Download</Button> : null}
            {onSave ? <Button size="sm" disabled={!editable || status === "saving"} aria-busy={status === "saving"} onClick={() => void save()}>{status === "saving" ? "Saving…" : saveLabel}</Button> : null}
          </div>
        </div>
        <textarea
          {...textareaProps}
          ref={textarea}
          id={inputId}
          name={name}
          value={content}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          hidden={preview}
          className={["mx-markdown-editor-input", textareaProps?.className].filter(Boolean).join(" ")}
          aria-describedby={[description != null ? descriptionId : undefined, hintId, textareaProps?.["aria-describedby"]].filter(Boolean).join(" ")}
          onChange={(event) => update({ value: event.currentTarget.value, start: event.currentTarget.selectionStart, end: event.currentTarget.selectionEnd }, false)}
          onKeyDown={(event) => {
            textareaProps?.onKeyDown?.(event);
            if (event.defaultPrevented || event.nativeEvent.isComposing || event.altKey || (!event.ctrlKey && !event.metaKey)) return;
            const key = event.key.toLowerCase();
            if (key === "s" && onSave) { event.preventDefault(); void save(); }
            else if (editable && ["b", "i", "k", "z", "y"].includes(key)) {
              event.preventDefault();
              command(key === "b" ? "bold" : key === "i" ? "italic" : key === "k" ? "link" : key === "y" || event.shiftKey ? "redo" : "undo");
            }
          }}
        />
        <div id={previewId} role="region" aria-label="Markdown preview" hidden={!preview} className="mx-markdown-editor-preview">
          {preview ? content ? <Markdown>{content}</Markdown> : <Text>Nothing to preview yet.</Text> : null}
        </div>
      </div>
      <Text id={hintId} variant="sm" className="mx-markdown-editor-hint">Use the toolbar or Ctrl/⌘ + B, I, or K to format. Ctrl/⌘ + Z undoes changes.</Text>
      <Text role={status === "error" ? "alert" : "status"} variant="sm">{statusMessage}</Text>
    </div>
  );
}
