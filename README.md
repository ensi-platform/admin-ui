# `@ensi-platform/admin-ui-base`

Admin UI primitives for Ensi admin panel (АП). Part of the `admin-ui` group.

## Install

```bash
pnpm add @ensi-platform/admin-ui-base react react-dom
```

## Usage

```tsx
import { Button } from '@ensi-platform/admin-ui-base';

export const Example = () => <Button>Save</Button>;
```

## Develop

```bash
pnpm install
pnpm build
pnpm dev
pnpm storybook
```

## Layers

```
admin-ui-kit (later)
  → admin-ui-layout (later)
    → admin-ui-base (this package — primitives)
      → admin-ui-icons (later)
      → admin-ui-tokens (later) — CSS custom properties `--aui-*`
```

`admin-ui-tokens` подключается один раз в entry АП (`import '@ensi-platform/admin-ui-tokens'`); base только пишет `var(--aui-…)` в CSS Modules (peerDep). Контракт: `.cursor/rules/tokens.mdc`.

Storefront uses a separate `storefront-ui-*` group.
