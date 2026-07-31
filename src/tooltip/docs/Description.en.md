Hint on hover and focus.

```tsx
import { Tooltip } from '@ensi-platform/admin-ui/tooltip';
```

## When to use

- short tip for an icon or textless button
- not for interactive content — use `Popover`
- not shown on touch — the UI must work without it

## API (short)

### Tooltip

RAC `TooltipTrigger`: `delay` (default `200`), `closeDelay` (default `100`), `children`.

### Tooltip.Trigger

`Focusable` wrapper for `Button` / a custom trigger.

### Tooltip.Content

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `variant` | `primary` | `primary` | visual variant |
| `arrow` | `boolean` | `false` | arrow toward the trigger |
| `placement` | RAC placement | — | position relative to the trigger |
| `offset` | `number` | `4` | gap from the trigger |
| `dataTestId` | `string` | — | `data-test-id` for tests |

Native panel attributes (`className`, …) are accepted.
