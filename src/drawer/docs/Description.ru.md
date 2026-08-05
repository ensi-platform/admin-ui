Боковая панель на React Aria `ModalOverlay` + `Dialog`.

```tsx
import { Drawer } from '@ensi-platform/admin-ui/drawer';
```

## Когда использовать

- фильтры / детали сущности сбоку экрана
- длинный контент, который не должен перекрывать весь viewport как `Modal`
- на mobile вместо боковой панели — см. `BottomSheet`

## API (кратко)

| Prop                  | Значения                  | По умолчанию | Описание                                     |
| --------------------- | ------------------------- | ------------ | -------------------------------------------- |
| `open`                | `boolean`                 | —            | открыт ли (только controlled)                |
| `onOpenChange`        | `(open: boolean) => void` | —            | смена состояния                              |
| `onExitComplete`      | `() => void`              | —            | после анимации закрытия (для `ModalHub`)     |
| `placement`           | `left` \| `right`         | `right`      | сторона viewport                             |
| `size`                | `sm` \| `md` \| `lg`      | `md`         | ширина панели; игнорируется при `fullscreen` |
| `fullscreen`          | `boolean`                 | `false`      | панель на всю ширину viewport                |
| `variant`             | `primary`                 | `primary`    | визуальный вариант                           |
| `dismissable`         | `boolean`                 | `true`       | закрытие снаружи                             |
| `keyboardDismissable` | `boolean`                 | `true`       | закрытие по Escape                           |
| `dataTestId`          | `string`                  | —            | атрибут `data-test-id` для тестов            |

Слоты: `Drawer.Header` / `Title` / `Body` / `Footer` / `CloseButton`. У `CloseButton` — `size`: `sm` \| `md` \| `lg` (по умолчанию `md`; не связан с `Drawer.size`).
