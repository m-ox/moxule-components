import { describe, expect, it } from "vitest";
import { themeTokens, type ThemeMode, type ThemeName } from "./theme";

function parseHexColor(color: string): [number, number, number] {
  const normalized = color.trim().replace(/^#/, "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((value) => `${value}${value}`)
          .join("")
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    throw new Error(`Only 3- and 6-digit hex colors are supported in contrast tests. Received: ${color}`);
  }

  const value = Number.parseInt(expanded, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function toLinearChannel(channel: number): number {
  const sRgb = channel / 255;
  return sRgb <= 0.03928 ? sRgb / 12.92 : ((sRgb + 0.055) / 1.055) ** 2.4;
}

function luminance(color: string): number {
  const [r, g, b] = parseHexColor(color);
  return 0.2126 * toLinearChannel(r) + 0.7152 * toLinearChannel(g) + 0.0722 * toLinearChannel(b);
}

function contrastRatio(foreground: string, background: string): number {
  const fg = luminance(foreground);
  const bg = luminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

const AA_TEXT_CONTRAST = 4.5;
const allThemes = Object.keys(themeTokens) as ThemeName[];
const allModes: ThemeMode[] = ["light", "dark"];

describe("theme contrast compliance", () => {
  for (const theme of allThemes) {
    for (const mode of allModes) {
      const tokens = themeTokens[theme][mode];
      const scope = `${theme}/${mode}`;

      it(`${scope} keeps readable text and controls`, () => {
        const readablePairs: Array<[label: string, fg: string, bg: string]> = [
          ["surface text", tokens.text, tokens.surface],
          ["chrome text", tokens.chromeText, tokens.chromeBg],
          ["primary button", tokens.buttonPrimaryText, tokens.buttonPrimaryBg],
          ["primary button hover", tokens.buttonPrimaryText, tokens.buttonPrimaryBgHover],
          ["secondary button", tokens.buttonSecondaryText, tokens.buttonSecondaryBg],
          ["secondary button hover", tokens.buttonSecondaryText, tokens.buttonSecondaryBgHover],
          ["success", tokens.successText, tokens.successBg],
          ["success hover", tokens.successText, tokens.successBgHover],
          ["warning", tokens.warningText, tokens.warningBg],
          ["warning hover", tokens.warningText, tokens.warningBgHover],
          ["error", tokens.errorText, tokens.errorBg],
          ["error hover", tokens.errorText, tokens.errorBgHover],
          ["neutral", tokens.neutralText, tokens.neutralBg],
          ["neutral hover", tokens.neutralText, tokens.neutralBgHover],
          ["ghost text", tokens.buttonGhostText, tokens.surface]
        ];

        for (const [label, fg, bg] of readablePairs) {
          const ratio = contrastRatio(fg, bg);
          expect(ratio, `${scope} ${label} contrast=${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(
            AA_TEXT_CONTRAST
          );
        }
      });

    }
  }
});