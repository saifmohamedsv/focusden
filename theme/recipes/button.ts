import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: "medium",
    borderRadius: "lg",
    cursor: "pointer",
    transition: "all 0.2s",
    _focusVisible: {
      outline: "2px solid",
      outlineColor: "amber.400",
      outlineOffset: "2px",
      boxShadow: "0 0 24px rgba(200, 137, 74, 0.15)",
    },
  },
  variants: {
    variant: {
      primary: {
        bg: "amber.400",
        color: "olive.900",
        _hover: { bg: "amber.300" },
        _active: { bg: "amber.500" },
      },
      ghost: {
        bg: "transparent",
        color: "olive.50",
        _hover: { bg: "olive.600" },
        _active: { bg: "olive.500" },
      },
      surface: {
        bg: "olive.600",
        color: "olive.50",
        border: "1px solid",
        borderColor: "rgba(255, 255, 255, 0.07)",
        _hover: { bg: "olive.500", borderColor: "rgba(255, 255, 255, 0.12)" },
      },
    },
    size: {
      sm: { px: "3", py: "1.5", fontSize: "sm" },
      md: { px: "4", py: "2", fontSize: "md" },
      lg: { px: "6", py: "3", fontSize: "lg" },
      icon: { p: "2", fontSize: "lg" },
    },
  },
  defaultVariants: {
    variant: "ghost",
    size: "md",
  },
});
