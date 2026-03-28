import { defineRecipe } from "@chakra-ui/react";

export const inputRecipe = defineRecipe({
  base: {
    bg: "olive.600",
    border: "1px solid",
    borderColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: "sm",
    color: "olive.50",
    fontSize: "md",
    px: "3",
    py: "2",
    transition: "all 0.2s",
    _placeholder: { color: "olive.200" },
    _focus: {
      borderColor: "rgba(255, 255, 255, 0.18)",
      outline: "none",
      boxShadow: "0 0 24px rgba(200, 137, 74, 0.15)",
    },
  },
});
