import type { CSSProperties } from "react";

const FOCUS_OUTLINE = "2px solid var(--mx-button-primary-bg, #1f5ed8)";
const FOCUS_GLOW = "0 0 0 4px rgba(31, 94, 216, 0.28)";

export function getFocusRingStyles(isFocusVisible: boolean): CSSProperties {
  if (!isFocusVisible) {
    return {
      outline: "none",
      boxShadow: "none"
    };
  }

  return {
    outline: FOCUS_OUTLINE,
    outlineOffset: "2px",
    boxShadow: FOCUS_GLOW
  };
}
