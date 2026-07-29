Метка и чип фильтра с опциональным снятием.

```tsx
import { Tag } from '@ensi-platform/admin-ui';
```

## Когда использовать

- значения, выбранные в `MultiSelect`
- чипы активных фильтров
- не статус сущности в таблице — для этого `Badge`

## API (кратко)

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` | `md` | размер |
| `variant` | `primary` | `primary` | визуальный вариант |
| `onRemove` | `() => void` | — | крестик; `aria-label` из `useAuiLabels().clear` |
| `disabled` | `boolean` | `false` | отключает чип и кнопку снятия |
| `children` | `ReactNode` | — | текст |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |

Без `as` и без status-variants. Обычные атрибуты `span` (`className`, …) принимаются.
