import { useTheme } from "../../theme/ThemeProvider";
import type { ThemeMode } from "../../theme/theme";
import { Toggle, type ToggleProps } from "../Toggle/Toggle";

export interface ThemeToggleProps
  extends Omit<ToggleProps, "checked" | "onCheckedChange" | "thumbOnIcon" | "thumbOffIcon"> {
  mode?: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
}

function ModeIcon({ dark = false }: { dark?: boolean }) {
  return (
    <svg className="mx-theme-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {dark ? (
        <path d="M20.9 13.1A9 9 0 0 1 10.9 3.1 9 9 0 1 0 20.9 13.1Z" />
      ) : (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </>
      )}
    </svg>
  );
}

export function ThemeToggle({
  mode,
  onModeChange,
  ariaLabel,
  label,
  className,
  ...props
}: ThemeToggleProps) {
  const theme = useTheme();
  return (
    <Toggle
      {...props}
      checked={(mode ?? theme.mode) === "dark"}
      onCheckedChange={(dark) => onModeChange(dark ? "dark" : "light")}
      ariaLabel={ariaLabel ?? (label != null && label !== false ? undefined : "Toggle dark mode")}
      label={label}
      className={["mx-theme-toggle", className].filter(Boolean).join(" ")}
      thumbOnIcon={<ModeIcon dark />}
      thumbOffIcon={<ModeIcon />}
    />
  );
}
