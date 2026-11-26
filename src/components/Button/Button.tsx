import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { SizeScale } from "../../system/scale";
import { useTheme } from "../../theme/ThemeProvider";
import type { ThemeName } from "../../theme/theme";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = SizeScale;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ThemeName;
  sx?: React.CSSProperties;
  class?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  color,
  disabled,
  sx,
  class: classProp,
  className,
  style,
  ...props
}: ButtonProps) {
  const { mode } = useTheme();

  return (
    <button
      type="button"
      disabled={disabled}
      className={["mx-button", className, classProp].filter(Boolean).join(" ")}
      data-mx-variant={variant}
      data-mx-size={size}
      data-mx-color={color}
      data-mx-color-mode={color ? mode : undefined}
      style={{ ...sx, ...style }}
      {...props}
    >{children}</button>
  );
}
