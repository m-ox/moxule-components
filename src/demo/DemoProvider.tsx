import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ThemeProvider, type FontStyleName, type ThemeMode, type ThemeName } from "../index";

import { loadSessionPreferences, saveSessionPreferences, type DemoDensity, type DemoSize } from "./preferences";
export type { DemoDensity, DemoSize } from "./preferences";

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
  const [initial] = useState(loadSessionPreferences);
  const [mode, setMode] = useState<ThemeMode>(initial.mode);
  const [theme, setTheme] = useState<ThemeName>(initial.theme);
  const [fontStyle, setFontStyle] = useState<FontStyleName>(initial.fontStyle);
  const [size, setSize] = useState<DemoSize>(initial.size);
  const [density, setDensity] = useState<DemoDensity>(initial.density);
  useEffect(() => { saveSessionPreferences({ mode, theme, fontStyle, size, density }); }, [mode, theme, fontStyle, size, density]);

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
