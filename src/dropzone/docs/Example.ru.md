## Пример

```tsx
<Dropzone
  title="Вложения"
  description="PDF, до 5 МБ"
  accept={{ 'application/pdf': ['.pdf'] }}
  maxFiles={5}
  maxSize={5 * 1024 * 1024}
  upload={(file, _context) => Promise.resolve({ id: file.name, url: `/files/${file.name}` })}
/>

<Form initialValues={{ files: [] }} validationSchema={schema} onSubmit={save}>
  <FormDropzone name="files" label="Вложения" hint="PDF, до 5 МБ" accept={{ 'application/pdf': ['.pdf'] }} />
  <Button type="submit">Сохранить</Button>
</Form>
```
