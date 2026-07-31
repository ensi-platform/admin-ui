Тумблер вкл/выкл на React Aria `Switch`.

```tsx
import { Switch, FormSwitch } from '@ensi-platform/admin-ui/switch';
```

## Когда использовать

- настройки / флаги вкл-выкл
- выбор с галочкой — см. `Checkbox`

## API (кратко)

### Switch

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | размер |
| `checked` | `boolean` | — | управляемое значение |
| `defaultChecked` | `boolean` | — | начальное значение |
| `onChange` | `(checked: boolean) => void` | — | смена состояния |
| `children` | `ReactNode` | — | видимая подпись; без children — `aria-label` |
| `invalid` | `boolean` | `false` | ошибка |
| `disabled` | `boolean` | `false` | недоступен |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |

Без Group / `as` / отдельных `variant` кроме `primary`.

### FormSwitch

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `name` | `string` | — | имя поля в `Form` (`boolean`) |
| `hint` | `ReactNode` | — | подсказка под контролом |
| `children` | `ReactNode` | — | подпись; без `Field.Label` |
| `size` | `sm` \| `md` \| `lg` | `md` | размер |
| `disabled` | `boolean` | — | недоступен |
| `block` | `boolean` | `true` | на всю ширину родителя |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |
