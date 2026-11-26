import { useState, type CSSProperties, type ImgHTMLAttributes } from "react";

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  sx?: CSSProperties;
  class?: string;
}

function cssDimension(value: number | string | undefined) {
  if (value === undefined) return undefined;
  return typeof value === "number" || /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}

function ImageResource({
  src,
  srcSet,
  sizes,
  alt,
  width,
  height,
  crossOrigin,
  decoding,
  fetchPriority,
  loading,
  referrerPolicy,
  useMap,
  onLoad,
  onError,
  sx,
  class: classProp,
  className,
  style,
  ...props
}: ImageProps) {
  const [failed, setFailed] = useState(false);
  const classes = ["mx-image", className, classProp].filter(Boolean).join(" ");

  if (failed || (!src && !srcSet)) {
    const initial = Array.from(alt?.trim() ?? "")[0]?.toUpperCase() ?? "";
    const hasAccessibleName = Boolean(alt?.trim() || props["aria-label"] || props["aria-labelledby"]);
    const decorative = !hasAccessibleName || props.role === "presentation" || props.role === "none";

    return (
      <span
        {...props}
        className={`${classes} mx-image-fallback`}
        role={props.role ?? (decorative ? undefined : "img")}
        aria-label={props["aria-label"] ?? (decorative ? undefined : alt)}
        aria-hidden={props["aria-hidden"] ?? (decorative ? true : undefined)}
        style={{
          "--mx-image-width": cssDimension(width),
          "--mx-image-height": cssDimension(height),
          ...sx,
          ...style
        } as CSSProperties}
      >
        {initial}
      </span>
    );
  }

  return (
    <img
      {...props}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      crossOrigin={crossOrigin}
      decoding={decoding}
      {...(fetchPriority !== undefined ? { fetchPriority } : null)}
      loading={loading}
      referrerPolicy={referrerPolicy}
      useMap={useMap}
      onLoad={onLoad}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
      className={classes}
      style={{ ...sx, ...style }}
    />
  );
}

export function Image(props: ImageProps) {
  // A new resource gets a fresh attempt, including when returning to a previous URL.
  return <ImageResource key={JSON.stringify([props.src, props.srcSet, props.sizes])} {...props} />;
}
