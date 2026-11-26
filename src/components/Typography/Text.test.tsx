import { render, screen } from "@testing-library/react";
import { Text } from "./Text";

describe("Text", () => {
  it("renders paragraph text by default", () => {
    render(<Text>Body copy</Text>);
    expect(screen.getByText("Body copy")).toBeInTheDocument();
  });

  it("supports style modifiers", () => {
    render(
      <Text i b u color="#123456">
        Styled body copy
      </Text>
    );

    const content = screen.getByText("Styled body copy");
    expect(content).toHaveStyle("font-style: italic");
    expect(content).toHaveStyle("font-weight: 700");
    expect(content).toHaveStyle("text-decoration: underline");
    expect(content).toHaveStyle("color: #123456");
  });
});
