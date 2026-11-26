import { render, screen } from "@testing-library/react";
import { PageShell } from "./PageShell";

describe("PageShell", () => {
  it("renders children", () => {
    render(
      <PageShell>
        <main>Content</main>
      </PageShell>
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies footer offset spacing", () => {
    render(
      <PageShell footerOffset="lg" data-testid="shell">
        <main>Content</main>
      </PageShell>
    );

    expect(screen.getByTestId("shell")).toHaveStyle("padding-bottom: 1.5rem");
  });
});
