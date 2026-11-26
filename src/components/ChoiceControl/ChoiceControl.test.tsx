import { createRef, useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Checkbox } from "../Checkbox/Checkbox";
import { Radio } from "../Radio/Radio";

describe.each([
  { Component: Checkbox, role: "checkbox" },
  { Component: Radio, role: "radio" }
] as const)("$role", ({ Component, role }) => {
  it("associates its visible label and description with the native input", () => {
    render(<><Component label="Receive updates" aria-describedby="hint" /><p id="hint">Sent weekly.</p></>);
    const input = screen.getByRole(role, { name: "Receive updates" });
    expect(screen.getByLabelText("Receive updates")).toBe(input);
    expect(input).toHaveAccessibleDescription("Sent weekly.");
    fireEvent.click(screen.getByText("Receive updates"));
    expect(input).toBeChecked();
  });

  it("supports controlled selection", () => {
    function Example() {
      const [checked, setChecked] = useState(false);
      return <Component label="Updates" checked={checked} onChange={(event) => setChecked(event.target.checked)} />;
    }
    render(<Example />);
    fireEvent.click(screen.getByRole(role));
    expect(screen.getByRole(role)).toBeChecked();
  });

  it("supports programmatic focus and preserves focus callbacks", () => {
    const ref = createRef<HTMLInputElement>();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(<Component ref={ref} label="Updates" onFocus={onFocus} onBlur={onBlur} />);
    act(() => ref.current?.focus());
    expect(ref.current).toHaveFocus();
    const focusRing = ref.current?.parentElement;
    expect(focusRing).toHaveStyle("outline: 2px solid var(--mx-color-text, #1d3558)");
    expect(onFocus).toHaveBeenCalledOnce();
    act(() => ref.current?.blur());
    expect(focusRing).toHaveStyle("outline: none");
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it("keeps disabled controls out of focus and selection", () => {
    const onChange = vi.fn();
    render(<Component label="Unavailable" disabled onChange={onChange} />);
    const input = screen.getByRole(role) as HTMLInputElement;
    input.focus();
    fireEvent.click(screen.getByText("Unavailable"));
    expect(input).toBeDisabled();
    expect(input).not.toHaveFocus();
    expect(input).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("preserves native form submission and required validation", () => {
    render(<form aria-label="Preferences"><Component label="Updates" name="updates" value="weekly" required /></form>);
    const form = screen.getByRole("form") as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    fireEvent.click(screen.getByRole(role));
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get("updates")).toBe("weekly");
  });
});

it("groups radio options by name and allows only one selection", () => {
  render(<fieldset><legend>Density</legend><Radio name="density" value="compact" label="Compact" defaultChecked /><Radio name="density" value="comfortable" label="Comfortable" /></fieldset>);
  expect(screen.getByRole("group", { name: "Density" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("radio", { name: "Comfortable" }));
  expect(screen.getByRole("radio", { name: "Compact" })).not.toBeChecked();
  expect(screen.getByRole("radio", { name: "Comfortable" })).toBeChecked();
});
