# Канал для АП

Как агенты (Cursor и др.) опираются на `@ensi-platform/admin-ui`.

## Source of truth

Контракт примитива:

- `src/<name>/docs/Description.ru.md` / `Description.en.md`
- `Example.*.md`, при необходимости `cssVariables.ts`
- `types.ts` (когда есть)

Storybook Docs читает те же файлы (+ stories в репо). В npm уходят Description / Example / cssVariables / types — без stories. В `docs/` пакета API компонентов не дублируем.

## Skill `admin-ui`

Source of truth: [`docs/skills/`](./skills/) (`SKILL.md` + `evals/`). Публикуется вместе с пакетом.

В consumer-приложении агент читает:

- skill: `node_modules/@ensi-platform/admin-ui/docs/skills/`
- контракт: `node_modules/@ensi-platform/admin-ui/src/<name>/docs/`, `…/types.ts`

Skill тонкий:

- когда триггериться
- короткая таблица выбора примитива (Button vs Badge vs Tag, …)
- указание: читай Description / types / Example — без копипасты длинных текстов

Обновили Description в этом репо — агент при следующем Read видит новое; skill трогать не нужно.

### Cursor в этом репо

`.cursor/skills/admin-ui` **не** храним. Укажите skill path на `docs/skills` (или подключите skill вручную). Sync в `.cursor/skills` consumer-приложений — вне этого пакета (опциональный mirror через `@ensi-platform/skills` позже).

См. также `.cursor/rules/component-docs.mdc` → «Канал для АП».
