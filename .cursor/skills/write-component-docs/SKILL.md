---
name: write-component-docs
description: >-
    Write or update Storybook docs for an admin-ui primitive: Description.ru.md,
    Description.en.md, Example.*.md, cssVariables.ts, and index.stories.tsx.
    Use when the user asks for component docs, Description, stories, or
    Storybook documentation for a primitive in src/*/docs/ — including
    «документация», «описание компонента», «стори».
---

# Write component docs

Samples: `src/button/docs/` (simple), `src/input/docs/` and `src/select/docs/` (field plus form).

Open a reference at the step that names it:

- [`references/description.md`](references/description.md) — Description, Example, CSS variables, Russian prose. Steps 2 and 3.
- [`references/stories.md`](references/stories.md) — stories meta, titles, and which cases to show. Steps 5 and 6.

## Workflow

1. Read the primitive's `types.ts` (and `Form*.tsx` if present).
   **Done when:** each of those files that exists has been read.
2. Write `Description.ru.md` and `Description.en.md` by applying `references/description.md` (no `# Title`, lede, import, When to use, API table, same facts in both languages).
   **Done when:** both Description files exist and match that reference.
3. Write `Example.ru.md` and `Example.en.md` (`## Пример` / `## Example` plus working JSX), as `references/description.md` describes.
   **Done when:** both Example files exist and the JSX matches the props in `types.ts`.
4. If the primitive has `--aui-*` in `src/ds/tokens/semantic.css`, add `docs/cssVariables.ts`: a header `/* CSS variables — Name (--aui-…-*) */`, and a `/* purpose */` comment (EN) at the end of every variable line. Leave prop-local vars (`--icon-size`, …) out of that file.
   **Done when:** every `--aui-<name>-` token for this primitive is in that file with a purpose comment, or the primitive has no such token and the file is absent.
5. Add or update `docs/index.tsx` when the Docs prop table needs a wrapper (`references/stories.md`).
   **Done when:** the wrapper exists, or the stories file has no prop table that needs one.
6. Write `index.stories.tsx` by applying `references/stories.md`: `docsDescriptionByLocale`, `docsExampleByLocale`, `docsCssVariables` when step 4 added the file, visual cases only, English UI copy, English story export names.
   **Done when:** `index.stories.tsx` wires those docs exports and the story UI copy is English.
7. Compare with the sample before finishing.
   **Done when:** the reply names the sample path (`src/button/docs`, or `src/input/docs` / `src/select/docs` for a field), the primitive's `docs/` matches that shape, and a search of `cssVariables.ts` shows no `--aui-` line without a `/* purpose */` comment.
