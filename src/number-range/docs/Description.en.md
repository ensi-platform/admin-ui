Two `NumberInput` fields for the lower and upper bound of a number.

```tsx
import { NumberRange, FormNumberRange } from '@ensi-platform/admin-ui/number-range';
```

## When to use

- a filter by amount, quantity, or price
- a single number — see `NumberInput`
- a date period — see `DateRangePicker`

## API (short)

### NumberRange

| Prop                                | Values                                         | Default   | Description                                                                                                                                |
| ----------------------------------- | ---------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `value` / `onChange`                | `{ from: number \| null; to: number \| null }` | —         | if `from` is greater than `to`, `to` is pulled up; if `to` is less than `from`, `from` is pulled down; clear sets `null` on that side only |
| `defaultValue`                      | `{ from: number \| null; to: number \| null }` | —         | uncontrolled initial                                                                                                                       |
| `min` / `max` / `step`              | `number`                                       | —         | shared bounds and step                                                                                                                     |
| `formatOptions`                     | `Intl.NumberFormatOptions`                     | —         | shared display and parse                                                                                                                   |
| `fromPlaceholder` / `toPlaceholder` | `string`                                       | —         | placeholders                                                                                                                               |
| `fromLabel` / `toLabel`             | `string`                                       | —         | accessible names                                                                                                                           |
| `clear`                             | `boolean`                                      | `false`   | clear button on each side                                                                                                                  |
| `size`                              | `sm` \| `md` \| `lg`                           | `md`      | size                                                                                                                                       |
| `variant`                           | `primary`                                      | `primary` | visual variant                                                                                                                             |
| `invalid`                           | `boolean`                                      | `false`   | invalid state                                                                                                                              |
| `disabled`                          | `boolean`                                      | `false`   | disabled                                                                                                                                   |
| `block`                             | `boolean`                                      | `true`    | full width                                                                                                                                 |
| `dataTestId`                        | `string`                                       | —         | `data-test-id` for tests                                                                                                                   |

### FormNumberRange

| Prop                                | Values                     | Default   | Description                           |
| ----------------------------------- | -------------------------- | --------- | ------------------------------------- |
| `name`                              | `string`                   | —         | field name in `Form` (`{ from, to }`) |
| `label`                             | `ReactNode`                | —         | label                                 |
| `hint`                              | `ReactNode`                | —         | hint                                  |
| `size`                              | `sm` \| `md` \| `lg`       | `md`      | size                                  |
| `variant`                           | `primary`                  | `primary` | visual variant                        |
| `disabled`                          | `boolean`                  | —         | disabled                              |
| `block`                             | `boolean`                  | `true`    | full width                            |
| `clear`                             | `boolean`                  | —         | clear buttons                         |
| `min` / `max` / `step`              | `number`                   | —         | shared bounds and step                |
| `formatOptions`                     | `Intl.NumberFormatOptions` | —         | shared display and parse              |
| `fromPlaceholder` / `toPlaceholder` | `string`                   | —         | placeholders                          |
| `fromLabel` / `toLabel`             | `string`                   | —         | accessible names                      |
| `dataTestId`                        | `string`                   | —         | `data-test-id` for tests              |
