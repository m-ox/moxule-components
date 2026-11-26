import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { TextInput } from "./TextInput";

it("associates its label, hints, errors, and input ref", () => {
  const ref = createRef<HTMLInputElement>();
  render(<TextInput ref={ref} label="Title" description="Keep it short." error="Title is required." />);
  const input = screen.getByRole("textbox", { name: "Title" });
  expect(input).toHaveAccessibleDescription("Keep it short. Title is required.");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(ref.current).toBe(input);
});

it("supports native editing, forms, and reset", () => {
  render(<form data-testid="form"><TextInput label="Title" name="title" defaultValue="Story" /></form>);
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "New title" } });
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(new FormData(form).get("title")).toBe("New title");
  form.reset();
  expect(input).toHaveValue("Story");
});
