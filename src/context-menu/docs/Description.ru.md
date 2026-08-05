Фиксированное меню у курсора (ПКМ / координаты): portal, закрытие снаружи и по Escape.

```tsx
import { ContextMenu } from '@ensi-platform/admin-ui/context-menu';
```

## Когда использовать

- действия по правому клику на строке, пункте навигации, ячейке
- короткий список команд (закрепить, открыть в новой вкладке, удалить)
- не для меню от кнопки-триггера — см. `Popover`

## API (кратко)

### ContextMenu

| Prop           | Значения             | По умолчанию | Описание                                |
| -------------- | -------------------- | ------------ | --------------------------------------- |
| `open`         | `boolean`            | `false`      | открыто ли меню                         |
| `x`            | `number`             | —            | позиция left (viewport, px)             |
| `y`            | `number`             | —            | позиция top (viewport, px)              |
| `onClose`      | `() => void`         | —            | закрытие (снаружи / Escape)             |
| `size`         | `sm` \| `md` \| `lg` | `md`         | размер                                  |
| `variant`      | `primary`            | `primary`    | визуальный вариант                      |
| `children`     | `ReactNode`          | —            | пункты `ContextMenu.Item` / `Separator` |
| `onMouseEnter` | `() => void`         | —            | наведение на поверхность меню           |
| `dataTestId`   | `string`             | —            | атрибут `data-test-id`                  |

### ContextMenu.Item

| Prop         | Значения    | По умолчанию | Описание               |
| ------------ | ----------- | ------------ | ---------------------- |
| `children`   | `ReactNode` | —            | подпись                |
| `icon`       | SVGR        | —            | иконка слева           |
| `disabled`   | `boolean`   | `false`      | недоступный пункт      |
| `onClick`    | handler     | —            | действие               |
| `dataTestId` | `string`    | —            | атрибут `data-test-id` |

### ContextMenu.Separator

| Prop         | Значения | По умолчанию | Описание               |
| ------------ | -------- | ------------ | ---------------------- |
| `dataTestId` | `string` | —            | атрибут `data-test-id` |
