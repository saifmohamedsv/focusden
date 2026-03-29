"use client";

interface TopProjectsProps {
  projects: string[];
}

export function TopProjects({ projects }: TopProjectsProps) {
  if (projects.length === 0) {
    return (
      <p
        style={{
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.3)",
          fontStyle: "italic",
          margin: 0,
        }}
      >
        No projects yet
      </p>
    );
  }

  return (
    <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
      {projects.map((name, i) => (
        <li
          key={name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background:
                i === 0
                  ? "var(--chakra-colors-accent, #c8a97e)"
                  : "rgba(255,255,255,0.08)",
              color:
                i === 0
                  ? "var(--chakra-colors-bg, #1a1410)"
                  : "rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {i + 1}
          </span>
          <span
            style={{
              fontSize: "0.9rem",
              color:
                i === 0
                  ? "var(--chakra-colors-fg, rgba(255,255,255,0.9))"
                  : "rgba(255,255,255,0.55)",
              fontWeight: i === 0 ? 600 : 400,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </span>
        </li>
      ))}
    </ol>
  );
}
