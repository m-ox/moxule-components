import type { HTMLAttributes, ReactNode } from "react";
import type { SizeScale } from "../../system/scale";

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  margin?: SizeScale;
  contentWidth?: SizeScale;
  sx?: React.CSSProperties;
  class?: string;
}

export function Layout({
  children,
  margin = "md",
  contentWidth = "lg",
  sx,
  class: classProp,
  className,
  style,
  ...props
}: LayoutProps) {
  return (
    <div className="mx-layout-wrapper">
      <div
        className={["mx-layout", className, classProp].filter(Boolean).join(" ")}
        data-mx-margin={margin}
        data-mx-content-width={contentWidth}
        style={{ ...sx, ...style }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
