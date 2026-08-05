Text link for in-app navigation.

```tsx
import { Link } from '@ensi-platform/admin-ui/link';
```

## When to use

- text navigation inside content (table, form, hint)
- inline navigation without button look
- button look with navigation — see `Button` with `as`

## API (short)

| Prop         | Values                                                                                | Default | Description                                     |
| ------------ | ------------------------------------------------------------------------------------- | ------- | ----------------------------------------------- |
| `as`         | tag or component                                                                      | `a`     | root; for SPA usually the router link component |
| `typography` | `bodyXs` \| `bodyS` \| `bodySTight` \| `bodyM` \| `bodyL` \| `headingM` \| `headingL` | `bodyS` | role from `@ds/typography`                      |
| `dataTestId` | `string`                                                                              | —       | `data-test-id` for tests                        |

Native link attributes (`href`, `target`, `rel`, …) and props of the chosen root are accepted via polymorphism. App router wrap — see **Getting started**.
