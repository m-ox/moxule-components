import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { getFocusRingStyles } from "../../system/focus";
import type { SizeScale } from "../../system/scale";
import { useTheme } from "../../theme/ThemeProvider";
import { getThemeTokens, type ThemeName } from "../../theme/theme";

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

const baseStyle: React.CSSProperties = {
  border: "1px solid transparent",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 600,
  lineHeight: 1,
  transition: "all 120ms ease"
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "var(--mx-button-primary-bg, #0f172a)",
    color: "var(--mx-button-primary-text, #f8fafc)"
  },
  secondary: {
    backgroundColor: "var(--mx-button-secondary-bg, #e2e8f0)",
    color: "var(--mx-button-secondary-text, #0f172a)"
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "var(--mx-button-ghost-border, #cbd5e1)",
    color: "var(--mx-button-ghost-text, #0f172a)"
  }
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  xs: {
    fontSize: "0.8rem",
    padding: "0.4rem 0.6rem"
  },
  sm: {
    fontSize: "0.875rem",
    padding: "0.5rem 0.75rem"
  },
  md: {
    fontSize: "0.95rem",
    padding: "0.65rem 1rem"
  },
  lg: {
    fontSize: "1.05rem",
    padding: "0.8rem 1.25rem"
  },
  xl: {
    fontSize: "1.125rem",
    padding: "0.95rem 1.5rem"
  }
};

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
  onFocus,
  onBlur,
  ...props
}: ButtonProps) {
  const { mode } = useTheme();
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const colorTokens = color ? getThemeTokens(color, mode) : null;
  const mergedClassName = ["mx-button", className, classProp].filter(Boolean).join(" ");

  const semanticVariantStyles: Record<ButtonVariant, React.CSSProperties> | null = colorTokens
    ? {
        primary: {
          backgroundColor: colorTokens.buttonPrimaryBg,
          color: colorTokens.buttonPrimaryText
        },
        secondary: {
          backgroundColor: colorTokens.buttonSecondaryBg,
          color: colorTokens.buttonSecondaryText
        },
        ghost: {
          backgroundColor: "transparent",
          borderColor: colorTokens.buttonGhostBorder,
          color: colorTokens.buttonGhostText
        }
      }
    : null;

  return (
    <button
      type="button"
      disabled={disabled}
      className={mergedClassName}
      onFocus={(event) => {
        setIsFocusVisible(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setIsFocusVisible(false);
        onBlur?.(event);
      }}
      style={{
        ...baseStyle,
        ...(semanticVariantStyles ? semanticVariantStyles[variant] : variantStyles[variant]),
        ...sizeStyles[size],
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...getFocusRingStyles(isFocusVisible),
        ...sx,
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
}
