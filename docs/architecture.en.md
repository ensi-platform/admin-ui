# Architecture

`@ensi-platform/admin-ui` is the UI for the Ensi admin panel: controls, forms, overlays, table, tokens, typography.

## Component layers

| Layer | Storybook | Examples | Role |
| --- | --- | --- | --- |
| Base | `Base/*` | `Button`, `MenuList`, `Avatar`, `Table`, … | primitives and their parts |
| App | `App/*` | `CascadeMenu` | ready-made admin chrome |

App is built from Base. The `sidebar | page` layout stays in the consumer app (there is no `AppShell`). List and detail page frames are application code; the package does not ship them. Screen visuals — `docs/design-language.md`.

## Stack

- styles — `--aui-*` CSS variables (CSS Modules on primitives)
- behavior — [React Aria Components](https://react-aria.adobe.com) inside; the public API is ours (`size` / `variant` / `dataTestId`, …)
- not shadcn and not Tailwind recipes

## Setup

1. Tokens **once** in the app entry: `import '@ensi-platform/admin-ui/tokens'`
2. `AdminUiProvider` at the UI root — locale, portals, built-in a11y strings, page substrate (`--aui-page-bg-primary` / `--aui-page-fg-primary`; content inset stays on the host)
3. Theme on `document.documentElement`: `data-theme="light"` | `"dark"`

Components do not know the theme — they only read `--aui-*`. Light is `semantic.css`, dark is a remap in `semantic.dark.css`.

Import only via subpath: `@ensi-platform/admin-ui/button`, `@ensi-platform/admin-ui/provider`, … There is no package root barrel.

Onboarding with examples — Storybook **Getting started** and the root [README](../README.md).

## Form

- `Form` (RHF + zod) — state / submit / validation live in the package
- FormX (`FormInput`, `FormSelect`, …) — next to the control, not a separate `FormFieldWrapper`
- no `FormControl`: label / hint / error belong to `Field` (+ RAC `Label` / `Text`)

Peers for Form*: `react-hook-form`, `@hookform/resolvers`, `zod`.

## Exports

`exports` in the root `package.json` are **not** the source of truth: `pnpm build` / `prepublishOnly` runs `sync-package` and writes only subpath `exports` (`./button`, `./tokens`, …) from `src/*/index.ts` (plus nested `tokens` / `typography`). There is no `"."` key. Without a build, workspace subpath imports do not resolve.
