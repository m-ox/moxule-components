import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import { getThemeTokens, isThemeName, type ThemeName } from "../../theme/theme";

export type HeaderVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  variant?: HeaderVariant;
  theme?: ThemeName;
  color?: ThemeName | string;
  sx?: CSSProperties;
  class?: string;
}

const headerStyles: Record<HeaderVariant, CSSProperties> = {
  h1: {
    fontSize: "3rem",
    lineHeight: 1.1,
    fontWeight: 800
  },
  h2: {
    fontSize: "2.5rem",
    lineHeight: 1.15,
    fontWeight: 750
  },
  h3: {
    fontSize: "2rem",
    lineHeight: 1.2,
    fontWeight: 700
  },
  h4: {
    fontSize: "1.5rem",
    lineHeight: 1.25,
    fontWeight: 650
  },
  h5: {
    fontSize: "1.25rem",
    lineHeight: 1.3,
    fontWeight: 650
  },
  h6: {
    fontSize: "1rem",
    lineHeight: 1.35,
    fontWeight: 650
  }
};

export function Header({
  children,
  variant = "h1",
  theme,
  color,
  sx,
  class: classProp,
  className,
  style,
  ...props
}: HeaderProps) {
  const { mode, tokens } = useTheme();
  const scopedTokens = theme ? getThemeTokens(theme, mode) : tokens;
  const semanticColor = color && isThemeName(color) ? getThemeTokens(color, mode).text : undefined;
  const Tag = variant;
  const mergedClassName = ["mx-header", `mx-header-${variant}`, className, classProp]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      className={mergedClassName}
      style={{
        margin: 0,
        fontFamily: "var(--mx-font-display, var(--mx-font-body, sans-serif))",
        letterSpacing: "var(--mx-font-display-letter-spacing, 0.01em)",
        color: semanticColor ?? color ?? scopedTokens.text,
        ...headerStyles[variant],
        ...sx,
        ...style
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
