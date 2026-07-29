## Example

```tsx
<MultiAutocomplete aria-label="Tags" options={TAG_OPTIONS} clear placeholder="Start typing…" />

<Form initialValues={{ tags: [] }} validationSchema={schema} onSubmit={save}>
  <FormMultiAutocomplete name="tags" label="Tags" options={TAG_OPTIONS} clear />
  <Button type="submit">Save</Button>
</Form>
```

`clear` calls `onChange([])`.
