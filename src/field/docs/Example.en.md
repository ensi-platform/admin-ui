## Example

```tsx
const EmailInput = () => {
    const { controlProps } = useField();

    return <input {...controlProps} />;
};

<Field invalid={!!error} size="md" dataTestId="email-field">
    <Field.Label>Email</Field.Label>
    <EmailInput />
    <Field.Hint>We do not share your email with third parties</Field.Hint>
    <Field.Error>{error}</Field.Error>
</Field>;
```
