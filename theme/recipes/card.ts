import { defineRecipe } from "@chakra-ui/react";

export const cardRecipe = defineRecipe({
  base: {
    bg: "olive.700",
    border: "1px solid",
    borderColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: "xl",
    backdropFilter: "blur(8px)",
  },
  variants: {
    variant: {
      default: {},
      elevated: {
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
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
