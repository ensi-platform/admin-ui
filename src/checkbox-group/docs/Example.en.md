## Example

```tsx
<CheckboxGroup value={tags} onChange={setTags} aria-label="Tags">
    <div style={{ display: 'flex', gap: 12 }}>
        <Checkbox value="a">A</Checkbox>
        <Checkbox value="b">B</Checkbox>
    </div>
</CheckboxGroup>

<Form initialValues={{ tags: [] }} onSubmit={save}>
    <FormCheckboxGroup name="tags" label="Tags">
        <Checkbox value="a">A</Checkbox>
        <Checkbox value="b">B</Checkbox>
    </FormCheckboxGroup>
</Form>
```
