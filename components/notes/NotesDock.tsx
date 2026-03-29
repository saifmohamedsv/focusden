"use client";

import { Box, Text } from "@chakra-ui/react";
import { useRef, useCallback, useState } from "react";
import { useAppStore } from "@/store";
import { FloatingPanel } from "@/components/ui/FloatingPanel";

function NotesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  );
}

export function NotesDock() {
  const notesContent = useAppStore((s) => s.notesContent);
  const setNotes = useAppStore((s) => s.setNotes);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const noteCount = notesContent.trim() ? notesContent.trim().split("\n").length : 0;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setNotes(value);
      }, 500);
    },
    [setNotes],
  );

  return (
    <>
      <Box
        as="button"
        onClick={() => setOpen(true)}
        display="flex"
        alignItems="center"
        gap="2"
        px="3"
        py="1.5"
        borderRadius="full"
        bg="transparent"
        color="fg.secondary"
        cursor="pointer"
        transition="all 0.15s"
        _hover={{ bg: "bg.surface", color: "fg" }}
        title="Open notes"
      >
        <NotesIcon />
        <Text fontSize="xs" fontWeight="medium" display={{ base: "none", md: "block" }}>
          Notes
        </Text>
        {noteCount > 0 && (
          <Box
            w="5"
            h="5"
            borderRadius="full"
            bg="accent.soft"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="xs" color="accent" fontWeight="semibold" lineHeight="1">
              {noteCount}
            </Text>
          </Box>
        )}
      </Box>

      {open && (
        <FloatingPanel title="Notes" onClose={() => setOpen(false)}>
          <textarea
            defaultValue={notesContent}
            onChange={handleChange}
            placeholder="What are you working on..."
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--color-text-secondary)",
              fontSize: "1rem",
              resize: "none",
              lineHeight: "1.7",
              fontFamily: "inherit",
              width: "100%",
              height: "100%",
              minHeight: "40vh",
            }}
          />
        </FloatingPanel>
      )}
    </>
  );
}
