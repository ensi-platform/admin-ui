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
