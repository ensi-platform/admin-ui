Модальное окно на React Aria `ModalOverlay` + `Dialog`.

```tsx
import { Modal } from '@ensi-platform/admin-ui/modal';
```

## Когда использовать

- диалог подтверждения / форма поверх страницы

## API (кратко)

| Prop                  | Значения                  | По умолчанию | Описание                                   |
| --------------------- | ------------------------- | ------------ | ------------------------------------------ |
| `open`                | `boolean`                 | —            | открыт ли (только controlled)              |
| `onOpenChange`        | `(open: boolean) => void` | —            | смена состояния                            |
| `onExitComplete`      | `() => void`              | —            | после анимации закрытия (для `ModalHub`)   |
| `size`                | `sm` \| `md` \| `lg`      | `md`         | ширина окна; игнорируется при `fullscreen` |
| `fullscreen`          | `boolean`                 | `false`      | на весь viewport                           |
| `variant`             | `primary`                 | `primary`    | визуальный вариант                         |
| `dismissable`         | `boolean`                 | `true`       | закрытие снаружи                           |
| `keyboardDismissable` | `boolean`                 | `true`       | закрытие по Escape                         |
| `dataTestId`          | `string`                  | —            | атрибут `data-test-id` для тестов          |

Слоты: `Modal.Header` / `Title` / `Body` / `Footer` / `CloseButton`. У `CloseButton` — `size`: `sm` \| `md` \| `lg` (по умолчанию `md`; не связан с `Modal.size`).
