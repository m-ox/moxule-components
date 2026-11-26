import type { HTMLAttributes, ReactNode } from "react";
import type { SizeScale } from "../../system/scale";

export interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  footerOffset?: SizeScale;
  fullHeight?: boolean;
  sx?: React.CSSProperties;
  class?: string;
}

export function PageShell({
  children,
  footerOffset,
  fullHeight = true,
  sx,
  class: classProp,
  className,
  style,
  ...props
}: PageShellProps) {
  return (
    <div
      className={["mx-page-shell", className, classProp].filter(Boolean).join(" ")}
      data-mx-full-height={fullHeight}
      data-mx-footer-offset={footerOffset}
      style={{ ...sx, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
