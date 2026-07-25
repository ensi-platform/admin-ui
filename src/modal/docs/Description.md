# Modal

Примитив модального окна на React Aria `ModalOverlay` + `Dialog`. Импорт: `import { Modal } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- диалог подтверждения / форма поверх страницы
- контент, который блокирует остальной UI
- imperative-открытие — отдельный пакет `ModalHub` (`useModal` / `useModalAsync`)

## API (кратко)

- `open` / `onOpenChange` — только controlled
- `onExitComplete` — после exit-анимации (нужен для ModalHub)
- `size`: `sm` | `md` | `lg`
- `fullscreen` — на весь viewport (перекрывает геометрию `size`)
- `variant`: `primary` (пока)
- `dismissable` / `keyboardDismissable` (дефолт `true`)
- `dataTestId`
- слоты: `Modal.Header` / `Modal.Title` / `Modal.Body` / `Modal.Footer` / `Modal.CloseButton`

## Пример

```tsx
<Modal open={open} onOpenChange={setOpen} size="md">
    <Modal.Header>
        <Modal.Title>Заголовок</Modal.Title>
        <Modal.CloseButton />
    </Modal.Header>
    <Modal.Body>Контент</Modal.Body>
    <Modal.Footer>
        <Button onClick={() => setOpen(false)}>Отмена</Button>
        <Button>Сохранить</Button>
    </Modal.Footer>
</Modal>
```

## Не делать

- не копировать стили компонента в АП
- не дублировать примитив обёрткой без нужды
- не использовать `defaultOpen` / uncontrolled
