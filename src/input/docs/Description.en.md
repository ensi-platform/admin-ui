Text control on React Aria `Input`.

```tsx
import { Input, FormInput } from '@ensi-platform/admin-ui';
```

## When to use

- free single-line text (email, name, search)
- multiline text — see `TextArea`
- a number — see `NumberInput`

## API (short)

### Input

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | size; inside Field inherits `Field.size` |
| `invalid` | `boolean` | `false` | invalid state |
| `disabled` | `boolean` | `false` | disabled |
| `clear` | `boolean` | `false` | clear button → `onChange` with `''` |
| `placeholder` | `string` | — | placeholder |
| `type` | HTML `type` | — | input type |
| `dataTestId` | `string` | — | `data-test-id` for tests |

No `as` / prefix/suffix.

### FormInput

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | field name in `Form` |
| `label` | `ReactNode` | — | label (`Field.Label`) |
| `hint` | `ReactNode` | — | hint |
| `clear` | `boolean` | — | clear button |
| `size` | `sm` \| `md` \| `lg` | `md` | size (on Field) |
| `disabled` | `boolean` | — | disabled |
| `dataTestId` | `string` | — | `data-test-id` for tests |

value / onChange / onBlur / validity come from `Form`.
