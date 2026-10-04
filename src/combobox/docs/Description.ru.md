Общий хром списков у `Select`, `MultiSelect` и `Autocomplete`. В коде приложения не импортировать.

```tsx
import { Select } from '@ensi-platform/admin-ui/select';
```

## Когда использовать

- одно значение без ввода — `Select`
- несколько значений без ввода — `MultiSelect`
- ввод, локальный список — `Autocomplete` / `MultiAutocomplete`
- ввод, бэкенд — `AutocompleteAsync` / `MultiAutocompleteAsync`
- чеклист внутри уже открытой панели — `SuggestChecklist`

## API (кратко)

Пропсов для кода приложения нет.

| Примитив                 | Импорт                                             |
| ------------------------ | -------------------------------------------------- |
| `Select`                 | `@ensi-platform/admin-ui/select`                   |
| `MultiSelect`            | `@ensi-platform/admin-ui/multi-select`             |
| `Autocomplete`           | `@ensi-platform/admin-ui/autocomplete`             |
| `MultiAutocomplete`      | `@ensi-platform/admin-ui/multi-autocomplete`       |
| `AutocompleteAsync`      | `@ensi-platform/admin-ui/autocomplete-async`       |
| `MultiAutocompleteAsync` | `@ensi-platform/admin-ui/multi-autocomplete-async` |
| `SuggestChecklist`       | `@ensi-platform/admin-ui/suggest-checklist`        |
