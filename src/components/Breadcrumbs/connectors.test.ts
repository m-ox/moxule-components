import { breadcrumbConnectors } from "./connectors";

it("connects ancestors to an upper rail and slopes down to the current page", () => {
  const path = breadcrumbConnectors([
    { x: 10, top: 20, rail: 0, slant: 8 },
    { x: 80, top: 20, rail: 0, slant: 8 },
    { x: 180, top: 20, rail: 0, slant: 8 }
  ]);
  expect(path).toContain("M 10 20 V 5 Q 10 0 15 0 H 167 Q 172 0");
  expect(path).toContain("L 180 20");
  expect(path).toContain("M 80 0 V 20");
});

it("keeps wrapped rows separate and stops connections from crossing labels", () => {
  expect(breadcrumbConnectors([
    { x: 10, top: 20, rail: 0, slant: 8 },
    { x: 80, top: 20, rail: 0, slant: 8 },
    { x: 10, top: 60, rail: 40, slant: 8 }
  ])).toBe("M 10 20 V 5 Q 10 0 15 0 H 75 Q 80 0 80 5 V 20 M 2 40 L 10 60");
});

it("leaves single-page trails unconnected", () => {
  expect(breadcrumbConnectors([])).toBe("");
  expect(breadcrumbConnectors([{ x: 10, top: 20, rail: 0, slant: 8 }])).toBe("");
});
