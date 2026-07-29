# Autocomplete

Single-select autocomplete на React Aria `ComboBox`. Импорт: `import { Autocomplete, FormAutocomplete } from '@ensi-platform/admin-ui'`.

## Когда использовать

- выбор одного значения с фильтрацией по вводу (локальный список)
- async-подсказки — `AutocompleteAsync` + `useSuggest`
- с `Field` — a11y пропы снаружи
- `FormAutocomplete` — поле формы: Field + RHF

## API (кратко)

### Autocomplete

- `options`: `{ value, label, disabled? }[]`
- `value` / `defaultValue` / `onChange` (`string | number | null`)
- `inputValue` / `defaultInputValue` / `onInputChange` (опционально)
- `clientFilter` (default `true`) — локальный contains-filter; `false` для controlled `items` (async)
- `isLoading` / `isError` — статус списка
- `placeholder`, `clear`
- `size`: sm | md | lg
- `invalid`, `disabled`, `block`
- `dataTestId`, `className`

### FormAutocomplete

- `name` — Path в Form
- `label`, `hint`, `options`, `clear`
- value / onChange / onBlur / валидность — из Form
- при `clear` пишет в RHF `''`

## Пример

```tsx
<Autocomplete
  aria-label="Город"
  options={CITY_OPTIONS}
  clear
  placeholder="Начните вводить…"
/>

<Form initialValues={{ city: '' }} validationSchema={schema} onSubmit={save}>
  <FormAutocomplete name="city" label="Город" options={CITY_OPTIONS} clear />
  <Button type="submit">Save</Button>
</Form>
```

## Не делать

- не читать FieldContext внутри Autocomplete
- не класть fetch/RQ в примитив — `AutocompleteAsync` + хук в АП
- не копировать стили Autocomplete в АП
- multi — `MultiAutocomplete`
