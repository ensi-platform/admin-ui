Local veil with a spinner over content while data is loading.

```tsx
import { Loader } from '@ensi-platform/admin-ui/loader';
```

## When to use

- block clicks on a list / card / form while data is loading
- refetch over already shown UI (children stay mounted)

## API (short)

| Prop         | Values               | Default | Description               |
| ------------ | -------------------- | ------- | ------------------------- |
| `size`       | `sm` \| `md` \| `lg` | `md`    | spinner size              |
| `active`     | `boolean`            | `false` | show veil and spinner     |
| `children`   | `ReactNode`          | —       | content under the overlay |
| `dataTestId` | `string`             | —       | `data-test-id` for tests  |

Native `div` attributes (`className`, …) are accepted.
