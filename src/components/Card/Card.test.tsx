import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(
      <Card>
        <span>Card content</span>
      </Card>
    );

    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("accepts class prop", () => {
    render(
      <Card class="custom-card" data-testid="card">
        Content
      </Card>
    );

    expect(screen.getByTestId("card")).toHaveClass("mx-card");
    expect(screen.getByTestId("card")).toHaveClass("custom-card");
  });

  it("keeps the legacy outline appearance transparent and flat", () => {
    render(
      <Card appearance="outline" data-testid="card-outline">
        Outline
      </Card>
    );

    expect(screen.getByTestId("card-outline")).toHaveStyle("background-color: rgba(0, 0, 0, 0)");
    expect(screen.getByTestId("card-outline")).toHaveStyle("border: none");
    expect(screen.getByTestId("card-outline")).toHaveStyle("box-shadow: none");
  });

  it("supports none appearance", () => {
    render(
      <Card appearance="none" data-testid="card-none">
        None
      </Card>
    );

    expect(screen.getByTestId("card-none")).toHaveStyle("background-color: rgba(0, 0, 0, 0)");
    expect(screen.getByTestId("card-none")).toHaveStyle("border: none");
  });
});
