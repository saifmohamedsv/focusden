"use client";

import { useAppStore } from "@/store";

export function ProjectNameInput() {
  const projectName = useAppStore((s) => s.projectName);
  const setProjectName = useAppStore((s) => s.setProjectName);

  return (
    <input
      value={projectName}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
      placeholder="Project name..."
      style={{
        background: "transparent",
        border: "none",
        outline: "none",
        fontSize: "0.875rem",
        color: "inherit",
        textAlign: "center",
        fontFamily: "inherit",
        width: "100%",
      }}
    />
  );
}
