# Архитектура

Пакет `@ensi-platform/admin-ui` — UI для админ-панели Ensi: контролы, формы, оверлеи, таблица, токены, типографика.

## Слои компонентов

| Слой | Storybook | Примеры | Роль |
| --- | --- | --- | --- |
| Base | `Base/*` | `Button`, `MenuList`, `Avatar`, `Table`, … | примитивы и составные части |
| App | `App/*` | `CascadeMenu` | готовые сборки chrome АП |

App собирается из Base; layout `sidebar \| page` остаётся у consumer (без `AppShell`).

## Стек

- стили — CSS-переменные `--aui-*` (CSS Modules у примитивов)
- поведение — [React Aria Components](https://react-aria.adobe.com) внутри; публичный API наш (`size` / `variant` / `dataTestId`, …)
- не shadcn / не Tailwind-рецепты «из коробки»

## Подключение

1. Токены **один раз** в entry приложения: `import '@ensi-platform/admin-ui/tokens'`
2. `AdminUiProvider` у корня UI — locale, порталы, встроенные a11y-строки, page-подложка (`--aui-page-bg-primary` / `--aui-page-fg-primary`; inset контента — у host)
3. Тема на `document.documentElement`: `data-theme="light"` | `"dark"`

Компоненты тему не знают — только читают `--aui-*`. Light — `semantic.css`, dark — remap в `semantic.dark.css`.

Импорт только через subpath: `@ensi-platform/admin-ui/button`, `@ensi-platform/admin-ui/provider`, … Корневого barrel нет.

Онбординг с примерами — Storybook **Getting started** и корневой [README](../README.md).

## Form

- `Form` (RHF + zod) — state / submit / validation в пакете
- FormX (`FormInput`, `FormSelect`, …) — рядом с контролом, не отдельный `FormFieldWrapper`
- `FormControl` не заводим: лейбл / хинт / ошибка закрывает `Field` (+ RAC `Label` / `Text`)

Peers для Form*: `react-hook-form`, `@hookform/resolvers`, `zod`.

## Exports

`exports` в корневом `package.json` **не** коммитятся: `pnpm build` / `prepublishOnly` гоняет `sync-package` — пишет только subpath `exports` (`./button`, `./tokens`, …) из `src/*/index.ts` (плюс nested `tokens` / `typography`). Ключа `"."` нет. Без build workspace-subpath импорты не резолвятся.
