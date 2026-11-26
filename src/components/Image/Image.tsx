import type { CSSProperties, ImgHTMLAttributes } from "react";

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  sx?: CSSProperties;
  class?: string;
}

export function Image({ sx, class: classProp, className, style, ...props }: ImageProps) {
  const mergedClassName = ["mx-image", className, classProp].filter(Boolean).join(" ");

  return (
    <img
      className={mergedClassName}
      style={{
        maxWidth: "100%",
        height: "auto",
        display: "block",
        ...sx,
        ...style
      }}
      {...props}
    />
  );
}
