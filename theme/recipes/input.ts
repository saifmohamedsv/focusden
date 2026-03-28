import { defineRecipe } from "@chakra-ui/react";

export const inputRecipe = defineRecipe({
  base: {
    bg: "olive.800/50",
    border: "1px solid",
    borderColor: "olive.700/50",
    borderRadius: "lg",
    color: "olive.100",
    fontSize: "md",
    px: "3",
    py: "2",
    transition: "all 0.2s",
    _placeholder: { color: "olive.500" },
    _focus: {
      borderColor: "amber.500/50",
      outline: "none",
      boxShadow: "0 0 0 1px var(--chakra-colors-amber-500)",
    },
  },
});
