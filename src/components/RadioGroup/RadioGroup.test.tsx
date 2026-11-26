import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { RadioGroup } from "./RadioGroup";

const options = [
  { label: "Comfortable", value: "comfortable" },
  { label: "Compact", value: "compact" }
];

describe("RadioGroup", () => {
  it("renders a named fieldset and labelled options from a list", () => {
    const { container } = render(
      <RadioGroup legend="Display density" description="Choose the preview spacing." options={options} />
    );
    const group = screen.getByRole("group", { name: "Display density" });
    expect(group.tagName).toBe("FIELDSET");
    expect(group).toHaveAccessibleDescription("Choose the preview spacing.");
    expect(within(group).getAllByRole("radio")).toHaveLength(2);
    expect(within(group).getByRole("radio", { name: "Comfortable" })).not.toBeChecked();
    expect(within(group).getByRole("radio", { name: "Compact" })).not.toBeChecked();
    expect(container.querySelectorAll("[style]")).toHaveLength(0);
  });

  it("updates controlled selection through onChange(value)", () => {
    const onChange = vi.fn();
    function Example() {
      const [value, setValue] = useState("comfortable");
      return <RadioGroup legend="Density" options={options} value={value} onChange={(next) => { setValue(next); onChange(next); }} />;
    }
    render(<Example />);
    fireEvent.click(screen.getByText("Compact"));
    expect(onChange).toHaveBeenCalledWith("compact");
    expect(screen.getByRole("radio", { name: "Compact" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Comfortable" })).not.toBeChecked();
    fireEvent.click(screen.getByText("Comfortable"));
    expect(screen.getByRole("radio", { name: "Comfortable" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Compact" })).not.toBeChecked();
  });

  it("supports an uncontrolled default, form submission, and native form reset", () => {
    render(<form aria-label="Preferences"><RadioGroup name="density" legend="Density" options={options} defaultValue="comfortable" /></form>);
    const form = screen.getByRole("form") as HTMLFormElement;
    fireEvent.click(screen.getByRole("radio", { name: "Compact" }));
    expect(new FormData(form).get("density")).toBe("compact");
    form.reset();
    expect(screen.getByRole("radio", { name: "Comfortable" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Compact" })).not.toBeChecked();
    expect(new FormData(form).get("density")).toBe("comfortable");
  });

  it("keeps unnamed groups independent", () => {
    render(<><RadioGroup legend="First" options={options} defaultValue="comfortable" /><RadioGroup legend="Second" options={options} defaultValue="comfortable" /></>);
    const first = within(screen.getByRole("group", { name: "First" }));
    const second = within(screen.getByRole("group", { name: "Second" }));
    fireEvent.click(first.getByRole("radio", { name: "Compact" }));
    expect(first.getByRole("radio", { name: "Compact" })).toBeChecked();
    expect(second.getByRole("radio", { name: "Comfortable" })).toBeChecked();
  });

  it("respects disabled options and a disabled group", () => {
    const onChange = vi.fn();
    const { rerender } = render(<RadioGroup legend="Density" options={[options[0], { ...options[1], disabled: true }]} onChange={onChange} />);
    fireEvent.click(screen.getByText("Compact"));
    expect(screen.getByRole("radio", { name: "Compact" })).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
    rerender(<RadioGroup legend="Density" options={options} disabled onChange={onChange} />);
    fireEvent.click(screen.getByText("Comfortable"));
    for (const radio of screen.getAllByRole("radio")) expect(radio).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports required selection and an external form", () => {
    render(<><form id="preferences" aria-label="Preferences" /><RadioGroup form="preferences" name="density" legend="Density" options={options} required /></>);
    const form = screen.getByRole("form") as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    fireEvent.click(screen.getByRole("radio", { name: "Compact" }));
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get("density")).toBe("compact");
  });

  it("preserves external descriptions alongside its own hint", () => {
    render(<><p id="extra-hint">Saved automatically.</p><RadioGroup legend="Density" options={options} description="Choose spacing." aria-describedby="extra-hint" /></>);
    expect(screen.getByRole("group")).toHaveAccessibleDescription("Choose spacing. Saved automatically.");
  });
});
