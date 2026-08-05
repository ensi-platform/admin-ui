Single autocomplete with an injected suggest hook.

```tsx
import { AutocompleteAsync, FormAutocompleteAsync } from '@ensi-platform/admin-ui/autocomplete-async';
```

## When to use

- backend suggestions (request lives in the app: React Query / `fetch`)
- local list without a request — see `Autocomplete`

## API (short)

### `useSuggest` contract

```ts
type TUseAutocompleteSuggest = (input: { query: string; enabled?: boolean }) => {
    options: IComboboxOption[];
    isLoading: boolean;
    isError?: boolean;
    error?: Error | null;
};
```

Pass a stable module hook reference (not inline or conditional).

- `debounceMs` / `minLength` live in `AutocompleteAsync`; UI loading = debounce-pending **or** hook `isLoading`
- merging the selected value with the server response is the hook's job (otherwise the selected label disappears)
- hook `isLoading` covers the whole in-flight request (React Query: `isFetching`); do not duplicate debounce in the hook when `debounceMs` is set

### AutocompleteAsync

| Prop           | Values                                      | Default | Description                       |
| -------------- | ------------------------------------------- | ------- | --------------------------------- |
| `useSuggest`   | `TUseAutocompleteSuggest`                   | —       | suggest hook (required)           |
| `minLength`    | `number`                                    | `0`     | min query length before fetch     |
| `debounceMs`   | `number`                                    | `300`   | input debounce                    |
| `value`        | `string \| number \| null`                  | —       | controlled value                  |
| `defaultValue` | `string \| number \| null`                  | —       | uncontrolled initial              |
| `onChange`     | `(value: string \| number \| null) => void` | —       | selection change; `null` on clear |
| `placeholder`  | `string`                                    | —       | placeholder                       |
| `clear`        | `boolean`                                   | `false` | clear button                      |
| `size`         | `sm` \| `md` \| `lg`                        | `md`    | size                              |
| `invalid`      | `boolean`                                   | `false` | invalid state                     |
| `disabled`     | `boolean`                                   | `false` | disabled                          |
| `block`        | `boolean`                                   | —       | full width                        |
| `dataTestId`   | `string`                                    | —       | `data-test-id` for tests          |

No external `options` / `isLoading`.

### FormAutocompleteAsync

| Prop          | Values                    | Default | Description                      |
| ------------- | ------------------------- | ------- | -------------------------------- |
| `name`        | `string`                  | —       | field name in `Form`             |
| `label`       | `ReactNode`               | —       | `Field.Label`                    |
| `hint`        | `ReactNode`               | —       | hint under the control           |
| `useSuggest`  | `TUseAutocompleteSuggest` | —       | suggest hook                     |
| `minLength`   | `number`                  | `0`     | min query length                 |
| `debounceMs`  | `number`                  | `300`   | input debounce                   |
| `placeholder` | `string`                  | —       | placeholder                      |
| `clear`       | `boolean`                 | `false` | clear button; writes `''` to RHF |
| `size`        | `sm` \| `md` \| `lg`      | `md`    | size                             |
| `disabled`    | `boolean`                 | —       | disabled                         |
| `dataTestId`  | `string`                  | —       | `data-test-id` for tests         |

Value / onChange / onBlur / validity come from `Form`.
