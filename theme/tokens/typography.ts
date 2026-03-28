import { defineTokens } from "@chakra-ui/react";

export const fonts = defineTokens.fonts({
  heading: { value: "'Lora', Georgia, serif" },
  body: { value: "'DM Sans', system-ui, sans-serif" },
  mono: { value: "'JetBrains Mono', 'Fira Code', monospace" },
});

export const fontSizes = defineTokens.fontSizes({
  xs: { value: "0.6875rem" },
  sm: { value: "0.8125rem" },
  md: { value: "0.9375rem" },
  lg: { value: "1.0625rem" },
  xl: { value: "1.25rem" },
  "2xl": { value: "1.625rem" },
  "3xl": { value: "2.125rem" },
  "4xl": { value: "3rem" },
  timer: { value: "3rem" },
});

export const fontWeights = defineTokens.fontWeights({
  light: { value: "300" },
  normal: { value: "400" },
  medium: { value: "500" },
  semibold: { value: "600" },
});
