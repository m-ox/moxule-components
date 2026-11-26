import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useMemo
} from "react";
import { toCssVariables } from "./cssVariables";
import { fontStyleTokens, type FontStyleName } from "../system/fonts";
import { derivePageShellBackground, getThemeTokens, type ThemeMode, type ThemeName, type ThemeTokens } from "./theme";

interface ThemeContextValue {
  mode: ThemeMode;
  theme: ThemeName;
  tokens: ThemeTokens;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  mode?: ThemeMode;
  theme?: ThemeName;
  fontStyle?: FontStyleName;
  customTokens?: Partial<ThemeTokens>;
}

export function ThemeProvider({
  children,
  mode = "light",
  theme = "primary",
  fontStyle = "clear",
  customTokens,
  style,
  className,
  ...props
}: ThemeProviderProps) {
  const derivedPageShellBg = customTokens?.buttonPrimaryBg && customTokens.pageShellBg === undefined
    ? derivePageShellBackground(customTokens.buttonPrimaryBg, mode)
    : undefined;
  const tokens = useMemo(() => {
    const baseTokens = getThemeTokens(theme, mode);
    const fontTokens = fontStyleTokens[fontStyle];
    return {
      ...baseTokens,
      ...fontTokens,
      ...(derivedPageShellBg ? { pageShellBg: derivedPageShellBg } : null),
      ...customTokens
    };
  }, [theme, mode, fontStyle, customTokens, derivedPageShellBg]);

  const value = useMemo(
    () => ({
      mode,
      theme,
      tokens
    }),
    [mode, theme, tokens]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={["mx-theme", className].filter(Boolean).join(" ")}
        data-mx-font-style={fontStyle}
        data-mx-mode={mode}
        data-mx-theme={theme}
        style={{
          ...(customTokens ? toCssVariables({
            ...customTokens,
            ...(derivedPageShellBg ? { pageShellBg: derivedPageShellBg } : null)
          }) : null),
          ...style
        }}
        {...props}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    const fallbackTheme = "primary";
    const fallbackMode = "light";
    return {
      theme: fallbackTheme,
      mode: fallbackMode,
      tokens: getThemeTokens(fallbackTheme, fallbackMode)
    };
  }

  return context;
}
