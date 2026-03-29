"use client";

import { Box, Text, HStack, IconButton } from "@chakra-ui/react";
import { useRef, useCallback, useState } from "react";
import { useAppStore } from "@/store";
import { FloatingPanel } from "@/components/ui/FloatingPanel";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

const textareaBaseStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  outline: "none",
  color: "var(--chakra-colors-fg-secondary, var(--color-fg-secondary))",
  fontSize: "1rem",
  resize: "none",
  lineHeight: "1.7",
  fontFamily: "inherit",
  width: "100%",
};

export function NotesPanel() {
  const notesContent = useAppStore((s) => s.notesContent);
  const setNotes = useAppStore((s) => s.setNotes);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [expanded, setExpanded] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = useCallback((e: any) => {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setNotes(value); }, 500);
  }, [setNotes]);

  return (
    <>
      <Box bg="bg.panel" border="1px solid" borderColor="border" borderRadius="xl" p="4" flex="1" display="flex" flexDirection="column" minH="0">
        <HStack justify="space-between" mb="3">
          <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="0.15em">Notes</Text>
          <HStack gap="1">
            <IconButton aria-label="Expand notes" variant="ghost" size="sm" rounded="full" onClick={() => setExpanded(true)}><ExpandIcon /></IconButton>
            <IconButton aria-label="Add note" variant="ghost" size="sm" rounded="full"><PlusIcon /></IconButton>
          </HStack>
        </HStack>
        <textarea
          defaultValue={notesContent}
          onChange={handleChange}
          placeholder="What are you working on..."
          style={{ ...textareaBaseStyle, flex: 1, minHeight: 0 }}
        />
      </Box>

      {expanded && (
        <FloatingPanel title="Notes" onClose={() => setExpanded(false)}>
          <textarea
            defaultValue={notesContent}
            onChange={handleChange}
            placeholder="What are you working on..."
            style={{ ...textareaBaseStyle, height: "100%", minHeight: "40vh" }}
          />
        </FloatingPanel>
      )}
    </>
  );
}
