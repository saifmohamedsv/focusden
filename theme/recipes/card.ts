import { defineRecipe } from "@chakra-ui/react";

export const cardRecipe = defineRecipe({
  base: {
    bg: "olive.900/60",
    border: "1px solid",
    borderColor: "olive.700/50",
    borderRadius: "xl",
    backdropFilter: "blur(8px)",
  },
  variants: {
    variant: {
      default: {},
      elevated: {
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      },
    },
    size: {
      sm: { p: "3" },
      md: { p: "4" },
      lg: { p: "6" },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
