"use client";

import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { SPACES } from "@/lib/supabase/spaces";
import { SpaceCard } from "./SpaceCard";

export function SpaceGrid() {
  return (
    <Box>
      <Text
        fontSize="xs"
        fontWeight="semibold"
        color="fg.muted"
        textTransform="uppercase"
        letterSpacing="0.15em"
        mb="3"
      >
        Spaces
      </Text>
      <SimpleGrid columns={2} gap="2">
        {SPACES.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
