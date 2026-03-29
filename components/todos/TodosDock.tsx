"use client";

import { Box, Text } from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useAppStore } from "@/store";
import { TodoItem } from "./TodoItem";
import { FloatingPanel } from "@/components/ui/FloatingPanel";

function TodosIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function TodoContent() {
  const todos = useAppStore((s) => s.todos);
  const addTodo = useAppStore((s) => s.addTodo);
  const reorderTodos = useAppStore((s) => s.reorderTodos);
  const [newTodoText, setNewTodoText] = useState("");

  const handleAdd = useCallback(() => {
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim());
      setNewTodoText("");
    }
  }, [newTodoText, addTodo]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleAdd();
    },
    [handleAdd],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = todos.findIndex((t) => t.id === active.id);
      const newIndex = todos.findIndex((t) => t.id === over.id);
      reorderTodos(arrayMove(todos, oldIndex, newIndex));
    },
    [todos, reorderTodos],
  );

  return (
    <>
      <input
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a todo..."
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        style={{
          marginBottom: "12px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "8px",
          padding: "8px 12px",
          fontSize: "0.875rem",
          color: "inherit",
          outline: "none",
          width: "100%",
          fontFamily: "inherit",
        }}
      />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </SortableContext>
      </DndContext>
      {todos.length === 0 && (
        <Text color="fg.dim" fontSize="sm" textAlign="center" py="6">
          No todos yet — type above and press Enter
        </Text>
      )}
    </>
  );
}

export function TodosDock() {
  const todos = useAppStore((s) => s.todos);
  const [open, setOpen] = useState(false);
  const pendingCount = todos.filter((t) => !t.completed).length;

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
        title="Open todos"
      >
        <TodosIcon />
        <Text fontSize="xs" fontWeight="medium" display={{ base: "none", md: "block" }}>
          Todos
        </Text>
        {pendingCount > 0 && (
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
              {pendingCount}
            </Text>
          </Box>
        )}
      </Box>

      {open && (
        <FloatingPanel title="Todos" onClose={() => setOpen(false)}>
          <TodoContent />
        </FloatingPanel>
      )}
    </>
  );
}
