export type MarkdownCommand = "bold" | "italic" | "strike" | "heading" | "quote" | "bullet-list" | "ordered-list" | "task-list" | "link" | "image" | "inline-code" | "code-block" | "table" | "rule";

export interface MarkdownSelection {
  value: string;
  start: number;
  end: number;
}

function replace(value: string, start: number, end: number, text: string, selectStart = 0, selectEnd = text.length): MarkdownSelection {
  return { value: value.slice(0, start) + text + value.slice(end), start: start + selectStart, end: start + selectEnd };
}

function wrap(value: string, start: number, end: number, marker: string, placeholder: string): MarkdownSelection {
  const selection = value.slice(start, end);
  if (selection.length >= marker.length * 2 && selection.startsWith(marker) && selection.endsWith(marker)) {
    return replace(value, start, end, selection.slice(marker.length, -marker.length));
  }
  if (start >= marker.length && value.slice(start - marker.length, start) === marker && value.slice(end, end + marker.length) === marker) {
    return replace(value, start - marker.length, end + marker.length, selection);
  }
  const text = selection || placeholder;
  return replace(value, start, end, `${marker}${text}${marker}`, marker.length, marker.length + text.length);
}

function block(value: string, start: number, end: number, text: string): MarkdownSelection {
  const before = value.slice(0, start);
  const after = value.slice(end);
  const prefix = !before || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
  const suffix = !after || after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";
  return replace(value, start, end, `${prefix}${text}${suffix}`, prefix.length, prefix.length + text.length);
}

export function formatMarkdown(value: string, start: number, end: number, command: MarkdownCommand): MarkdownSelection {
  if (command === "bold") return wrap(value, start, end, "**", "bold text");
  if (command === "italic") return wrap(value, start, end, "_", "italic text");
  if (command === "strike") return wrap(value, start, end, "~~", "strikethrough text");
  if (command === "inline-code") {
    const selection = value.slice(start, end);
    const existing = selection.match(/^`+/)?.[0];
    if (existing && selection.endsWith(existing) && selection.length > existing.length * 2) {
      return wrap(value, start, end, existing, "code");
    }
    const longest = Math.max(0, ...(selection.match(/`+/g) ?? []).map((run) => run.length));
    return wrap(value, start, end, "`".repeat(longest + 1), "code");
  }
  if (command === "link" || command === "image") {
    const image = command === "image";
    const label = (value.slice(start, end) || (image ? "Image description" : "link text")).replace(/([\[\]])/g, "\\$1");
    const url = image ? "https://example.com/image.jpg" : "https://example.com";
    const prefix = `${image ? "!" : ""}[${label}](`;
    return replace(value, start, end, `${prefix}${url})`, prefix.length, prefix.length + url.length);
  }
  if (command === "code-block") {
    const text = value.slice(start, end) || "code goes here";
    const fence = "`".repeat(Math.max(3, ...(text.match(/`+/g) ?? []).map((run) => run.length + 1)));
    const result = block(value, start, end, `${fence}\n${text}\n${fence}`);
    return { ...result, start: result.start + fence.length + 1, end: result.end - fence.length - 1 };
  }
  if (command === "table") return block(value, start, end, "| Heading | Heading |\n| --- | --- |\n| Content | Content |");
  if (command === "rule") {
    const result = block(value, start, end, "---\n\n");
    return { ...result, start: result.end };
  }

  const lineStart = start === 0 ? 0 : value.lastIndexOf("\n", start - 1) + 1;
  const lastSelected = end > start && value[end - 1] === "\n" ? end - 1 : end;
  const nextBreak = value.indexOf("\n", lastSelected);
  const lineEnd = nextBreak === -1 ? value.length : nextBreak;
  const lines = value.slice(lineStart, lineEnd).split("\n");
  const patterns = {
    heading: /^##\s+/,
    quote: /^>\s?/,
    "bullet-list": /^[-+*]\s+(?!\[[ xX]\]\s)/,
    "ordered-list": /^\d+\.\s+/,
    "task-list": /^[-+*]\s+\[[ xX]\]\s+/
  };
  const pattern = patterns[command];
  const remove = lines.every((line) => pattern.test(line.trimStart()));
  const updated = lines.map((line, index) => {
    const indent = line.match(/^\s*/)?.[0] ?? "";
    const text = line.slice(indent.length);
    if (remove) return indent + text.replace(pattern, "");
    const cleaned = command === "heading" ? text.replace(/^#{1,6}\s+/, "")
      : command === "quote" ? text
      : text.replace(/^(?:[-+*]|\d+\.)\s+(?:\[[ xX]\]\s+)?/, "");
    const prefix = command === "heading" ? "## " : command === "quote" ? "> "
      : command === "ordered-list" ? `${index + 1}. ` : command === "task-list" ? "- [ ] " : "- ";
    return `${indent}${prefix}${cleaned || (command === "heading" ? "Heading" : "Item")}`;
  }).join("\n");
  return replace(value, lineStart, lineEnd, updated);
}
