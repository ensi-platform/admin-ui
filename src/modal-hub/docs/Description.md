# ModalHub

Imperative-слой поверх `Modal` / `Drawer`: стек в React Context. Импорт: `import { ModalProvider, ModalHub, useModal, useModalAsync } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- открыть модалку из хелпера / меню / async-чанка без локального `useState`
- несколько модалок в стеке

Declarative `<Modal open>` / `<Drawer open>` работают **без** `ModalProvider`.

## API (кратко)

- `ModalProvider` — context-стор стека
- `ModalHub` — рендер стека (один раз в root)
- `useModal({ Component, props? })` → `{ onOpenHandler, onCloseHandler }`
- `useModalAsync({ loadComponent, props? })` → lazy + race-guard
- контракт компонента: `open` / `onOpenChange` / `onExitComplete`

## Пример

```tsx
<AdminUiProvider>
    <ModalProvider>
        <App />
        <ModalHub />
    </ModalProvider>
</AdminUiProvider>
```

```tsx
const ConfirmModal = ({ open, onOpenChange, onExitComplete }: IModalHubItemProps) => (
    <Modal open={open} onOpenChange={onOpenChange} onExitComplete={onExitComplete}>
        …
    </Modal>
);

const { onOpenHandler } = useModal({ Component: ConfirmModal });
```

## Не делать

- не смешивать стек с `AdminUiProvider`
- не тащить zustand в base ради hub
- не дублировать `ModalHub` в нескольких местах tree
