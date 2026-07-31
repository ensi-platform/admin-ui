Overlay next to a trigger with interactive content.

```tsx
import { Popover } from '@ensi-platform/admin-ui/popover';
```

## When to use

- click panel: filters, action menu, short form
- not for plain text hints — use `Tooltip`

## API (short)

### Popover

RAC `DialogTrigger`: `isOpen` / `defaultOpen` / `onOpenChange`, `children`.

### Popover.Trigger

`Pressable` wrapper for `Button` / a custom trigger.

### Popover.Content

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | panel size |
| `variant` | `primary` | `primary` | visual variant |
| `arrow` | `boolean` | `false` | arrow toward the trigger |
| `placement` | RAC placement | `bottom` | position relative to the trigger |
| `offset` | `number` | `4` | gap from the trigger |
| `dataTestId` | `string` | — | `data-test-id` for tests |

Always wraps RAC `Dialog` inside. Native panel attributes (`className`, …) are accepted.
