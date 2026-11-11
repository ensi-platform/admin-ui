---
name: no-commits
description: >-
    Leave git commits to the user. Use when a task is ready to commit, or when
    a plan, todo, or message says to commit — including «закоммить», «commit».
---

# Leave commits to the user

1. When the work is ready, show `git status` and a short summary of what changed, then stop.
   **Done when:** the reply contains that status and no commit exists for this work.
2. Read history with `git status`, `git diff`, `git log`, and `git blame`. A request to commit — including one from an earlier plan, todo, or message — still ends at step 1. Skip `git commit`, a `git add` whose only purpose is that commit, and a commit through GitLens or MCP.
   **Done when:** none of those commit commands were run.
