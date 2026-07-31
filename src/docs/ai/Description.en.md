How agents (Cursor and others) use `@ensi-platform/admin-ui`.

## Source of truth

Per primitive, the contract is:

- `src/<name>/docs/Description.ru.md` / `Description.en.md`
- `Example.*.md`, and `cssVariables.ts` when needed
- `types.ts` when present

Storybook Docs reads the same Description / Example files. Do not duplicate component API under package `docs/`.

These contract files (plus the skill below) ship in the npm package so agents can read them from `node_modules/@ensi-platform/admin-ui/...`. Stories stay in the repo / Storybook only.

## Skill

Thin router for **consuming** the UI kit (pick a primitive, then read its Description). Authoring Description / stories — separate skill `write-component-docs`.

Location in the package: `docs/skills/` (`SKILL.md`, `evals/`).

In a consumer app:

- skill — `node_modules/@ensi-platform/admin-ui/docs/skills/`
- contract — `node_modules/@ensi-platform/admin-ui/src/<name>/docs/`, `…/types.ts`

Point Cursor (or sync) at that skill path. Updating a Description does not require editing the skill.

## Rules for agents

- do not invent API — read Description / types first;
- imports only via subpaths (`@ensi-platform/admin-ui/button`, …) — no package root barrel;
- setup (tokens, Provider, theme) — see **Getting started**.

## Next

- **Getting started** — install and first screen
- `Base/Button`, `Form/Input`, `Overlays/Modal` — primitives
- Package docs: `docs/ai.md`, `docs/architecture.md`
