Как агенты (Cursor и др.) работают с `@ensi-platform/admin-ui`.

## Контракт примитива

Источник описания:

- `src/<name>/docs/Description.ru.md` / `Description.en.md`
- `Example.*.md`, при необходимости `cssVariables.ts`
- `types.ts` (когда есть)

Storybook Docs читает те же Description / Example. API компонентов в `docs/` пакета не дублируем.

Эти файлы контракта (и skill ниже) публикуются в npm — агент читает их из `node_modules/@ensi-platform/admin-ui/...`. Stories остаются в репо / Storybook.

## Skill

Тонкий роутер для **потребления** UI-кита (выбрать примитив → прочитать Description). Авторство Description / stories — отдельный skill `write-component-docs`.

В пакете: `docs/skills/` (`SKILL.md`, `evals/`).

В consumer-приложении:

- skill — `node_modules/@ensi-platform/admin-ui/docs/skills/`
- контракт — `node_modules/@ensi-platform/admin-ui/src/<name>/docs/`, `…/types.ts`

Укажите Cursor (или sync) на этот путь skill. Обновление Description не требует правок skill.

## Правила для агента

- не выдумывать API — сначала Description / types;
- импорты только через subpath (`@ensi-platform/admin-ui/button`, …), корневого barrel нет;
- setup (токены, Provider, тема) — см. **Getting started**.

## Дальше

- **Getting started** — установка и первый экран
- `Base/Button`, `Form/Input`, `Overlays/Modal` — примитивы
- Документация пакета: `docs/ai.md`, `docs/architecture.md`
