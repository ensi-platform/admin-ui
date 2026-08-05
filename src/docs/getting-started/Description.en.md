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

Mount once at the UI root — portals, locale, built-in strings, and page substrate (background/text color; content inset stays on the host):

```tsx
import { AdminUiProvider } from '@ensi-platform/admin-ui/provider';

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
</AdminUiProvider>;
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
import { Button } from '@ensi-platform/admin-ui/button';

<Button variant="primary" size="md">
    Save
</Button>;
```

## Links / router

The package does not know your router: `Link` defaults to a plain `<a>`. Ideal app setup — one wrapper that hard-codes the router link; import only your `Link` in the admin UI.

```tsx
import { Link as AuiLink, type TLinkProps } from '@ensi-platform/admin-ui/link';
import { Link as RouterLink } from 'react-router';

export const Link = (props: Omit<TLinkProps<typeof RouterLink>, 'as'>) => <AuiLink as={RouterLink} {...props} />;
```

For Next.js — the same pattern with `next/link` (`href` stays). Types come from the framework component via `TLinkProps<typeof …>`. Button look with navigation — `Button` with `as`, not `Link`.

## Next

- **AI** — agents / skill channel
- `Base/Button` — base controls
- `Base/Link` — text links
- `Form/Input` — fields and forms
- `Overlays/Modal` — modals and overlays
- `Design System/Typography` — text roles
