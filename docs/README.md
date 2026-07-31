# Документация пакета

Карта каналов. API примитивов сюда **не** пишем — source of truth: `src/<name>/docs/Description.*.md` и `types.ts`.

| Канал | Где | Для кого |
| --- | --- | --- |
| Онбординг / API примитивов | Storybook + `src/<name>/docs/` | люди + агенты |
| Пакет (этот каталог) | `docs/*.md`, `docs/skills/` | контрибьюторы, АП |
| Визуал АП | [`concepts/`](./concepts/) | продукт / дизайн (в npm не публикуется) |

## В этом каталоге

- [architecture.md](./architecture.md) — стек, токены, Form, exports
- [ai.md](./ai.md) — канал для АП / skills
- [skills/](./skills/) — skill `admin-ui` (публикуется с пакетом)
- [concepts/](./concepts/) — скриншоты-референсы интерфейса АП

## Storybook

Опубликованный: [https://ensi-platform.github.io/admin-ui](https://ensi-platform.github.io/admin-ui)

Локально: `pnpm storybook` → **Getting started**, **AI**, далее Base / Form / Overlays / Design System.
