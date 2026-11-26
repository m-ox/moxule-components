import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import { isThemeName, type ThemeName } from "../../theme/theme";

export type HeaderVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  variant?: HeaderVariant;
  theme?: ThemeName;
  color?: ThemeName | string;
  sx?: CSSProperties;
  class?: string;
}

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
  const { mode } = useTheme();
  const semanticColor = color && isThemeName(color) ? color : undefined;
  const scopedTheme = semanticColor ?? (color ? undefined : theme);
  const textColor = semanticColor ? undefined : color;
  const Tag = variant;
  return (
    <Tag
      className={["mx-header", `mx-header-${variant}`, className, classProp].filter(Boolean).join(" ")}
      data-mx-color={scopedTheme}
      data-mx-color-mode={scopedTheme ? mode : undefined}
      style={{ color: textColor, ...sx, ...style }}
      {...props}
    >{children}</Tag>
  );
}
