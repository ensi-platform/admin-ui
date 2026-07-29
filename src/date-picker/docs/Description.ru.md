Поле выбора даты на React Aria `DatePicker` и вертикальном календаре.

```tsx
import { DatePicker, FormDatePicker } from '@ensi-platform/admin-ui';
```

## Когда использовать

- одна дата
- дата со временем — тот же контрол с `granularity`
- период дат — см. `DateRangePicker`
- только время — см. `TimeField`

## API (кратко)

### DatePicker

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `value` / `onChange` | `DateValue \| null` | — | управляемое значение (`@internationalized/date`, не ISO-строка) |
| `defaultValue` | `DateValue \| null` | — | начальное значение |
| `size` | `sm` \| `md` \| `lg` | `md` | размер |
| `variant` | `primary` | `primary` | визуальный вариант |
| `granularity` | RAC granularity | — | точность (дата / время) |
| `minValue` / `maxValue` | `DateValue` | — | границы |
| `clear` | `boolean` | `false` | кнопка очистки |
| `invalid` | `boolean` | `false` | ошибка |
| `disabled` | `boolean` | `false` | недоступен |
| `block` | `boolean` | `true` | на всю ширину |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |

### FormDatePicker

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `name` | `string` | — | имя поля в `Form` |
| `label` | `ReactNode` | — | подпись |
| `hint` | `ReactNode` | — | подсказка |
| `clear` | `boolean` | — | кнопка очистки |
| `size` | `sm` \| `md` \| `lg` | `md` | размер |
| `disabled` | `boolean` | — | недоступен |
| `granularity` | RAC granularity | — | точность |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |
