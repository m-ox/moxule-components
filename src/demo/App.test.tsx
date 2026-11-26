import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { Link as RouterLink, MemoryRouter, useLocation } from "react-router-dom";
import { App } from "./App";
import { preferencesStorageKey } from "./preferences";
import { blogMarkdownStorageKey } from "./pages/BlogComponents/sections/MarkdownEditorExample";

beforeEach(() => {
  sessionStorage.removeItem(preferencesStorageKey);
  localStorage.removeItem(blogMarkdownStorageKey);
});

function LocationProbe() {
  const { pathname, search, hash } = useLocation();
  return <div hidden data-testid="location">{pathname}{search}{hash}</div>;
}

function renderApp(initialEntries = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
      <RouterLink to="/missing-page">Missing page</RouterLink>
      <LocationProbe />
    </MemoryRouter>
  );
}

it("lets Image handle the toolbar logo fallback", () => {
  renderApp();
  fireEvent.error(screen.getByRole("img", { name: "Moxules logo" }));
  const logo = screen.getByRole("img", { name: "Moxules logo" });
  expect(logo.tagName).toBe("SPAN");
  expect(logo).toHaveClass("mx-image-fallback", "mx-demo-logo");
  expect(logo).toHaveTextContent("M");
});

it("shows an independent toggle example and a reusable navbar theme toggle", () => {
  const { container } = renderApp();
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
  const { container } = renderApp();
  expect(container.querySelectorAll("[style]")).toHaveLength(0);
  expect(container.querySelectorAll("section")).toHaveLength(5);
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

it("renders Dashboard as home and supplies breadcrumbs above the page", () => {
  renderApp(["/"]);
  expect(screen.getByTestId("location").textContent).toBe("/");
  const main = screen.getByRole("main");
  const breadcrumbs = within(main).getByRole("navigation", { name: "Breadcrumb" });
  expect(within(breadcrumbs).getByText("Dashboard")).toHaveAttribute("aria-current", "page");
  expect(within(breadcrumbs).getAllByRole("listitem")).toHaveLength(1);
  expect(within(breadcrumbs).queryByRole("link")).not.toBeInTheDocument();
  expect(breadcrumbs.querySelector(".mx-breadcrumbs-separator")).toBeNull();
  const title = screen.getByRole("heading", { level: 1, name: "Dashboard" });
  expect(breadcrumbs.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  const header = within(screen.getByRole("banner"));
  expect(header.getAllByRole("link")).toHaveLength(1);
  expect(header.getByRole("link")).toHaveAttribute("href", "/");
  expect(header.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
});

it("places the menu beside the navbar theme toggle and navigates with the left drawer", () => {
  vi.useFakeTimers();
  try {
    renderApp();
    const navbar = within(screen.getByRole("banner"));
    const trigger = navbar.getByRole("button", { name: "Open menu" });
    expect(trigger.parentElement).toBe(navbar.getByRole("switch", { name: "Toggle dark mode" }).parentElement);
    trigger.focus();
    fireEvent.click(trigger);
    const drawer = screen.getByRole("dialog", { name: "Menu" });
    expect(drawer).toHaveAttribute("data-mx-side", "left");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", drawer.id);
    fireEvent.click(within(drawer).getByRole("link", { name: "Components" }));
    act(() => vi.advanceTimersByTime(240));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("location").textContent).toBe("/#general-components");
    expect(trigger).toHaveFocus();
  } finally {
    vi.useRealTimers();
  }
});

it("places the notification clicker after Toggle and sends colored nudges to a corner", () => {
  renderApp();
  const toggle = screen.getByRole("article", { name: "Toggle" });
  const card = screen.getByRole("article", { name: "Notifications" });
  expect(toggle.nextElementSibling).toBe(card);
  const controls = within(card);
  fireEvent.click(controls.getByRole("button", { name: "Show nudge" }));
  const viewport = screen.getByRole("region", { name: "Notifications" });
  expect(viewport).toHaveAttribute("data-mx-position", "bottom-right");
  expect(within(viewport).getByRole("status")).toHaveAttribute("data-mx-variant", "success");
  fireEvent.change(controls.getByRole("combobox", { name: "Nudge type" }), { target: { value: "purple" } });
  fireEvent.click(controls.getByRole("button", { name: "Show nudge" }));
  expect(within(viewport).getByText("A little purple nudge.").closest(".mx-nudge")?.getAttribute("style")).toContain("#5f4a89");
  fireEvent.click(screen.getByRole("switch", { name: "Toggle dark mode" }));
  expect(viewport.closest(".mx-theme")).toHaveAttribute("data-mx-mode", "dark");
  fireEvent.click(screen.getByRole("link", { name: "Missing page" }));
  expect(within(viewport).getByText("A little purple nudge.")).toBeInTheDocument();
});

it("places the Modal card after Drawer and opens a working confirmation", () => {
  vi.useFakeTimers();
  try {
    renderApp();
    const drawer = screen.getByRole("article", { name: "Drawer" });
    const card = screen.getByRole("article", { name: "Modal" });
    expect(drawer.nextElementSibling).toBe(card);
    const trigger = within(card).getByRole("button", { name: "Open modal" });
    trigger.focus();
    fireEvent.click(trigger);
    const modal = screen.getByRole("dialog", { name: "A little moment" });
    fireEvent.click(within(modal).getByRole("button", { name: "Continue" }));
    act(() => vi.advanceTimersByTime(240));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  } finally {
    vi.useRealTimers();
  }
});

it("updates route breadcrumbs and preserves shared preferences when leaving Dashboard", () => {
  const { container } = renderApp();
  fireEvent.change(screen.getByRole("combobox", { name: "Theme selector" }), { target: { value: "pink" } });
  fireEvent.click(screen.getByRole("button", { name: "Use clear" }));
  fireEvent.change(screen.getByRole("combobox", { name: "Size" }), { target: { value: "large" } });
  fireEvent.click(screen.getByRole("radio", { name: "Compact" }));
  fireEvent.click(screen.getByRole("switch", { name: "Toggle dark mode" }));
  fireEvent.click(screen.getByRole("link", { name: "Missing page" }));
  expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  const breadcrumbs = within(screen.getByRole("navigation", { name: "Breadcrumb" }));
  expect(breadcrumbs.getByText("Page not found")).toHaveAttribute("aria-current", "page");
  expect(screen.queryByRole("heading", { name: "General Components" })).not.toBeInTheDocument();
  fireEvent.click(within(screen.getByRole("banner")).getByRole("link"));
  expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();
  const theme = container.querySelector(".mx-demo");
  expect(theme).toHaveAttribute("data-mx-theme", "pink");
  expect(theme).toHaveAttribute("data-mx-mode", "dark");
  expect(theme).toHaveAttribute("data-mx-font-style", "clear");
  expect(screen.getByRole("combobox", { name: "Size" })).toHaveValue("large");
  expect(screen.getByRole("radio", { name: "Compact" })).toBeChecked();
});

it("supports home section URLs and routes footer links to real section anchors", () => {
  renderApp(["/#theme-colors"]);
  expect(screen.getByRole("heading", { name: "Theme Color Preview" })).toBeInTheDocument();
  const footer = within(screen.getByRole("contentinfo"));
  fireEvent.click(footer.getByRole("link", { name: "Components" }));
  expect(screen.getByTestId("location").textContent).toBe("/#general-components");
  expect(document.getElementById("general-components")).toHaveAccessibleName("General Components");
});

it("redirects old dashboard URLs home while preserving search and section anchors", () => {
  renderApp(["/dashboard?view=all#theme-colors"]);
  expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();
  expect(screen.getByTestId("location").textContent).toBe("/?view=all#theme-colors");
  expect(within(screen.getByRole("banner")).getByRole("link")).toHaveAttribute("href", "/");
});

it("links the full-width blog feature card to its subpage and shows the breadcrumb hierarchy", () => {
  const { container } = renderApp();
  const section = screen.getByRole("region", { name: "Blog features" });
  expect(within(section).getAllByRole("article")).toHaveLength(1);
  expect(within(section).getByRole("heading", { name: "Want to see blog features? Check out the blog components!" })).toBeInTheDocument();
  const general = screen.getByRole("region", { name: "General Components" });
  expect(general.nextElementSibling).toBe(section);
  fireEvent.change(screen.getByRole("combobox", { name: "Theme selector" }), { target: { value: "pink" } });
  fireEvent.click(screen.getByRole("switch", { name: "Toggle dark mode" }));
  fireEvent.click(within(section).getByRole("button", { name: "View blog components" }));
  expect(screen.getByTestId("location").textContent).toBe("/blog-components");
  expect(screen.getByRole("heading", { level: 1, name: "Blog Components" })).toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "General Components" })).not.toBeInTheDocument();
  expect(container.querySelector(".mx-demo")).toHaveAttribute("data-mx-theme", "pink");
  expect(container.querySelector(".mx-demo")).toHaveAttribute("data-mx-mode", "dark");
  const breadcrumbs = within(screen.getByRole("navigation", { name: "Breadcrumb" }));
  const steps = breadcrumbs.getAllByRole("listitem");
  expect(steps).toHaveLength(2);
  expect(within(steps[0]).getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/");
  expect(within(steps[1]).getByText("Blog Components")).toHaveAttribute("aria-current", "page");
});

it("opens Blog Components directly and returns home through its parent breadcrumb", () => {
  renderApp(["/blog-components"]);
  expect(screen.getByRole("heading", { level: 1, name: "Blog Components" })).toBeInTheDocument();
  const breadcrumbs = within(screen.getByRole("navigation", { name: "Breadcrumb" }));
  fireEvent.click(breadcrumbs.getByRole("link", { name: "Dashboard" }));
  expect(screen.getByTestId("location").textContent).toBe("/");
  expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();
  expect(within(screen.getByRole("navigation", { name: "Breadcrumb" })).getAllByRole("listitem")).toHaveLength(1);
});

it("shows the Markdown editor on Blog Components and reloads a saved post", async () => {
  const first = renderApp(["/blog-components"]);
  expect(screen.getByRole("heading", { name: "Markdown Editor" })).toBeInTheDocument();
  const markdown = "# My saved post\n\n**A small story.**";
  fireEvent.change(screen.getByRole("textbox", { name: "Post content" }), { target: { value: markdown } });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(await screen.findByText("Saved.")).toBeInTheDocument();
  expect(localStorage.getItem(blogMarkdownStorageKey)).toBe(markdown);
  first.unmount();
  renderApp(["/blog-components"]);
  expect(screen.getByRole("textbox", { name: "Post content" })).toHaveValue(markdown);
  fireEvent.click(screen.getByRole("button", { name: "Preview" }));
  expect(within(screen.getByRole("region", { name: "Markdown preview" })).getByRole("heading", { name: "My saved post" })).toBeInTheDocument();
});

it("opens simple Preferences from the menu and keeps choices for the browser session", () => {
  const first = renderApp();
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  fireEvent.click(within(screen.getByRole("dialog", { name: "Menu" })).getByRole("link", { name: "Preferences" }));
  expect(screen.getByTestId("location").textContent).toBe("/preferences");
  expect(screen.getByRole("heading", { level: 1, name: "Preferences" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Theme Color Preview" })).not.toBeInTheDocument();
  const settings = within(screen.getByRole("article", { name: "Appearance preferences" }));
  fireEvent.change(settings.getByRole("combobox", { name: "Font style" }), { target: { value: "clear" } });
  fireEvent.change(settings.getByRole("combobox", { name: "Theme color" }), { target: { value: "pink" } });
  fireEvent.change(settings.getByRole("combobox", { name: "Text size" }), { target: { value: "large" } });
  fireEvent.click(settings.getByRole("switch", { name: "Dark mode" }));
  const stored = JSON.parse(sessionStorage.getItem(preferencesStorageKey)!);
  expect(stored).toMatchObject({ theme: "pink", fontStyle: "clear", size: "large", mode: "dark" });
  first.unmount();
  const second = renderApp(["/preferences"]);
  expect(screen.getByRole("combobox", { name: "Font style" })).toHaveValue("clear");
  expect(screen.getByRole("combobox", { name: "Theme color" })).toHaveValue("pink");
  expect(screen.getByRole("combobox", { name: "Text size" })).toHaveValue("large");
  expect(screen.getByRole("switch", { name: "Dark mode" })).toHaveAttribute("aria-checked", "true");
  expect(second.container.querySelector(".mx-demo")).toHaveAttribute("data-mx-mode", "dark");
  const breadcrumbs = within(screen.getByRole("navigation", { name: "Breadcrumb" }));
  expect(breadcrumbs.getByText("Preferences")).toHaveAttribute("aria-current", "page");
  fireEvent.click(breadcrumbs.getByRole("link", { name: "Dashboard" }));
  expect(screen.getByRole("combobox", { name: "Theme selector" })).toHaveValue("pink");
});
