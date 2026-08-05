Single-select на React Aria `Select`.

```tsx
import { Select, FormSelect } from '@ensi-platform/admin-ui/select';
```

## Когда использовать

- одно значение из справочника / enum
- несколько значений — см. `MultiSelect`
- с фильтрацией по вводу — см. `Autocomplete`

## API (кратко)

### Select

| Prop           | Значения                                    | По умолчанию | Описание                                 |
| -------------- | ------------------------------------------- | ------------ | ---------------------------------------- |
| `options`      | `{ value, label, disabled? }[]`             | —            | список опций                             |
| `value`        | `string \| number \| null`                  | —            | управляемое значение; `null` после clear |
| `defaultValue` | `string \| number \| null`                  | —            | начальное значение                       |
| `onChange`     | `(value: string \| number \| null) => void` | —            | смена выбора; `null` при clear           |
| `placeholder`  | `string`                                    | —            | плейсхолдер                              |
| `clear`        | `boolean`                                   | `false`      | кнопка очистки                           |
| `size`         | `sm` \| `md` \| `lg`                        | `md`         | размер                                   |
| `invalid`      | `boolean`                                   | `false`      | ошибка                                   |
| `disabled`     | `boolean`                                   | `false`      | недоступен                               |
| `dataTestId`   | `string`                                    | —            | атрибут `data-test-id` для тестов        |

Без `as` / compound `Item`.

### FormSelect

| Prop          | Значения                        | По умолчанию | Описание                          |
| ------------- | ------------------------------- | ------------ | --------------------------------- |
| `name`        | `string`                        | —            | имя поля в `Form`                 |
| `label`       | `ReactNode`                     | —            | подпись `Field.Label`             |
| `hint`        | `ReactNode`                     | —            | подсказка под контролом           |
| `options`     | `{ value, label, disabled? }[]` | —            | список опций                      |
| `placeholder` | `string`                        | —            | плейсхолдер                       |
| `clear`       | `boolean`                       | `false`      | кнопка очистки; в RHF пишет `''`  |
| `size`        | `sm` \| `md` \| `lg`            | `md`         | размер                            |
| `disabled`    | `boolean`                       | —            | недоступен                        |
| `dataTestId`  | `string`                        | —            | атрибут `data-test-id` для тестов |

Value / onChange / onBlur / валидность — из `Form`. Примитив `Select.onChange(null)` при clear; `FormSelect` пишет `''` (удобно для `z.string()`).
