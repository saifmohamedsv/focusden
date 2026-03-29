"use client";

import { Box, Text, HStack, IconButton } from "@chakra-ui/react";
import { useRef, useCallback } from "react";
import { useAppStore } from "@/store";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function NotesPanel() {
  const notesContent = useAppStore((s) => s.notesContent);
  const setNotes = useAppStore((s) => s.setNotes);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = useCallback((e: any) => {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setNotes(value); }, 500);
  }, [setNotes]);

  return (
    <Box bg="bg.panel" border="1px solid" borderColor="border" borderRadius="xl" p="4" flex="1" display="flex" flexDirection="column" minH="0">
      <HStack justify="space-between" mb="3">
        <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="0.15em">Notes</Text>
        <IconButton aria-label="Add note" variant="ghost" size="sm" rounded="full"><PlusIcon /></IconButton>
      </HStack>
      <textarea
        defaultValue={notesContent}
        onChange={handleChange}
        placeholder="What are you working on..."
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "var(--chakra-colors-fg-secondary, var(--color-fg-secondary))",
          fontSize: "1rem",
          resize: "none",
          lineHeight: "1.7",
          fontFamily: "inherit",
          width: "100%",
          minHeight: 0,
        }}
      />
    </Box>
  );
}
