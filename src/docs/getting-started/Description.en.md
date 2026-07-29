`@ensi-platform/admin-ui` — UI library for the Ensi admin panel.

## Install

```bash
pnpm add @ensi-platform/admin-ui react react-dom
```

## Tokens

Import CSS once in the app entry:

```tsx
import '@ensi-platform/admin-ui/tokens';
```

## Provider

Mount once at the UI root — portals, locale, and built-in strings:

```tsx
import { AdminUiProvider, Button } from '@ensi-platform/admin-ui';

<AdminUiProvider
    locale="en-US"
    labels={{
        close: t('aui.close'),
        clear: t('aui.clear'),
        confirm: t('aui.confirm'),
        cancel: t('aui.cancel'),
        delete: t('aui.delete'),
        notDelete: t('aui.notDelete'),
    }}
>
    <App />
</AdminUiProvider>
```

Details — `Design System/Provider`.

## Theme

Set the theme on `document.documentElement`:

```ts
document.documentElement.setAttribute('data-theme', 'light'); // or 'dark'
```

Components are theme-agnostic — they only use `--aui-*` CSS variables.

## First component

```tsx
import { Button } from '@ensi-platform/admin-ui';

<Button variant="primary" size="md">
    Save
</Button>
```

## Next

- `Base/Button` — base controls
- `Form/Input` — fields and forms
- `Overlays/Modal` — modals and overlays
- `Design System/Typography` — text roles
