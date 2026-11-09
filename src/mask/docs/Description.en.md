Single-line field that formats input with an IMask pattern. The mask is passed in from outside via `opts`.

```tsx
import { Mask, FormMask } from '@ensi-platform/admin-ui/mask';
```

## When to use

- phone, tax id, code, and other text whose format the app defines
- a date — see `DatePicker`
- a number — see `NumberInput`
- free text — see `Input`

## API (short)

`value` and `onChange` carry the string as shown in the field, including mask literals. An empty field is `''`. A partial value is emitted immediately. If the mask rewrites the passed `value`, `onChange` fires once with the normalized string. Until the parent stores it, the field keeps showing `value`.

Pass the same `opts` object between renders: a constant or `useMemo`. A new object on every render makes IMask refresh the mask.

### Mask

| Prop         | Values               | Default | Description                                 |
| ------------ | -------------------- | ------- | ------------------------------------------- |
| `opts`       | `FactoryOpts`        | —       | IMask options (`mask`, `blocks`, `prepare`) |
| `size`       | `sm` \| `md` \| `lg` | `md`    | size; inside Field inherits `Field.size`    |
| `invalid`    | `boolean`            | `false` | invalid state                               |
| `disabled`   | `boolean`            | `false` | disabled                                    |
| `readOnly`   | `boolean`            | `false` | visible and copyable, not editable          |
| `clear`      | `boolean`            | `false` | clear button → `onChange` with `''`         |
| `dataTestId` | `string`             | —       | `data-test-id` for tests                    |

Chrome matches `Input`. No `as`.

### FormMask

| Prop         | Values               | Default | Description                        |
| ------------ | -------------------- | ------- | ---------------------------------- |
| `name`       | `string`             | —       | field name in `Form`               |
| `opts`       | `FactoryOpts`        | —       | IMask options                      |
| `label`      | `ReactNode`          | —       | label (`Field.Label`)              |
| `hint`       | `ReactNode`          | —       | hint                               |
| `clear`      | `boolean`            | —       | clear button                       |
| `size`       | `sm` \| `md` \| `lg` | `md`    | size (on Field)                    |
| `disabled`   | `boolean`            | —       | disabled                           |
| `readOnly`   | `boolean`            | —       | visible and copyable, not editable |
| `dataTestId` | `string`             | —       | `data-test-id` for tests           |

value / onChange / onBlur / validity come from `Form`.
