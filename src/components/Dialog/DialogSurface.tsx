import { useEffect, useId, useRef, useState, type CSSProperties, type DialogHTMLAttributes, type ReactNode, type RefObject } from "react";
import { Header } from "../Typography/Header";
import { Text } from "../Typography/Text";

export interface DialogSurfaceProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, "open" | "title" | "children"> {
  presentation: "drawer" | "modal";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  side?: "left" | "right";
  footer?: ReactNode;
  closeLabel?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  initialFocusRef?: RefObject<HTMLElement>;
  onDismiss?: () => void;
  sx?: CSSProperties;
  class?: string;
}

let scrollLocks = 0;
let previousOverflow = "";

function lockScroll() {
  if (scrollLocks++ === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  return () => {
    if (--scrollLocks === 0) document.body.style.overflow = previousOverflow;
  };
}

export function DialogSurface({
  presentation,
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = "right",
  closeLabel = presentation === "drawer" ? "Close drawer" : "Close modal",
  closeOnBackdrop = true,
  closeOnEscape = true,
  initialFocusRef,
  onDismiss,
  sx,
  class: classProp,
  className,
  style,
  id,
  onCancel,
  onClick,
  onClose,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: DialogSurfaceProps) {
  const generatedId = useId();
  const dialogId = id ?? `${generatedId}-${presentation}`;
  const titleId = `${generatedId}-title`;
  const descriptionId = `${generatedId}-description`;
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const unlockScroll = useRef<(() => void)>();
  const internalCloses = useRef(0);
  const latest = useRef({ open, onOpenChange, onDismiss, initialFocusRef });
  const [closing, setClosing] = useState(false);
  useEffect(() => { latest.current = { open, onOpenChange, onDismiss, initialFocusRef }; });

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    if (open) {
      setClosing(false);
      if (!element.open) {
        returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        element.showModal();
        unlockScroll.current ??= lockScroll();
        (latest.current.initialFocusRef?.current ?? closeButton.current)?.focus();
      }
      return;
    }

    if (!element.open) return;
    setClosing(true);
    const finish = () => {
      internalCloses.current++;
      element.close();
      unlockScroll.current?.();
      unlockScroll.current = undefined;
      setClosing(false);
      if (returnFocus.current?.isConnected) returnFocus.current.focus();
      latest.current.onDismiss?.();
    };
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    const timer = setTimeout(finish, 240);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => () => {
    if (dialog.current?.open) {
      internalCloses.current++;
      dialog.current.close();
    }
    unlockScroll.current?.();
    unlockScroll.current = undefined;
    if (returnFocus.current?.isConnected) returnFocus.current.focus();
  }, []);

  return (
    <dialog
      {...props}
      ref={dialog}
      id={dialogId}
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : titleId)}
      aria-describedby={[description != null ? descriptionId : undefined, ariaDescribedBy].filter(Boolean).join(" ") || undefined}
      data-mx-side={presentation === "drawer" ? side : undefined}
      data-mx-state={closing ? "closing" : "open"}
      className={[`mx-${presentation}`, className, classProp].filter(Boolean).join(" ")}
      style={{ ...sx, ...style }}
      onCancel={(event) => {
        if (event.target !== event.currentTarget) return;
        onCancel?.(event);
        const cancelled = event.defaultPrevented;
        event.preventDefault();
        if (!cancelled && closeOnEscape) onOpenChange(false);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || !closeOnBackdrop || event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
          onOpenChange(false);
        }
      }}
      onClose={(event) => {
        if (event.target !== event.currentTarget) return;
        onClose?.(event);
        if (internalCloses.current > 0) {
          internalCloses.current--;
          return;
        }
        unlockScroll.current?.();
        unlockScroll.current = undefined;
        if (latest.current.open) {
          latest.current.onOpenChange(false);
          latest.current.onDismiss?.();
        }
      }}
    >
      <div className={`mx-${presentation}-header`}>
        <Header id={titleId} variant="h2" className={`mx-${presentation}-title`}>{title}</Header>
        <button type="button" ref={closeButton} className={`mx-${presentation}-close`} aria-label={closeLabel} onClick={() => onOpenChange(false)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {description != null ? <Text id={descriptionId} variant="sm">{description}</Text> : null}
      <div className={`mx-${presentation}-content`}>{children}</div>
      {footer != null ? <div className={`mx-${presentation}-footer`}>{footer}</div> : null}
    </dialog>
  );
}
