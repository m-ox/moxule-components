import { formatMarkdown } from "./formatting";

describe("Markdown formatting", () => {
  it("wraps selected text and toggles formatting off without losing surrounding text", () => {
    const bold = formatMarkdown("Hello world!", 6, 11, "bold");
    expect(bold).toEqual({ value: "Hello **world**!", start: 8, end: 13 });
    expect(formatMarkdown(bold.value, bold.start, bold.end, "bold").value).toBe("Hello world!");
    expect(formatMarkdown("**hello**", 0, 9, "bold").value).toBe("hello");
  });

  it("inserts a selected placeholder at an empty cursor", () => {
    expect(formatMarkdown("", 0, 0, "italic")).toEqual({ value: "_italic text_", start: 1, end: 12 });
  });

  it("formats complete selected lines without touching the following line", () => {
    const value = "one\ntwo\nthree";
    const result = formatMarkdown(value, 0, 8, "ordered-list");
    expect(result.value).toBe("1. one\n2. two\nthree");
    expect(formatMarkdown(result.value, 0, 13, "ordered-list").value).toBe(value);
  });

  it("switches list types and toggles tasks", () => {
    expect(formatMarkdown("1. one\n2. two", 0, 13, "task-list").value).toBe("- [ ] one\n- [ ] two");
    expect(formatMarkdown("- [x] done", 0, 10, "task-list").value).toBe("done");
    expect(formatMarkdown("- [ ] task", 0, 10, "bullet-list").value).toBe("- task");
  });

  it("changes existing heading levels instead of stacking markers", () => {
    expect(formatMarkdown("# Title", 0, 7, "heading").value).toBe("## Title");
    expect(formatMarkdown("## Title", 0, 8, "heading").value).toBe("Title");
  });

  it("selects the inserted URL so it can be replaced immediately", () => {
    const result = formatMarkdown("Read more", 0, 9, "link");
    expect(result.value).toBe("[Read more](https://example.com)");
    expect(result.value.slice(result.start, result.end)).toBe("https://example.com");
  });

  it("keeps code fences valid when the selected code already contains backticks", () => {
    const result = formatMarkdown("```js\nhello\n```", 0, 15, "code-block");
    expect(result.value.startsWith("````\n")).toBe(true);
    expect(result.value.endsWith("\n````")).toBe(true);
    expect(formatMarkdown("`code`", 0, 6, "inline-code").value).toBe("code");
  });
});
