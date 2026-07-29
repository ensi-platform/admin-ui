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
