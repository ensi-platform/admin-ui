Императивный стек поверх `Modal` / `Drawer` через React Context.

```tsx
import { ModalProvider, ModalHub, useModal, useModalAsync } from '@ensi-platform/admin-ui';
```

## Когда использовать

- открыть окно из хелпера / меню / async-чанка без локального `useState`

## API (кратко)

### ModalProvider / ModalHub

| API | Описание |
| --- | --- |
| `ModalProvider` | context-стор стека; mount один раз в root (отдельно от `AdminUiProvider`) |
| `ModalHub` | рендер стека; один раз рядом с деревом приложения |

### useModal / useModalAsync

| API | Аргументы | Возвращает |
| --- | --- | --- |
| `useModal` | `{ Component, props? }` | `{ onOpenHandler, onCloseHandler }` |
| `useModalAsync` | `{ loadComponent, props? }` | `{ onOpenHandler, onCloseHandler }` — lazy-загрузка и защита от гонок |

### IModalHubItemProps

Контракт компонента в стеке:

| Prop | Значения | Описание |
| --- | --- | --- |
| `open` | `boolean` | открыт ли |
| `onOpenChange` | `(open: boolean) => void` | смена состояния |
| `onExitComplete` | `() => void` | после анимации закрытия (нужен для снятия из стека) |
