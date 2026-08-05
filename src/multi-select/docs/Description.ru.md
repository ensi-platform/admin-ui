Мультивыбор на React Aria `Select` (`selectionMode="multiple"`).

```tsx
import { MultiSelect, FormMultiSelect } from '@ensi-platform/admin-ui/multi-select';
```

## Когда использовать

- несколько значений из справочника / enum
- одно значение — см. `Select`
- статус в таблице — см. `Badge`

## API (кратко)

### MultiSelect

| Prop           | Значения                                | По умолчанию | Описание                               |
| -------------- | --------------------------------------- | ------------ | -------------------------------------- |
| `options`      | `{ value, label, disabled? }[]`         | —            | список опций                           |
| `value`        | `(string \| number)[]`                  | —            | управляемое значение; `[]` после clear |
| `defaultValue` | `(string \| number)[]`                  | —            | начальное значение                     |
| `onChange`     | `(value: (string \| number)[]) => void` | —            | смена выбора; `[]` при clear           |
| `placeholder`  | `string`                                | —            | плейсхолдер                            |
| `clear`        | `boolean`                               | `false`      | очистить всё выделение                 |
| `size`         | `sm` \| `md` \| `lg`                    | `md`         | размер                                 |
| `invalid`      | `boolean`                               | `false`      | ошибка                                 |
| `disabled`     | `boolean`                               | `false`      | недоступен                             |
| `dataTestId`   | `string`                                | —            | атрибут `data-test-id` для тестов      |

В триггере — теги с remove по одному. Без `as` / compound `Item`.

### FormMultiSelect

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
