Multiline text control on React Aria `TextArea`.

```tsx
import { TextArea, FormTextArea } from '@ensi-platform/admin-ui/textarea';
```

## When to use

- free multiline text (comment, description, address)
- a single line — see `Input`

## API (short)

### TextArea

| Prop          | Values               | Default | Description                              |
| ------------- | -------------------- | ------- | ---------------------------------------- |
| `size`        | `sm` \| `md` \| `lg` | `md`    | size; inside Field inherits `Field.size` |
| `invalid`     | `boolean`            | `false` | invalid state                            |
| `disabled`    | `boolean`            | `false` | disabled                                 |
| `clear`       | `boolean`            | `false` | clear button → `onChange` with `''`      |
| `placeholder` | `string`             | —       | placeholder                              |
| `rows`        | `number`             | —       | row count                                |
| `dataTestId`  | `string`             | —       | `data-test-id` for tests                 |

No `as` / extra `variant` beyond `primary`.

### FormTextArea

| Prop         | Values               | Default | Description              |
| ------------ | -------------------- | ------- | ------------------------ |
| `name`       | `string`             | —       | field name in `Form`     |
| `label`      | `ReactNode`          | —       | label (`Field.Label`)    |
| `hint`       | `ReactNode`          | —       | hint                     |
| `clear`      | `boolean`            | —       | clear button             |
| `size`       | `sm` \| `md` \| `lg` | `md`    | size (on Field)          |
| `disabled`   | `boolean`            | —       | disabled                 |
| `dataTestId` | `string`             | —       | `data-test-id` for tests |

value / onChange / onBlur / validity come from `Form`.
