Multi autocomplete with an injected suggest hook.

```tsx
import { MultiAutocompleteAsync, FormMultiAutocompleteAsync } from '@ensi-platform/admin-ui/multi-autocomplete-async';
```

## When to use

- several values + backend suggestions
- local list — see `MultiAutocomplete`

## API (short)

### `useSuggest` contract

Same as `AutocompleteAsync`: merge `selected ∪ fetched` is the hook's job; keep `useSuggest` stable across renders; UI `isLoading` = debounce-pending **or** fetch in flight.

### MultiAutocompleteAsync

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `useSuggest` | `TUseAutocompleteSuggest` | — | suggest hook (required) |
| `minLength` | `number` | `0` | min query length before fetch |
| `debounceMs` | `number` | `300` | input debounce |
| `value` | `(string \| number)[]` | — | controlled; `[]` after clear |
| `defaultValue` | `(string \| number)[]` | — | uncontrolled initial |
| `onChange` | `(value: (string \| number)[]) => void` | — | selection change; `[]` on clear |
| `placeholder` | `string` | — | placeholder |
| `clear` | `boolean` | `false` | clear entire selection |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `invalid` | `boolean` | `false` | invalid state |
| `disabled` | `boolean` | `false` | disabled |
| `block` | `boolean` | — | full width |
| `dataTestId` | `string` | — | `data-test-id` for tests |

No external `options` / `isLoading`.

### FormMultiAutocompleteAsync

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | field name in `Form` |
| `label` | `ReactNode` | — | `Field.Label` |
| `hint` | `ReactNode` | — | hint under the control |
| `useSuggest` | `TUseAutocompleteSuggest` | — | suggest hook |
| `minLength` | `number` | `0` | min query length |
| `debounceMs` | `number` | `300` | input debounce |
| `placeholder` | `string` | — | placeholder |
| `clear` | `boolean` | `false` | clear entire selection |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `disabled` | `boolean` | — | disabled |
| `dataTestId` | `string` | — | `data-test-id` for tests |

Value / onChange / onBlur / validity come from `Form`.
