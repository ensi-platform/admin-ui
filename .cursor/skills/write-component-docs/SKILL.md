---
name: write-component-docs
description: >-
  Write or update Storybook docs for an admin-ui primitive: Description.ru.md,
  Description.en.md, and index.stories.tsx. Use when the user asks for component
  docs, Description, stories, Storybook documentation, or documentation for a
  primitive in src/*/docs/.
---

# Write component docs

Follow project rules (read if needed):

- [`.cursor/rules/component-docs.mdc`](../../rules/component-docs.mdc) — Description format
- [`.cursor/rules/component-stories.mdc`](../../rules/component-stories.mdc) — stories format

Exemplars:

- simple: `src/button/docs/`
- field + form: `src/input/docs/`, `src/select/docs/`

## Workflow

1. Read the primitive's `types.ts` (and `Form*.tsx` if present).
2. Write `Description.ru.md` and `Description.en.md`:
   - no `# Title`
   - lede + `tsx` import block from `@ensi-platform/admin-ui-base`
   - When to use / API table / Example
   - same facts in both languages; no «Не делать» / «Common mistakes»
   - RU prose: no hybrid anglicisms (`Confirm-диалоги` → «диалоги подтверждения»; code names only in backticks)
3. Add or update `docs/index.tsx` StoryComponent wrapper when prop table is needed.
4. Write `index.stories.tsx`:
   - `docsDescriptionByLocale: { ru, en }`
   - visual cases only; RU UI copy; English story export names
5. Compare with the exemplar before finishing.

## Do not

- invent a second `form-*.stories.tsx`
- glue RU+EN into one `docs.description.component` string
- put full API essays into stories
