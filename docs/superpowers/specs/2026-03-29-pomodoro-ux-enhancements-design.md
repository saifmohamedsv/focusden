# Pomodoro UX Enhancements — Design Spec

Four UX improvements to make the focus workspace more interactive, cozy, and polished.

## 1. Focus End / Break Transition Cards

When a Pomodoro focus session or break timer completes, the timer zone transforms into an inline transition card instead of silently switching.

### Focus Complete Card
- Timer ring fades out, warm card slides in-place
- Shows: "Focus complete!" + duration focused + todos completed count
- Two buttons: **"Take a break"** (starts break) / **"Keep going"** (adds another focus round)
- Auto-starts break after 10 seconds if no interaction (thin progress bar at bottom of card fills over 10s, indicating auto-continue)

### Break Complete Card
- Shows: "Break's over!" + break duration
- Two buttons: **"Start focusing"** (next round) / **"I need more time"** (+2 min to break)
- Auto-starts next focus round after 10 seconds if no interaction

### State Changes
New timer statuses: `"transition_to_break"` and `"transition_to_focus"`

```
running → time hits 0 → "transition_to_break" → show focus-complete card
  "Take a break" → "break"
  "Keep going" → "running" (same round continues)
  10s auto → "break"

break → time hits 0 → "transition_to_focus" → show break-complete card
  "Start focusing" → "running" (next round)
  "I need more time" → stay in "break" (+2 min added)
  10s auto → "running"
```

### Files
- Modify: `store/slices/timerSlice.ts` — add `transition_to_break` and `transition_to_focus` to `timerStatus` union, add `extendBreak` action
- Modify: `types/index.ts` — update `TimerStatus` type
- Create: `components/timer/TransitionCard.tsx` — the inline card shown between focus/break
- Modify: `hooks/useTimer.ts` — handle transition states, add auto-continue timeout
- Modify: `app/(dashboard)/page.tsx` — conditionally render TransitionCard when in transition state

---

## 2. Click-to-Edit Timer Durations

When the timer is idle, clicking the time digits opens inline editing.

### Behavior
- **Idle state only** — clicking digits when running/paused/break does nothing
- Click the minutes display → transforms into an editable input field
- Focus minutes: 5-60 range, break minutes: 1-30 range
- Confirm: press Enter or click away (blur)
- Cancel: press Escape (reverts to previous value)
- Visual hint: subtle underline on hover when idle, cursor changes to text
- Below the time, a small clickable label shows break duration: "5 min break" — also click-to-edit
- Manual edit clears the current mood selection (since user is customizing)
- Mood picker presets still override manual values when selected

### Files
- Modify: `components/timer/TimerDisplay.tsx` — add edit mode with inline input, handle click/blur/keydown
- Modify: `store/slices/sessionSlice.ts` — `setMood(null)` when manual edit happens (or handle in component)

---

## 3. Floating Overlay for Notes/Todos

Each panel gets an expand button that opens a floating overlay card for more workspace.

### Behavior
- Expand icon (arrows-out) in each panel header, next to the + button
- Clicking opens a centered floating card:
  - Semi-transparent backdrop with `backdrop-filter: blur(8px)`, not full blackout
  - Card: `max-width: 560px`, `max-height: 70vh`, elevated with `shadow-lg`
  - Same `bg.panel` styling, `border-radius: xl`
  - Full-size content area (textarea for notes, full todo list for todos)
  - Close: X button top-right, click backdrop, or press Escape
- Only one panel expanded at a time
- Timer keeps running behind the overlay
- Content syncs with same store — no separate state

### Files
- Create: `components/ui/FloatingPanel.tsx` — reusable overlay (backdrop + centered card + close on Escape/backdrop click)
- Modify: `components/notes/NotesPanel.tsx` — add expand button, render FloatingPanel when expanded
- Modify: `components/todos/TodoList.tsx` — add expand button, render FloatingPanel when expanded

---

## 4. Scoped Space Theming

Space switching only affects wallpaper and accent color. All other UI chrome stays constant.

### What changes per space
- `--color-bg-primary` — page background / wallpaper area
- `--color-bg-secondary` — secondary background
- `--color-accent` — timer ring, play button, active states
- `--color-accent-hover` — accent hover states

### What stays constant (base theme)
- `--color-text-primary` → `#EDE5D0` (always)
- `--color-text-secondary` → `#A89880` (always)
- `--color-border` → `rgba(255, 255, 255, 0.07)` (always)
- `--color-surface` → `#2a2620` (always)
- Nav bar, right panel, card backgrounds — all use base Chakra semantic tokens

### Files
- Modify: `theme/palettes.ts` — `applyPalette()` only sets bg_primary, bg_secondary, accent, accent_hover (4 vars instead of 8)
- Modify: `app/globals.css` — text/border/surface vars are static, remove from transition list
- `SpacePalette` type stays unchanged for future flexibility
