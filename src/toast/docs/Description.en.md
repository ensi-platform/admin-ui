Transient notifications on RAC `UNSTABLE_Toast*`.

```tsx
import { ToastProvider, ToastRegion, useToast } from '@ensi-platform/admin-ui';
```

## When to use

- short feedback after save, delete, or request error
- stack of several messages (limit via `maxVisibleToasts` on `ToastProvider`, default `5`)

Mount `ToastProvider` and `ToastRegion` next to `ModalHub` (not inside `AdminUiProvider` automatically). Call via `useToast()` → `{ appendToast, closeToast }`.

## API (short)

Status (`Toast`): semantic `variant`, no `size`.

### ToastProvider

| Prop               | Values      | Default | Description                                                                             |
| ------------------ | ----------- | ------- | --------------------------------------------------------------------------------------- |
| `maxVisibleToasts` | `number`    | `5`     | max simultaneously visible toasts; fixed at queue creation, changes after mount ignored |
| `defaultTimeout`   | `number`    | `5000`  | default auto-dismiss in ms; `0` — sticky by default; read on each `appendToast`         |
| `children`         | `ReactNode` | —       | app content                                                                             |

### Content (`appendToast`)

| Prop          | Values                                                    | Default   | Description                    |
| ------------- | --------------------------------------------------------- | --------- | ------------------------------ |
| `title`       | `string`                                                  | —         | primary message                |
| `description` | `string`                                                  | —         | secondary text under the title |
| `variant`     | `neutral` \| `success` \| `warning` \| `danger` \| `info` | `neutral` | semantic status                |

### Options

| Prop      | Values       | Default          | Description                                       |
| --------- | ------------ | ---------------- | ------------------------------------------------- |
| `timeout` | `number`     | `defaultTimeout` | overrides `defaultTimeout`; `0` — no auto-dismiss |
| `onClose` | `() => void` | —                | on dismiss immediately (not after animation)      |

### useToast

- `appendToast(content, options?)` → `key`
- `closeToast(key)` — close by key
- outside `ToastProvider` → throw
- raw `UNSTABLE_ToastQueue` is not re-exported

### ToastRegion

- default position: **top-end** (`position: fixed; top + inset-inline-end`, stack downward)
- z-index: token `--aui-toast-z` (default `1050`); override in the app via `:root { --aui-toast-z: … }` or `className` / `style` on Region
- VT duration: token `--aui-toast-duration-motion` (default `200ms`); override in the app via CSS
- `dataTestId`, `className`, `style`
- no `placement` / `motionDuration` / `maxVisibleToasts` props
- animation: CSS View Transitions (`wrapUpdate` + `viewTransitionName`); without VT / with `prefers-reduced-motion` — instant update
- keyboard: toasts are focusable (`Tab` / landmarks) — toast container `tabIndex={0}`, close button reachable; auto-dismiss pauses on region focus/hover
- mount **one** `ToastRegion` per Provider; two Regions on one queue duplicate UI
