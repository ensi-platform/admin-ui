---
name: admin-ui
description: >-
    Build Ensi admin UI with @ensi-platform/admin-ui primitives (Button, Field,
    Form*, Select, Modal, Table, tokens, Provider). Use whenever the user builds
    or changes admin screens, forms, filters, overlays, or asks which control to
    pick — even if they do not name the package.
---

# admin-ui

Skill for **consuming** the package (assemble UI). Authoring Description / stories — use `write-component-docs`.

## Before coding

1. Pick the primitive (table below).
2. Read — do not invent API:
   - `src/<name>/docs/Description.ru.md` or `Description.en.md`
   - `src/<name>/types.ts` (when present)
   - if unsure: `Example.*.md`
3. In a consumer app: same files under `node_modules/@ensi-platform/admin-ui/...`. Prefer Description over guessing from neighbouring JSX.

Package channel overview: [`docs/ai.md`](../ai.md). Architecture: [`docs/architecture.md`](../architecture.md).

## Setup (host app)

- tokens once: `import '@ensi-platform/admin-ui/tokens'`
- `AdminUiProvider` from `@ensi-platform/admin-ui/provider` at the UI root (locale, portals, built-in labels, page substrate; content inset on host `main`)
- theme: `data-theme` on `document.documentElement` (`light` | `dark`)

## Choose

| Need | Use | Not |
| --- | --- | --- |
| app sidebar / main menu | `CascadeMenu` | invent a second cascade / card-nav |
| menu column items only | `MenuList` | rebuild inside page chrome |
| user avatar circle | `Avatar` | ad-hoc initials span |
| action / submit / link-as-button | `Button` | — |
| entity status (read-only) | `Badge` | `Tag` |
| removable chip / filter value / MultiSelect chips | `Tag` | `Badge` |
| single-line text | `Input` / `FormInput` | `Textarea` |
| multi-line text | `Textarea` / `FormTextarea` | `Input` |
| one from a list | `Select` / `FormSelect` | `MultiSelect` |
| several from a list | `MultiSelect` / `FormMultiSelect` | `Select` |
| date / range / time | `DatePicker` / `DateRangePicker` / `TimeField` (+ Form*) | — |
| confirm / delete dialog | `ConfirmModal` / `DeleteModal` / `ActionPopup` | raw `Modal` unless custom chrome |
| custom dialog shell | `Modal` | — |
| field chrome (label / hint / error) | `Field` | invent `FormControl` |
| async feedback | `Toast` / `Loader` | read Description first |

When neighbours disagree, trust that primitive’s Description.

## Rules

- Public API is ours (`size` / `variant` / `dataTestId`, …); React Aria stays internal.
- Form fields: FormX next to the control; wrap chrome with `Field` — no `FormControl`.
- Do not paste long docs into the reply; read Description / types and code from them.
- Import only via subpaths: `@ensi-platform/admin-ui/button`, `@ensi-platform/admin-ui/provider`, … (no package root barrel).
