---
name: router
description: >-
    Route a task in this admin-ui repo to the skills that apply. Use when the
    user asks to add or change a primitive, fix a bug, write tests or docs, or
    match the design language — including «примитив», «поправь», «баг»,
    «тесты», «документация», «как в концепте».
---

# Route the task

This skill picks a mode and names the skills to read. It writes no code and builds no plan. A contract that does not say what happens goes to the `grill` skill.

1. Read [`../no-commits/SKILL.md`](../no-commits/SKILL.md) and [`../code-comments/SKILL.md`](../code-comments/SKILL.md).
   **Done when:** both files have been read.
2. Read the request and the `src/<name>/` it touches. Write down the primitive and the file paths.
   **Done when:** the reply names the primitive and the paths, or says the task has no primitive yet.
3. Pick one mode from the table and read every skill in that row. For "Change an existing primitive", read the rows of the file-type map that match the paths from step 2, and read `tdd` when that primitive already has tests or the change alters behavior.
   **Done when:** the reply names the mode and each skill that was read.

| Mode | Read |
| --- | --- |
| New primitive | `component-structure`, `component-api`, `component-styles`, `tokens`, `react-aria`, `write-component-docs`, `tdd` |
| Change an existing primitive | the file-type map, plus `tdd` when tests exist or behavior changes |
| Bug | `diagnosing-bugs`, then `tdd` |
| Tests | `tdd` |
| Docs or stories | `write-component-docs` |
| Visual or screen layout | `align-to-concept`, `tokens` |
| Review | `code-review` |

A request that only asks for a commit stops after step 1 (`no-commits`).

## File-type map

| Paths | Skill |
| --- | --- |
| `*.tsx`, `types.ts` | `component-api` |
| a new file under `src/<name>/` | `component-structure` |
| `*.module.css`, `theme.ts` | `component-styles`, `tokens` |
| an import from `react-aria-components` or `@react-aria/*` | `react-aria` |
| debounce, throttle, previous value, media query, or storage | `usehooks` |

Read the skill file at `.cursor/skills/<name>/SKILL.md`. A skill that says to open a `references/` file is read at the step that names it.
