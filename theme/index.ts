import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { colors } from "./tokens/colors";
import { fonts, fontSizes, fontWeights } from "./tokens/typography";
import { buttonRecipe } from "./recipes/button";
import { cardRecipe } from "./recipes/card";
import { inputRecipe } from "./recipes/input";
import { sliderRecipe } from "./recipes/slider";

const config = defineConfig({
  theme: {
    tokens: {
      colors,
      fonts,
      fontSizes,
      fontWeights,
    },
    semanticTokens: {
      colors: {
        // Background hierarchy
        bg: {
          DEFAULT: { value: "{colors.olive.900}" },
          panel: { value: "{colors.olive.700}" },
          surface: { value: "{colors.olive.600}" },
          elevated: { value: "{colors.olive.500}" },
          active: { value: "{colors.olive.400}" },
        },
        // Text hierarchy
        fg: {
          DEFAULT: { value: "{colors.olive.50}" },
          secondary: { value: "{colors.olive.100}" },
          muted: { value: "{colors.olive.200}" },
          dim: { value: "{colors.olive.300}" },
        },
        // Accent
        accent: {
          DEFAULT: { value: "{colors.amber.400}" },
          dim: { value: "{colors.amber.600}" },
          soft: { value: "{colors.amber.800}" },
          glow: { value: "rgba(200, 137, 74, 0.18)" },
        },
        // Borders
        border: {
          DEFAULT: { value: "rgba(255, 255, 255, 0.07)" },
          mid: { value: "rgba(255, 255, 255, 0.12)" },
          strong: { value: "rgba(255, 255, 255, 0.18)" },
        },
        // Semantic
        success: {
          DEFAULT: { value: "{colors.sage.400}" },
          dim: { value: "{colors.sage.500}" },
          soft: { value: "{colors.sage.800}" },
        },
        warning: {
          DEFAULT: { value: "#C4853A" },
        },
        danger: {
          DEFAULT: { value: "#A04040" },
        },
        info: {
          DEFAULT: { value: "{colors.mist.200}" },
          soft: { value: "{colors.mist.700}" },
        },
      },
    },
    recipes: {
      button: buttonRecipe,
      card: cardRecipe,
      input: inputRecipe,
    },
    slotRecipes: {
      slider: sliderRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
