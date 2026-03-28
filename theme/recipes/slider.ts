import { defineSlotRecipe } from "@chakra-ui/react";

export const sliderRecipe = defineSlotRecipe({
  slots: ["root", "track", "range", "thumb"],
  base: {
    root: {
      width: "full",
    },
    track: {
      bg: "olive.400",
      borderRadius: "full",
      height: "1.5",
    },
    range: {
      bg: "amber.400",
      borderRadius: "full",
    },
    thumb: {
      width: "3.5",
      height: "3.5",
      bg: "amber.400",
      borderRadius: "full",
      border: "2px solid",
      borderColor: "amber.500",
      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.4)",
      cursor: "pointer",
      _hover: { bg: "amber.300" },
      _active: { transform: "scale(1.15)" },
    },
  },
});
