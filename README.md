# `@ensi-platform/admin-ui`

UI library for the Ensi admin panel: controls, forms, overlays, table, tokens, and typography.

Styles use `--aui-*` tokens. Behavior comes from [React Aria Components](https://react-aria.adobe.com).

## Install

```bash
pnpm add @ensi-platform/admin-ui react react-dom
```

For `Form*` helpers also install peers:

```bash
pnpm add react-hook-form @hookform/resolvers zod
```

## Quick start

```tsx
import '@ensi-platform/admin-ui/tokens';
import { AdminUiProvider } from '@ensi-platform/admin-ui/provider';
import { Button } from '@ensi-platform/admin-ui/button';
import { typographyStyles } from '@ensi-platform/admin-ui/typography';

export const Example = () => (
    <AdminUiProvider
        locale="ru-RU"
        labels={{
            close: t('aui.close'),
            clear: t('aui.clear'),
            confirm: t('aui.confirm'),
            cancel: t('aui.cancel'),
            delete: t('aui.delete'),
            notDelete: t('aui.notDelete'),
        }}
    >
        <p className={typographyStyles.bodyM}>Body text</p>
        <Button variant="primary">Save</Button>
    </AdminUiProvider>
);
```

1. Import tokens **once** in the app entry.
2. Mount `AdminUiProvider` at the UI root (locale, portals, built-in a11y labels).
3. Import only via subpaths (no package root barrel):

```tsx
import { Button } from '@ensi-platform/admin-ui/button';
```

Business copy stays in children/props. `lang` on `<html>` is the host app’s job.

## Theme

```ts
document.documentElement.setAttribute('data-theme', 'light'); // or 'dark'
```

Components only read `--aui-*` CSS variables. Light defaults live in `semantic.css`; dark remaps in `semantic.dark.css`.

## Docs

Package docs (architecture, AI channel, concepts): [`docs/README.md`](docs/README.md)

Storybook: [https://ensi-platform.github.io/admin-ui](https://ensi-platform.github.io/admin-ui)

Locally:

```bash
pnpm storybook
```

Start at **Getting started**, then **AI**, then Base / Form / Overlays / Design System.

## Develop

```bash
pnpm install
pnpm hooks:setup    # pre-commit: typecheck + test
pnpm build          # required after clone: sync-package writes exports, then Vite
pnpm dev
pnpm storybook
pnpm test
```

`exports` are not committed: `pnpm build` / `prepublishOnly` runs `sync-package`, which writes subpath `exports` (`./button`, `./tokens`, …) from `src/*/index.ts` (plus nested `tokens` / `typography`). There is no root `"."` export. Without a build, workspace subpath imports will not resolve.

## Related packages

Tokens currently ship from this package (`@ensi-platform/admin-ui/tokens`). A future extract may live in `@ensi-platform/admin-ui-tokens`. Storefront uses a separate `storefront-ui-*` group.
