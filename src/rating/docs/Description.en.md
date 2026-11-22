Star rating in whole and half steps.

```tsx
import { Rating, FormRating } from '@ensi-platform/admin-ui/rating';
```

## When to use

- a product, review, or quality score
- a track without stars — see `Slider`
- a status with no number — see `Badge`

## API (short)

### Rating

| Prop           | Values                    | Default   | Description                                              |
| -------------- | ------------------------- | --------- | -------------------------------------------------------- |
| `size`         | `sm` \| `md` \| `lg`      | `md`      | star size                                                |
| `variant`      | `primary`                 | `primary` | palette                                                  |
| `value`        | `number`                  | —         | controlled value                                         |
| `defaultValue` | `number`                  | —         | initial value                                            |
| `onChange`     | `(value: number) => void` | —         | value change                                             |
| `minValue`     | `number`                  | `0`       | minimum; a second press on the current half returns here |
| `maxValue`     | `number`                  | `5`       | maximum; one star per unit above `minValue`              |
| `step`         | `number`                  | `0.5`     | step                                                     |
| `readOnly`     | `boolean`                 | `false`   | display without a slider: `role="img"`                   |
| `invalid`      | `boolean`                 | `false`   | error                                                    |
| `disabled`     | `boolean`                 | `false`   | unavailable; with `readOnly` it stays a slider           |
| `dataTestId`   | `string`                  | —         | `data-test-id` for tests                                 |

Label it with `Field` or `aria-label`. The number is not shown. On the slider it is `aria-valuetext` from the `ratingValue` template (`{value}` of `{max}`). On `readOnly` the same string is the image name. No `as`.

### FormRating

| Prop         | Values               | Default | Description                  |
| ------------ | -------------------- | ------- | ---------------------------- |
| `name`       | `string`             | —       | `Form` field name (`number`) |
| `label`      | `ReactNode`          | —       | label                        |
| `hint`       | `ReactNode`          | —       | hint under the stars         |
| `size`       | `sm` \| `md` \| `lg` | `md`    | size                         |
| `readOnly`   | `boolean`            | —       | display only                 |
| `disabled`   | `boolean`            | —       | unavailable                  |
| `block`      | `boolean`            | `true`  | `Field` column width         |
| `dataTestId` | `string`             | —       | `data-test-id` for tests     |

A missing field value becomes `minValue` (`0`).
