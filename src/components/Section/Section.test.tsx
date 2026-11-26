import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import { Section } from "./Section";

describe("Section", () => {
  it("owns the heading, description, and content with accessible associations", () => {
    const { container } = render(<Section title="Preferences" description="Configure your account."><button>Save preferences</button></Section>);
    const section = screen.getByRole("region", { name: "Preferences" });
    expect(section.tagName).toBe("SECTION");
    expect(within(section).getByRole("heading", { level: 2, name: "Preferences" })).toBeInTheDocument();
    expect(section).toHaveAccessibleDescription("Configure your account.");
    expect(within(section).getByRole("button", { name: "Save preferences" })).toBeInTheDocument();
    expect(container.querySelectorAll("[style]")).toHaveLength(0);
  });

  it("supports a heading level, rich title, and explicit typography props", () => {
    render(<Section title={<>Advanced <em>options</em></>} description="Optional settings." headingLevel="h3" headingProps={{ id: "advanced-title", className: "custom-heading" }} descriptionProps={{ variant: "sm", id: "advanced-description" }} />);
    const section = screen.getByRole("region", { name: "Advanced options" });
    expect(screen.getByRole("heading", { level: 3 })).toHaveAttribute("id", "advanced-title");
    expect(screen.getByRole("heading")).toHaveClass("mx-header", "custom-heading");
    expect(section).toHaveAttribute("aria-labelledby", "advanced-title");
    expect(section).toHaveAttribute("aria-describedby", "advanced-description");
    expect(screen.getByText("Optional settings.")).toHaveClass("mx-text-sm");
  });

  it("generates unique associations for multiple sections", () => {
    render(<><Section title="First" description="First description." /><Section title="Second" description="Second description." /></>);
    const first = screen.getByRole("region", { name: "First" });
    const second = screen.getByRole("region", { name: "Second" });
    expect(first.getAttribute("aria-labelledby")).not.toBe(second.getAttribute("aria-labelledby"));
    expect(first.getAttribute("aria-describedby")).not.toBe(second.getAttribute("aria-describedby"));
    expect(first).toHaveAccessibleDescription("First description.");
    expect(second).toHaveAccessibleDescription("Second description.");
  });

  it("leaves no empty headings or dangling associations when only children are supplied", () => {
    const { container } = render(<Section><p>Custom content</p></Section>);
    const section = container.querySelector("section")!;
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(section).not.toHaveAttribute("aria-labelledby");
    expect(section).not.toHaveAttribute("aria-describedby");
    expect(screen.getByText("Custom content")).toBeInTheDocument();
  });

  it("preserves explicit accessible labels and additional descriptions", () => {
    render(<><p id="extra">Saved automatically.</p><Section title="Visible title" description="Choose settings." aria-label="Account settings" aria-describedby="extra" /></>);
    const section = screen.getByRole("region", { name: "Account settings" });
    expect(section).not.toHaveAttribute("aria-labelledby");
    expect(section).toHaveAccessibleDescription("Choose settings. Saved automatically.");
  });

  it("forwards the section ref and retains class and style overrides", () => {
    const ref = createRef<HTMLElement>();
    render(<Section ref={ref} id="preferences" title="Preferences" class="custom" className="user" sx={{ gap: "2rem" }} style={{ gap: "1rem" }} />);
    const section = screen.getByRole("region");
    expect(ref.current).toBe(section);
    expect(section).toHaveAttribute("id", "preferences");
    expect(section).toHaveClass("mx-section", "custom", "user");
    expect(section).toHaveStyle("gap: 1rem");
  });
});
