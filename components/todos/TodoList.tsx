"use client";

import { Box, Text, HStack, IconButton } from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useAppStore } from "@/store";
import { TodoItem } from "./TodoItem";
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

interface TodoContentProps {
  showAddByDefault?: boolean;
}

function TodoContent({ showAddByDefault = false }: TodoContentProps) {
  const todos = useAppStore((s) => s.todos);
  const addTodo = useAppStore((s) => s.addTodo);
  const reorderTodos = useAppStore((s) => s.reorderTodos);
  const [newTodoText, setNewTodoText] = useState("");
  const [isAdding, setIsAdding] = useState(showAddByDefault);

  const handleAdd = useCallback(() => {
    if (newTodoText.trim()) { addTodo(newTodoText.trim()); setNewTodoText(""); setIsAdding(showAddByDefault); }
  }, [newTodoText, addTodo, showAddByDefault]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") { setNewTodoText(""); setIsAdding(showAddByDefault); }
  }, [handleAdd, showAddByDefault]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = todos.findIndex((t) => t.id === active.id);
    const newIndex = todos.findIndex((t) => t.id === over.id);
    reorderTodos(arrayMove(todos, oldIndex, newIndex));
  }, [todos, reorderTodos]);

  return (
    <>
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
    </>
  );
}

export function TodoList() {
  const [isAdding, setIsAdding] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Box bg="bg.panel" border="1px solid" borderColor="border" borderRadius="xl" p="4" flex="1" display="flex" flexDirection="column" minH="0">
        <HStack justify="space-between" mb="3">
          <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="0.15em">Todos</Text>
          <HStack gap="1">
            <IconButton aria-label="Expand todos" variant="ghost" size="sm" rounded="full" onClick={() => setExpanded(true)}><ExpandIcon /></IconButton>
            <IconButton aria-label="Add todo" variant="ghost" size="sm" onClick={() => setIsAdding(true)} rounded="full"><PlusIcon /></IconButton>
          </HStack>
        </HStack>
        {isAdding && (
          <AddTodoInput onDone={() => setIsAdding(false)} />
        )}
        <Box flex="1" overflow="auto" css={{ "&::-webkit-scrollbar": { display: "none" } }}>
          <DndContextWrapper />
        </Box>
      </Box>

      {expanded && (
        <FloatingPanel title="Todos" onClose={() => setExpanded(false)}>
          <TodoContent showAddByDefault={true} />
        </FloatingPanel>
      )}
    </>
  );
}

function AddTodoInput({ onDone }: { onDone: () => void }) {
  const addTodo = useAppStore((s) => s.addTodo);
  const [newTodoText, setNewTodoText] = useState("");

  const handleAdd = useCallback(() => {
    if (newTodoText.trim()) { addTodo(newTodoText.trim()); setNewTodoText(""); }
    onDone();
  }, [newTodoText, addTodo, onDone]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") { setNewTodoText(""); onDone(); }
  }, [handleAdd, onDone]);

  return (
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
  );
}

function DndContextWrapper() {
  const todos = useAppStore((s) => s.todos);
  const reorderTodos = useAppStore((s) => s.reorderTodos);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = todos.findIndex((t) => t.id === active.id);
    const newIndex = todos.findIndex((t) => t.id === over.id);
    reorderTodos(arrayMove(todos, oldIndex, newIndex));
  }, [todos, reorderTodos]);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        {todos.map((todo) => (<TodoItem key={todo.id} todo={todo} />))}
      </SortableContext>
    </DndContext>
  );
}
