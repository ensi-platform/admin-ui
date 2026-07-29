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
