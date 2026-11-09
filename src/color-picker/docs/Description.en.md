A color field: the swatch opens a palette, and the hex sits beside it.

```tsx
import { ColorPicker, FormColorPicker } from '@ensi-platform/admin-ui/color-picker';
```

## When to use

- one opaque color: a badge, a status, a product attribute
- the code is already known — type it without opening the palette
- a short list of allowed colors — the `presets` prop
- a date or a time — see `DatePicker` and `TimeField`

## API (short)

### ColorPicker

| Prop                 | Values               | Default   | Description                                                          |
| -------------------- | -------------------- | --------- | -------------------------------------------------------------------- |
| `value` / `onChange` | `string`             | —         | `''` or `#rrggbb`. The color object stays inside                     |
| `defaultValue`       | `string`             | `''`      | initial value without external state                                 |
| `presets`            | `string[]`           | —         | swatches in the panel. Strings that are not colors are dropped       |
| `clear`              | `boolean`            | `false`   | clear button                                                         |
| `size`               | `sm` \| `md` \| `lg` | `md`      | size                                                                 |
| `variant`            | `primary`            | `primary` | visual variant                                                       |
| `invalid`            | `boolean`            | `false`   | error. An unrecognized `value` marks the field too                   |
| `disabled`           | `boolean`            | `false`   | disabled                                                             |
| `block`              | `boolean`            | `true`    | full width                                                           |
| `dataTestId`         | `string`             | —         | `data-test-id` attribute                                             |

Six digits are published immediately. Three digits (`#abc`) expand to `#aabbcc` on blur or Enter. Enter does not submit the form. A drag on the area publishes when the pointer is released; arrow keys on the hue slider publish on each step.

### FormColorPicker

| Prop       | Values               | Default   | Description        |
| ---------- | -------------------- | --------- | ------------------ |
| `name`     | `string`             | —         | field name in `Form` |
| `label`    | `ReactNode`          | —         | label              |
| `hint`     | `ReactNode`          | —         | hint               |
| `clear`    | `boolean`            | —         | clear button       |
| `presets`  | `string[]`           | —         | preset swatches    |
| `size`     | `sm` \| `md` \| `lg` | `md`      | size               |
| `variant`  | `primary`            | `primary` | visual variant     |
| `disabled` | `boolean`            | —         | disabled           |
| `block`    | `boolean`            | `true`    | full width         |
