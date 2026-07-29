## Example

```tsx
<Select
  aria-label="Status"
  options={[
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
  ]}
  clear
  placeholder="Select…"
/>

<Form initialValues={{ status: '' }} validationSchema={schema} onSubmit={save}>
  <FormSelect name="status" label="Status" options={STATUS_OPTIONS} clear />
  <Button type="submit">Save</Button>
</Form>
```

`FormSelect` with `clear` writes `''` to RHF (handy for `z.string()`). Primitive `Select.onChange(null)`.
