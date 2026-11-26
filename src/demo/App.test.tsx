import { fireEvent, render, screen, within } from "@testing-library/react";
import { App } from "./App";

it("lets Image handle the toolbar logo fallback", () => {
  render(<App />);
  fireEvent.error(screen.getByRole("img", { name: "Moxules logo" }));
  const logo = screen.getByRole("img", { name: "Moxules logo" });
  expect(logo.tagName).toBe("SPAN");
  expect(logo).toHaveClass("mx-image-fallback", "mx-demo-logo");
  expect(logo).toHaveTextContent("M");
});

it("shows an independent toggle example and a reusable navbar theme toggle", () => {
  const { container } = render(<App />);
  const examples = within(screen.getByRole("article", { name: "Toggle" }));
  const sound = examples.getByRole("switch", { name: "Enable sound" });
  fireEvent.click(examples.getByText("Enable sound"));
  expect(sound).toHaveAttribute("aria-checked", "true");
  expect(container.querySelector('[data-mx-mode="light"]')).toBeInTheDocument();
  expect(examples.getByRole("switch", { name: "Unavailable option" })).toBeDisabled();
  const navbarToggle = within(screen.getByRole("banner")).getByRole("switch", { name: "Toggle dark mode" });
  expect(navbarToggle).toHaveClass("mx-theme-toggle");
  fireEvent.click(navbarToggle);
  expect(container.querySelector('[data-mx-mode="dark"]')).toBeInTheDocument();
  expect(sound).toHaveAttribute("aria-checked", "true");
});

it("places working general controls below the theme previews and preserves selections on theme changes", () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll("[style]")).toHaveLength(0);
  expect(container.querySelectorAll("section")).toHaveLength(4);
  for (const section of container.querySelectorAll("section")) expect(section).toHaveClass("mx-section");
  expect(container.querySelector(".mx-page-shell")).toHaveStyle("padding-bottom: 0px");
  const footerLinks = within(screen.getByRole("contentinfo")).getAllByRole("link");
  expect(footerLinks).toHaveLength(3);
  for (const link of footerLinks) {
    expect(link).toHaveClass("mx-link");
    expect(link).toHaveAttribute("data-mx-color", "inherit");
  }
  const heading = screen.getByRole("heading", { name: "General Components" });
  const themeHeading = screen.getByRole("heading", { name: "Theme Color Preview" });
  expect(themeHeading.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  const section = screen.getByRole("region", { name: "General Components" });
  const controls = within(section);
  const demo = container.querySelector('[data-demo-density]') as HTMLElement;
  const comfortableGap = getComputedStyle(demo).getPropertyValue("--mx-demo-grid-gap");
  const comfortablePadding = getComputedStyle(demo).getPropertyValue("--mx-demo-card-padding");
  const size = controls.getByRole("combobox", { name: "Size" });
  const fontScale = () => Number(getComputedStyle(demo).getPropertyValue("--mx-font-scale"));
  expect(fontScale()).toBe(1);
  fireEvent.change(size, { target: { value: "small" } });
  const smallScale = fontScale();
  expect(smallScale).toBeLessThan(1);
  fireEvent.change(size, { target: { value: "medium" } });
  expect(fontScale()).toBe(1);
  fireEvent.click(controls.getByRole("button", { name: "Try button" }));
  expect(controls.getByRole("status")).toHaveTextContent("Button pressed 1 time.");
  fireEvent.change(controls.getByRole("combobox", { name: "Size" }), { target: { value: "large" } });
  const largeScale = fontScale();
  expect(largeScale).toBeGreaterThan(1);
  expect(largeScale - 1).toBe(1 - smallScale);
  fireEvent.click(controls.getByRole("radio", { name: "Compact" }));
  expect(demo).toHaveAttribute("data-demo-density", "compact");
  expect(getComputedStyle(demo).getPropertyValue("--mx-demo-grid-gap")).not.toBe(comfortableGap);
  expect(getComputedStyle(demo).getPropertyValue("--mx-demo-card-padding")).not.toBe(comfortablePadding);
  fireEvent.click(controls.getByRole("checkbox", { name: "Enable notifications" }));
  fireEvent.change(screen.getByRole("combobox", { name: "Theme selector" }), { target: { value: "pink" } });
  fireEvent.click(screen.getByRole("switch", { name: "Toggle dark mode" }));
  expect(container.querySelector('[data-mx-theme="pink"][data-mx-mode="dark"]')).toBeInTheDocument();
  expect(controls.getByRole("combobox", { name: "Size" })).toHaveValue("large");
  expect(fontScale()).toBe(largeScale);
  expect(controls.getByRole("radio", { name: "Compact" })).toBeChecked();
  expect(controls.getByRole("radio", { name: "Comfortable" })).not.toBeChecked();
  expect(controls.getByRole("checkbox", { name: "Enable notifications" })).toBeChecked();
  fireEvent.click(controls.getByText("Comfortable"));
  expect(demo).toHaveAttribute("data-demo-density", "comfortable");
  expect(getComputedStyle(demo).getPropertyValue("--mx-demo-grid-gap")).toBe(comfortableGap);
  expect(getComputedStyle(demo).getPropertyValue("--mx-demo-card-padding")).toBe(comfortablePadding);
  expect(controls.getByRole("radio", { name: "Comfortable" })).toBeChecked();
});
