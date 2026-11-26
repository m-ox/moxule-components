export type ThemeMode = "light" | "dark";
export type ThemeName =
  | "primary"
  | "secondary"
  | "tertiary"
  | "blue"
  | "red"
  | "green"
  | "purple"
  | "pink";

export function isThemeName(value: string): value is ThemeName {
  return ["primary", "secondary", "tertiary", "blue", "red", "green", "purple", "pink"].includes(
    value
  );
}

export interface ThemeTokens {
  surface: string;
  pageShellBg: string;
  text: string;
  border: string;
  chromeBg: string;
  chromeText: string;
  fontDisplay: string;
  fontBody: string;
  fontDisplayLetterSpacing: string;
  buttonPrimaryBg: string;
  buttonPrimaryBgHover: string;
  buttonPrimaryText: string;
  buttonSecondaryBg: string;
  buttonSecondaryBgHover: string;
  buttonSecondaryText: string;
  buttonGhostText: string;
  buttonGhostBorder: string;
  buttonGhostBgHover: string;
  successBg: string;
  successBgHover: string;
  successText: string;
  successBorder: string;
  warningBg: string;
  warningBgHover: string;
  warningText: string;
  warningBorder: string;
  errorBg: string;
  errorBgHover: string;
  errorText: string;
  errorBorder: string;
  neutralBg: string;
  neutralBgHover: string;
  neutralText: string;
  neutralBorder: string;
}

interface ThemeSeed {
  surface: string;
  text: string;
  border: string;
  chromeBg: string;
  chromeText: string;
  accent: string;
  accentHover: string;
  accentText: string;
  accentSoft: string;
  accentSoftHover: string;
  accentSoftText: string;
  accentGhost: string;
  accentGhostBorder: string;
  accentGhostHover: string;
}

export function derivePageShellBackground(primaryColor: string, mode: ThemeMode): string {
  let hex = primaryColor.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(hex)) hex = hex.split("").map((digit) => digit + digit).join("");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return mode === "light" ? "#f7f7f7" : "#0c0c0c";

  const [r, g, b] = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return mode === "light" ? "#f7f7f7" : "#0c0c0c";

  const sector = max === r ? (g - b) / delta : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  const hue = ((sector * 60 - 30) % 360 + 360) % 360;
  // Shift to a neighboring hue, with fixed off-white or subtle charcoal lightness.
  const floor = mode === "light" ? 239 : 10;
  const chroma = mode === "light" ? 16 : 4;
  const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
  const channels = hue < 60 ? [chroma, x, 0]
    : hue < 120 ? [x, chroma, 0]
      : hue < 180 ? [0, chroma, x]
        : hue < 240 ? [0, x, chroma]
          : hue < 300 ? [x, 0, chroma] : [chroma, 0, x];
  return `#${channels.map((channel) => Math.round(floor + channel).toString(16).padStart(2, "0")).join("")}`;
}

function buildTheme(seed: ThemeSeed, mode: ThemeMode): ThemeTokens {
  const statusTokens =
    mode === "light"
      ? {
          successBg: "#2da874",
          successBgHover: "#56c996",
          successText: "#0d2d21",
          successBorder: "#8dd6b6",
          warningBg: "#dca22f",
          warningBgHover: "#ba8622",
          warningText: "#302006",
          warningBorder: "#e7c67e",
          errorBg: "#f12a83",
          errorBgHover: "#e83c8a",
          errorText: "#220413",
          errorBorder: "#ee8fbe",
          neutralBg: "#6f7a84",
          neutralBgHover: "#737f89",
          neutralText: "#05090c",
          neutralBorder: "#b4bcc4"
        }
      : {
          successBg: "#56c996",
          successBgHover: "#43b081",
          successText: "#0d2d21",
          successBorder: "#3c8e6e",
          warningBg: "#f0be58",
          warningBgHover: "#d6a649",
          warningText: "#35250a",
          warningBorder: "#8e6f36",
          errorBg: "#ff64ad",
          errorBgHover: "#ef4d9e",
          errorText: "#3d0f26",
          errorBorder: "#a94878",
          neutralBg: "#9ca6b0",
          neutralBgHover: "#8b949e",
          neutralText: "#202832",
          neutralBorder: "#5f6872"
        };

  return {
    surface: seed.surface,
    pageShellBg: derivePageShellBackground(seed.accent, mode),
    text: seed.text,
    border: seed.border,
    chromeBg: seed.chromeBg,
    chromeText: seed.chromeText,
    fontDisplay: '"Cantarell", sans-serif',
    fontBody: '"Gudea", sans-serif',
    fontDisplayLetterSpacing: "0.01em",
    buttonPrimaryBg: seed.accent,
    buttonPrimaryBgHover: seed.accentHover,
    buttonPrimaryText: seed.accentText,
    buttonSecondaryBg: seed.accentSoft,
    buttonSecondaryBgHover: seed.accentSoftHover,
    buttonSecondaryText: seed.accentSoftText,
    buttonGhostText: seed.accentGhost,
    buttonGhostBorder: seed.accentGhostBorder,
    buttonGhostBgHover: seed.accentGhostHover,
    ...statusTokens
  };
}

const primaryLight = buildTheme(
  {
    surface: "#eef3fb",
    text: "#1d3558",
    border: "#8ea5c2",
    chromeBg: "#3f618f",
    chromeText: "#f4f7fb",
    accent: "#3f618f",
    accentHover: "#36547c",
    accentText: "#f4f7fb",
    accentSoft: "#d6deea",
    accentSoftHover: "#c7d2e2",
    accentSoftText: "#23416a",
    accentGhost: "#3f618f",
    accentGhostBorder: "#8fa7c5",
    accentGhostHover: "rgba(63, 97, 143, 0.16)"
  },
  "light"
);

const primaryDark = buildTheme(
  {
    surface: "#111a28",
    text: "#d7e2f2",
    border: "#3f536f",
    chromeBg: "#2f4768",
    chromeText: "#eaf0f8",
    accent: "#7f97b9",
    accentHover: "#6e88ad",
    accentText: "#0b1829",
    accentSoft: "#24364f",
    accentSoftHover: "#2d4260",
    accentSoftText: "#d7e2f2",
    accentGhost: "#a8bdd8",
    accentGhostBorder: "#526782",
    accentGhostHover: "rgba(127, 151, 185, 0.2)"
  },
  "dark"
);

const secondaryLight = buildTheme(
  {
    surface: "#ffffff",
    text: "#292929",
    border: "#c9c9c9",
    chromeBg: "#666666",
    chromeText: "#fafafa",
    accent: "#666666",
    accentHover: "#5a5a5a",
    accentText: "#fafafa",
    accentSoft: "#eaeaea",
    accentSoftHover: "#dddddd",
    accentSoftText: "#3d3d3d",
    accentGhost: "#666666",
    accentGhostBorder: "#9c9c9c",
    accentGhostHover: "rgba(102, 102, 102, 0.12)"
  },
  "light"
);

const secondaryDark = buildTheme(
  {
    surface: "#141414",
    text: "#eaeaea",
    border: "#757575",
    chromeBg: "#4d4d4d",
    chromeText: "#f6f6f6",
    accent: "#a3a3a3",
    accentHover: "#949494",
    accentText: "#1a1a1a",
    accentSoft: "#383838",
    accentSoftHover: "#474747",
    accentSoftText: "#eaeaea",
    accentGhost: "#c9c9c9",
    accentGhostBorder: "#8c8c8c",
    accentGhostHover: "rgba(163, 163, 163, 0.2)"
  },
  "dark"
);

const tertiaryLight = buildTheme(
  {
    surface: "#f8fcfb",
    text: "#0f3a33",
    border: "#abd6cb",
    chromeBg: "#0f7f6d",
    chromeText: "#f2fffc",
    accent: "#0f7f6d",
    accentHover: "#0d6d5d",
    accentText: "#f2fffc",
    accentSoft: "#d7efea",
    accentSoftHover: "#c8e7e0",
    accentSoftText: "#0f3a33",
    accentGhost: "#0d6d5d",
    accentGhostBorder: "#8bc4b8",
    accentGhostHover: "rgba(15, 127, 109, 0.14)"
  },
  "light"
);

const tertiaryDark = buildTheme(
  {
    surface: "#07211c",
    text: "#dffbf5",
    border: "#2a5b52",
    chromeBg: "#0b5f58",
    chromeText: "#e9fffa",
    accent: "#5fd7c1",
    accentHover: "#47c7af",
    accentText: "#06201b",
    accentSoft: "#124137",
    accentSoftHover: "#195247",
    accentSoftText: "#dffbf5",
    accentGhost: "#9eeadd",
    accentGhostBorder: "#39736a",
    accentGhostHover: "rgba(95, 215, 193, 0.18)"
  },
  "dark"
);

const blueLight = buildTheme(
  {
    surface: "#f4f8ff",
    text: "#102a52",
    border: "#9fb8ee",
    chromeBg: "#255fc7",
    chromeText: "#f5f9ff",
    accent: "#255fc7",
    accentHover: "#1f52ae",
    accentText: "#f5f9ff",
    accentSoft: "#dce8ff",
    accentSoftHover: "#cfe0ff",
    accentSoftText: "#1a4b98",
    accentGhost: "#255fc7",
    accentGhostBorder: "#a8c1f3",
    accentGhostHover: "rgba(46, 114, 232, 0.14)"
  },
  "light"
);

const blueDark = buildTheme(
  {
    surface: "#0b172b",
    text: "#d8e6ff",
    border: "#345383",
    chromeBg: "#1a4fb4",
    chromeText: "#ebf2ff",
    accent: "#7eaaff",
    accentHover: "#6998f4",
    accentText: "#0b2147",
    accentSoft: "#1c345f",
    accentSoftHover: "#244171",
    accentSoftText: "#d8e6ff",
    accentGhost: "#a6c4ff",
    accentGhostBorder: "#4f70a8",
    accentGhostHover: "rgba(126, 170, 255, 0.2)"
  },
  "dark"
);

const redLight = buildTheme(
  {
    surface: "#fbf8f8",
    text: "#422125",
    border: "#e0c3c6",
    chromeBg: "#a6535c",
    chromeText: "#fcfafa",
    accent: "#a6535c",
    accentHover: "#924951",
    accentText: "#fcfafa",
    accentSoft: "#f3e7e8",
    accentSoftHover: "#ebd9db",
    accentSoftText: "#643237",
    accentGhost: "#924951",
    accentGhostBorder: "#c58f95",
    accentGhostHover: "rgba(166, 83, 92, 0.14)"
  },
  "light"
);

const redDark = buildTheme(
  {
    surface: "#1b0d0f",
    text: "#f3e9ea",
    border: "#8d474e",
    chromeBg: "#8d474e",
    chromeText: "#faf5f5",
    accent: "#c58f95",
    accentHover: "#bc7e85",
    accentText: "#2a1517",
    accentSoft: "#532a2e",
    accentSoftHover: "#6c363c",
    accentSoftText: "#f3e9ea",
    accentGhost: "#e0c3c6",
    accentGhostBorder: "#b8757d",
    accentGhostHover: "rgba(197, 143, 149, 0.2)"
  },
  "dark"
);

const greenLight = buildTheme(
  {
    surface: "#f4fcfa",
    text: "#0d3a35",
    border: "#a8d9d1",
    chromeBg: "#0f7d72",
    chromeText: "#effffb",
    accent: "#0f7d72",
    accentHover: "#0d6d63",
    accentText: "#effffb",
    accentSoft: "#d6f0eb",
    accentSoftHover: "#c5e9e2",
    accentSoftText: "#0d3a35",
    accentGhost: "#0d6d63",
    accentGhostBorder: "#86c6bc",
    accentGhostHover: "rgba(15, 125, 114, 0.14)"
  },
  "light"
);

const greenDark = buildTheme(
  {
    surface: "#071f1c",
    text: "#dffaf3",
    border: "#2e665f",
    chromeBg: "#0b5f58",
    chromeText: "#e9fffa",
    accent: "#4fd1bd",
    accentHover: "#3dc1ab",
    accentText: "#052320",
    accentSoft: "#14443f",
    accentSoftHover: "#1c5751",
    accentSoftText: "#dffaf3",
    accentGhost: "#8fe3d4",
    accentGhostBorder: "#3a8278",
    accentGhostHover: "rgba(79, 209, 189, 0.2)"
  },
  "dark"
);

const purpleLight = buildTheme(
  {
    surface: "#f9f8fa",
    text: "#2b213e",
    border: "#c7c0d6",
    chromeBg: "#5f4a89",
    chromeText: "#fafafb",
    accent: "#5f4a89",
    accentHover: "#524076",
    accentText: "#fafafb",
    accentSoft: "#e9e6ee",
    accentSoftHover: "#dcd7e5",
    accentSoftText: "#392c52",
    accentGhost: "#5f4a89",
    accentGhostBorder: "#9789b2",
    accentGhostHover: "rgba(95, 74, 137, 0.14)"
  },
  "light"
);

const purpleDark = buildTheme(
  {
    surface: "#130f1b",
    text: "#e9e6ee",
    border: "#6f5c95",
    chromeBg: "#5f4a89",
    chromeText: "#f5f4f8",
    accent: "#9789b2",
    accentHover: "#8777a7",
    accentText: "#181322",
    accentSoft: "#34294b",
    accentSoftHover: "#433460",
    accentSoftText: "#e9e6ee",
    accentGhost: "#c7c0d6",
    accentGhostBorder: "#8777a7",
    accentGhostHover: "rgba(151, 137, 178, 0.2)"
  },
  "dark"
);

const pinkLight = buildTheme(
  {
    surface: "#fdf9fa",
    text: "#422e33",
    border: "#e9bdc8",
    chromeBg: "#dd9aaa",
    chromeText: "#2c1f22",
    accent: "#dd9aaa",
    accentHover: "#c78b99",
    accentText: "#2c1f22",
    accentSoft: "#f7e6ea",
    accentSoftHover: "#f2d9df",
    accentSoftText: "#583e44",
    accentGhost: "#855c66",
    accentGhostBorder: "#bc8391",
    accentGhostHover: "rgba(221, 154, 170, 0.14)"
  },
  "light"
);

const pinkDark = buildTheme(
  {
    surface: "#1f1618",
    text: "#faf0f2",
    border: "#7a555e",
    chromeBg: "#7a555e",
    chromeText: "#fdf9fa",
    accent: "#dd9aaa",
    accentHover: "#cb8e9c",
    accentText: "#2c1f22",
    accentSoft: "#583e44",
    accentSoftHover: "#6f4d55",
    accentSoftText: "#faf0f2",
    accentGhost: "#e9bdc8",
    accentGhostBorder: "#a67480",
    accentGhostHover: "rgba(221, 154, 170, 0.2)"
  },
  "dark"
);

export const themeTokens: Record<ThemeName, Record<ThemeMode, ThemeTokens>> = {
  primary: {
    light: primaryLight,
    dark: primaryDark
  },
  secondary: {
    light: secondaryLight,
    dark: secondaryDark
  },
  tertiary: {
    light: tertiaryLight,
    dark: tertiaryDark
  },
  blue: {
    light: blueLight,
    dark: blueDark
  },
  red: {
    light: redLight,
    dark: redDark
  },
  green: {
    light: greenLight,
    dark: greenDark
  },
  purple: {
    light: purpleLight,
    dark: purpleDark
  },
  pink: {
    light: pinkLight,
    dark: pinkDark
  }
};

export function getThemeTokens(theme: ThemeName, mode: ThemeMode): ThemeTokens {
  return themeTokens[theme][mode];
}
