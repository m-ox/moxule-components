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
          warningText: "#3a2908",
          warningBorder: "#e7c67e",
          errorBg: "#f12a83",
          errorBgHover: "#cf1f6e",
          errorText: "#3d0f26",
          errorBorder: "#ee8fbe",
          neutralBg: "#6f7a84",
          neutralBgHover: "#5c6670",
          neutralText: "#1f2730",
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
    // Keep the page neutral so themed card surfaces remain distinct.
    pageShellBg: mode === "light" ? "#e8e8e8" : "#0c0c0c",
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
    accentText: "#17283f",
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
    surface: "#f6f7f8",
    text: "#2e343b",
    border: "#c7cdd3",
    chromeBg: "#5f6f7f",
    chromeText: "#f8fafc",
    accent: "#5f6f7f",
    accentHover: "#526170",
    accentText: "#f8fafc",
    accentSoft: "#dce1e6",
    accentSoftHover: "#cfd6dc",
    accentSoftText: "#2e343b",
    accentGhost: "#4f5d6b",
    accentGhostBorder: "#a8b0b8",
    accentGhostHover: "rgba(95, 111, 127, 0.15)"
  },
  "light"
);

const secondaryDark = buildTheme(
  {
    surface: "#1f242a",
    text: "#dde3e9",
    border: "#4c5863",
    chromeBg: "#3c4651",
    chromeText: "#f3f6f9",
    accent: "#9aa9b8",
    accentHover: "#8798a8",
    accentText: "#1b222a",
    accentSoft: "#2d353d",
    accentSoftHover: "#353f48",
    accentSoftText: "#dde3e9",
    accentGhost: "#b4c0cc",
    accentGhostBorder: "#63707c",
    accentGhostHover: "rgba(154, 169, 184, 0.18)"
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
    accentGhost: "#0f7f6d",
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
    accentGhost: "#2e72e8",
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
    surface: "#fff7fb",
    text: "#4d2035",
    border: "#efb1d0",
    chromeBg: "#f12a83",
    chromeText: "#2d0a1d",
    accent: "#f12a83",
    accentHover: "#d91f73",
    accentText: "#fff4fa",
    accentSoft: "#ffd8ea",
    accentSoftHover: "#ffc8e1",
    accentSoftText: "#6f244a",
    accentGhost: "#f12a83",
    accentGhostBorder: "#ea93bc",
    accentGhostHover: "rgba(241, 42, 131, 0.14)"
  },
  "light"
);

const redDark = buildTheme(
  {
    surface: "#2a1320",
    text: "#ffdce9",
    border: "#8f486d",
    chromeBg: "#c11d67",
    chromeText: "#ffebf3",
    accent: "#f56aa9",
    accentHover: "#ef559b",
    accentText: "#3e1227",
    accentSoft: "#5a2340",
    accentSoftHover: "#6a2b4c",
    accentSoftText: "#ffdce9",
    accentGhost: "#f7a7cc",
    accentGhostBorder: "#995375",
    accentGhostHover: "rgba(245, 106, 169, 0.2)"
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
    accentGhost: "#0f7d72",
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
    surface: "#faf6ff",
    text: "#3a2452",
    border: "#cfb8eb",
    chromeBg: "#7b4bd9",
    chromeText: "#f8f4ff",
    accent: "#7b4bd9",
    accentHover: "#693bc4",
    accentText: "#f8f4ff",
    accentSoft: "#eadfff",
    accentSoftHover: "#dfd1ff",
    accentSoftText: "#4d3272",
    accentGhost: "#7b4bd9",
    accentGhostBorder: "#b899e8",
    accentGhostHover: "rgba(123, 75, 217, 0.14)"
  },
  "light"
);

const purpleDark = buildTheme(
  {
    surface: "#1e1630",
    text: "#e8dcff",
    border: "#5c4b80",
    chromeBg: "#5f36af",
    chromeText: "#f2ebff",
    accent: "#b391ff",
    accentHover: "#a57dff",
    accentText: "#241440",
    accentSoft: "#342553",
    accentSoftHover: "#422f66",
    accentSoftText: "#e8dcff",
    accentGhost: "#c8adff",
    accentGhostBorder: "#7661a8",
    accentGhostHover: "rgba(179, 145, 255, 0.2)"
  },
  "dark"
);

const pinkLight = buildTheme(
  {
    surface: "#fff7ff",
    text: "#4f2456",
    border: "#f0baf0",
    chromeBg: "#f858ee",
    chromeText: "#4b1550",
    accent: "#f858ee",
    accentHover: "#e045d6",
    accentText: "#4b1550",
    accentSoft: "#ffdffd",
    accentSoftHover: "#ffcffa",
    accentSoftText: "#6d2f73",
    accentGhost: "#f858ee",
    accentGhostBorder: "#e59be1",
    accentGhostHover: "rgba(248, 88, 238, 0.14)"
  },
  "light"
);

const pinkDark = buildTheme(
  {
    surface: "#29162e",
    text: "#ffe4ff",
    border: "#8a5a93",
    chromeBg: "#9f3499",
    chromeText: "#ffedff",
    accent: "#f37fec",
    accentHover: "#eb68e2",
    accentText: "#3c1540",
    accentSoft: "#55295f",
    accentSoftHover: "#673373",
    accentSoftText: "#ffe4ff",
    accentGhost: "#f6b4f2",
    accentGhostBorder: "#9a66a6",
    accentGhostHover: "rgba(243, 127, 236, 0.2)"
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