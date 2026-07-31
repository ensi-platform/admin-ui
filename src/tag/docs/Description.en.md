Label and filter chip with optional remove.

```tsx
import { Tag } from '@ensi-platform/admin-ui/tag';
```

## When to use

- values selected in `MultiSelect`
- chips for active filters
- not an entity status in a table — use `Badge`

## API (short)

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` | `md` | size |
| `variant` | `primary` | `primary` | visual variant |
| `onRemove` | `() => void` | — | remove control; `aria-label` from `useAuiLabels().clear` |
| `disabled` | `boolean` | `false` | disables the chip and remove button |
| `children` | `ReactNode` | — | text |
| `dataTestId` | `string` | — | `data-test-id` for tests |

No `as` and no status variants. Native `span` attributes (`className`, …) are accepted.
