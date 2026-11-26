import type { HTMLAttributes, ReactNode } from "react";
import { contentWidthScale, spacingScale, type SizeScale } from "../../system/scale";

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  margin?: SizeScale;
  contentWidth?: SizeScale;
  sx?: React.CSSProperties;
  class?: string;
}

const wrapperStyle: React.CSSProperties = {
  width: "100%",
  color: "var(--mx-color-text, #0f172a)",
  boxSizing: "border-box"
};

const contentStyle: React.CSSProperties = {
  width: "100%",
  marginInline: "auto",
  boxSizing: "border-box"
};

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
  const mergedClassName = ["mx-layout", className, classProp].filter(Boolean).join(" ");

  return (
    <div className="mx-layout-wrapper" style={wrapperStyle}>
      <div
        className={mergedClassName}
        style={{
          ...contentStyle,
          maxWidth: contentWidthScale[contentWidth],
          paddingInline: spacingScale[margin],
          ...sx,
          ...style
        }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
