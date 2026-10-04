Как агенты (Cursor и др.) работают с `@ensi-platform/admin-ui`.

## Контракт примитива

Источник описания в репо (Storybook):

- `src/<name>/docs/Description.ru.md` / `Description.en.md`
- `Example.ru.md` / `Example.en.md`, при необходимости `cssVariables.ts`
- `types.ts` (когда есть)
- визуальный канон экранов — `docs/design-language.md`

Storybook Docs читает оба языка. API компонентов в `docs/` пакета не дублируем.

В npm для агента уходит только английский, уже под другими именами:

- `Description.en.md` → `src/<name>/docs/Description.md`
- `Example.en.md` → `Example.md`
- онбординг → `src/docs/getting-started/Description.md`

`*.ru.md` и stories остаются в репо. Агент читает опубликованные файлы из `node_modules/@ensi-platform/admin-ui/...`.

## Skill

Тонкий роутер для **потребления** UI-кита (выбрать примитив → прочитать Description). Авторство Description / stories — отдельный skill `write-component-docs`.

В пакете: `docs/skills/` (`SKILL.md`).

В consumer-приложении:

- skill — `node_modules/@ensi-platform/admin-ui/docs/skills/`
- контракт — `node_modules/@ensi-platform/admin-ui/src/<name>/docs/`, `…/types.ts` (включая `icons`, `hooks`, `combobox`)

`postinstall` (`scripts/sync-consumer.ts`) копирует skill и пишет указатель. Путь вручную указывать не нужно:

- `.cursor/skills/admin-ui/SKILL.md`
- `.claude/skills/admin-ui/SKILL.md` — тот же файл
- маркер `<!-- @ensi-platform/admin-ui:start -->` … `:end` в `AGENTS.md` корня consumer-репо (остальной файл не трогается)

Ограничения:

- корень consumer-репо — ближайший `.git` от `INIT_CWD`; нет — скрипт ничего не делает
- **pnpm ≥ 9** не запускает lifecycle-скрипты зависимостей, пока не выполнить `pnpm approve-builds @ensi-platform/admin-ui` (или `pnpm.onlyBuiltDependencies`), затем снова `pnpm install`
- вручную: `node node_modules/@ensi-platform/admin-ui/scripts/sync-consumer.ts`
- отключить все три канала: `ADMIN_UI_SKIP_CONSUMER_SYNC=1`

Обновление Description не требует правок skill.

## Правила для агента

- не выдумывать API — сначала Description / types;
- экраны (список, фильтры, карточка) собирать по `docs/design-language.md`;
- цвета вёрстки приложения — `src/ds/tokens/docs/Description.md` (оформление контрола остаётся у примитива);
- импорты только через subpath (`@ensi-platform/admin-ui/button`, …), корневого barrel нет;
- setup (токены, Provider, тема) — см. **Getting started**.

## Дальше

- **Getting started** — установка и первый экран
- `Base/Button`, `Form/Input`, `Overlays/Modal` — примитивы
- Документация пакета: `docs/ai.md`, `docs/architecture.md`
