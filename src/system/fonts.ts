export type FontStyleName = "clear" | "playful" | "stark" | "bizarre";

export interface ThemeFontTokens {
  fontDisplay: string;
  fontBody: string;
  fontDisplayLetterSpacing: string;
}

export const fontStyleTokens: Record<FontStyleName, ThemeFontTokens> = {
  clear: {
    fontDisplay: '"Cantarell", sans-serif',
    fontBody: '"Gudea", sans-serif',
    fontDisplayLetterSpacing: "0.01em"
  },
  playful: {
    fontDisplay: '"DynaPuff", sans-serif',
    fontBody: '"Gudea", sans-serif',
    fontDisplayLetterSpacing: "0.01em"
  },
  stark: {
    fontDisplay: '"Martel", serif',
    fontBody: '"Gudea", sans-serif',
    fontDisplayLetterSpacing: "0.01em"
  },
  bizarre: {
    fontDisplay: '"Loved by the King", cursive',
    fontBody: '"Gudea", sans-serif',
    fontDisplayLetterSpacing: "0.06em"
  }
};
