import { Button, type ButtonProps } from "../Button/Button";

export interface MenuButtonProps extends Omit<ButtonProps, "children"> {
  open?: boolean;
}

export function MenuButton({ open = false, className, "aria-label": ariaLabel, ...props }: MenuButtonProps) {
  return (
    <Button
      variant="ghost"
      {...props}
      className={["mx-menu-button", className].filter(Boolean).join(" ")}
      aria-label={ariaLabel ?? (open ? "Close menu" : "Open menu")}
      aria-expanded={open}
      aria-haspopup="dialog"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
        {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
      </svg>
    </Button>
  );
}
