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
        bg: {
          DEFAULT: { value: "{colors.olive.950}" },
          secondary: { value: "{colors.olive.900}" },
          surface: { value: "{colors.olive.800}" },
        },
        fg: {
          DEFAULT: { value: "{colors.olive.100}" },
          muted: { value: "{colors.olive.400}" },
        },
        accent: {
          DEFAULT: { value: "{colors.amber.500}" },
          hover: { value: "{colors.amber.400}" },
          subtle: { value: "{colors.amber.500/20}" },
        },
        border: {
          DEFAULT: { value: "{colors.olive.700}" },
          subtle: { value: "{colors.olive.700/50}" },
        },
        success: {
          DEFAULT: { value: "{colors.sage.400}" },
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
