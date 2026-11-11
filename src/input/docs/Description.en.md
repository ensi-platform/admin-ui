Text control on React Aria `Input`.

```tsx
import { Input, FormInput } from '@ensi-platform/admin-ui/input';
```

## When to use

- free single-line text (email, name, search)
- multiline text — see `TextArea`
- a number — see `NumberInput`

## API (short)

### Input

| Prop          | Values               | Default | Description                              |
| ------------- | -------------------- | ------- | ---------------------------------------- |
| `size`        | `sm` \| `md` \| `lg` | `md`    | size; inside Field inherits `Field.size` |
| `invalid`     | `boolean`            | `false` | invalid state                            |
| `disabled`    | `boolean`            | `false` | disabled (no focus, no selection)        |
| `readOnly`    | `boolean`            | `false` | visible and copyable, not editable       |
| `clear`       | `boolean`            | `false` | clear button → `onChange` with `''`      |
| `leftAddon`   | `ReactNode`          | —       | slot before the field; click focuses it  |
| `rightAddon`  | `ReactNode`          | —       | slot after the clear button              |
| `placeholder` | `string`             | —       | placeholder                              |
| `type`        | HTML `type`          | —       | input type                               |
| `dataTestId`  | `string`             | —       | `data-test-id` for tests                 |

`Input.AddonButton` is the in-slot button (`type="button"`). When `disabled`, slots stay visible but ignore clicks.

### FormInput

| Prop         | Values               | Default | Description                        |
| ------------ | -------------------- | ------- | ---------------------------------- |
| `name`       | `string`             | —       | field name in `Form`               |
| `label`      | `ReactNode`          | —       | label (`Field.Label`)              |
| `hint`       | `ReactNode`          | —       | hint                               |
| `clear`      | `boolean`            | —       | clear button                       |
| `size`       | `sm` \| `md` \| `lg` | `md`    | size (on Field)                    |
| `disabled`   | `boolean`            | —       | disabled                           |
| `readOnly`   | `boolean`            | —       | visible and copyable, not editable |
| `dataTestId` | `string`             | —       | `data-test-id` for tests           |

value / onChange / onBlur / validity come from `Form`.
