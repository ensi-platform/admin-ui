Мультивыбор autocomplete на React Aria `ComboBox` (`selectionMode="multiple"`).

```tsx
import { MultiAutocomplete, FormMultiAutocomplete } from '@ensi-platform/admin-ui/multi-autocomplete';
```

## Когда использовать

- несколько значений с фильтрацией по локальному списку
- подсказки с бэкенда — см. `MultiAutocompleteAsync`
- одно значение — см. `Autocomplete`

## API (кратко)

### MultiAutocomplete

| Prop            | Значения                                | По умолчанию | Описание                               |
| --------------- | --------------------------------------- | ------------ | -------------------------------------- |
| `options`       | `{ value, label, disabled? }[]`         | —            | список опций                           |
| `value`         | `(string \| number)[]`                  | —            | управляемое значение; `[]` после clear |
| `defaultValue`  | `(string \| number)[]`                  | —            | начальное значение                     |
| `onChange`      | `(value: (string \| number)[]) => void` | —            | смена выбора; `[]` при clear           |
| `inputValue`    | `string`                                | —            | управляемый текст фильтра              |
| `onInputChange` | `(value: string) => void`               | —            | смена текста фильтра                   |
| `clientFilter`  | `boolean`                               | `true`       | локальный contains-filter              |
| `isLoading`     | `boolean`                               | —            | статус загрузки списка                 |
| `isError`       | `boolean`                               | —            | статус ошибки списка                   |
| `placeholder`   | `string`                                | —            | плейсхолдер                            |
| `clear`         | `boolean`                               | `false`      | очистить всё выделение                 |
| `size`          | `sm` \| `md` \| `lg`                    | `md`         | размер                                 |
| `invalid`       | `boolean`                               | `false`      | ошибка                                 |
| `disabled`      | `boolean`                               | `false`      | недоступен                             |
| `block`         | `boolean`                               | —            | на всю ширину                          |
| `dataTestId`    | `string`                                | —            | атрибут `data-test-id` для тестов      |

После добавления значения filter-input очищается. Теги и input в одном wrap-потоке; overflow — `+N`.

### FormMultiAutocomplete

| Prop          | Значения                        | По умолчанию | Описание                          |
| ------------- | ------------------------------- | ------------ | --------------------------------- |
| `name`        | `string`                        | —            | имя поля в `Form`                 |
| `label`       | `ReactNode`                     | —            | подпись `Field.Label`             |
| `hint`        | `ReactNode`                     | —            | подсказка под контролом           |
| `options`     | `{ value, label, disabled? }[]` | —            | список опций                      |
| `placeholder` | `string`                        | —            | плейсхолдер                       |
| `clear`       | `boolean`                       | `false`      | очистить всё выделение            |
| `size`        | `sm` \| `md` \| `lg`            | `md`         | размер                            |
| `disabled`    | `boolean`                       | —            | недоступен                        |
| `dataTestId`  | `string`                        | —            | атрибут `data-test-id` для тестов |

Value / onChange / onBlur / валидность — из `Form`.
