## Example

```tsx
<DeleteModal
    open={open}
    onOpenChange={setOpen}
    title="Delete role?"
    onConfirm={async () => {
        await deleteRole(id);
    }}
>
    This action cannot be undone.
</DeleteModal>
```
