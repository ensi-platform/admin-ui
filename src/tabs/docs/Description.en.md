Underline tabs with a sliding indicator.

```tsx
import { Tabs } from '@ensi-platform/admin-ui/tabs';
```

## When to use

- sections of a page or entity card
- several related content panels on one screen

## API (short)

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `variant` | `primary` | `primary` | visual variant |
| `value` | `string` | — | selected tab (controlled) |
| `defaultValue` | `string` | — | initial tab (uncontrolled) |
| `onChange` | `(value: string) => void` | — | selection change |
| `disabled` | `boolean` | `false` | disables all tabs |
| `dataTestId` | `string` | — | `data-test-id` for tests |

Slots: `Tabs.List` / `Tabs.Tab` (`id`, `disabled?`) / `Tabs.Panel` (`id`). `Tab` and `Panel` `id`s must match.
