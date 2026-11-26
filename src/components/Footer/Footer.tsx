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
  const content = layout === "split"
    ? Children.toArray(children).map((child, index) => <div className="mx-footer-item" key={index}>{child}</div>)
    : children;

  return (
    <footer
      className={["mx-footer", className, classProp].filter(Boolean).join(" ")}
      data-mx-footer-layout={layout}
      data-mx-footer-position={position}
      style={{ ...sx, ...style }}
      {...props}
    >
      <div className={layout === "split" ? "mx-footer-content mx-footer-content-split" : "mx-footer-content"}>
        {content}
      </div>
    </footer>
  );
}
