import { defineTokens } from "@chakra-ui/react";

export const fonts = defineTokens.fonts({
  heading: { value: "'Inter', sans-serif" },
  body: { value: "'Inter', sans-serif" },
  mono: { value: "'JetBrains Mono', monospace" },
});

export const fontSizes = defineTokens.fontSizes({
  xs: { value: "0.75rem" },
  sm: { value: "0.8125rem" },
  md: { value: "0.875rem" },
  lg: { value: "1rem" },
  xl: { value: "1.125rem" },
  "2xl": { value: "1.5rem" },
  "3xl": { value: "2rem" },
  "4xl": { value: "3rem" },
  timer: { value: "4.5rem" },
});

export const fontWeights = defineTokens.fontWeights({
  normal: { value: "400" },
  medium: { value: "500" },
  semibold: { value: "600" },
  bold: { value: "700" },
});
