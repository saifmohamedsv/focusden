"use client";

import { HStack, Text, IconButton, Box } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo } from "@/types";
import { useAppStore } from "@/store";

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

interface TodoItemProps { todo: Todo; }

export function TodoItem({ todo }: TodoItemProps) {
  const toggleTodo = useAppStore((s) => s.toggleTodo);
  const deleteTodo = useAppStore((s) => s.deleteTodo);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <HStack ref={setNodeRef} style={style} gap="3" py="1.5" cursor="grab" {...attributes} {...listeners} role="group">
      <Box as="button" onClick={() => toggleTodo(todo.id)} w="5" h="5" borderRadius="md" border="1.5px solid" borderColor={todo.completed ? "success" : "border.mid"} bg={todo.completed ? "success.soft" : "transparent"} display="flex" alignItems="center" justifyContent="center" flexShrink={0} color="success" cursor="pointer">
        {todo.completed && <CheckIcon />}
      </Box>
      <Text flex="1" fontSize="sm" color={todo.completed ? "fg.muted" : "fg.secondary"} textDecoration={todo.completed ? "line-through" : "none"}>
        {todo.text}
      </Text>
      <IconButton aria-label="Delete todo" variant="ghost" size="sm" onClick={() => deleteTodo(todo.id)} opacity={0} _groupHover={{ opacity: 1 }} color="fg.muted" rounded="full">
        <TrashIcon />
      </IconButton>
    </HStack>
  );
}
