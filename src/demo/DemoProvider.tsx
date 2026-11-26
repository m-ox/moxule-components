import { createContext, useContext, useState, type ReactNode } from "react";
import { ThemeProvider, type FontStyleName, type ThemeMode, type ThemeName } from "../index";

export type DemoSize = "small" | "medium" | "large";
export type DemoDensity = "comfortable" | "compact";

interface DemoPreferences {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  fontStyle: FontStyleName;
  setFontStyle: (fontStyle: FontStyleName) => void;
  size: DemoSize;
  setSize: (size: DemoSize) => void;
  density: DemoDensity;
  setDensity: (density: DemoDensity) => void;
}

const DemoContext = createContext<DemoPreferences | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [theme, setTheme] = useState<ThemeName>("primary");
  const [fontStyle, setFontStyle] = useState<FontStyleName>("playful");
  const [size, setSize] = useState<DemoSize>("medium");
  const [density, setDensity] = useState<DemoDensity>("comfortable");

  return (
    <DemoContext.Provider value={{ mode, setMode, theme, setTheme, fontStyle, setFontStyle, size, setSize, density, setDensity }}>
      <ThemeProvider mode={mode} theme={theme} fontStyle={fontStyle} data-demo-size={size} data-demo-density={density} className="mx-demo">
        {children}
      </ThemeProvider>
    </DemoContext.Provider>
  );
}

export function useDemoPreferences() {
  const preferences = useContext(DemoContext);
  if (!preferences) throw new Error("useDemoPreferences requires DemoProvider.");
  return preferences;
}
