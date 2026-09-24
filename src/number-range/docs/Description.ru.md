Два поля `NumberInput`: нижняя и верхняя граница числа.

```tsx
import { NumberRange, FormNumberRange } from '@ensi-platform/admin-ui/number-range';
```

## Когда использовать

- фильтр по сумме, количеству или цене
- одно число — см. `NumberInput`
- период дат — см. `DateRangePicker`

## API (кратко)

### NumberRange

| Prop                                | Значения                                       | По умолчанию | Описание                                                                                                                                      |
| ----------------------------------- | ---------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` / `onChange`                | `{ from: number \| null; to: number \| null }` | —            | если `from` больше `to`, подтягивается `to`; если `to` меньше `from`, подтягивается `from`; очистка ставит `null` только у изменённой стороны |
| `defaultValue`                      | `{ from: number \| null; to: number \| null }` | —            | начальное значение                                                                                                                            |
| `min` / `max` / `step`              | `number`                                       | —            | общие границы и шаг                                                                                                                           |
| `formatOptions`                     | `Intl.NumberFormatOptions`                     | —            | общее отображение и разбор                                                                                                                    |
| `fromPlaceholder` / `toPlaceholder` | `string`                                       | —            | плейсхолдеры сторон                                                                                                                           |
| `fromLabel` / `toLabel`             | `string`                                       | —            | доступные имена сторон                                                                                                                        |
| `clear`                             | `boolean`                                      | `false`      | кнопка очистки на каждой стороне                                                                                                              |
| `size`                              | `sm` \| `md` \| `lg`                           | `md`         | размер                                                                                                                                        |
| `variant`                           | `primary`                                      | `primary`    | вариант                                                                                                                                       |
| `invalid`                           | `boolean`                                      | `false`      | ошибка                                                                                                                                        |
| `disabled`                          | `boolean`                                      | `false`      | недоступен                                                                                                                                    |
| `block`                             | `boolean`                                      | `true`       | на всю ширину                                                                                                                                 |
| `dataTestId`                        | `string`                                       | —            | атрибут `data-test-id` для тестов                                                                                                             |

### FormNumberRange

| Prop                                | Значения                   | По умолчанию | Описание                                  |
| ----------------------------------- | -------------------------- | ------------ | ----------------------------------------- |
| `name`                              | `string`                   | —            | имя поля в `Form` (объект `{ from, to }`) |
| `label`                             | `ReactNode`                | —            | подпись                                   |
| `hint`                              | `ReactNode`                | —            | подсказка                                 |
| `size`                              | `sm` \| `md` \| `lg`       | `md`         | размер                                    |
| `variant`                           | `primary`                  | `primary`    | вариант                                   |
| `disabled`                          | `boolean`                  | —            | недоступен                                |
| `block`                             | `boolean`                  | `true`       | на всю ширину                             |
| `clear`                             | `boolean`                  | —            | кнопки очистки                            |
| `min` / `max` / `step`              | `number`                   | —            | общие границы и шаг                       |
| `formatOptions`                     | `Intl.NumberFormatOptions` | —            | общее отображение и разбор                |
| `fromPlaceholder` / `toPlaceholder` | `string`                   | —            | плейсхолдеры сторон                       |
| `fromLabel` / `toLabel`             | `string`                   | —            | доступные имена сторон                    |
| `dataTestId`                        | `string`                   | —            | атрибут `data-test-id` для тестов         |
