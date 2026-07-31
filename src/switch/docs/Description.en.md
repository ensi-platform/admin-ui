On/off toggle on React Aria `Switch`.

```tsx
import { Switch, FormSwitch } from '@ensi-platform/admin-ui/switch';
```

## When to use

- settings / on-off flags
- a checkmark choice — see `Checkbox`

## API (short)

### Switch

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `checked` | `boolean` | — | controlled |
| `defaultChecked` | `boolean` | — | uncontrolled |
| `onChange` | `(checked: boolean) => void` | — | change handler |
| `children` | `ReactNode` | — | visible label; without children use `aria-label` |
| `invalid` | `boolean` | `false` | invalid state |
| `disabled` | `boolean` | `false` | disabled |
| `dataTestId` | `string` | — | `data-test-id` for tests |

No Group / `as` / extra `variant` beyond `primary`.

### FormSwitch

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | field name in `Form` (boolean) |
| `hint` | `ReactNode` | — | hint under the control |
| `children` | `ReactNode` | — | label; no `Field.Label` |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `disabled` | `boolean` | — | disabled |
| `block` | `boolean` | `true` | full width of the parent |
| `dataTestId` | `string` | — | `data-test-id` for tests |
