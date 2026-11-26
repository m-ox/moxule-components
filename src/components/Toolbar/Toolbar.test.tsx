import { render, screen } from "@testing-library/react";
import { Toolbar } from "./Toolbar";

describe("Toolbar", () => {
  it("renders left and right items", () => {
    render(
      <Toolbar left={<span>My Logo</span>} right={<button type="button">Log out</button>} />
    );

    expect(screen.getByText("My Logo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });

  it("supports multiple wrapped right-side components", () => {
    render(
      <Toolbar logo={<span>Brand</span>}>
        <button type="button">Notifications</button>
        <button type="button">User menu</button>
      </Toolbar>
    );

    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "User menu" })).toBeInTheDocument();
  });

  it("supports left-only usage", () => {
    render(<Toolbar left={<span>Only left</span>} />);
    expect(screen.getByText("Only left")).toBeInTheDocument();
  });

  it("is sticky by default", () => {
    render(<Toolbar left={<span>Sticky</span>} data-testid="toolbar" />);

    expect(screen.getByTestId("toolbar")).toHaveStyle("position: sticky");
    expect(screen.getByTestId("toolbar")).toHaveStyle("top: 0");
  });

  it("supports static position", () => {
    render(<Toolbar left={<span>Static</span>} position="static" data-testid="toolbar" />);

    expect(screen.getByTestId("toolbar")).toHaveStyle("position: static");
  });
});