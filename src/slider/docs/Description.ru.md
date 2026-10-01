Ползунок для выбора числа из диапазона.

```tsx
import { Slider, FormSlider } from '@ensi-platform/admin-ui/slider';
```

## Когда использовать

- масштаб, громкость, доля и другие значения на шкале
- точное число с клавиатуры — см. `NumberInput`

## API (кратко)

### Slider

| Prop            | Значения                 | По умолчанию | Описание                                      |
| --------------- | ------------------------ | ------------ | --------------------------------------------- |
| `size`          | `sm` \| `md` \| `lg`     | `md`         | размер ручки                                  |
| `value`         | `number`                 | —            | управляемое значение                          |
| `defaultValue`  | `number`                 | —            | начальное значение                            |
| `onChange`      | `(value: number) => void`| —            | смена значения                                |
| `minValue`      | `number`                 | `0`          | минимум                                       |
| `maxValue`      | `number`                 | `100`        | максимум                                      |
| `step`          | `number`                 | `1`          | шаг                                           |
| `ticks`         | `boolean`                | `true`       | риски на каждом шаге, не больше 49            |
| `formatValue`   | `(value) => ReactNode`   | число        | текст текущего значения                       |
| `formatDetail`  | `(value) => ReactNode`   | —            | второй текст справа                           |
| `invalid`       | `boolean`                | `false`      | ошибка                                        |
| `disabled`      | `boolean`                | `false`      | недоступен                                    |
| `block`         | `boolean`                | `true`       | на всю ширину родителя                        |
| `dataTestId`    | `string`                 | —            | атрибут `data-test-id` для тестов             |

Подпись снаружи через `Field` или `aria-label`. Без `as`.

### FormSlider

| Prop           | Значения                 | По умолчанию | Описание                          |
| -------------- | ------------------------ | ------------ | --------------------------------- |
| `name`         | `string`                 | —            | имя поля в `Form` (`number`)      |
| `label`        | `ReactNode`              | —            | подпись                           |
| `hint`         | `ReactNode`              | —            | подсказка под контролом           |
| `size`         | `sm` \| `md` \| `lg`     | `md`         | размер                            |
| `disabled`     | `boolean`                | —            | недоступен                        |
| `block`        | `boolean`                | `true`       | на всю ширину родителя            |
| `dataTestId`   | `string`                 | —            | атрибут `data-test-id` для тестов |
