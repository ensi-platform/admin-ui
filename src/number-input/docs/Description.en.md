Numeric control on React Aria `NumberField`.

```tsx
import { NumberInput, FormNumberInput } from '@ensi-platform/admin-ui';
```

## When to use

- quantities, prices, weights
- money — via `formatOptions` (store as `number`; no separate MoneyInput)
- free text — see `Input`

## API (short)

### NumberInput

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `value` / `onChange` | `number \| null` | — | controlled; `null` means empty |
| `defaultValue` | `number \| null` | — | uncontrolled initial |
| `min` / `max` / `step` | `number` | — | bounds and step |
| `prefix` / `suffix` | `ReactNode` | — | content before/after the field |
| `clear` | `boolean` | `false` | clear → `onChange(null)` |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `invalid` | `boolean` | `false` | invalid state |
| `disabled` | `boolean` | `false` | disabled |
| `formatOptions` | `Intl.NumberFormatOptions` | — | display/parse (RAC) |
| `placeholder` | `string` | — | placeholder |
| `dataTestId` | `string` | — | `data-test-id` for tests |

No stepper in v1.

### FormNumberInput

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | field name in `Form` (`number \| null`) |
| `label` | `ReactNode` | — | label |
| `hint` | `ReactNode` | — | hint |
| `clear` | `boolean` | — | clear button |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `disabled` | `boolean` | — | disabled |
| `min` / `max` / `step` | `number` | — | bounds and step |
| `prefix` / `suffix` | `ReactNode` | — | content before/after the field |
| `formatOptions` | `Intl.NumberFormatOptions` | — | display/parse |
| `dataTestId` | `string` | — | `data-test-id` for tests |
