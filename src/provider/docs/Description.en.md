Root provider for the package:

- portal isolation
- text direction
- built-in label strings

```tsx
import { AdminUiProvider, useAuiLabels } from '@ensi-platform/admin-ui';
```

## When to use

- always — UI root

## API (short)

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `locale` | `string` | `ru-RU` | BCP 47 |
| `direction` | `ltr` \| `rtl` | from `locale` | text direction |
| `labels` | `Partial<IAuiLabels>` | EN defaults | built-in strings |
| `className` | `string` | — | root `div` |

Hooks: `useAuiLabels()`, `useAuiLocale()`, `useAuiDirection()`.
