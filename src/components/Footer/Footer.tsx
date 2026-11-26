import { Children, type HTMLAttributes, type ReactNode } from "react";

export type FooterLayout = "centered" | "split";
export type FooterPosition = "static" | "natural";

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  layout?: FooterLayout;
  position?: FooterPosition;
  sx?: React.CSSProperties;
  class?: string;
}

const footerStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  borderTop: "1px solid var(--mx-color-border, #cbd5e1)",
  backgroundColor: "var(--mx-color-chrome-bg, var(--mx-color-surface, #ffffff))",
  color: "var(--mx-color-chrome-text, var(--mx-color-text, #0f172a))",
  fontFamily: "var(--mx-font-display, var(--mx-font-body, sans-serif))",
  letterSpacing: "var(--mx-font-display-letter-spacing, 0.01em)",
  boxSizing: "border-box",
  padding: "0.75rem 1rem"
};

const centeredContentStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.75rem",
  flexWrap: "wrap"
};

const splitContentStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.75rem"
};

const splitItemStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minWidth: 0
};

export function Footer({
  children,
  layout = "centered",
  position = "natural",
  sx,
  class: classProp,
  className,
  style,
  ...props
}: FooterProps) {
  const mergedClassName = ["mx-footer", className, classProp].filter(Boolean).join(" ");

  const content =
    layout === "split"
      ? Children.toArray(children).map((child, index) => (
          <div className="mx-footer-item" key={index} style={splitItemStyle}>
            {child}
          </div>
        ))
      : children;

  return (
    <footer
      className={mergedClassName}
      data-mx-footer-layout={layout}
      data-mx-footer-position={position}
      style={{
        ...footerStyle,
        ...(position === "static"
          ? {
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 20
            }
          : null),
        ...sx,
        ...style
      }}
      {...props}
    >
      <div
        className={layout === "split" ? "mx-footer-content mx-footer-content-split" : "mx-footer-content"}
        style={layout === "split" ? splitContentStyle : centeredContentStyle}
      >
        {content}
      </div>
    </footer>
  );
}
