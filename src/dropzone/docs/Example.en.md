## Example

```tsx
<Dropzone
  title="Attachments"
  description="PDF, up to 5 MB"
  accept={{ 'application/pdf': ['.pdf'] }}
  maxFiles={5}
  maxSize={5 * 1024 * 1024}
  upload={(file, _context) => Promise.resolve({ id: file.name, url: `/files/${file.name}` })}
/>

<Form initialValues={{ files: [] }} validationSchema={schema} onSubmit={save}>
  <FormDropzone name="files" label="Attachments" hint="PDF, up to 5 MB" accept={{ 'application/pdf': ['.pdf'] }} />
  <Button type="submit">Save</Button>
</Form>
```
