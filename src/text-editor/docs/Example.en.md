## Example

```tsx
<TextEditor aria-label="Page text" defaultValue="<p>Paragraph</p>" maxLength={2000} onChange={setHtml} />

<Form initialValues={{ content: '' }} onSubmit={save}>
  <FormTextEditor name="content" label="Text" hint="Headings, lists, links" />
  <Button type="submit">Save</Button>
</Form>
```
