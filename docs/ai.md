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

Source of truth: [`docs/skills/`](./skills/) (`SKILL.md`). Публикуется вместе с пакетом.

В consumer-приложении агент читает:

- skill: `node_modules/@ensi-platform/admin-ui/docs/skills/`
- контракт: `node_modules/@ensi-platform/admin-ui/src/<name>/docs/`, `…/types.ts`

Skill тонкий:

- когда триггериться
- короткая таблица выбора примитива (Button vs Badge vs Tag, …)
- указание: читай Description / types / Example — без копипасты длинных текстов

### Автосинк в consumer-приложении

При установке пакета (`pnpm add` / `npm install`) `postinstall`-скрипт (`scripts/sync-consumer.ts`) синхронизирует три канала без ручной настройки:

- `.cursor/skills/admin-ui/SKILL.md` — Cursor;
- `.claude/skills/admin-ui/SKILL.md` — Claude Code (тот же контент, тот же frontmatter-формат Agent Skills);
- маркер-блок `<!-- @ensi-platform/admin-ui:start -->…:end` в `AGENTS.md` в корне consumer-репо — для агентов без концепции skills (Codex CLI, Copilot coding agent и др.), которые читают только `AGENTS.md` целиком. Блок создаётся/обновляется идемпотентно; остальной `AGENTS.md` не трогается.

Условия и ограничения:

- корень consumer-репо ищется по ближайшему `.git` от `INIT_CWD`; не находит — тихо ничего не делает;
- **pnpm ≥ 9** по умолчанию блокирует lifecycle-скрипты зависимостей («ignored build scripts»). Если синк не сработал сам — один раз выполнить `pnpm approve-builds @ensi-platform/admin-ui` (или добавить пакет в `pnpm.onlyBuiltDependencies` в корневом `package.json` consumer-репо), затем `pnpm install` ещё раз;
- ручной запуск без переустановки: `node node_modules/@ensi-platform/admin-ui/scripts/sync-consumer.ts`;
- опт-аут (отключает все три канала сразу): `ADMIN_UI_SKIP_CONSUMER_SYNC=1`;
- в самом репозитории admin-ui `.cursor/skills/admin-ui`, `.claude/skills/admin-ui` и корневой `AGENTS.md` не трогаем — скрипт детектит dev-режим и ничего не пишет.

См. также `.cursor/rules/component-docs.mdc` → «Канал для АП».
