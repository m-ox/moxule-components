import { createContext, useCallback, useContext, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Nudge, type NudgeProps } from "./Nudge";

export type NudgePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
export type NudgeOptions = Pick<NudgeProps, "message" | "variant" | "color" | "duration" | "closeLabel" | "onDismiss">;

export interface NudgeProviderProps {
  children: ReactNode;
  position?: NudgePosition;
  duration?: number;
  label?: string;
}

interface NudgeRecord extends NudgeOptions {
  id: string;
  open: boolean;
}

interface NudgeContextValue {
  nudge: (options: NudgeOptions | string) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const NudgeContext = createContext<NudgeContextValue | null>(null);

export function NudgeProvider({ children, position = "bottom-right", duration = 6000, label = "Notifications" }: NudgeProviderProps) {
  const [nudges, setNudges] = useState<NudgeRecord[]>([]);
  const prefix = useId();
  const sequence = useRef(0);

  const nudge = useCallback((input: NudgeOptions | string) => {
    const options = typeof input === "string" ? { message: input } : input;
    const id = `${prefix}-nudge-${++sequence.current}`;
    setNudges((current) => [...current, {
      ...options,
      duration: options.duration ?? (options.variant === "error" ? 0 : duration),
      id,
      open: true
    }]);
    return id;
  }, [duration, prefix]);

  const dismiss = useCallback((id: string) => {
    setNudges((current) => current.map((item) => item.id === id ? { ...item, open: false } : item));
  }, []);
  const dismissAll = useCallback(() => {
    setNudges((current) => current.map((item) => ({ ...item, open: false })));
  }, []);
  const value = useMemo(() => ({ nudge, dismiss, dismissAll }), [nudge, dismiss, dismissAll]);

  return (
    <NudgeContext.Provider value={value}>
      {children}
      <div className="mx-nudge-viewport" data-mx-position={position} role="region" aria-label={label}>
        <ol className="mx-nudge-list">
          {nudges.map(({ id, onDismiss, ...options }) => (
            <li key={id}>
              <Nudge {...options} onDismiss={() => {
                setNudges((current) => current.filter((item) => item.id !== id));
                onDismiss?.();
              }} />
            </li>
          ))}
        </ol>
      </div>
    </NudgeContext.Provider>
  );
}

export function useNudges(): NudgeContextValue {
  const context = useContext(NudgeContext);
  if (!context) throw new Error("useNudges requires NudgeProvider.");
  return context;
}
