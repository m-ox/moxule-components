import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Link as RouterLink, useLocation } from "react-router-dom";
import { Sitemap } from "./Sitemap";

const items = [{ label: "Dashboard", href: "/", children: [{ label: "Fonts", href: "/fonts" }, { label: "Themes", href: "/themes" }] }];

it("renders all pages as links, nests children, and marks the exact current path", () => {
  render(<Sitemap items={items} currentPath="/themes?mode=dark" />);
  const nav = screen.getByRole("navigation", { name: "Sitemap" });
  expect(within(nav).getAllByRole("link")).toHaveLength(3);
  expect(within(nav).getAllByRole("list")).toHaveLength(2);
  expect(screen.getByRole("link", { name: "Themes" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute("aria-current");
});

it("supports router links without nested anchors", () => {
  function Location() { return <div data-testid="location">{useLocation().pathname}</div>; }
  const { container } = render(<MemoryRouter><Sitemap items={items} renderLink={(item) => <RouterLink to={item.href}>{item.label}</RouterLink>} /><Location /></MemoryRouter>);
  fireEvent.click(screen.getByRole("link", { name: "Fonts" }));
  expect(screen.getByTestId("location")).toHaveTextContent("/fonts");
  expect(container.querySelector("a a")).toBeNull();
});
