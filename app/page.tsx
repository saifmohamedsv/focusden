import { Box, Heading, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box
      minH="100vh"
      bg="bg"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="4"
    >
      <Heading color="accent" size="2xl">
        destract
      </Heading>
      <Text color="fg.muted" fontSize="lg">
        Focus, Flow, Feel Good
      </Text>
    </Box>
  );
}
