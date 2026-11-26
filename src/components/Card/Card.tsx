import type { HTMLAttributes, ReactNode } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import type { ThemeName } from "../../theme/theme";

type CardAppearance = "solid" | "outline" | "none";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  color?: ThemeName;
  appearance?: CardAppearance;
  sx?: React.CSSProperties;
  class?: string;
}

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

  return (
    <article
      className={["mx-card", className, classProp].filter(Boolean).join(" ")}
      data-mx-appearance={appearance}
      data-mx-color={color}
      data-mx-color-mode={color ? mode : undefined}
      style={{ ...sx, ...style }}
      {...props}
    >{children}</article>
  );
}
