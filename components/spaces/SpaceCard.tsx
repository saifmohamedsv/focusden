"use client";

import { Box, Text } from "@chakra-ui/react";
import { useAppStore } from "@/store";
import { Space } from "@/types";

interface SpaceCardProps {
  space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
  const activeSpaceId = useAppStore((s) => s.activeSpaceId);
  const setActiveSpace = useAppStore((s) => s.setActiveSpace);
  const isActive = activeSpaceId === space.id;

  return (
    <Box
      as="button"
      position="relative"
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      border="2px solid"
      borderColor={isActive ? "yellow.400" : "transparent"}
      onClick={() => setActiveSpace(space.id)}
      w="100%"
      h="80px"
      _hover={{ borderColor: isActive ? "yellow.400" : "border.mid" }}
      transition="border-color 0.15s ease"
      style={{
        backgroundImage: `url(${space.wallpaper_path})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <Box
        position="absolute"
        inset="0"
        bg="blackAlpha.500"
      />

      {/* Active green dot */}
      {isActive && (
        <Box
          position="absolute"
          top="6px"
          right="6px"
          w="8px"
          h="8px"
          borderRadius="full"
          bg="green.400"
        />
      )}

      {/* Space name */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        px="2"
        py="1.5"
        bgGradient="to-t"
        gradientFrom="blackAlpha.800"
        gradientTo="transparent"
      >
        <Text fontSize="xs" fontWeight="medium" color="white" lineHeight="1.2">
          {space.name}
        </Text>
      </Box>
    </Box>
  );
}
