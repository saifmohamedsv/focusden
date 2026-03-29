"use client";

import { Box, Text, HStack, IconButton } from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useAppStore } from "@/store";
import { TodoItem } from "./TodoItem";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function TodoList() {
  const todos = useAppStore((s) => s.todos);
  const addTodo = useAppStore((s) => s.addTodo);
  const reorderTodos = useAppStore((s) => s.reorderTodos);
  const [newTodoText, setNewTodoText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = useCallback(() => {
    if (newTodoText.trim()) { addTodo(newTodoText.trim()); setNewTodoText(""); setIsAdding(false); }
  }, [newTodoText, addTodo]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") { setNewTodoText(""); setIsAdding(false); }
  }, [handleAdd]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = todos.findIndex((t) => t.id === active.id);
    const newIndex = todos.findIndex((t) => t.id === over.id);
    reorderTodos(arrayMove(todos, oldIndex, newIndex));
  }, [todos, reorderTodos]);

  return (
    <Box bg="bg.panel" border="1px solid" borderColor="border" borderRadius="xl" p="4" flex="1" display="flex" flexDirection="column" minH="0">
      <HStack justify="space-between" mb="3">
        <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="0.15em">Todos</Text>
        <IconButton aria-label="Add todo" variant="ghost" size="sm" onClick={() => setIsAdding(true)} rounded="full"><PlusIcon /></IconButton>
      </HStack>
      {isAdding && (
        <input
          value={newTodoText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodoText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAdd}
          placeholder="What needs doing..."
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          style={{
            marginBottom: "0.5rem",
            background: "var(--chakra-colors-bg-surface, rgba(255,255,255,0.05))",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "4px",
            padding: "0.375rem 0.75rem",
            fontSize: "0.875rem",
            color: "inherit",
            outline: "none",
            width: "100%",
            fontFamily: "inherit",
          }}
        />
      )}
      <Box flex="1" overflow="auto" css={{ "&::-webkit-scrollbar": { display: "none" } }}>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {todos.map((todo) => (<TodoItem key={todo.id} todo={todo} />))}
          </SortableContext>
        </DndContext>
      </Box>
    </Box>
  );
}
