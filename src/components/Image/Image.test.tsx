import { render, screen } from "@testing-library/react";
import { Image } from "./Image";

describe("Image", () => {
  it("renders image with alt text", () => {
    render(<Image src="/demo.png" alt="Demo" />);

    expect(screen.getByRole("img", { name: "Demo" })).toBeInTheDocument();
  });

  it("merges class and className", () => {
    render(<Image src="/demo.png" alt="Demo" class="custom" className="user" data-testid="image" />);

    const image = screen.getByTestId("image");
    expect(image).toHaveClass("mx-image");
    expect(image).toHaveClass("custom");
    expect(image).toHaveClass("user");
  });
});
