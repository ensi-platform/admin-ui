Search field and checkboxes fed by backend suggestions. The list stays on the panel.

```tsx
import { SuggestChecklist } from '@ensi-platform/admin-ui/suggest-checklist';
```

## When to use

- several values in an already open panel, such as a table header filter
- a closed list with tags — see `MultiAutocompleteAsync`

## API (short)

| Prop           | Values                                  | Default | Description                                                     |
| -------------- | --------------------------------------- | ------- | --------------------------------------------------------------- |
| `useSuggest`   | `IUseAutocompleteSuggest`               | —       | suggest hook (`page`, `hasMore`), same contract as autocomplete |
| `minLength`    | `number`                                | `0`     | min query length                                                |
| `debounceMs`   | `number`                                | `300`   | input debounce                                                  |
| `value`        | `(string \| number)[]`                  | —       | selected values                                                 |
| `defaultValue` | `(string \| number)[]`                  | —       | initial selection                                               |
| `onChange`     | `(value: (string \| number)[]) => void` | —       | selection change                                                |
| `placeholder`  | `string`                                | —       | search placeholder                                              |
| `disabled`     | `boolean`                               | `false` | disabled                                                        |
| `dataTestId`   | `string`                                | —       | `data-test-id`                                                  |

Already selected items stay on top while the next response arrives. The hook returns one page; further pages load at the end of the list while `hasMore` is true.
