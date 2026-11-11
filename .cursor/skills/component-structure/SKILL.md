---
name: component-structure
description: >-
    Lay out a primitive folder under src/<name>. Use when adding a primitive
    or moving its files — including «структура», «папка компонента».
---

# Primitive folder

Flat sample: `src/button/` (`Component.tsx`, `styles.module.css`, `theme.ts`, `types.ts`, `index.ts`, `__tests__/`, `docs/`). Compound sample: `src/field/` (same, plus `components/<Part>/`). Those trees outrank a diagram. Public props are the `component-api` skill. Docs are `write-component-docs`. Tests are `tdd` and `tdd/references/component-tests.md`.

1. Match the new or moved files to the sample that fits: one visual part stays flat like `src/button/`; more than one visual part, or a compound, uses `components/` like `src/field/`.
   **Done when:** the reply names which sample the folder follows.
2. Apply the roles and the import rules below.
   **Done when:** each new file matches a role, and each new import matches the alias rule.

## Roles

| File | Role |
| --- | --- |
| `Component.tsx` | Shell. The RAC root lives here, not in a part |
| `FormX.tsx` | Form glue on the shell, when the primitive has a `Form*` |
| `styles.module.css` | Shell styles only |
| `theme.ts` | cva for the shell, when the shell has variants |
| `types.ts` | Public and internal prop types |
| `utils.ts` | Pure helpers for this primitive |
| `index.ts` | Public re-exports only: `export * from './Component'` and `export * from './types'`, plus `FormX` and public subcomponents |
| `components/<Part>/` | One visual part (`Trigger`, `List`, `Label`). Not `Root` |
| `__tests__/` | See `tdd/references/component-tests.md` |
| `docs/` | Required for a public primitive. See `write-component-docs` |

`index.ts` uses named exports only.

A part is `components/<Part>/index.tsx` plus `styles.module.css` beside it, and `theme.ts` when that part has cva. Shell styles stay in `src/<name>/styles.module.css`. A part can stay private. A public compound assigns it in `Component.tsx`: `Object.assign(Field, { Label, Hint, Error })`.

## Imports

Aliases come from `tsconfig.json` `paths` and `vite.config.ts` `resolve.alias`.

| Alias | Target | Use |
| --- | --- | --- |
| `@/*` | `src/*` | Across primitives (`from '@/icons'`, `from '@/field'`) |
| `@ds/*` | `src/ds/*` | `@ds/common`, `@ds/common/utils`, `@ds/typography`, `@ds/tokens` |

- Across `src/<name>` folders, import with `@/` or `@ds/`.
- Inside one primitive and its `components/`, import with a relative path (`from '../Item'`, `from '../../types'`).
- Import the folder (`from '@/icon'`), not `@/icon/index`.
- Omit the extension. `.ts`, `.tsx`, and `.js` resolve.
- Write `@/` with the slash. A bare `@` alias would capture `@react-aria/*` (`vite.config.ts`).
- Shared types (`IDataTestIdProps`, `TMergeElementProps`, `TSVGRIcon`) come from `@ds/common`.
- Helpers such as `toCssSize` come from `@ds/common/utils`.
- Typography in JSX comes from `typographyStyles` in `@ds/typography`.

## utils.ts

Put pure helpers (value mapping, gesture predicates, normalization) in `src/<name>/utils.ts`, one file for the primitive. Hooks go in `hooks/` because they use React. Leave `utils.ts` out of `index.ts` until it is public API. Test it in `__tests__/utils.test.ts`, or in a section of `<name>.test.tsx`.
