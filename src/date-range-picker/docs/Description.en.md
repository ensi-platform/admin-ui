Date range picker on React Aria `DateRangePicker` with a vertical calendar.

```tsx
import { DateRangePicker, FormDateRangePicker } from '@ensi-platform/admin-ui';
```

## When to use

- a date period (filters, reports)
- a single date — see `DatePicker`
- time only — see `TimeField`

## API (short)

### DateRangePicker

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `value` / `onChange` | `DateRange \| null` | — | controlled; for zod require both `start` and `end` |
| `defaultValue` | `DateRange \| null` | — | uncontrolled initial |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `variant` | `primary` | `primary` | visual variant |
| `clear` | `boolean` | `false` | clear button |
| `invalid` | `boolean` | `false` | invalid state |
| `disabled` | `boolean` | `false` | disabled |
| `block` | `boolean` | `true` | full width |
| `dataTestId` | `string` | — | `data-test-id` for tests |

### FormDateRangePicker

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | field name in `Form` |
| `label` | `ReactNode` | — | label |
| `hint` | `ReactNode` | — | hint |
| `clear` | `boolean` | — | clear button |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `disabled` | `boolean` | — | disabled |
| `dataTestId` | `string` | — | `data-test-id` for tests |
