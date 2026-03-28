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
    },
  },
  variants: {
    variant: {
      primary: {
        bg: "amber.500",
        color: "olive.950",
        _hover: { bg: "amber.400" },
        _active: { bg: "amber.600" },
      },
      ghost: {
        bg: "transparent",
        color: "olive.200",
        _hover: { bg: "olive.800" },
        _active: { bg: "olive.700" },
      },
      surface: {
        bg: "olive.800",
        color: "olive.100",
        border: "1px solid",
        borderColor: "olive.700",
        _hover: { bg: "olive.700" },
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
