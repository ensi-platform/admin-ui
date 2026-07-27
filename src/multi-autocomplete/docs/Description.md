# MultiAutocomplete

Мультивыбор autocomplete на React Aria `ComboBox` (`selectionMode="multiple"`). Импорт: `import { MultiAutocomplete, FormMultiAutocomplete } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- несколько значений с фильтрацией по вводу
- async — `MultiAutocompleteAsync` + `useSuggest`
- trigger: Tag + input; не поместившиеся сворачиваются в `+N` (клик раскрывает)

## API (кратко)

- `options`, `value` / `defaultValue` / `onChange` (`TSelectValue[]`)
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
