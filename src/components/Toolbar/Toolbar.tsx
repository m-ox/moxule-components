import type { HTMLAttributes, ReactNode } from "react";

export type ToolbarPosition = "sticky" | "static";

export interface ToolbarProps extends HTMLAttributes<HTMLElement> {
  left?: ReactNode;
  right?: ReactNode;
  position?: ToolbarPosition;
  logo?: ReactNode;
  children?: ReactNode;
  sx?: React.CSSProperties;
  class?: string;
}

const toolbarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: "0.75rem 1rem",
  borderBottom: "1px solid var(--mx-color-border, #cbd5e1)",
  backgroundColor: "var(--mx-color-chrome-bg, var(--mx-color-surface, #ffffff))",
  color: "var(--mx-color-chrome-text, var(--mx-color-text, #0f172a))",
  boxSizing: "border-box"
};

const leftContentStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  fontFamily: "var(--mx-font-display, var(--mx-font-body, sans-serif))",
  letterSpacing: "var(--mx-font-display-letter-spacing, 0.01em)",
  minWidth: 0
};

const rightContentStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "0.5rem",
  minWidth: 0
};

export function Toolbar({
  left,
  right,
  position = "sticky",
  logo,
  children,
  sx,
  class: classProp,
  className,
  style,
  ...props
}: ToolbarProps) {
  const mergedClassName = ["mx-toolbar", className, classProp].filter(Boolean).join(" ");
  const leftContent = left ?? logo;
  const rightContent = right ?? children;
  const positionStyles: React.CSSProperties =
    position === "sticky"
      ? {
          position: "sticky",
          top: 0,
          zIndex: 20
        }
      : {
          position: "static"
        };

  return (
    <header
      className={mergedClassName}
      style={{
        ...toolbarStyle,
        ...positionStyles,
        ...sx,
        ...style
      }}
      {...props}
    >
      <div className="mx-toolbar-left" data-mx-toolbar="left" style={leftContentStyle}>
        {leftContent}
      </div>
      <div className="mx-toolbar-right" data-mx-toolbar="right" style={rightContentStyle}>
        {rightContent}
      </div>
    </header>
  );
}