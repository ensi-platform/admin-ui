Mobile bottom sheet on React Aria `ModalOverlay` + `Dialog`.

```tsx
import { BottomSheet } from '@ensi-platform/admin-ui/bottom-sheet';
```

## When to use

- filters / actions / details on mobile instead of a side `Drawer`
- content that is convenient to dismiss with a swipe down

## API (short)

| Prop                  | Values                    | Default   | Description                             |
| --------------------- | ------------------------- | --------- | --------------------------------------- |
| `open`                | `boolean`                 | —         | whether open (controlled only)          |
| `onOpenChange`        | `(open: boolean) => void` | —         | open state change                       |
| `onExitComplete`      | `() => void`              | —         | after exit animation (for `ModalHub`)   |
| `variant`             | `primary`                 | `primary` | visual variant                          |
| `fullscreen`          | `boolean`                 | `false`   | full viewport height                    |
| `dismissable`         | `boolean`                 | `true`    | dismiss on outside click and swipe down |
| `keyboardDismissable` | `boolean`                 | `true`    | dismiss on Escape                       |
| `dataTestId`          | `string`                  | —         | `data-test-id` for tests                |

Slots: `BottomSheet.Header` / `Title` / `Body` / `Footer` / `CloseButton`. On `CloseButton` — `size`: `sm` \| `md` \| `lg` (default `md`).

Height follows content (`max-height` via token); no root `size`. Handle is drawn in the shell.
