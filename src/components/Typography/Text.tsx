import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import { getThemeTokens, isThemeName, type ThemeName } from "../../theme/theme";

export type TextAs = "p" | "span" | "div";
export type TextVariant = "sm" | "md" | "lg";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: TextAs;
  variant?: TextVariant;
  theme?: ThemeName;
  color?: ThemeName | string;
  i?: boolean;
  b?: boolean;
  u?: boolean;
  sx?: CSSProperties;
  class?: string;
}

const variantStyles: Record<TextVariant, CSSProperties> = {
  sm: {
    fontSize: "0.9rem",
    lineHeight: 1.45
  },
  md: {
    fontSize: "1rem",
    lineHeight: 1.6
  },
  lg: {
    fontSize: "1.1rem",
    lineHeight: 1.65
  }
};

export function Text({
  children,
  as = "p",
  variant = "md",
  theme,
  color,
  i = false,
  b = false,
  u = false,
  sx,
  class: classProp,
  className,
  style,
  ...props
}: TextProps) {
  const { mode, tokens } = useTheme();
  const scopedTokens = theme ? getThemeTokens(theme, mode) : tokens;
  const semanticColor = color && isThemeName(color) ? getThemeTokens(color, mode).text : undefined;
  const Tag = as;
  const mergedClassName = ["mx-text", `mx-text-${variant}`, className, classProp]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      className={mergedClassName}
      style={{
        margin: as === "p" ? 0 : undefined,
        fontFamily: "var(--mx-font-body, sans-serif)",
        color: semanticColor ?? color ?? scopedTokens.text,
        fontStyle: i ? "italic" : "normal",
        fontWeight: b ? 700 : 400,
        textDecoration: u ? "underline" : "none",
        ...variantStyles[variant],
        ...sx,
        ...style
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
