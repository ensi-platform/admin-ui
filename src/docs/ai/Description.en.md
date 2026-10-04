How agents (Cursor and others) use `@ensi-platform/admin-ui`.

## Source of truth

Per primitive, the contract in this repo (Storybook) is:

- `src/<name>/docs/Description.ru.md` / `Description.en.md`
- `Example.ru.md` / `Example.en.md`, and `cssVariables.ts` when needed
- `types.ts` when present
- screen visual canon — `docs/design-language.md`

Storybook Docs reads both languages. Do not duplicate component API under package `docs/`.

The npm package ships English only, renamed for agents:

- `Description.en.md` → `src/<name>/docs/Description.md`
- `Example.en.md` → `Example.md`
- getting started → `src/docs/getting-started/Description.md`

`*.ru.md` and stories stay in the repo. Read the published files from `node_modules/@ensi-platform/admin-ui/...`.

## Skill

Thin router for **consuming** the UI kit (pick a primitive, then read its Description). Authoring Description / stories — separate skill `write-component-docs`.

Location in the package: `docs/skills/` (`SKILL.md`).

In a consumer app:

- skill — `node_modules/@ensi-platform/admin-ui/docs/skills/`
- contract — `node_modules/@ensi-platform/admin-ui/src/<name>/docs/`, `…/types.ts` (`icons`, `hooks`, `combobox` included)

`postinstall` (`scripts/sync-consumer.ts`) copies the skill and writes a pointer. No manual path setup:

- `.cursor/skills/admin-ui/SKILL.md`
- `.claude/skills/admin-ui/SKILL.md` — same file
- marker `<!-- @ensi-platform/admin-ui:start -->` … `:end` in the consumer repo `AGENTS.md` (rest of the file stays)

Limits:

- consumer root is the nearest `.git` from `INIT_CWD`; if none, the script does nothing
- **pnpm ≥ 9** ignores dependency lifecycle scripts until `pnpm approve-builds @ensi-platform/admin-ui` (or `pnpm.onlyBuiltDependencies`), then `pnpm install` again
- manual run: `node node_modules/@ensi-platform/admin-ui/scripts/sync-consumer.ts`
- opt out of all three: `ADMIN_UI_SKIP_CONSUMER_SYNC=1`

Updating a Description does not require editing the skill.

## Rules for agents

- do not invent API — read Description / types first;
- assemble screens (lists, filters, detail pages) from `docs/design-language.md`;
- app layout colours — `src/ds/tokens/docs/Description.md` (control chrome stays on the primitive);
- imports only via subpaths (`@ensi-platform/admin-ui/button`, …) — no package root barrel;
- setup (tokens, Provider, theme) — see **Getting started**.

## Next

- **Getting started** — install and first screen
- `Base/Button`, `Form/Input`, `Overlays/Modal` — primitives
- Package docs: `docs/ai.md`, `docs/architecture.md`
