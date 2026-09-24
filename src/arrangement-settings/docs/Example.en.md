## Example

```tsx
<ArrangementSettings
    open={open}
    onOpenChange={setOpen}
    title="Filter settings"
    items={[
        { id: 'name', label: 'Name' },
        { id: 'date', label: 'Date' },
    ]}
    value={visible}
    onSave={setVisible}
/>
```
