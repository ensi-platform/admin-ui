## Example

```tsx
<Modal open={open} onOpenChange={setOpen} size="md">
    <Modal.Header>
        <Modal.Title>Title</Modal.Title>
        <Modal.CloseButton />
    </Modal.Header>
    <Modal.Body>Content</Modal.Body>
    <Modal.Footer>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button>Save</Button>
    </Modal.Footer>
</Modal>
```
