Modal dialog on React Aria `ModalOverlay` + `Dialog`.

```tsx
import { Modal } from '@ensi-platform/admin-ui/modal';
```

## When to use

- confirmation dialog / form over the page

## API (short)

| Prop                  | Values                    | Default   | Description                             |
| --------------------- | ------------------------- | --------- | --------------------------------------- |
| `open`                | `boolean`                 | —         | whether open (controlled only)          |
| `onOpenChange`        | `(open: boolean) => void` | —         | open state change                       |
| `onExitComplete`      | `() => void`              | —         | after close animation (for `ModalHub`)  |
| `size`                | `sm` \| `md` \| `lg`      | `md`      | dialog width; ignored when `fullscreen` |
| `fullscreen`          | `boolean`                 | `false`   | full viewport                           |
| `variant`             | `primary`                 | `primary` | visual variant                          |
| `dismissable`         | `boolean`                 | `true`    | close on outside click                  |
| `keyboardDismissable` | `boolean`                 | `true`    | close on Escape                         |
| `dataTestId`          | `string`                  | —         | `data-test-id` for tests                |

Slots: `Modal.Header` / `Title` / `Body` / `Footer` / `CloseButton`. For `CloseButton` — `size`: `sm` \| `md` \| `lg` (default `md`; not tied to `Modal.size`).
