---
name: Never commit without explicit permission
description: Always ask for user confirmation before creating any git commit — never commit autonomously
type: feedback
---

Never create a git commit without the user's explicit permission first.

**Why:** The user wants full control over what gets committed and when. Autonomous commits are unwanted.

**How to apply:** After completing code changes, show the user what changed and ask "Should I commit this?" before running `git commit`. This applies to all contexts — main branch, worktrees, spike branches, merge commits, etc.
