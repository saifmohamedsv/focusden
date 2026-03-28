import { SpacePalette } from "@/types";

export const defaultPalette: SpacePalette = {
  bg_primary: "#14130e",
  bg_secondary: "#1e1c16",
  accent: "#d4943a",
  accent_hover: "#e8a32e",
  text_primary: "#e8e0d0",
  text_secondary: "#8a7a5e",
  border: "#3a3428",
  surface: "#2a2620",
};

export function applyPalette(palette: SpacePalette): void {
  const root = document.documentElement;
  root.style.setProperty("--color-bg-primary", palette.bg_primary);
  root.style.setProperty("--color-bg-secondary", palette.bg_secondary);
  root.style.setProperty("--color-accent", palette.accent);
  root.style.setProperty("--color-accent-hover", palette.accent_hover);
  root.style.setProperty("--color-text-primary", palette.text_primary);
  root.style.setProperty("--color-text-secondary", palette.text_secondary);
  root.style.setProperty("--color-border", palette.border);
  root.style.setProperty("--color-surface", palette.surface);
}

export const spacePalettes: Record<string, SpacePalette> = {
  "rainy-library": defaultPalette,
  "ocean-cabin": {
    bg_primary: "#0e1419",
    bg_secondary: "#141d24",
    accent: "#4a9bb5",
    accent_hover: "#5eb8d4",
    text_primary: "#d4e4ec",
    text_secondary: "#6a8a9e",
    border: "#243440",
    surface: "#1a2830",
  },
  "mountain-lodge": {
    bg_primary: "#16130f",
    bg_secondary: "#201c16",
    accent: "#c27a3a",
    accent_hover: "#d98f4e",
    text_primary: "#e8ddd0",
    text_secondary: "#8a755e",
    border: "#3a3020",
    surface: "#2a2418",
  },
  "zen-garden": {
    bg_primary: "#0e1410",
    bg_secondary: "#141e16",
    accent: "#5a9b6b",
    accent_hover: "#6bb87e",
    text_primary: "#d4e8da",
    text_secondary: "#6a9a7a",
    border: "#243a2a",
    surface: "#1a2e20",
  },
  "sunset-desert": {
    bg_primary: "#181210",
    bg_secondary: "#221a16",
    accent: "#d46a3a",
    accent_hover: "#e87e4e",
    text_primary: "#e8dcd4",
    text_secondary: "#9a7a6a",
    border: "#3a2a22",
    surface: "#2e2018",
  },
  "midnight-city": {
    bg_primary: "#0e0e14",
    bg_secondary: "#14141e",
    accent: "#7a6ad4",
    accent_hover: "#9488e8",
    text_primary: "#d8d4e8",
    text_secondary: "#7a7a9a",
    border: "#2a2a3a",
    surface: "#1e1e2e",
  },
  "autumn-cafe": {
    bg_primary: "#16120e",
    bg_secondary: "#201a14",
    accent: "#c4843a",
    accent_hover: "#d8984e",
    text_primary: "#e8dece",
    text_secondary: "#8a7a60",
    border: "#3a3020",
    surface: "#2a2418",
  },
  "northern-cabin": {
    bg_primary: "#101416",
    bg_secondary: "#161e22",
    accent: "#5a8aaa",
    accent_hover: "#6ea0c0",
    text_primary: "#d4dee8",
    text_secondary: "#6a8090",
    border: "#243038",
    surface: "#1a2830",
  },
};
