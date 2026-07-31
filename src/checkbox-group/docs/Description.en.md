Checkbox group with a shared `string[]` value. Inside — `Checkbox` with `value`; how to arrange them is up to you in `children`.

```tsx
import { Checkbox } from '@ensi-platform/admin-ui/checkbox';
import { CheckboxGroup, FormCheckboxGroup } from '@ensi-platform/admin-ui/checkbox-group';
```

## When to use

- several options, more than one can be selected (`string[]`)
- a single yes/no flag — see `Checkbox`

## API (short)

### CheckboxGroup

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `value` | `string[]` | — | controlled |
| `defaultValue` | `string[]` | — | uncontrolled |
| `onChange` | `(value: string[]) => void` | — | selection change |
| `children` | `ReactNode` | — | `Checkbox` items and arbitrary layout |
| `size` | `sm` \| `md` \| `lg` | `md` | chrome (`data-size`); set item size on each `Checkbox` |
| `invalid` | `boolean` | `false` | invalid state |
| `disabled` | `boolean` | `false` | disabled |
| `dataTestId` | `string` | — | `data-test-id` for tests |

### FormCheckboxGroup

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | field name in `Form` (`string[]`) |
| `label` | `ReactNode` | — | field label |
| `hint` | `ReactNode` | — | hint under the control |
| `children` | `ReactNode` | — | `Checkbox` items and layout |
| `size` | `sm` \| `md` \| `lg` | `md` | Field / group chrome size |
| `disabled` | `boolean` | — | disabled |
| `block` | `boolean` | `true` | full width of the parent |
| `dataTestId` | `string` | — | `data-test-id` for tests |
