Подсказка на hover и focus.

```tsx
import { Tooltip } from '@ensi-platform/admin-ui/tooltip';
```

## Когда использовать

- короткая подсказка к иконке или кнопке без текста
- не для интерактивного контента — там `Popover`
- на touch не показывается — интерфейс должен работать без него

## API (кратко)

### Tooltip

RAC `TooltipTrigger`: `delay` (по умолчанию `200`), `closeDelay` (по умолчанию `100`), `children`.

### Tooltip.Trigger

Обёртка `Focusable` для `Button` / кастомного триггера.

### Tooltip.Content

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `size` | `sm` \| `md` \| `lg` | `md` | размер |
| `variant` | `primary` | `primary` | визуальный вариант |
| `arrow` | `boolean` | `false` | стрелка к триггеру |
| `placement` | placement RAC | — | позиция относительно триггера |
| `offset` | `number` | `4` | отступ от триггера |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |

Обычные атрибуты панели (`className`, …) принимаются.
