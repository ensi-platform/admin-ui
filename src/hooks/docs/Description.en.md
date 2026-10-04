Package hooks: the previous render value, and a callback after an overlay has fully closed.

```tsx
import { useOverlayExitComplete, usePrevious } from '@ensi-platform/admin-ui/hooks';
```

## When to use

- keep the value from the previous render
- run code once the overlay is gone, including after the exit animation
- debounce stays in `usehooks-ts`

## API (short)

### `usePrevious`

| Argument       | Values | Default | Description                          |
| -------------- | ------ | ------- | ------------------------------------ |
| `value`        | `T`    | —       | current value                        |
| `initialValue` | `T`    | —       | value returned before the first update |

Returns the value from the previous render (`initialValue` on the first one).

### `useOverlayExitComplete`

| Argument         | Values       | Default | Description                                      |
| ---------------- | ------------ | ------- | ------------------------------------------------ |
| `open`           | `boolean`    | —       | overlay is open                                  |
| `isExiting`      | `boolean`    | —       | exit animation is running                        |
| `onExitComplete` | `() => void` | —       | called once after a full close, and on unmount during exit |
