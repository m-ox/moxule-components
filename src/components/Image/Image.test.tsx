import { fireEvent, render, screen } from "@testing-library/react";
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

  it("replaces a failed image with its alt initial and preserves its accessible name", () => {
    const onError = vi.fn();
    render(<Image src="/broken.png" alt="  brand logo" width={32} height="40" loading="lazy" class="custom" data-testid="image" onError={onError} sx={{ borderRadius: "8px" }} />);
    fireEvent.error(screen.getByRole("img"));
    const fallback = screen.getByRole("img", { name: "brand logo" });
    expect(fallback.tagName).toBe("SPAN");
    expect(fallback).toHaveTextContent("B");
    expect(fallback).toHaveClass("mx-image", "mx-image-fallback", "custom");
    expect(fallback).toHaveAttribute("data-testid", "image");
    expect(fallback).toHaveStyle({ "--mx-image-width": "32px", "--mx-image-height": "40px", borderRadius: "8px" });
    expect(fallback).not.toHaveAttribute("src");
    expect(fallback).not.toHaveAttribute("loading");
    expect(onError).toHaveBeenCalledOnce();
    expect(onError.mock.calls[0][0].target.tagName).toBe("IMG");
  });

  it("retries when the resource changes, including a previously failed URL", () => {
    const { rerender } = render(<Image src="/first.png" alt="Logo" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByRole("img").tagName).toBe("SPAN");
    rerender(<Image src="/second.png" alt="Logo" />);
    expect(screen.getByRole("img").tagName).toBe("IMG");
    rerender(<Image src="/first.png" alt="Logo" />);
    expect(screen.getByRole("img").tagName).toBe("IMG");
    fireEvent.error(screen.getByRole("img"));
    rerender(<Image src="/first.png" srcSet="/first-2x.png 2x" alt="Logo" />);
    expect(screen.getByRole("img").tagName).toBe("IMG");
  });

  it("keeps decorative fallbacks hidden from assistive technology", () => {
    const { container } = render(<Image src="/broken.png" alt="" />);
    fireEvent.error(container.querySelector("img")!);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("span")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("span")).toHaveTextContent("");
  });

  it("uses an initial without a source and respects an explicit accessible label", () => {
    const { container } = render(<Image alt="étoile" aria-label="Account avatar" />);
    const fallback = screen.getByRole("img", { name: "Account avatar" });
    expect(fallback).toHaveTextContent("É");
    expect(container.querySelectorAll("[style]")).toHaveLength(0);
  });
});
