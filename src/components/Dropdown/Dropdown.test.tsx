import { fireEvent, render, screen } from "@testing-library/react";
import { Dropdown } from "./Dropdown";

describe("Dropdown", () => {
  const options = [
    { label: "Primary", value: "primary" },
    { label: "Blue", value: "blue" }
  ];

  it("renders options", () => {
    render(<Dropdown options={options} value="primary" onChange={() => undefined} aria-label="Theme" />);

    expect(screen.getByRole("option", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Blue" })).toBeInTheDocument();
  });

  it("calls onChange with selected value", () => {
    const onChange = vi.fn();
    render(<Dropdown options={options} value="primary" onChange={onChange} aria-label="Theme" />);

    fireEvent.change(screen.getByRole("combobox", { name: "Theme" }), {
      target: { value: "blue" }
    });

    expect(onChange).toHaveBeenCalledWith("blue");
  });

  it("applies themed background styling", () => {
    render(<Dropdown options={options} value="primary" onChange={() => undefined} aria-label="Theme" />);

    expect(screen.getByRole("combobox", { name: "Theme" })).toHaveStyle(
      "background-color: var(--mx-color-surface, #ffffff)"
    );
  });

  it("applies standardized focus ring", () => {
    render(<Dropdown options={options} value="primary" onChange={() => undefined} aria-label="Theme" />);

    const dropdown = screen.getByRole("combobox", { name: "Theme" });
    fireEvent.focus(dropdown);

    expect(dropdown).toHaveStyle("outline: 2px solid var(--mx-button-primary-bg, #1f5ed8)");
    expect(dropdown).toHaveStyle("box-shadow: 0 0 0 4px rgba(31, 94, 216, 0.28)");
  });
});
