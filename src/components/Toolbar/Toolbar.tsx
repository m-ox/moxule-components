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
  return (
    <header
      className={["mx-toolbar", className, classProp].filter(Boolean).join(" ")}
      data-mx-toolbar-position={position}
      style={{ ...sx, ...style }}
      {...props}
    >
      <div className="mx-toolbar-left" data-mx-toolbar="left">{left ?? logo}</div>
      <div className="mx-toolbar-right" data-mx-toolbar="right">{right ?? children}</div>
    </header>
  );
}
