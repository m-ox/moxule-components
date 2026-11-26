import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactElement, type ReactNode } from "react";

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "content"> {
  children: ReactElement;
  content: ReactNode;
  side?: "top" | "bottom";
  delay?: number;
  disabled?: boolean;
  sx?: CSSProperties;
  class?: string;
}

export function Tooltip({ children, content, side = "top", delay = 250, disabled = false, sx, class: classProp, className, style, onMouseEnter, onMouseLeave, onFocusCapture, onBlurCapture, ...props }: TooltipProps) {
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);
  const popup = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const hovered = useRef(false);
  const focused = useRef(false);
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [placement, setPlacement] = useState({ side, shift: 0 });
  const visible = open && !disabled && content != null;
  const child = children as ReactElement<{ "aria-describedby"?: string }>;

  useEffect(() => {
    if (visible) { setRendered(true); return; }
    if (!rendered) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setRendered(false); return; }
    const exit = setTimeout(() => setRendered(false), 140);
    return () => clearTimeout(exit);
  }, [visible, rendered]);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (disabled) { clearTimeout(timer.current); setOpen(false); }
  }, [disabled]);
  useEffect(() => {
    if (!visible) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      clearTimeout(timer.current);
      setOpen(false);
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [visible]);

  useLayoutEffect(() => {
    if (!visible) return;
    const position = () => {
      if (!root.current || !popup.current) return;
      const trigger = root.current.getBoundingClientRect();
      const tooltip = popup.current.getBoundingClientRect();
      const shift = Math.max(12 - trigger.left, Math.min(0, window.innerWidth - 12 - trigger.left - tooltip.width));
      const resolvedSide = side === "top" && trigger.top < tooltip.height + 12 ? "bottom"
        : side === "bottom" && window.innerHeight - trigger.bottom < tooltip.height + 12 ? "top" : side;
      setPlacement((current) => current.shift === shift && current.side === resolvedSide ? current : { shift, side: resolvedSide });
    };
    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [visible, rendered, side, content]);

  return (
    <span
      {...props}
      ref={root}
      className={["mx-tooltip", className, classProp].filter(Boolean).join(" ")}
      style={{ ...sx, ...style }}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        hovered.current = true;
        clearTimeout(timer.current);
        if (!disabled) timer.current = setTimeout(() => setOpen(true), Math.max(0, delay));
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        hovered.current = false;
        clearTimeout(timer.current);
        if (!focused.current) setOpen(false);
      }}
      onFocusCapture={(event) => {
        onFocusCapture?.(event);
        focused.current = true;
        clearTimeout(timer.current);
        if (!disabled) setOpen(true);
      }}
      onBlurCapture={(event) => {
        onBlurCapture?.(event);
        if (event.currentTarget.contains(event.relatedTarget)) return;
        focused.current = false;
        if (!hovered.current) setOpen(false);
      }}
    >
      {cloneElement(child, { "aria-describedby": [child.props["aria-describedby"], visible ? id : undefined].filter(Boolean).join(" ") || undefined })}
      {visible || rendered ? <span
        ref={popup}
        id={id}
        role="tooltip"
        aria-hidden={!visible || undefined}
        data-mx-state={visible ? "open" : "closing"}
        data-mx-side={placement.side}
        className="mx-tooltip-content"
        style={placement.shift ? { "--mx-tooltip-shift": `${placement.shift}px` } as CSSProperties : undefined}
      >{content}</span> : null}
    </span>
  );
}
