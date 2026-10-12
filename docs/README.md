# Документация пакета

Карта каналов. API примитивов сюда **не** пишем — source of truth в репо: `src/<name>/docs/Description.ru.md` / `Description.en.md` и `types.ts`. В npm для агента английский файл называется `Description.md`.

| Канал | Где | Для кого |
| --- | --- | --- |
| Онбординг / API примитивов | Storybook + `src/<name>/docs/` | люди + агенты |
| Пакет (этот каталог) | `docs/*.md`, `ai/skills/` | контрибьюторы, АП |
| Визуал АП (текст) | [`design-language.md`](./design-language.md) | продукт / дизайн (в npm публикуется) |

## В этом каталоге

- [architecture.md](./architecture.md) — стек, токены, Form, exports
- [ai.md](./ai.md) — канал для АП / skills
- [design-language.md](./design-language.md) — визуальный канон (слои, CascadeMenu WIP, list/detail); в npm уходит [design-language.en.md](./design-language.en.md)
- [`ai/skills/admin-ui/`](../ai/skills/admin-ui/) — skill `admin-ui` (в npm через `ai-sync`; postinstall пишет `.cursor` / `.claude` / `.agents` и блок в `AGENTS.md`, см. [ai.md](./ai.md))

## Storybook

Опубликованный: [https://ensi-platform.github.io/admin-ui](https://ensi-platform.github.io/admin-ui)

Локально: `pnpm storybook` → **Getting started**, **AI**, далее Base / Form / Overlays / Design System.
