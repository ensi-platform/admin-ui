# MultiAutocomplete

Мультивыбор autocomplete на React Aria `ComboBox` (`selectionMode="multiple"`). Импорт: `import { MultiAutocomplete, FormMultiAutocomplete } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- несколько значений с фильтрацией по вводу (filter только список, не выбранные теги)
- async — `MultiAutocompleteAsync` + `useSuggest` (labels выбранных кэшируются из известных options; loading включает debounce-pending)
- trigger: теги и input в одном wrap-потоке (каретка после последнего тега); не поместившиеся сворачиваются в `+N` (клик раскрывает wrap; схлопывается при закрытии списка / blur)
- клик по полю / телу тега открывает список (× remove / clear / chevron — свои действия)
- после добавления значения filter-input очищается
- при печати overflow учитывает ширину ввода — теги уходят в `+N`, без обрезки чипов

## API (кратко)

- `options`, `value` / `defaultValue` / `onChange` (`TComboboxValue[]`)
- `inputValue` / `onInputChange` (опционально)
- `clientFilter` (default `true`), `isLoading` / `isError`
- `clear` → `onChange([])`
- `size`, `variant`, `invalid`, `disabled`, `block`, `dataTestId`

## Пример

```tsx
<MultiAutocomplete
  aria-label="Метки"
  options={TAG_OPTIONS}
  clear
  placeholder="Начните вводить…"
/>
```

## Не делать

- не читать FieldContext внутри
- не копировать стили в АП
- single — `Autocomplete`
