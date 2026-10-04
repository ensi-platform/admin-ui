Shared list chrome for `Select`, `MultiSelect`, and `Autocomplete`. App code does not import it.

```tsx
import { Select } from '@ensi-platform/admin-ui/select';
```

## When to use

- one value, no typing — `Select`
- several values, no typing — `MultiSelect`
- typing, local list — `Autocomplete` / `MultiAutocomplete`
- typing, backend — `AutocompleteAsync` / `MultiAutocompleteAsync`
- checklist inside an already open panel — `SuggestChecklist`

## API (short)

No props for app code.

| Primitive                  | Import                                              |
| -------------------------- | --------------------------------------------------- |
| `Select`                   | `@ensi-platform/admin-ui/select`                    |
| `MultiSelect`              | `@ensi-platform/admin-ui/multi-select`              |
| `Autocomplete`             | `@ensi-platform/admin-ui/autocomplete`              |
| `MultiAutocomplete`        | `@ensi-platform/admin-ui/multi-autocomplete`        |
| `AutocompleteAsync`        | `@ensi-platform/admin-ui/autocomplete-async`        |
| `MultiAutocompleteAsync`   | `@ensi-platform/admin-ui/multi-autocomplete-async`  |
| `SuggestChecklist`         | `@ensi-platform/admin-ui/suggest-checklist`         |
