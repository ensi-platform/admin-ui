## Пример

```tsx
<TextArea placeholder="Комментарий" size="md" clear />

const CommentControl = () => {
  const { controlProps, size, invalid, disabled } = useField();
  return <TextArea {...controlProps} size={size} invalid={invalid} disabled={disabled} clear />;
};

<Field invalid={Boolean(error)}>
  <Field.Label>Комментарий</Field.Label>
  <CommentControl />
  <Field.Error>{error}</Field.Error>
</Field>

<Form initialValues={{ comment: '' }} validationSchema={schema} onSubmit={save}>
  <FormTextArea name="comment" label="Комментарий" hint="…" clear />
  <Button type="submit">Save</Button>
</Form>
```
