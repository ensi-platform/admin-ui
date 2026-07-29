Date picker on React Aria `DatePicker` with a vertical calendar.

```tsx
import { DatePicker, FormDatePicker } from '@ensi-platform/admin-ui';
```

## When to use

- a single date
- date with time — same control with `granularity`
- a date range — see `DateRangePicker`
- time only — see `TimeField`

## API (short)

### DatePicker

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `value` / `onChange` | `DateValue \| null` | — | controlled (`@internationalized/date`, not an ISO string) |
| `defaultValue` | `DateValue \| null` | — | uncontrolled initial |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `variant` | `primary` | `primary` | visual variant |
| `granularity` | RAC granularity | — | precision (date / time) |
| `minValue` / `maxValue` | `DateValue` | — | bounds |
| `clear` | `boolean` | `false` | clear button |
| `invalid` | `boolean` | `false` | invalid state |
| `disabled` | `boolean` | `false` | disabled |
| `block` | `boolean` | `true` | full width |
| `dataTestId` | `string` | — | `data-test-id` for tests |

### FormDatePicker

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | field name in `Form` |
| `label` | `ReactNode` | — | label |
| `hint` | `ReactNode` | — | hint |
| `clear` | `boolean` | — | clear button |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `disabled` | `boolean` | — | disabled |
| `granularity` | RAC granularity | — | precision |
| `dataTestId` | `string` | — | `data-test-id` for tests |
