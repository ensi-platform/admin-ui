## Пример

```tsx
<Select
  aria-label="Статус"
  options={[
    { value: 'draft', label: 'Черновик' },
    { value: 'published', label: 'Опубликован' },
  ]}
  clear
  placeholder="Выберите…"
/>

<Form initialValues={{ status: '' }} validationSchema={schema} onSubmit={save}>
  <FormSelect name="status" label="Статус" options={STATUS_OPTIONS} clear />
  <Button type="submit">Сохранить</Button>
</Form>
```

`FormSelect` при `clear` пишет в RHF `''` (удобно для `z.string()`). Примитив `Select.onChange(null)`.
