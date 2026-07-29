Imperative stack over `Modal` / `Drawer` via React Context.

```tsx
import { ModalProvider, ModalHub, useModal, useModalAsync } from '@ensi-platform/admin-ui';
```

## When to use

- open a dialog from a helper / menu / async chunk without local `useState`

## API (short)

### ModalProvider / ModalHub

| API | Description |
| --- | --- |
| `ModalProvider` | context store for the stack; mount once at the root (separate from `AdminUiProvider`) |
| `ModalHub` | renders the stack; once next to the app tree |

### useModal / useModalAsync

| API | Arguments | Returns |
| --- | --- | --- |
| `useModal` | `{ Component, props? }` | `{ onOpenHandler, onCloseHandler }` |
| `useModalAsync` | `{ loadComponent, props? }` | `{ onOpenHandler, onCloseHandler }` — lazy load and race guard |

### IModalHubItemProps

Contract for a component in the stack:

| Prop | Values | Description |
| --- | --- | --- |
| `open` | `boolean` | whether open |
| `onOpenChange` | `(open: boolean) => void` | open state change |
| `onExitComplete` | `() => void` | after close animation (required to remove from the stack) |
