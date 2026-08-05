Мульти autocomplete с injected suggest-хуком.

```tsx
import { MultiAutocompleteAsync, FormMultiAutocompleteAsync } from '@ensi-platform/admin-ui/multi-autocomplete-async';
```

## Когда использовать

- несколько значений + подсказки с бэкенда
- локальный список — см. `MultiAutocomplete`

## API (кратко)

### Контракт `useSuggest`

Тот же, что у `AutocompleteAsync`: merge `selected ∪ fetched` — обязанность хука; `useSuggest` стабилен между рендерами; UI `isLoading` = debounce-pending **или** fetch in flight.

### MultiAutocompleteAsync

| Prop           | Значения                                | По умолчанию | Описание                               |
| -------------- | --------------------------------------- | ------------ | -------------------------------------- |
| `useSuggest`   | `TUseAutocompleteSuggest`               | —            | хук подсказок (обязателен)             |
| `minLength`    | `number`                                | `0`          | мин. длина query для запроса           |
| `debounceMs`   | `number`                                | `300`        | debounce ввода                         |
| `value`        | `(string \| number)[]`                  | —            | управляемое значение; `[]` после clear |
| `defaultValue` | `(string \| number)[]`                  | —            | начальное значение                     |
| `onChange`     | `(value: (string \| number)[]) => void` | —            | смена выбора; `[]` при clear           |
| `placeholder`  | `string`                                | —            | плейсхолдер                            |
| `clear`        | `boolean`                               | `false`      | очистить всё выделение                 |
| `size`         | `sm` \| `md` \| `lg`                    | `md`         | размер                                 |
| `invalid`      | `boolean`                               | `false`      | ошибка                                 |
| `disabled`     | `boolean`                               | `false`      | недоступен                             |
| `block`        | `boolean`                               | —            | на всю ширину                          |
| `dataTestId`   | `string`                                | —            | атрибут `data-test-id` для тестов      |

Без `options` / `isLoading` снаружи.

### FormMultiAutocompleteAsync

| Prop          | Значения                  | По умолчанию | Описание                          |
| ------------- | ------------------------- | ------------ | --------------------------------- |
| `name`        | `string`                  | —            | имя поля в `Form`                 |
| `label`       | `ReactNode`               | —            | подпись `Field.Label`             |
| `hint`        | `ReactNode`               | —            | подсказка под контролом           |
| `useSuggest`  | `TUseAutocompleteSuggest` | —            | хук подсказок                     |
| `minLength`   | `number`                  | `0`          | мин. длина query                  |
| `debounceMs`  | `number`                  | `300`        | debounce ввода                    |
| `placeholder` | `string`                  | —            | плейсхолдер                       |
| `clear`       | `boolean`                 | `false`      | очистить всё выделение            |
| `size`        | `sm` \| `md` \| `lg`      | `md`         | размер                            |
| `disabled`    | `boolean`                 | —            | недоступен                        |
| `dataTestId`  | `string`                  | —            | атрибут `data-test-id` для тестов |

Value / onChange / onBlur / валидность — из `Form`.
