## Пример

```tsx
<DeleteModal
    open={open}
    onOpenChange={setOpen}
    title="Удалить роль?"
    onConfirm={async () => {
        await deleteRole(id);
    }}
>
    Действие необратимо.
</DeleteModal>
```
