Status pill for tables and page headers.

```tsx
import { Badge } from '@ensi-platform/admin-ui';
```

## When to use

- entity status (“In assembly”, “Paid”)
- read-only — no click or remove
- not for MultiSelect / filters — use `Tag`

## API (short)

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` | `md` | size |
| `variant` | `neutral` \| `success` \| `warning` \| `danger` \| `info` | `neutral` | semantic status |
| `dataTestId` | `string` | — | `data-test-id` for tests |
| `children` | `ReactNode` | — | status text |

No `as` and no `onRemove` — a removable chip is `Tag`. Native `span` attributes (`className`, …) are accepted.
