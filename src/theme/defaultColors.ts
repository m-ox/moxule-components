export interface PrimaryThemeModeColors {
  surface: string;
  text: string;
  border: string;
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  buttonSecondaryBg: string;
  buttonSecondaryText: string;
  buttonGhostText: string;
  buttonGhostBorder: string;
}

export interface DefaultPrimaryColors {
  light: PrimaryThemeModeColors;
  dark: PrimaryThemeModeColors;
}

export const defaultPrimaryColors: DefaultPrimaryColors = {
  light: {
    surface: "#f7fdf9",
    text: "#0f2b1f",
    border: "#b7dcc8",
    buttonPrimaryBg: "#1f8f58",
    buttonPrimaryText: "#f6fff9",
    buttonSecondaryBg: "#daf0e2",
    buttonSecondaryText: "#15482e",
    buttonGhostText: "#1f8f58",
    buttonGhostBorder: "#89c8a3"
  },
  dark: {
    surface: "#081a12",
    text: "#dcf9e8",
    border: "#2d6046",
    buttonPrimaryBg: "#5fdd9a",
    buttonPrimaryText: "#092116",
    buttonSecondaryBg: "#123525",
    buttonSecondaryText: "#dcf9e8",
    buttonGhostText: "#8ee6b7",
    buttonGhostBorder: "#3a7f5c"
  }
};
