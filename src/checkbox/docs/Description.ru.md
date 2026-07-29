Чекбокс для значения `boolean`. Группа опций (`string[]`) — отдельный `CheckboxGroup` / `FormCheckboxGroup`.

```tsx
import { Checkbox, FormCheckbox } from '@ensi-platform/admin-ui';
```

## Когда использовать

- одно значение `boolean`
- набор опций с общим значением — см. `CheckboxGroup`
- вкл/выкл без «галочки» — см. `Switch`

## API (кратко)

### Checkbox

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | размер |
| `checked` | `boolean` | — | управляемое значение |
| `defaultChecked` | `boolean` | — | начальное значение |
| `onChange` | `(checked: boolean) => void` | — | смена состояния |
| `indeterminate` | `boolean` | `false` | промежуточное (чёрточка) |
| `value` | `string` | — | ключ внутри `CheckboxGroup` |
| `children` | `ReactNode` | — | видимая подпись; без children — `aria-label` |
| `invalid` | `boolean` | `false` | ошибка |
| `disabled` | `boolean` | `false` | недоступен |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |

Не передавать `checked` / `onChange`, если чекбокс внутри `CheckboxGroup`.

### FormCheckbox

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `name` | `string` | — | имя поля в `Form` (`boolean`) |
| `hint` | `ReactNode` | — | подсказка под контролом |
| `children` | `ReactNode` | — | подпись; без `Field.Label` |
| `size` | `sm` \| `md` \| `lg` | `md` | размер |
| `disabled` | `boolean` | — | недоступен |
| `block` | `boolean` | `true` | на всю ширину родителя |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |
