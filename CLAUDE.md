@AGENTS.md

# FocusDen — Project Conventions

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- Chakra UI v3 with custom theme (theme/ directory)
- Zustand + IndexedDB persistence (store/ directory)
- Howler.js for multi-track audio
- NextAuth.js v5 (Google OAuth)
- Supabase (Postgres + RLS)
- Framer Motion for animations

## Patterns

### Chakra v3 Type Workarounds
Custom recipe variants ("primary", "surface", "icon") need casting:
```tsx
variant={"primary" as "solid"}
```

### Form Inputs
Use native `<input>` and `<textarea>` with inline styles instead of `Box as="input"` (Chakra v3 doesn't forward HTML form props through polymorphic types).

### Overlays
Use `FloatingPanel` component (components/ui/FloatingPanel.tsx) with React Portal for any overlay/modal. Renders to document.body to avoid CSS containment issues.

### Store Architecture
Zustand with slice pattern. Each feature has its own slice in store/slices/. Combined in store/index.ts with IndexedDB persistence via idb-keyval. Only user data is persisted (not ephemeral timer state).

### Space Theming
`applyPalette()` only sets 4 CSS vars: bg_primary, bg_secondary, accent, accent_hover. Text, border, surface stay constant across all spaces.

### SVG Icons
Inline SVG components — no icon library dependency. Each icon is a function component returning `<svg>`.

### Animations
Framer Motion with `useReducedMotion()` check. All animations respect prefers-reduced-motion.

## Design Tokens (Semantic)
bg, bg.panel, bg.surface, bg.elevated, fg, fg.secondary, fg.muted, fg.dim, accent, accent.dim, accent.soft, accent.glow, border, border.mid, border.strong, success, success.dim, success.soft

## Next.js 16 Notes
- `middleware.ts` is renamed to `proxy.ts`
- `params` in layouts/pages are Promises (must await)
- Turbopack is default (no --turbopack flag needed)
