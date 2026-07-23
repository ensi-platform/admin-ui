# `@ensi-platform/admin-ui-base`

Admin UI primitives for Ensi admin panel (АП). Part of the `admin-ui` group.

## Install

```bash
pnpm add @ensi-platform/admin-ui-base react react-dom
```

## Usage

```tsx
import '@ensi-platform/admin-ui-base/tokens';
import { AdminUiProvider, Button, typographyStyles } from '@ensi-platform/admin-ui-base';
// или subpath:
// import { Button } from '@ensi-platform/admin-ui-base/button';
// import { AdminUiProvider } from '@ensi-platform/admin-ui-base/provider';
// import { typographyStyles } from '@ensi-platform/admin-ui-base/typography';

export const Example = () => (
    <AdminUiProvider locale="ru-RU" labels={{ close: t('aui.close'), clear: t('aui.clear') }}>
        <p className={typographyStyles.bodyM}>Body text</p>
        <Button>Save</Button>
    </AdminUiProvider>
);
```

`AdminUiProvider` один раз у корня: `I18nProvider` (React Aria), portal isolation (`isolation: isolate`), RTL (`direction` или из locale), `labels` для встроенных a11y-строк. В примитивах: `const { close } = useAuiLabels()`. Бизнес-текст — children/props снаружи. `lang` на `<html>` — ответственность АП.

Headless — [`react-aria-components`](https://react-aria.adobe.com); стили наши.

Токены (`--aui-*`) пока живут в этом пакете (`src/tokens/`). Подключай CSS один раз в entry / Storybook. Later — вынос в `@ensi-platform/admin-ui-tokens`.

Тема: `document.documentElement.setAttribute('data-theme', 'light' | 'dark')`. Light — `:root` в `semantic.css`, dark — remap в `semantic.dark.css`. Компоненты тему не знают.

Типографика v1: `typographyStyles.bodyXs | bodyS | bodyM | bodyL` (regular) на CSS vars `--aui-font-*` / `--aui-line-height-*`. Значения — в tokens; классы — в `src/typography/`. Примитивы compose классы в JSX. Роли `label*` / `heading*` — later. Reset (`box-sizing`, `margin: 0`) — в `AdminUiProvider`.

## Develop

```bash
pnpm install
pnpm hooks:setup   # pre-commit: typecheck + test
pnpm sync-package   # exports + src/index.ts из src/*/index.ts
pnpm build
pnpm dev
pnpm storybook
```

`pnpm build` сам вызывает `sync-package`. Public entry = каждый `src/<name>/index.ts` (кроме `common`) + `./tokens`.

## Layers

```
admin-ui-kit (later)
  → admin-ui-layout (later)
  → admin-ui-base (this package — primitives + interim tokens)
    → admin-ui-icons (later)
    → admin-ui-tokens (later) — вынос src/tokens/
```

Сейчас: `import '@ensi-platform/admin-ui-base/tokens'`. Компоненты пишут только `var(--aui-…)` в CSS Modules. Контракт: `.cursor/rules/tokens.mdc`.

Storefront uses a separate `storefront-ui-*` group.
