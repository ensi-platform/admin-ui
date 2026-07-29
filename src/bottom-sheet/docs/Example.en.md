## Example

```tsx
<BottomSheet open={open} onOpenChange={setOpen}>
    <BottomSheet.Header>
        <BottomSheet.Title>Filters</BottomSheet.Title>
        <BottomSheet.CloseButton />
    </BottomSheet.Header>
    <BottomSheet.Body>Content</BottomSheet.Body>
    <BottomSheet.Footer>
        <Button onClick={() => setOpen(false)}>Close</Button>
    </BottomSheet.Footer>
</BottomSheet>
```
