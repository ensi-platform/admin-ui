Slider for picking a number from a range.

```tsx
import { Slider, FormSlider } from '@ensi-platform/admin-ui/slider';
```

## When to use

- scale, volume, ratio, and other values on a track
- an exact number from the keyboard — see `NumberInput`

## API

### Slider

| Prop            | Values                   | Default | Description                                |
| --------------- | ------------------------ | ------- | ------------------------------------------ |
| `size`          | `sm` \| `md` \| `lg`     | `md`    | thumb size                                 |
| `value`         | `number`                 | —       | controlled value                           |
| `defaultValue`  | `number`                 | —       | initial value                              |
| `onChange`      | `(value: number) => void`| —       | value change                               |
| `minValue`      | `number`                 | `0`     | minimum                                    |
| `maxValue`      | `number`                 | `100`   | maximum                                    |
| `step`          | `number`                 | `1`     | step                                       |
| `ticks`         | `boolean`                | `true`  | a mark per step, at most 49                |
| `formatValue`   | `(value) => ReactNode`   | number  | current value text                         |
| `formatDetail`  | `(value) => ReactNode`   | —       | secondary text on the right                |
| `invalid`       | `boolean`                | `false` | error                                      |
| `disabled`      | `boolean`                | `false` | unavailable                                |
| `block`         | `boolean`                | `true`  | full width of the parent                   |
| `dataTestId`    | `string`                 | —       | `data-test-id` for tests                   |

Label it with `Field` or `aria-label`. No `as`.

### FormSlider

| Prop           | Values               | Default | Description               |
| -------------- | -------------------- | ------- | ------------------------- |
| `name`         | `string`             | —       | `Form` field name (`number`) |
| `label`        | `ReactNode`          | —       | label                     |
| `hint`         | `ReactNode`          | —       | hint under the control    |
| `size`         | `sm` \| `md` \| `lg` | `md`    | size                      |
| `disabled`     | `boolean`            | —       | unavailable               |
| `block`        | `boolean`            | `true`  | full width of the parent  |
| `dataTestId`   | `string`             | —       | `data-test-id` for tests  |
