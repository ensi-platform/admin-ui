---
name: code-comments
description: >-
    Write code comments and JSDoc in English. Use when adding or editing a
    comment, JSDoc, or a section marker under src — including «комментарий»,
    «jsdoc».
---

# Comments in English

1. Write every comment in English: JSDoc on props, types, and exports; inline `//`; block `/* */`; section markers in `types.ts`.
   **Done when:** every new or edited comment in the diff is English.
2. Keep product language in UI copy of tests and fixtures, and in `Description.ru.md`. Story example UI copy is English; that format is `write-component-docs`, `references/stories.md`.
   **Done when:** a non-English string in the diff is one of those three, or there is none.
3. Keep JSDoc to one short line, in the same shape as the primitives already in the repo:
    - `/** Theme inputs. */`
    - `/** {Name} size. */` / `/** Visual variant. */`
    - `/** Control state (our names, not RAC). */`
    - `/** Own / chrome props (not from RAC|DOM). */`
    - `/** Content slice for FormX. */`
    - `/** RAC keys omitted because names differ from ours. */`
    - refs: `/** Ref to the … (React 19 prop). */`
    - stories: `/** Story wrapper for react-docgen-typescript. */`

   **Done when:** each new JSDoc line matches one of these shapes.
