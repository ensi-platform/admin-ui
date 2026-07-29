Single-select autocomplete on React Aria `ComboBox`.

```tsx
import { Autocomplete, FormAutocomplete } from '@ensi-platform/admin-ui';
```

## When to use

- one value with filter over a local list
- backend suggestions — see `AutocompleteAsync`
- multiple values — see `MultiAutocomplete`

## API (short)

### Autocomplete

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `options` | `{ value, label, disabled? }[]` | — | options list |
| `value` | `string \| number \| null` | — | controlled; `null` after clear |
| `defaultValue` | `string \| number \| null` | — | uncontrolled initial |
| `onChange` | `(value: string \| number \| null) => void` | — | selection change; `null` on clear |
| `inputValue` | `string` | — | controlled input text |
| `defaultInputValue` | `string` | — | uncontrolled input text |
| `onInputChange` | `(value: string) => void` | — | input text change |
| `clientFilter` | `boolean` | `true` | local contains-filter; `false` for controlled items |
| `isLoading` | `boolean` | — | list loading status |
| `isError` | `boolean` | — | list error status |
| `placeholder` | `string` | — | placeholder |
| `clear` | `boolean` | `false` | clear button |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `invalid` | `boolean` | `false` | invalid state |
| `disabled` | `boolean` | `false` | disabled |
| `block` | `boolean` | — | full width |
| `dataTestId` | `string` | — | `data-test-id` for tests |

### FormAutocomplete

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

Value / onChange / onBlur / validity come from `Form`.
