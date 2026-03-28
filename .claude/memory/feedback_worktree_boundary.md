---
name: Keep worktrees inside project directory
description: Never create git worktrees outside the platform project root — use .claude/worktrees/ instead
type: feedback
---

Never create git worktrees or any files outside the project directory (`/Users/s-m/Developer/platform`).

**Why:** The user considers the platform directory the project boundary. Creating worktrees at `../spike/` puts them in the parent Developer folder, which pollutes the user's workspace outside the project scope.

**How to apply:** Always use `.claude/worktrees/` inside the project root for worktrees (e.g., `git worktree add .claude/worktrees/<name> -b <branch>`). Never use `../` paths to escape the project directory.
