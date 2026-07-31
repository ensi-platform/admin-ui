Multi-select autocomplete on React Aria `ComboBox` (`selectionMode="multiple"`).

```tsx
import { MultiAutocomplete, FormMultiAutocomplete } from '@ensi-platform/admin-ui/multi-autocomplete';
```

## When to use

- several values with filter over a local list
- backend suggest — see `MultiAutocompleteAsync`
- single value — see `Autocomplete`

## API (short)

### MultiAutocomplete

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `options` | `{ value, label, disabled? }[]` | — | options list |
| `value` | `(string \| number)[]` | — | controlled; `[]` after clear |
| `defaultValue` | `(string \| number)[]` | — | uncontrolled initial |
| `onChange` | `(value: (string \| number)[]) => void` | — | selection change; `[]` on clear |
| `inputValue` | `string` | — | controlled filter text |
| `onInputChange` | `(value: string) => void` | — | filter text change |
| `clientFilter` | `boolean` | `true` | local contains-filter |
| `isLoading` | `boolean` | — | list loading status |
| `isError` | `boolean` | — | list error status |
| `placeholder` | `string` | — | placeholder |
| `clear` | `boolean` | `false` | clear entire selection |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `invalid` | `boolean` | `false` | invalid state |
| `disabled` | `boolean` | `false` | disabled |
| `block` | `boolean` | — | full width |
| `dataTestId` | `string` | — | `data-test-id` for tests |

Filter input clears after a value is added. Tags and input share one wrap flow; overflow is `+N`.

### FormMultiAutocomplete

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | field name in `Form` |
| `label` | `ReactNode` | — | `Field.Label` |
| `hint` | `ReactNode` | — | hint under the control |
| `options` | `{ value, label, disabled? }[]` | — | options list |
| `placeholder` | `string` | — | placeholder |
| `clear` | `boolean` | `false` | clear entire selection |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `disabled` | `boolean` | — | disabled |
| `dataTestId` | `string` | — | `data-test-id` for tests |

Value / onChange / onBlur / validity come from `Form`.
