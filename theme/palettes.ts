import { SpacePalette } from "@/types";

// Default palette — "Rainy Library" (warm olive/amber)
export const defaultPalette: SpacePalette = {
  bg_primary: "#181713",
  bg_secondary: "#221f18",
  accent: "#C8894A",
  accent_hover: "#d4a560",
  text_primary: "#EDE5D0",
  text_secondary: "#A89880",
  border: "rgba(255, 255, 255, 0.07)",
  surface: "#2a2620",
};

// Applies a space palette as CSS custom properties on :root
export function applyPalette(palette: SpacePalette): void {
  const root = document.documentElement;
  // Only set space-scoped variables — wallpaper bg + accent
  // Text, border, surface stay constant (base theme)
  root.style.setProperty("--color-bg-primary", palette.bg_primary);
  root.style.setProperty("--color-bg-secondary", palette.bg_secondary);
  root.style.setProperty("--color-accent", palette.accent);
  root.style.setProperty("--color-accent-hover", palette.accent_hover);
}

// Each space defines its own palette override
export const spacePalettes: Record<string, SpacePalette> = {
  "rainy-library": defaultPalette,
  "ocean-cabin": {
    bg_primary: "#0e1419",
    bg_secondary: "#141d24",
    accent: "#4a9bb5",
    accent_hover: "#5eb8d4",
    text_primary: "#d4e4ec",
    text_secondary: "#6a8a9e",
    border: "rgba(255, 255, 255, 0.07)",
    surface: "#1a2830",
  },
  "mountain-lodge": {
    bg_primary: "#16130f",
    bg_secondary: "#201c16",
    accent: "#c27a3a",
    accent_hover: "#d98f4e",
    text_primary: "#e8ddd0",
    text_secondary: "#8a755e",
    border: "rgba(255, 255, 255, 0.07)",
    surface: "#2a2418",
  },
  "zen-garden": {
    bg_primary: "#0e1410",
    bg_secondary: "#141e16",
    accent: "#5a9b6b",
    accent_hover: "#6bb87e",
    text_primary: "#d4e8da",
    text_secondary: "#6a9a7a",
    border: "rgba(255, 255, 255, 0.07)",
    surface: "#1a2e20",
  },
  "sunset-desert": {
    bg_primary: "#181210",
    bg_secondary: "#221a16",
    accent: "#d46a3a",
    accent_hover: "#e87e4e",
    text_primary: "#e8dcd4",
    text_secondary: "#9a7a6a",
    border: "rgba(255, 255, 255, 0.07)",
    surface: "#2e2018",
  },
  "midnight-city": {
    bg_primary: "#0e0e14",
    bg_secondary: "#14141e",
    accent: "#7a6ad4",
    accent_hover: "#9488e8",
    text_primary: "#d8d4e8",
    text_secondary: "#7a7a9a",
    border: "rgba(255, 255, 255, 0.07)",
    surface: "#1e1e2e",
  },
  "autumn-cafe": {
    bg_primary: "#16120e",
    bg_secondary: "#201a14",
    accent: "#c4843a",
    accent_hover: "#d8984e",
    text_primary: "#e8dece",
    text_secondary: "#8a7a60",
    border: "rgba(255, 255, 255, 0.07)",
    surface: "#2a2418",
  },
  "northern-cabin": {
    bg_primary: "#101416",
    bg_secondary: "#161e22",
    accent: "#5a8aaa",
    accent_hover: "#6ea0c0",
    text_primary: "#d4dee8",
    text_secondary: "#6a8090",
    border: "rgba(255, 255, 255, 0.07)",
    surface: "#1a2830",
  },
};
