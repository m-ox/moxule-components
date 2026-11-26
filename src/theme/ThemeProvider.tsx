import {
  createContext,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useMemo
} from "react";
import { fontStyleTokens, type FontStyleName } from "../system/fonts";
import { getThemeTokens, type ThemeMode, type ThemeName, type ThemeTokens } from "./theme";

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

function toCssVariables(tokens: ThemeTokens): CSSProperties {
  return {
    "--mx-color-surface": tokens.surface,
    "--mx-page-shell-bg": tokens.pageShellBg,
    "--mx-color-text": tokens.text,
    "--mx-color-border": tokens.border,
    "--mx-color-chrome-bg": tokens.chromeBg,
    "--mx-color-chrome-text": tokens.chromeText,
    "--mx-font-display": tokens.fontDisplay,
    "--mx-font-body": tokens.fontBody,
    "--mx-font-display-letter-spacing": tokens.fontDisplayLetterSpacing,
    "--mx-button-primary-bg": tokens.buttonPrimaryBg,
    "--mx-button-primary-bg-hover": tokens.buttonPrimaryBgHover,
    "--mx-button-primary-text": tokens.buttonPrimaryText,
    "--mx-button-secondary-bg": tokens.buttonSecondaryBg,
    "--mx-button-secondary-bg-hover": tokens.buttonSecondaryBgHover,
    "--mx-button-secondary-text": tokens.buttonSecondaryText,
    "--mx-button-ghost-text": tokens.buttonGhostText,
    "--mx-button-ghost-border": tokens.buttonGhostBorder,
    "--mx-button-ghost-bg-hover": tokens.buttonGhostBgHover,
    "--mx-status-success-bg": tokens.successBg,
    "--mx-status-success-bg-hover": tokens.successBgHover,
    "--mx-status-success-text": tokens.successText,
    "--mx-status-success-border": tokens.successBorder,
    "--mx-status-warning-bg": tokens.warningBg,
    "--mx-status-warning-bg-hover": tokens.warningBgHover,
    "--mx-status-warning-text": tokens.warningText,
    "--mx-status-warning-border": tokens.warningBorder,
    "--mx-status-error-bg": tokens.errorBg,
    "--mx-status-error-bg-hover": tokens.errorBgHover,
    "--mx-status-error-text": tokens.errorText,
    "--mx-status-error-border": tokens.errorBorder,
    "--mx-status-neutral-bg": tokens.neutralBg,
    "--mx-status-neutral-bg-hover": tokens.neutralBgHover,
    "--mx-status-neutral-text": tokens.neutralText,
    "--mx-status-neutral-border": tokens.neutralBorder
  } as CSSProperties;
}

export function ThemeProvider({
  children,
  mode = "light",
  theme = "primary",
  fontStyle = "clear",
  customTokens,
  style,
  ...props
}: ThemeProviderProps) {
  const tokens = useMemo(() => {
    const baseTokens = getThemeTokens(theme, mode);
    const fontTokens = fontStyleTokens[fontStyle];
    return {
      ...baseTokens,
      ...fontTokens,
      ...customTokens
    };
  }, [theme, mode, fontStyle, customTokens]);

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
        data-mx-mode={mode}
        data-mx-theme={theme}
        style={{
          ...toCssVariables(tokens),
          color: "var(--mx-color-text)",
          backgroundColor: "var(--mx-color-surface)",
          fontFamily: "var(--mx-font-body)",
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