import { fireEvent, render, screen } from "@testing-library/react";
import { Markdown } from "./Markdown";

it("renders headings, lists, tables, tasks, and themed links", () => {
  render(<Markdown>{"# Hello\n\n**Bold** and _italic_\n\n- [x] Done\n\n| One | Two |\n| --- | --- |\n| A | B |\n\n[Details](https://example.com)"}</Markdown>);
  expect(screen.getByRole("heading", { name: "Hello" })).toBeInTheDocument();
  expect(screen.getByText("Bold").tagName).toBe("STRONG");
  expect(screen.getByRole("table")).toHaveTextContent("OneTwoAB");
  expect(screen.getByRole("checkbox")).toBeChecked();
  expect(screen.getByRole("link", { name: "Details" })).toHaveClass("mx-link");
});

it("does not execute raw HTML or unsafe link URLs", () => {
  const { container } = render(<Markdown>{'<script>alert("bad")</script>\n\n<img src=x onerror=alert(1)>\n\n[Unsafe](javascript:alert%281%29)'}</Markdown>);
  expect(container.querySelector("script")).toBeNull();
  expect(container.querySelector("img")).toBeNull();
  expect(screen.getByText("Unsafe").closest("a")).not.toHaveAttribute("href", expect.stringContaining("javascript:"));
});

it("uses the library image fallback for failed Markdown images", () => {
  render(<Markdown>{"![Mountain view](https://example.com/mountain.jpg)"}</Markdown>);
  fireEvent.error(screen.getByRole("img", { name: "Mountain view" }));
  expect(screen.getByRole("img", { name: "Mountain view" })).toHaveTextContent("M");
});
