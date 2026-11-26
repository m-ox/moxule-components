import { isThemeName, type ThemeMode, type ThemeName } from "../theme/theme";
import type { FontStyleName } from "../system/fonts";

export type DemoSize = "small" | "medium" | "large";
export type DemoDensity = "comfortable" | "compact";
export interface DemoPreferenceValues {
  mode: ThemeMode;
  theme: ThemeName;
  fontStyle: FontStyleName;
  size: DemoSize;
  density: DemoDensity;
}

export const preferencesStorageKey = "moxule-components.demo.preferences";
const defaults: DemoPreferenceValues = { mode: "light", theme: "primary", fontStyle: "playful", size: "medium", density: "comfortable" };

export function loadSessionPreferences(): DemoPreferenceValues {
  try {
    const stored: unknown = JSON.parse(window.sessionStorage.getItem(preferencesStorageKey) ?? "null");
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return { ...defaults };
    const values = stored as Record<string, unknown>;
    return {
      mode: values.mode === "light" || values.mode === "dark" ? values.mode : defaults.mode,
      theme: typeof values.theme === "string" && isThemeName(values.theme) ? values.theme : defaults.theme,
      fontStyle: ["clear", "playful", "stark", "bizarre"].includes(values.fontStyle as string) ? values.fontStyle as FontStyleName : defaults.fontStyle,
      size: values.size === "small" || values.size === "medium" || values.size === "large" ? values.size : defaults.size,
      density: values.density === "comfortable" || values.density === "compact" ? values.density : defaults.density
    };
  } catch {
    return { ...defaults };
  }
}

export function saveSessionPreferences(preferences: DemoPreferenceValues) {
  try {
    window.sessionStorage.setItem(preferencesStorageKey, JSON.stringify(preferences));
  } catch {
    // Preferences still work for the mounted app if browser storage is unavailable.
  }
}
