Multi-select on React Aria `Select` (`selectionMode="multiple"`).

```tsx
import { MultiSelect, FormMultiSelect } from '@ensi-platform/admin-ui/multi-select';
```

## When to use

- several values from a dictionary / enum
- single value — see `Select`
- status in a table — see `Badge`

## API (short)

### MultiSelect

| Prop           | Values                                  | Default | Description                     |
| -------------- | --------------------------------------- | ------- | ------------------------------- |
| `options`      | `{ value, label, disabled? }[]`         | —       | options list                    |
| `value`        | `(string \| number)[]`                  | —       | controlled; `[]` after clear    |
| `defaultValue` | `(string \| number)[]`                  | —       | uncontrolled initial            |
| `onChange`     | `(value: (string \| number)[]) => void` | —       | selection change; `[]` on clear |
| `placeholder`  | `string`                                | —       | placeholder                     |
| `clear`        | `boolean`                               | `false` | clear entire selection          |
| `size`         | `sm` \| `md` \| `lg`                    | `md`    | size                            |
| `invalid`      | `boolean`                               | `false` | invalid state                   |
| `disabled`     | `boolean`                               | `false` | disabled                        |
| `dataTestId`   | `string`                                | —       | `data-test-id` for tests        |

Trigger shows tags with per-tag remove. No `as` / compound `Item`.

### FormMultiSelect

| Prop          | Values                          | Default | Description              |
| ------------- | ------------------------------- | ------- | ------------------------ |
| `name`        | `string`                        | —       | field name in `Form`     |
| `label`       | `ReactNode`                     | —       | `Field.Label`            |
| `hint`        | `ReactNode`                     | —       | hint under the control   |
| `options`     | `{ value, label, disabled? }[]` | —       | options list             |
| `placeholder` | `string`                        | —       | placeholder              |
| `clear`       | `boolean`                       | `false` | clear entire selection   |
| `size`        | `sm` \| `md` \| `lg`            | `md`    | size                     |
| `disabled`    | `boolean`                       | —       | disabled                 |
| `dataTestId`  | `string`                        | —       | `data-test-id` for tests |

Value / onChange / onBlur / validity come from `Form`.
