---
name: write-component-docs
description: >-
    Write or update Storybook docs for an admin-ui primitive: Description.ru.md,
    Description.en.md, Example.*.md, cssVariables.ts, and index.stories.tsx.
    Use when the user asks for component docs, Description, stories, Storybook
    documentation, or documentation for a primitive in src/*/docs/.
---

# Write component docs

Follow project rules (read if needed):

- [`.cursor/rules/component-docs.mdc`](../../rules/component-docs.mdc) — Description / Example / CSS vars
- [`.cursor/rules/component-stories.mdc`](../../rules/component-stories.mdc) — stories format

Exemplars:

- simple: `src/button/docs/`
- field + form: `src/input/docs/`, `src/select/docs/`

## Workflow

1. Read the primitive's `types.ts` (and `Form*.tsx` if present).
2. Write `Description.ru.md` and `Description.en.md`:
    - no `# Title`
    - lede + `tsx` import block from `@ensi-platform/admin-ui`
    - When to use = product scenarios + neighbor redirects only (not Field/RHF/`as` wiring)
    - API table only (no Example section); API limits (`as`, a11y) live under API
    - same facts in both languages; no «Не делать» / «Common mistakes»
    - RU prose: no hybrid anglicisms (`Confirm-диалоги` → «диалоги подтверждения»; code names only in backticks)
3. Write `Example.ru.md` / `Example.en.md` (`## Пример` / `## Example` + working JSX).
4. If the primitive has `--aui-*` in `src/ds/tokens/semantic.css`, add `docs/cssVariables.ts`:
    - header `/* CSS variables — Name (--aui-…-*) */`
    - **every** variable line ends with `/* purpose */` (EN)
    - no prop-local vars (`--icon-size`, …)
5. Add or update `docs/index.tsx` StoryComponent wrapper when prop table is needed.
6. Write `index.stories.tsx`:
    - `docsDescriptionByLocale`, `docsExampleByLocale`, `docsCssVariables` (when applicable)
    - visual cases only; English UI copy; English story export names
7. Compare with the exemplar before finishing; confirm no `--aui-` line lacks a comment.

## Do not

- invent a second `form-*.stories.tsx`
- glue RU+EN into one `docs.description.component` string
- put full API essays into stories
- put CSS variables or Example into Description.md
