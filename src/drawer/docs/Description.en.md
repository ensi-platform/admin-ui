Side panel on React Aria `ModalOverlay` + `Dialog`.

```tsx
import { Drawer } from '@ensi-platform/admin-ui/drawer';
```

## When to use

- filters / entity details at the side of the screen
- long content that should not cover the whole viewport like `Modal`
- on mobile use `BottomSheet` instead of a side panel

## API (short)

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | whether open (controlled only) |
| `onOpenChange` | `(open: boolean) => void` | — | open state change |
| `onExitComplete` | `() => void` | — | after exit animation (for `ModalHub`) |
| `placement` | `left` \| `right` | `right` | side of the viewport |
| `size` | `sm` \| `md` \| `lg` | `md` | panel width; ignored when `fullscreen` |
| `fullscreen` | `boolean` | `false` | panel full viewport width |
| `variant` | `primary` | `primary` | visual variant |
| `dismissable` | `boolean` | `true` | dismiss on outside click |
| `keyboardDismissable` | `boolean` | `true` | dismiss on Escape |
| `dataTestId` | `string` | — | `data-test-id` for tests |

Slots: `Drawer.Header` / `Title` / `Body` / `Footer` / `CloseButton`. On `CloseButton` — `size`: `sm` \| `md` \| `lg` (default `md`; independent of `Drawer.size`).
