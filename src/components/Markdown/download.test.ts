import { downloadMarkdown } from "./download";

it("downloads Markdown bytes with a .md filename and releases the object URL", () => {
  vi.useFakeTimers();
  const originalURL = URL;
  const create = vi.fn((_blob: Blob | MediaSource) => "blob:markdown-test");
  const revoke = vi.fn();
  vi.stubGlobal("URL", class extends originalURL {
    static createObjectURL = create;
    static revokeObjectURL = revoke;
  });
  let filename = "";
  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) { filename = this.download; });
  try {
    downloadMarkdown("# Hello\n\n**World**", "my-post");
    expect(filename).toBe("my-post.md");
    expect(click).toHaveBeenCalledOnce();
    const blob = create.mock.calls[0][0] as Blob;
    expect(blob.type).toBe("text/markdown;charset=utf-8");
    expect(blob.size).toBe(18);
    vi.runAllTimers();
    expect(revoke).toHaveBeenCalledWith("blob:markdown-test");
  } finally {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  }
});
