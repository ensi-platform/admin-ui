Оценка целыми и половинными звёздами.

```tsx
import { Rating, FormRating } from '@ensi-platform/admin-ui/rating';
```

## Когда использовать

- оценка товара, отзыва или качества
- доля на шкале без звёзд — см. `Slider`
- статус без числа — см. `Badge`

## API (кратко)

### Rating

| Prop           | Значения                  | По умолчанию | Описание                                                       |
| -------------- | ------------------------- | ------------ | -------------------------------------------------------------- |
| `size`         | `sm` \| `md` \| `lg`      | `md`         | размер звезды                                                  |
| `variant`      | `primary`                 | `primary`    | палитра                                                        |
| `value`        | `number`                  | —            | управляемое значение                                           |
| `defaultValue` | `number`                  | —            | начальное значение                                             |
| `onChange`     | `(value: number) => void` | —            | смена значения                                                 |
| `minValue`     | `number`                  | `0`          | минимум; повторное нажатие по текущей половине возвращает сюда |
| `maxValue`     | `number`                  | `5`          | максимум; одна звезда на единицу выше `minValue`               |
| `step`         | `number`                  | `0.5`        | шаг                                                            |
| `readOnly`     | `boolean`                 | `false`      | показ без слайдера: `role="img"`                               |
| `invalid`      | `boolean`                 | `false`      | ошибка                                                         |
| `disabled`     | `boolean`                 | `false`      | недоступен; вместе с `readOnly` остаётся слайдером             |
| `dataTestId`   | `string`                  | —            | атрибут `data-test-id`                                         |

Подпись снаружи через `Field` или `aria-label`. Число на экране не рисуется. У слайдера оно в `aria-valuetext` по шаблону `ratingValue` (`{value}` из `{max}`). У `readOnly` та же строка — имя картинки. Без `as`.

### FormRating

| Prop         | Значения             | По умолчанию | Описание                     |
| ------------ | -------------------- | ------------ | ---------------------------- |
| `name`       | `string`             | —            | имя поля в `Form` (`number`) |
| `label`      | `ReactNode`          | —            | подпись                      |
| `hint`       | `ReactNode`          | —            | подсказка под звёздами       |
| `size`       | `sm` \| `md` \| `lg` | `md`         | размер                       |
| `readOnly`   | `boolean`            | —            | только показ                 |
| `disabled`   | `boolean`            | —            | недоступен                   |
| `block`      | `boolean`            | `true`       | ширина колонки `Field`       |
| `dataTestId` | `string`             | —            | атрибут `data-test-id`       |

Пустое значение поля становится `minValue` (`0`).
