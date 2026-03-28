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
      <Heading color="accent" size="2xl" fontFamily="heading">
        FocusDen
      </Heading>
      <Text color="fg.secondary" fontSize="lg">
        Focus, Flow, Feel Good
      </Text>
    </Box>
  );
}
