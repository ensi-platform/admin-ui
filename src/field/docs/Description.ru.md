Составная обёртка label / hint / error вокруг любого контрола.

```tsx
import { Field, useField } from '@ensi-platform/admin-ui';
```

## Когда использовать

- подпись и подсказка к `Input` / `Select` / кастомному контролу
- показ ошибки валидации (текст снаружи, в т.ч. из RHF)
- вместо старого FormControl

Связка с формой — через `Form` / `FormInput` и т.п., не через `name` на `Field`.

## API (кратко)

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | размер label / отступов |
| `invalid` | `boolean` | `false` | ошибка |
| `disabled` | `boolean` | `false` | недоступен |
| `block` | `boolean` | — | на всю ширину родителя |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |
| `children` | `ReactNode` | — | слоты и контрол |

Слоты: `Field.Label`, `Field.Hint`, `Field.Error` (типографика зависит от `size`: sm/md — Label `bodyS`, Hint/Error `bodyXs`; lg — Label `bodyM`, Hint/Error `bodyS`).

`useField().controlProps` — прокинуть на контрол (`id`, `aria-*`, `disabled`). Label / hint / error — только слотами, не пропами на root.
