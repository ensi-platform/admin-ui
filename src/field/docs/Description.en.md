Compound wrapper for label / hint / error around any control.

```tsx
import { Field, useField } from '@ensi-platform/admin-ui/field';
```

## When to use

- label and hint for `Input` / `Select` / a custom control
- showing a validation error (text from outside, including RHF)
- instead of the old FormControl

Form wiring goes through `Form` / `FormInput` etc., not via `name` on `Field`.

## API (short)

| Prop         | Values               | Default | Description              |
| ------------ | -------------------- | ------- | ------------------------ |
| `size`       | `sm` \| `md` \| `lg` | `md`    | label / spacing size     |
| `invalid`    | `boolean`            | `false` | invalid state            |
| `disabled`   | `boolean`            | `false` | disabled                 |
| `block`      | `boolean`            | —       | full width of the parent |
| `dataTestId` | `string`             | —       | `data-test-id` for tests |
| `children`   | `ReactNode`          | —       | slots and control        |

Slots: `Field.Label`, `Field.Hint`, `Field.Error` (typography follows `size`: sm/md — Label `bodyS`, Hint/Error `bodyXs`; lg — Label `bodyM`, Hint/Error `bodyS`).

`useField().controlProps` — spread onto the control (`id`, `aria-*`, `disabled`). Label / hint / error are slots only, not root props.
