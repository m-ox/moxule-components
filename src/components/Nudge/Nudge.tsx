import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { BannerProps } from "../Banner/Banner";
import { Text } from "../Typography/Text";

export interface NudgeProps extends Omit<BannerProps, "dismissible"> {
  /** Milliseconds before dismissal; 0 keeps the nudge until closed. */
  duration?: number;
  open?: boolean;
}

export function Nudge({
  message,
  variant = "neutral",
  color,
  duration = variant === "error" ? 0 : 6000,
  open = true,
  onDismiss,
  closeLabel = "Dismiss notification",
  role = variant === "error" ? "alert" : "status",
  class: classProp,
  className,
  sx,
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: NudgeProps) {
  const root = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const finished = useRef(false);
  const onDismissRef = useRef(onDismiss);
  const remaining = useRef(duration);
  const [dismissed, setDismissed] = useState(false);
  const [exitHeight, setExitHeight] = useState<number>();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => { onDismissRef.current = onDismiss; }, [onDismiss]);
  useEffect(() => { remaining.current = duration; }, [duration]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setDismissed(true);
    onDismissRef.current?.();
  }, []);

  const dismiss = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    setExitHeight(root.current?.getBoundingClientRect().height ?? 0);
  }, [finish]);

  useEffect(() => {
    if (!open) dismiss();
  }, [open, dismiss]);

  useEffect(() => {
    if (exitHeight === undefined) return;
    const timer = setTimeout(finish, 240);
    return () => clearTimeout(timer);
  }, [exitHeight, finish]);

  useEffect(() => {
    if (hovered || focused || !open || closing.current || !Number.isFinite(duration) || duration <= 0) return;
    const started = Date.now();
    const timer = setTimeout(dismiss, Math.max(0, remaining.current));
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - started));
    };
  }, [duration, hovered, focused, open, exitHeight, dismiss]);

  if (dismissed) return null;
  const customStyle = {
    ...(color ? { "--mx-banner-accent": color } : null),
    ...(exitHeight !== undefined ? { "--mx-banner-exit-height": `${exitHeight}px` } : null)
  } as CSSProperties;

  return (
    <div
      {...props}
      ref={root}
      role={role}
      aria-atomic="true"
      aria-hidden={exitHeight !== undefined ? true : props["aria-hidden"]}
      data-mx-variant={variant}
      data-mx-dismissing={exitHeight !== undefined ? "true" : undefined}
      className={["mx-banner", "mx-nudge", className, classProp].filter(Boolean).join(" ")}
      style={{ ...customStyle, ...sx, ...style }}
      onMouseEnter={(event) => { setHovered(true); onMouseEnter?.(event); }}
      onMouseLeave={(event) => { setHovered(false); onMouseLeave?.(event); }}
      onFocus={(event) => { setFocused(true); onFocus?.(event); }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        onBlur?.(event);
      }}
    >
      <Text as="div" className="mx-banner-message">{message}</Text>
      <button type="button" className="mx-banner-close" aria-label={closeLabel} disabled={exitHeight !== undefined} onClick={dismiss}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
