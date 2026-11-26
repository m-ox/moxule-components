import type { HTMLAttributes, ReactNode } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import { getThemeTokens, type ThemeName } from "../../theme/theme";

type CardAppearance = "solid" | "outline" | "none";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  color?: ThemeName;
  appearance?: CardAppearance;
  sx?: React.CSSProperties;
  class?: string;
}

const baseStyle: React.CSSProperties = {
  borderRadius: "12px",
  padding: "0.85rem",
  color: "var(--mx-color-text, #0f172a)",
  boxSizing: "border-box",
  transition: "box-shadow 140ms ease, border-color 140ms ease, background-color 140ms ease"
};

const appearanceStyles: Record<CardAppearance, React.CSSProperties> = {
  solid: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--mx-color-border, #cbd5e1)"
  },
  outline: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--mx-color-border, #cbd5e1)",
    backgroundColor: "transparent",
    boxShadow: "none"
  },
  none: {
    border: "none",
    backgroundColor: "transparent",
    boxShadow: "none"
  }
};

export function Card({
  children,
  color,
  appearance = "solid",
  sx,
  class: classProp,
  className,
  style,
  ...props
}: CardProps) {
  const { mode } = useTheme();
  const colorTokens = color ? getThemeTokens(color, mode) : null;
  const mergedClassName = ["mx-card", className, classProp].filter(Boolean).join(" ");
  const solidSeparationStyle: React.CSSProperties =
    mode === "dark"
      ? {
          boxShadow:
            "0 22px 40px -28px rgba(0, 0, 0, 0.92), 0 10px 18px -18px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.06)"
        }
      : {
          boxShadow:
            "0 14px 30px -24px rgba(15, 23, 42, 0.62), 0 8px 16px -18px rgba(15, 23, 42, 0.48), 0 0 0 1px rgba(255, 255, 255, 0.45)"
        };

  const semanticStyles: React.CSSProperties | null = colorTokens
    ? {
        color: colorTokens.text,
        ...(appearance === "solid"
          ? {
              backgroundColor: colorTokens.surface,
              borderColor: colorTokens.border
            }
          : appearance === "outline"
            ? {
                borderColor: colorTokens.border
              }
            : null)
      }
    : null;

  return (
    <article
      className={mergedClassName}
      style={{
        ...baseStyle,
        ...appearanceStyles[appearance],
        ...(appearance === "solid"
          ? {
              backgroundColor: "var(--mx-color-surface, #ffffff)",
              ...solidSeparationStyle
            }
          : null),
        ...semanticStyles,
        ...sx,
        ...style
      }}
      {...props}
    >
      {children}
    </article>
  );
}
