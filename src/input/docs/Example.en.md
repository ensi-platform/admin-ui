## Example

```tsx
<Input placeholder="Email" size="md" clear />

const EmailControl = () => {
  const { controlProps, size, invalid, disabled } = useField();
  return <Input {...controlProps} size={size} invalid={invalid} disabled={disabled} clear />;
};

<Field invalid={Boolean(error)}>
  <Field.Label>Email</Field.Label>
  <EmailControl />
  <Field.Error>{error}</Field.Error>
</Field>

<Form initialValues={{ email: '' }} validationSchema={schema} onSubmit={save}>
  <FormInput name="email" label="Email" hint="…" clear />
  <Button type="submit">Save</Button>
</Form>
```
