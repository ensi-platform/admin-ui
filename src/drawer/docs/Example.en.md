## Example

```tsx
<Drawer open={open} onOpenChange={setOpen} placement="right" size="md">
    <Drawer.Header>
        <Drawer.Title>Filters</Drawer.Title>
        <Drawer.CloseButton />
    </Drawer.Header>
    <Drawer.Body>Content</Drawer.Body>
    <Drawer.Footer>
        <Button onClick={() => setOpen(false)}>Close</Button>
    </Drawer.Footer>
</Drawer>
```
