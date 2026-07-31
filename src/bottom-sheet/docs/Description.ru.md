Мобильная шторка снизу на React Aria `ModalOverlay` + `Dialog`.

```tsx
import { BottomSheet } from '@ensi-platform/admin-ui/bottom-sheet';
```

## Когда использовать

- фильтры / действия / детали на mobile вместо бокового `Drawer`
- контент, который удобно закрывать свайпом вниз

## API (кратко)

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `open` | `boolean` | — | открыт ли (только controlled) |
| `onOpenChange` | `(open: boolean) => void` | — | смена состояния |
| `onExitComplete` | `() => void` | — | после анимации закрытия (для `ModalHub`) |
| `variant` | `primary` | `primary` | визуальный вариант |
| `fullscreen` | `boolean` | `false` | на всю высоту viewport |
| `dismissable` | `boolean` | `true` | закрытие снаружи и свайпом вниз |
| `keyboardDismissable` | `boolean` | `true` | закрытие по Escape |
| `dataTestId` | `string` | — | атрибут `data-test-id` для тестов |

Слоты: `BottomSheet.Header` / `Title` / `Body` / `Footer` / `CloseButton`. У `CloseButton` — `size`: `sm` \| `md` \| `lg` (по умолчанию `md`).

Высота по контенту (`max-height` токеном), без `size` на корне. Handle рисуется в shell.
