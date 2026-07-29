# Drawer

Примитив боковой панели на React Aria `ModalOverlay` + `Dialog`. Импорт: `import { Drawer } from '@ensi-platform/admin-ui'`.

## Когда использовать

- фильтры / детали сущности сбоку экрана
- длинный контент, который не должен перекрывать весь viewport как Modal

## API (кратко)

- `open` / `onOpenChange` — только controlled
- `onExitComplete` — после exit-анимации (для ModalHub)
- `placement`: `left` | `right` (дефолт `right`)
- `size`: `sm` | `md` | `lg`
- `fullscreen` — панель на всю ширину viewport (перекрывает геометрию `size`)
- `variant`: `primary` (пока)
- `dismissable` / `keyboardDismissable` (дефолт `true`)
- `dataTestId`
- слоты: `Drawer.Header` / `Drawer.Title` / `Drawer.Body` / `Drawer.Footer` / `Drawer.CloseButton`
- `CloseButton.size`: `sm` | `md` | `lg` (дефолт `md`; не связан с `Drawer.size`)

## Пример

```tsx
<Drawer open={open} onOpenChange={setOpen} placement="right" size="md">
    <Drawer.Header>
        <Drawer.Title>Фильтры</Drawer.Title>
        <Drawer.CloseButton />
    </Drawer.Header>
    <Drawer.Body>Контент</Drawer.Body>
    <Drawer.Footer>
        <Button onClick={() => setOpen(false)}>Закрыть</Button>
    </Drawer.Footer>
</Drawer>
```

## Не делать

- не копировать стили компонента в АП
- не дублировать примитив обёрткой без нужды
- не использовать `defaultOpen` / uncontrolled
