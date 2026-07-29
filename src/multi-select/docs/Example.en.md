## Example

```tsx
<MultiSelect
  aria-label="Tags"
  options={[
    { value: 'vip', label: 'vip' },
    { value: 'regular', label: 'regular customer' },
  ]}
  clear
  placeholder="Select…"
/>

<Form initialValues={{ tags: [] }} validationSchema={schema} onSubmit={save}>
  <FormMultiSelect name="tags" label="Tags" options={TAG_OPTIONS} clear />
  <Button type="submit">Save</Button>
</Form>
```

`clear` calls `onChange([])`.
