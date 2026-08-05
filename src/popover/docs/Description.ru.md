Оверлей у триггера с интерактивным контентом.

```tsx
import { Popover } from '@ensi-platform/admin-ui/popover';
```

## Когда использовать

- панель по клику: фильтры, меню действий, короткая форма
- не для текстовой подсказки — там `Tooltip`

## API (кратко)

### Popover

RAC `DialogTrigger`: `isOpen` / `defaultOpen` / `onOpenChange`, `children`.

### Popover.Trigger

Обёртка `Pressable` для `Button` / кастомного триггера.

### Popover.Content

| Prop         | Значения             | По умолчанию | Описание                          |
| ------------ | -------------------- | ------------ | --------------------------------- |
| `size`       | `sm` \| `md` \| `lg` | `md`         | размер панели                     |
| `variant`    | `primary`            | `primary`    | визуальный вариант                |
| `arrow`      | `boolean`            | `false`      | стрелка к триггеру                |
| `placement`  | placement RAC        | `bottom`     | позиция относительно триггера     |
| `offset`     | `number`             | `4`          | отступ от триггера                |
| `dataTestId` | `string`             | —            | атрибут `data-test-id` для тестов |

Внутри всегда RAC `Dialog`. Обычные атрибуты панели (`className`, …) принимаются.
