# BottomSheet

Примитив мобильной шторки снизу на React Aria `ModalOverlay` + `Dialog`. Импорт: `import { BottomSheet } from '@ensi-platform/admin-ui'`.

## Когда использовать

- фильтры / действия / детали на mobile вместо бокового `Drawer`
- контент, который удобно закрывать свайпом вниз

## API (кратко)

- `open` / `onOpenChange` — только controlled
- `onExitComplete` — после exit-анимации (для ModalHub)
- `variant`: `primary` (пока)
- `fullscreen` — на всю высоту viewport
- `dismissable` / `keyboardDismissable` (дефолт `true`) — `dismissable` также включает swipe-to-close
- высота по контенту, `max-height` токеном (без `size`)
- `dataTestId`
- слоты: `BottomSheet.Header` / `BottomSheet.Title` / `BottomSheet.Body` / `BottomSheet.Footer` / `BottomSheet.CloseButton`
- `CloseButton.size`: `sm` | `md` | `lg` (дефолт `md`)
- handle рисуется в shell

## Пример

```tsx
<BottomSheet open={open} onOpenChange={setOpen}>
    <BottomSheet.Header>
        <BottomSheet.Title>Фильтры</BottomSheet.Title>
        <BottomSheet.CloseButton />
    </BottomSheet.Header>
    <BottomSheet.Body>Контент</BottomSheet.Body>
    <BottomSheet.Footer>
        <Button onClick={() => setOpen(false)}>Закрыть</Button>
    </BottomSheet.Footer>
</BottomSheet>
```

## Не делать

- не копировать стили компонента в АП
- не дублировать примитив обёрткой без нужды
- не использовать `defaultOpen` / uncontrolled
- не подменять `Modal` / `Drawer` на mobile без явной нужды в жесте снизу
