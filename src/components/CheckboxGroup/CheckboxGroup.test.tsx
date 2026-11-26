import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { CheckboxGroup } from "./CheckboxGroup";

const options = [{ label: "Email", value: "email" }, { label: "SMS", value: "sms" }];

describe("CheckboxGroup", () => {
  it("owns the labelled fieldset, description, and checkbox options", () => {
    const { container } = render(<CheckboxGroup legend="Notifications" description="Choose your channels." options={options} />);
    const group = screen.getByRole("group", { name: "Notifications" });
    expect(group.tagName).toBe("FIELDSET");
    expect(group).toHaveAccessibleDescription("Choose your channels.");
    expect(within(group).getAllByRole("checkbox")).toHaveLength(2);
    expect(container.querySelectorAll("[style]")).toHaveLength(0);
  });

  it("adds and removes selections independently in controlled mode", () => {
    const onChange = vi.fn();
    function Example() {
      const [value, setValue] = useState<string[]>([]);
      return <CheckboxGroup legend="Notifications" options={options} value={value} onChange={(next) => { setValue(next); onChange(next); }} />;
    }
    render(<Example />);
    fireEvent.click(screen.getByText("Email"));
    fireEvent.click(screen.getByText("SMS"));
    expect(screen.getByRole("checkbox", { name: "Email" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "SMS" })).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(["email", "sms"]);
    fireEvent.click(screen.getByText("Email"));
    expect(screen.getByRole("checkbox", { name: "Email" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "SMS" })).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(["sms"]);
  });

  it("preserves controlled values missing from the currently rendered options", () => {
    const onChange = vi.fn();
    render(<CheckboxGroup legend="Notifications" options={options} value={["other-channel"]} onChange={onChange} />);
    fireEvent.click(screen.getByText("Email"));
    expect(onChange).toHaveBeenCalledWith(["other-channel", "email"]);
  });

  it("supports uncontrolled selection, external forms, validation, and native reset", () => {
    const onChange = vi.fn();
    render(<><form id="preferences" aria-label="Preferences" /><CheckboxGroup legend="Notifications" name="channels" form="preferences" options={[{ ...options[0], required: true }, options[1]]} defaultValue={["email"]} onChange={onChange} /></>);
    const form = screen.getByRole("form") as HTMLFormElement;
    fireEvent.click(screen.getByText("SMS"));
    expect(onChange).toHaveBeenLastCalledWith(["email", "sms"]);
    expect(new FormData(form).getAll("channels")).toEqual(["email", "sms"]);
    fireEvent.click(screen.getByText("Email"));
    expect(form.checkValidity()).toBe(false);
    form.reset();
    expect(form.checkValidity()).toBe(true);
    expect(screen.getByRole("checkbox", { name: "Email" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "SMS" })).not.toBeChecked();
    expect(new FormData(form).getAll("channels")).toEqual(["email"]);
  });

  it("respects disabled options and a disabled group", () => {
    const onChange = vi.fn();
    const { rerender } = render(<CheckboxGroup legend="Notifications" options={[options[0], { ...options[1], disabled: true }]} onChange={onChange} />);
    fireEvent.click(screen.getByText("SMS"));
    expect(screen.getByRole("checkbox", { name: "SMS" })).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
    rerender(<CheckboxGroup legend="Notifications" options={options} disabled onChange={onChange} />);
    fireEvent.click(screen.getByText("Email"));
    for (const checkbox of screen.getAllByRole("checkbox")) expect(checkbox).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("retains external descriptions alongside its own hint", () => {
    render(<><p id="extra">Saved automatically.</p><CheckboxGroup legend="Notifications" description="Select channels." options={options} aria-describedby="extra" /></>);
    expect(screen.getByRole("group")).toHaveAccessibleDescription("Select channels. Saved automatically.");
  });
});
