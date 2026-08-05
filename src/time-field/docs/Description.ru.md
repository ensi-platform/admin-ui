Поле времени на React Aria `TimeField` (без календаря).

```tsx
import { TimeField, FormTimeField } from '@ensi-platform/admin-ui/time-field';
```

## Когда использовать

- только время
- дата или дата со временем — см. `DatePicker`
- период — см. `DateRangePicker`

## API (кратко)

### TimeField

| Prop                 | Значения             | По умолчанию | Описание                          |
| -------------------- | -------------------- | ------------ | --------------------------------- |
| `value` / `onChange` | `TimeValue \| null`  | —            | управляемое значение              |
| `defaultValue`       | `TimeValue \| null`  | —            | начальное значение                |
| `size`               | `sm` \| `md` \| `lg` | `md`         | размер                            |
| `variant`            | `primary`            | `primary`    | визуальный вариант                |
| `hourCycle`          | `12` \| `24`         | —            | 12/24-часовой формат (RAC)        |
| `clear`              | `boolean`            | `false`      | кнопка очистки                    |
| `invalid`            | `boolean`            | `false`      | ошибка                            |
| `disabled`           | `boolean`            | `false`      | недоступен                        |
| `block`              | `boolean`            | `true`       | на всю ширину                     |
| `dataTestId`         | `string`             | —            | атрибут `data-test-id` для тестов |

### FormTimeField

| Prop         | Значения             | По умолчанию | Описание                          |
| ------------ | -------------------- | ------------ | --------------------------------- |
| `name`       | `string`             | —            | имя поля в `Form`                 |
| `label`      | `ReactNode`          | —            | подпись                           |
| `hint`       | `ReactNode`          | —            | подсказка                         |
| `clear`      | `boolean`            | —            | кнопка очистки                    |
| `size`       | `sm` \| `md` \| `lg` | `md`         | размер                            |
| `disabled`   | `boolean`            | —            | недоступен                        |
| `hourCycle`  | `12` \| `24`         | —            | 12/24-часовой формат              |
| `dataTestId` | `string`             | —            | атрибут `data-test-id` для тестов |
