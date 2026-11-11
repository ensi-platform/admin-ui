Password field on `Input` with a reveal button.

```tsx
import { Password, FormPassword } from '@ensi-platform/admin-ui/password';
```

## When to use

- a secret the user can reveal for a moment
- plain text — see `Input`

## API (short)

### Password

| Prop           | Values      | Default            | Description                                |
| -------------- | ----------- | ------------------ | ------------------------------------------ |
| `leftAddon`    | `ReactNode` | —                  | slot before the field                      |
| `rightAddon`   | `ReactNode` | —                  | slot after clear, before the reveal button |
| `clear`        | `boolean`   | `false`            | clear button before the right slot         |
| `disabled`     | `boolean`   | `false`            | disabled; no reveal button                 |
| `readOnly`     | `boolean`   | `false`            | visible and copyable; no reveal button     |
| `autoComplete` | `string`    | `current-password` | overridable                                |
| `dataTestId`   | `string`    | —                  | `data-test-id` for tests                   |

Visibility stays inside the component. There is no `type` prop.

### FormPassword

| Prop       | Values      | Default | Description           |
| ---------- | ----------- | ------- | --------------------- |
| `name`     | `string`    | —       | field name in `Form`  |
| `label`    | `ReactNode` | —       | label (`Field.Label`) |
| `hint`     | `ReactNode` | —       | hint                  |
| `clear`    | `boolean`   | —       | clear button          |
| `disabled` | `boolean`   | —       | disabled              |
| `readOnly` | `boolean`   | —       | read-only             |

value / onChange / onBlur / validity come from `Form`.
