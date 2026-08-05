Группа чекбоксов с общим значением `string[]`. Внутри — `Checkbox` с `value`; как их разложить, решаете сами в `children`.

```tsx
import { Checkbox } from '@ensi-platform/admin-ui/checkbox';
import { CheckboxGroup, FormCheckboxGroup } from '@ensi-platform/admin-ui/checkbox-group';
```

## Когда использовать

- несколько опций, можно выбрать больше одной (`string[]`)
- один флаг да/нет — см. `Checkbox`

## API (кратко)

### CheckboxGroup

| Prop           | Значения                    | По умолчанию | Описание                                                               |
| -------------- | --------------------------- | ------------ | ---------------------------------------------------------------------- |
| `value`        | `string[]`                  | —            | управляемое значение                                                   |
| `defaultValue` | `string[]`                  | —            | начальное значение                                                     |
| `onChange`     | `(value: string[]) => void` | —            | смена выбора                                                           |
| `children`     | `ReactNode`                 | —            | `Checkbox` и произвольная вёрстка                                      |
| `size`         | `sm` \| `md` \| `lg`        | `md`         | оформление группы (`data-size`); размер пунктов — на каждом `Checkbox` |
| `invalid`      | `boolean`                   | `false`      | ошибка                                                                 |
| `disabled`     | `boolean`                   | `false`      | недоступна                                                             |
| `dataTestId`   | `string`                    | —            | атрибут `data-test-id` для тестов                                      |

### FormCheckboxGroup

| Prop         | Значения             | По умолчанию | Описание                          |
| ------------ | -------------------- | ------------ | --------------------------------- |
| `name`       | `string`             | —            | имя поля в `Form` (`string[]`)    |
| `label`      | `ReactNode`          | —            | подпись поля                      |
| `hint`       | `ReactNode`          | —            | подсказка под контролом           |
| `children`   | `ReactNode`          | —            | `Checkbox` и вёрстка              |
| `size`       | `sm` \| `md` \| `lg` | `md`         | размер оболочки `Field` / группы  |
| `disabled`   | `boolean`            | —            | недоступна                        |
| `block`      | `boolean`            | `true`       | на всю ширину родителя            |
| `dataTestId` | `string`             | —            | атрибут `data-test-id` для тестов |
