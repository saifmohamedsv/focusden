---
name: Block quality checklist
description: Every Puck block must pass these 5 checks before being considered done
type: feedback
---

Every Puck block we build must be:
1. **Responsive** — works across desktop/tablet/mobile viewports
2. **Translated** — all text via `usePuckI18n()`, AR/EN keys in both locale files
3. **Smooth** — clean transitions, no janky renders
4. **Clean coded** — follows existing patterns, one component per file, proper types
5. **Working as expected** — renders correctly in editor preview and matches design intent

**Why:** User explicitly stated these as requirements before starting any block work.

**How to apply:** Check all 5 points before marking any block implementation as complete. Do not skip review.
