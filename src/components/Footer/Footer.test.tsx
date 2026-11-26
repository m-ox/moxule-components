import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("centers wrapped content when layout is centered", () => {
    render(
      <Footer layout="centered" data-testid="footer">
        <a href="#about">About</a>
        <a href="#pricing">Pricing</a>
      </Footer>
    );

    const footer = screen.getByTestId("footer");
    expect(footer).toHaveAttribute("data-mx-footer-layout", "centered");
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pricing" })).toBeInTheDocument();
  });

  it("splits wrapped content evenly when layout is split", () => {
    render(
      <Footer layout="split" data-testid="footer">
        <span>One</span>
        <span>Two</span>
        <span>Three</span>
      </Footer>
    );

    const footer = screen.getByTestId("footer");
    expect(footer).toHaveAttribute("data-mx-footer-layout", "split");
    expect(footer.querySelectorAll(".mx-footer-item")).toHaveLength(3);
  });

  it("supports static bottom positioning", () => {
    render(
      <Footer layout="centered" position="static" data-testid="footer">
        <span>Static footer</span>
      </Footer>
    );

    const footer = screen.getByTestId("footer");
    expect(footer).toHaveAttribute("data-mx-footer-position", "static");
    expect(footer).toHaveStyle("position: fixed");
    expect(footer).toHaveStyle("bottom: 0");
  });
});
