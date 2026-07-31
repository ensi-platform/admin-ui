Time-only field on React Aria `TimeField` (no calendar).

```tsx
import { TimeField, FormTimeField } from '@ensi-platform/admin-ui/time-field';
```

## When to use

- time only
- a date or date with time — see `DatePicker`
- a date range — see `DateRangePicker`

## API (short)

### TimeField

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `value` / `onChange` | `TimeValue \| null` | — | controlled value |
| `defaultValue` | `TimeValue \| null` | — | uncontrolled initial |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `variant` | `primary` | `primary` | visual variant |
| `hourCycle` | `12` \| `24` | — | 12/24-hour format (RAC) |
| `clear` | `boolean` | `false` | clear button |
| `invalid` | `boolean` | `false` | invalid state |
| `disabled` | `boolean` | `false` | disabled |
| `block` | `boolean` | `true` | full width |
| `dataTestId` | `string` | — | `data-test-id` for tests |

### FormTimeField

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | field name in `Form` |
| `label` | `ReactNode` | — | label |
| `hint` | `ReactNode` | — | hint |
| `clear` | `boolean` | — | clear button |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `disabled` | `boolean` | — | disabled |
| `hourCycle` | `12` \| `24` | — | 12/24-hour format |
| `dataTestId` | `string` | — | `data-test-id` for tests |
