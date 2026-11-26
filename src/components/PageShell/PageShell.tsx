import type { HTMLAttributes, ReactNode } from "react";
import { spacingScale, type SizeScale } from "../../system/scale";

export interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  footerOffset?: SizeScale;
  fullHeight?: boolean;
  sx?: React.CSSProperties;
  class?: string;
}

const baseStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: "var(--mx-page-shell-bg, #e8e8e8)"
};

export function PageShell({
  children,
  footerOffset = "xl",
  fullHeight = true,
  sx,
  class: classProp,
  className,
  style,
  ...props
}: PageShellProps) {
  const mergedClassName = ["mx-page-shell", className, classProp].filter(Boolean).join(" ");

  return (
    <div
      className={mergedClassName}
      style={{
        ...baseStyle,
        minHeight: fullHeight ? "100vh" : undefined,
        paddingBottom: spacingScale[footerOffset],
        ...sx,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
