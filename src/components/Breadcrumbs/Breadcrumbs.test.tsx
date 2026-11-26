import { createRef } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Link as RouterLink, MemoryRouter, useLocation } from "react-router-dom";
import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  const items = [{ label: "Home", href: "/" }, { label: "Library", href: "/library" }, { label: "Dashboard", href: "/library/dashboard" }];

  it("renders an ordered navigation trail with only the current page marked", () => {
    const { container } = render(<Breadcrumbs items={items} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(nav).getByRole("list").tagName).toBe("OL");
    expect(within(nav).getAllByRole("listitem")).toHaveLength(3);
    expect(within(nav).getAllByRole("link")).toHaveLength(2);
    expect(within(nav).getByText("Dashboard")).toHaveAttribute("aria-current", "page");
    expect(within(nav).queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
    expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    expect(container.querySelector(".mx-breadcrumbs-connectors")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".mx-breadcrumbs-separator")).toBeNull();
    expect(container.querySelectorAll("[style]")).toHaveLength(0);
    const home = screen.getByRole("link", { name: "Home" });
    home.focus();
    expect(home).toHaveFocus();
  });

  it("supports router links without nested anchors and retains theme styling", () => {
    function Location() { return <div data-testid="path">{useLocation().pathname}</div>; }
    const { container } = render(
      <MemoryRouter initialEntries={["/library/dashboard"]}>
        <Breadcrumbs items={items} renderLink={(item) => <RouterLink to={item.href!}>{item.label}</RouterLink>} />
        <Location />
      </MemoryRouter>
    );
    const library = screen.getByRole("link", { name: "Library" });
    expect(library).toHaveClass("mx-link");
    expect(container.querySelector("a a")).toBeNull();
    fireEvent.click(library);
    expect(screen.getByTestId("path")).toHaveTextContent("/library");
  });

  it("supports native attributes, custom separators, labels, classes, styles, and refs", () => {
    const ref = createRef<HTMLElement>();
    render(<Breadcrumbs items={items} ref={ref} aria-label="Page path" separator=">" class="custom" sx={{ margin: "1rem" }} style={{ margin: "2rem" }} />);
    const nav = screen.getByRole("navigation", { name: "Page path" });
    expect(ref.current).toBe(nav);
    expect(nav).toHaveClass("mx-breadcrumbs", "custom");
    expect(nav).toHaveStyle({ margin: "2rem" });
    expect(screen.getAllByText(">")).toHaveLength(2);
    expect(nav.querySelector(".mx-breadcrumbs-connectors")).toBeNull();
  });

  it("handles a single current page, unlinked ancestors, and externally labelled navigation", () => {
    const { rerender } = render(<Breadcrumbs items={[{ label: "Dashboard" }]} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("navigation").querySelector(".mx-breadcrumbs-connectors")).toBeNull();
    rerender(<><h2 id="path-title">Page hierarchy</h2><Breadcrumbs aria-labelledby="path-title" items={[{ label: "Library" }, { label: "Dashboard" }]} /></>);
    expect(screen.getByRole("navigation", { name: "Page hierarchy" })).not.toHaveAttribute("aria-label");
    expect(screen.getByText("Library")).not.toHaveAttribute("aria-current");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders nothing for an empty trail", () => {
    const { container } = render(<Breadcrumbs items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
