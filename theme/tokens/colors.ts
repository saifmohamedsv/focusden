import { defineTokens } from "@chakra-ui/react";

export const colors = defineTokens.colors({
  // Background & surface hierarchy
  olive: {
    50: { value: "#EDE5D0" },
    100: { value: "#A89880" },
    200: { value: "#736858" },
    300: { value: "#4a4438" },
    400: { value: "#3d3830" },
    500: { value: "#322e26" },
    600: { value: "#2a2620" },
    700: { value: "#221f18" },
    800: { value: "#1c1a14" },
    900: { value: "#181713" },
    950: { value: "#131210" },
  },
  // Accent — warm amber
  amber: {
    50: { value: "#fef7ec" },
    100: { value: "#f5dfc0" },
    200: { value: "#e8c490" },
    300: { value: "#d4a560" },
    400: { value: "#C8894A" },
    500: { value: "#b07838" },
    600: { value: "#8a5e30" },
    700: { value: "#6b4825" },
    800: { value: "#3d2e1e" },
    900: { value: "#2a1f14" },
    950: { value: "#1a130c" },
  },
  // Sage — success / completed states
  sage: {
    50: { value: "#e8f0e9" },
    100: { value: "#c0d8c4" },
    200: { value: "#90b896" },
    300: { value: "#6B8F71" },
    400: { value: "#5A8A60" },
    500: { value: "#4a6350" },
    600: { value: "#3a5040" },
    700: { value: "#2a3d30" },
    800: { value: "#1e2d20" },
    900: { value: "#152218" },
    950: { value: "#0d1610" },
  },
  // Mist — info / neutral accent
  mist: {
    50: { value: "#e4edf4" },
    100: { value: "#c0d4e2" },
    200: { value: "#8CA3B4" },
    300: { value: "#6a8a9e" },
    400: { value: "#506878" },
    500: { value: "#3a4e5c" },
    600: { value: "#2a3a46" },
    700: { value: "#1e2830" },
    800: { value: "#141e26" },
    900: { value: "#0e151c" },
    950: { value: "#080e12" },
  },
});
