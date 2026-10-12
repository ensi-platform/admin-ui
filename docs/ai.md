# Канал для АП

Как агенты (Cursor и др.) опираются на `@ensi-platform/admin-ui`.

## Source of truth

Контракт примитива в репо (Storybook):

- `src/<name>/docs/Description.ru.md` / `Description.en.md`
- `Example.ru.md` / `Example.en.md`, при необходимости `cssVariables.ts`
- `types.ts` (когда есть)

Визуальный канон экранов — `docs/design-language.md`. Онбординг в репо — `src/docs/getting-started/Description.ru.md` / `Description.en.md`.

Storybook Docs читает оба языка (+ stories в репо). В npm для агента уходит только английский, уже под именами `Description.md` и `Example.md` (из `*.en.md`), плюс `cssVariables.ts`, `types.ts` и онбординг `src/docs/getting-started/Description.md`. `docs/ai.md` в пакете — копия `src/docs/ai/Description.en.md`, `docs/design-language.md` — из `docs/design-language.en.md`, `docs/architecture.md` — из `docs/architecture.en.md`. `*.ru.md` и stories в пакет не входят. В `docs/` пакета API компонентов не дублируем.

## Skill `admin-ui`

Source of truth: [`ai/skills/admin-ui/SKILL.md`](../ai/skills/admin-ui/SKILL.md). Сборка (`@ensi-platform/ai-sync`) кладёт его в npm как `ai/skills/admin-ui/` и bin `admin-ui:ai`.

В consumer-приложении агент читает:

- skill: `node_modules/@ensi-platform/admin-ui/ai/skills/admin-ui/`
- контракт: `node_modules/@ensi-platform/admin-ui/src/<name>/docs/`, `…/types.ts`

Skill тонкий:

- когда триггериться
- короткая таблица выбора примитива (Button vs Badge vs Tag, …)
- указание: читай Description / types / Example — без копипасты длинных текстов

### Автосинк в consumer-приложении

`postinstall` запускает `bin/ai.js` (`admin-ui:ai`). Он копирует каталог skill и дописывает маркер-блок в `AGENTS.md`. Остальной файл не трогается.

- `.cursor/skills/admin-ui/` — Cursor
- `.claude/skills/admin-ui/` — Claude Code
- `.agents/skills/admin-ui/` и блок `<!-- @ensi-platform/admin-ui:start -->…:end` в `AGENTS.md` — Codex

Условия:

- корень consumer-репо — ближайший `.git` от `INIT_CWD`; нет корня — скрипт выходит с ошибкой, `|| exit 0` не роняет `install`;
- внутри репозитория admin-ui экспорт пропускается;
- **pnpm ≥ 9** не запускает lifecycle-скрипты, пока не выполнить `pnpm approve-builds @ensi-platform/admin-ui` (или `pnpm.onlyBuiltDependencies`), затем снова `pnpm install`;
- вручную: `pnpm exec admin-ui:ai` (флаги `--cursor`, `--claude`, `--codex`; без флагов — все три).

См. также `.cursor/rules/component-docs.mdc` → «Канал для АП».
