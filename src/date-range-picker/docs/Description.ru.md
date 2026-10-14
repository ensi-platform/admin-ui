Поле диапазона дат на React Aria `DateRangePicker` и вертикальном календаре.

```tsx
import { DateRangePicker, FormDateRangePicker } from '@ensi-platform/admin-ui/date-range-picker';
```

## Когда использовать

- период дат (фильтры, отчёты)
- одна дата — см. `DatePicker`
- только время — см. `TimeField`

## API (кратко)

### DateRangePicker

| Prop                 | Значения             | По умолчанию | Описание                                                |
| -------------------- | -------------------- | ------------ | ------------------------------------------------------- |
| `value` / `onChange` | `DateRange \| null`  | —            | управляемое значение; для zod нужны оба `start` и `end` |
| `defaultValue`       | `DateRange \| null`  | —            | начальное значение                                      |
| `size`               | `sm` \| `md` \| `lg` | `md`         | размер                                                  |
| `variant`            | `primary`            | `primary`    | визуальный вариант                                      |
| `clear`              | `boolean`            | `false`      | кнопка очистки                                          |
| `invalid`            | `boolean`            | `false`      | ошибка                                                  |
| `disabled`           | `boolean`            | `false`      | недоступен                                              |
| `block`              | `boolean`            | `true`       | на всю ширину                                           |
| `dataTestId`         | `string`             | —            | атрибут `data-test-id` для тестов                       |

Если дата окончания раньше даты начала, при уходе с поля, по `Enter` или при закрытии календаря даты меняются местами. Неполный ввод и дата вне `minValue` / `maxValue` возвращаются к последнему допустимому диапазону. Перевёрнутый диапазон в `onChange` не попадает.

### FormDateRangePicker

| Prop         | Значения             | По умолчанию | Описание                          |
| ------------ | -------------------- | ------------ | --------------------------------- |
| `name`       | `string`             | —            | имя поля в `Form`                 |
| `label`      | `ReactNode`          | —            | подпись                           |
| `hint`       | `ReactNode`          | —            | подсказка                         |
| `clear`      | `boolean`            | —            | кнопка очистки                    |
| `size`       | `sm` \| `md` \| `lg` | `md`         | размер                            |
| `disabled`   | `boolean`            | —            | недоступен                        |
| `dataTestId` | `string`             | —            | атрибут `data-test-id` для тестов |
