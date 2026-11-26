import { forwardRef, useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { Text } from "../Typography/Text";

export type BannerVariant = "success" | "warning" | "error" | "neutral";

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "color"> {
  message: ReactNode;
  variant?: BannerVariant;
  color?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  closeLabel?: string;
  sx?: CSSProperties;
  class?: string;
}

export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner({
  message,
  variant = "neutral",
  color,
  dismissible = false,
  onDismiss,
  closeLabel = "Dismiss banner",
  role = variant === "error" ? "alert" : "status",
  sx,
  class: classProp,
  className,
  style,
  ...props
}, ref) {
  const [dismissed, setDismissed] = useState(false);
  const [exitHeight, setExitHeight] = useState<number>();
  const dismissTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(dismissTimer.current), []);
  if (dismissed) return null;

  const customStyle = color ? { "--mx-banner-accent": color } as CSSProperties : undefined;
  const exitStyle = exitHeight !== undefined
    ? { "--mx-banner-exit-height": `${exitHeight}px` } as CSSProperties : undefined;

  return (
    <div
      {...props}
      ref={ref}
      role={role}
      data-mx-variant={variant}
      data-mx-dismissing={exitHeight !== undefined ? "true" : undefined}
      aria-hidden={exitHeight !== undefined ? true : props["aria-hidden"]}
      className={["mx-banner", className, classProp].filter(Boolean).join(" ")}
      style={{ ...customStyle, ...exitStyle, ...sx, ...style }}
    >
      <Text as="div" className="mx-banner-message">{message}</Text>
      {dismissible ? (
        <button
          type="button"
          className="mx-banner-close"
          aria-label={closeLabel}
          disabled={exitHeight !== undefined}
          onClick={(event) => {
            if (dismissTimer.current !== undefined) return;
            const finish = () => {
              setDismissed(true);
              onDismiss?.();
            };
            if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
              finish();
              return;
            }
            setExitHeight(event.currentTarget.parentElement!.getBoundingClientRect().height);
            // Match the CSS exit animation; also works when animation events are unavailable.
            dismissTimer.current = setTimeout(finish, 240);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
});
