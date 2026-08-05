Числовой контрол на React Aria `NumberField`.

```tsx
import { NumberInput, FormNumberInput } from '@ensi-platform/admin-ui/number-input';
```

## Когда использовать

- количества, цены, веса
- деньги — через `formatOptions` (в store числом; отдельного MoneyInput нет)
- свободный текст — см. `Input`

## API (кратко)

### NumberInput

| Prop                   | Значения                   | По умолчанию | Описание                             |
| ---------------------- | -------------------------- | ------------ | ------------------------------------ |
| `value` / `onChange`   | `number \| null`           | —            | управляемое значение; `null` — пусто |
| `defaultValue`         | `number \| null`           | —            | начальное значение                   |
| `min` / `max` / `step` | `number`                   | —            | границы и шаг                        |
| `prefix` / `suffix`    | `ReactNode`                | —            | контент до/после поля                |
| `clear`                | `boolean`                  | `false`      | очистка → `onChange(null)`           |
| `size`                 | `sm` \| `md` \| `lg`       | `md`         | размер                               |
| `invalid`              | `boolean`                  | `false`      | ошибка                               |
| `disabled`             | `boolean`                  | `false`      | недоступен                           |
| `formatOptions`        | `Intl.NumberFormatOptions` | —            | отображение/парс (RAC)               |
| `placeholder`          | `string`                   | —            | плейсхолдер                          |
| `dataTestId`           | `string`                   | —            | атрибут `data-test-id` для тестов    |

Stepper в v1 нет.

### FormNumberInput

| Prop                   | Значения                   | По умолчанию | Описание                             |
| ---------------------- | -------------------------- | ------------ | ------------------------------------ |
| `name`                 | `string`                   | —            | имя поля в `Form` (`number \| null`) |
| `label`                | `ReactNode`                | —            | подпись                              |
| `hint`                 | `ReactNode`                | —            | подсказка                            |
| `clear`                | `boolean`                  | —            | кнопка очистки                       |
| `size`                 | `sm` \| `md` \| `lg`       | `md`         | размер                               |
| `disabled`             | `boolean`                  | —            | недоступен                           |
| `min` / `max` / `step` | `number`                   | —            | границы и шаг                        |
| `prefix` / `suffix`    | `ReactNode`                | —            | контент до/после поля                |
| `formatOptions`        | `Intl.NumberFormatOptions` | —            | отображение/парс                     |
| `dataTestId`           | `string`                   | —            | атрибут `data-test-id` для тестов    |
