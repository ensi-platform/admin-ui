Boolean flag. A set of options (`string[]`) is a separate `CheckboxGroup` / `FormCheckboxGroup`.

```tsx
import { Checkbox, FormCheckbox } from '@ensi-platform/admin-ui/checkbox';
```

## When to use

- a single `boolean` value
- a set of options with a shared value — see `CheckboxGroup`
- on/off without a checkmark look — see `Switch`

## API (short)

### Checkbox

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `checked` | `boolean` | — | controlled |
| `defaultChecked` | `boolean` | — | uncontrolled |
| `onChange` | `(checked: boolean) => void` | — | change handler |
| `indeterminate` | `boolean` | `false` | indeterminate (dash) |
| `value` | `string` | — | key inside `CheckboxGroup` |
| `children` | `ReactNode` | — | visible label; without children use `aria-label` |
| `invalid` | `boolean` | `false` | invalid state |
| `disabled` | `boolean` | `false` | disabled |
| `dataTestId` | `string` | — | `data-test-id` for tests |

Do not pass `checked` / `onChange` when the checkbox is inside `CheckboxGroup`.

### FormCheckbox

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | field name in `Form` (boolean) |
| `hint` | `ReactNode` | — | hint under the control |
| `children` | `ReactNode` | — | label; no `Field.Label` |
| `size` | `sm` \| `md` \| `lg` | `md` | size |
| `disabled` | `boolean` | — | disabled |
| `block` | `boolean` | `true` | full width of the parent |
| `dataTestId` | `string` | — | `data-test-id` for tests |
