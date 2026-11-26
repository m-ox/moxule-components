export type SizeScale = "xs" | "sm" | "md" | "lg" | "xl";

export const spacingScale: Record<SizeScale, string> = {
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem"
};

export const contentWidthScale: Record<SizeScale, string> = {
  xs: "40rem",
  sm: "48rem",
  md: "64rem",
  lg: "80rem",
  xl: "90rem"
};
