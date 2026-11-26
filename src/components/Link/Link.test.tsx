import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Link as RouterLink, MemoryRouter, NavLink, useLocation } from "react-router-dom";
import { Link } from "./Link";

function Location() {
  const location = useLocation();
  return <output aria-label="Location">{JSON.stringify(location)}</output>;
}

describe("Link", () => {
  it("renders a normal, focusable anchor with native attributes", () => {
    const ref = createRef<HTMLAnchorElement>();
    const { container } = render(<Link href="https://example.com" target="_blank" rel="noreferrer" ref={ref}>Documentation</Link>);
    const link = screen.getByRole("link", { name: "Documentation" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    ref.current?.focus();
    expect(link).toHaveFocus();
    expect(link).toHaveStyle("outline: 2px solid currentColor");
    expect(link).toHaveStyle("border-radius: 3px");
    expect(container.querySelectorAll("[style]")).toHaveLength(0);
  });

  it("wraps a real React Router link without nesting anchors or losing navigation state", () => {
    const outerRef = createRef<HTMLAnchorElement>();
    const childRef = createRef<HTMLAnchorElement>();
    const { container, unmount } = render(
      <MemoryRouter>
        <Link asChild ref={outerRef} className="outer">
          <RouterLink to={{ pathname: "/reports", search: "?view=all", hash: "#summary" }} state={{ from: "demo" }} className="inner" ref={childRef}>Reports</RouterLink>
        </Link>
        <Location />
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: "Reports" });
    expect(container.querySelectorAll("a")).toHaveLength(1);
    expect(link).toHaveClass("mx-link", "outer", "inner");
    expect(link).toHaveAttribute("href", "/reports?view=all#summary");
    expect(outerRef.current).toBe(link);
    expect(childRef.current).toBe(link);
    fireEvent.click(link);
    expect(JSON.parse(screen.getByLabelText("Location").textContent!)).toMatchObject({
      pathname: "/reports", search: "?view=all", hash: "#summary", state: { from: "demo" }
    });
    unmount();
    expect(outerRef.current).toBeNull();
    expect(childRef.current).toBeNull();
  });

  it("preserves NavLink class, style, and children render callbacks", () => {
    render(
      <MemoryRouter initialEntries={["/reports"]}>
        <Link asChild className="outer" sx={{ textDecorationThickness: "2px" }}>
          <NavLink to="/reports" className={({ isActive }) => isActive ? "is-active" : "is-inactive"} style={({ isActive }) => ({ fontWeight: isActive ? 700 : 400 })}>
            {({ isActive }) => isActive ? "Current reports" : "Reports"}
          </NavLink>
        </Link>
        <RouterLink to="/other">Other</RouterLink>
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: "Current reports" });
    expect(link).toHaveClass("mx-link", "outer", "is-active");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveStyle({ fontWeight: "700", textDecorationThickness: "2px" });
    fireEvent.click(screen.getByRole("link", { name: "Other" }));
    expect(screen.getByRole("link", { name: "Reports" })).toBe(link);
    expect(link).toHaveClass("mx-link", "is-inactive");
    expect(link).not.toHaveAttribute("aria-current");
    expect(link).toHaveStyle({ fontWeight: "400", textDecorationThickness: "2px" });
  });

  it("runs child handlers first and allows the outer handler to cancel navigation", () => {
    const calls: string[] = [];
    render(
      <MemoryRouter>
        <Link asChild onClick={(event) => { calls.push("outer"); event.preventDefault(); }}>
          <RouterLink to="/reports" onClick={() => calls.push("child")}>Reports</RouterLink>
        </Link>
        <Location />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("link"));
    expect(calls).toEqual(["child", "outer"]);
    expect(JSON.parse(screen.getByLabelText("Location").textContent!).pathname).toBe("/");
  });

  it("respects a child handler that prevents navigation", () => {
    const onClick = vi.fn();
    render(<MemoryRouter><Link asChild onClick={onClick}><RouterLink to="/reports" onClick={(event) => event.preventDefault()}>Reports</RouterLink></Link><Location /></MemoryRouter>);
    fireEvent.click(screen.getByRole("link"));
    expect(onClick).not.toHaveBeenCalled();
    expect(JSON.parse(screen.getByLabelText("Location").textContent!).pathname).toBe("/");
  });

  it("merges explicit styles with the child's styles taking precedence", () => {
    render(<Link asChild sx={{ padding: "1rem", color: "red" }} style={{ padding: "2rem" }}><a href="#details" style={{ color: "green" }}>Details</a></Link>);
    expect(screen.getByRole("link")).toHaveStyle({ padding: "2rem", color: "#008000" });
  });
});
