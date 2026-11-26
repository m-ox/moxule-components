import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import { isThemeName, type ThemeName } from "../../theme/theme";

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
  const { mode } = useTheme();
  const semanticColor = color && isThemeName(color) ? color : undefined;
  const scopedTheme = semanticColor ?? (color ? undefined : theme);
  const textColor = semanticColor ? undefined : color;
  const Tag = as;
  return (
    <Tag
      className={["mx-text", `mx-text-${variant}`, className, classProp].filter(Boolean).join(" ")}
      data-mx-italic={i || undefined}
      data-mx-bold={b || undefined}
      data-mx-underline={u || undefined}
      data-mx-color={scopedTheme}
      data-mx-color-mode={scopedTheme ? mode : undefined}
      style={{ color: textColor, ...sx, ...style }}
      {...props}
    >{children}</Tag>
  );
}
