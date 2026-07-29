Single-select on React Aria `Select`.

```tsx
import { Select, FormSelect } from '@ensi-platform/admin-ui';
```

## When to use

- one value from a dictionary / enum
- multiple values — see `MultiSelect`
- filter-as-you-type — see `Autocomplete`

## API (short)

### Select

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `options` | `{ value, label, disabled? }[]` | — | options list |
| `value` | `string \| number \| null` | — | controlled; `null` after clear |
| `defaultValue` | `string \| number \| null` | — | uncontrolled initial |
| `onChange` | `(value: string \| number \| null) => void` | — | selection change; `null` on clear |
| `placeholder` | `string` | — | placeholder |
| `clear` | `boolean` | `false` | clear button |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `invalid` | `boolean` | `false` | invalid state |
| `disabled` | `boolean` | `false` | disabled |
| `dataTestId` | `string` | — | `data-test-id` for tests |

No `as` / compound `Item`.

### FormSelect

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | field name in `Form` |
| `label` | `ReactNode` | — | `Field.Label` |
| `hint` | `ReactNode` | — | hint under the control |
| `options` | `{ value, label, disabled? }[]` | — | options list |
| `placeholder` | `string` | — | placeholder |
| `clear` | `boolean` | `false` | clear button; writes `''` to RHF |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `disabled` | `boolean` | — | disabled |
| `dataTestId` | `string` | — | `data-test-id` for tests |

Value / onChange / onBlur / validity come from `Form`. Primitive `Select.onChange(null)` on clear; `FormSelect` writes `''` (handy for `z.string()`).
