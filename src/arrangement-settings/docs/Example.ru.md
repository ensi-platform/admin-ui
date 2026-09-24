## Пример

```tsx
<ArrangementSettings
    open={open}
    onOpenChange={setOpen}
    title="Настройка фильтров"
    items={[
        { id: 'name', label: 'Название' },
        { id: 'date', label: 'Дата' },
    ]}
    value={visible}
    onSave={setVisible}
/>
```
