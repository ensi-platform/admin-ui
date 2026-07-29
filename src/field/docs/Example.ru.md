## Пример

```tsx
const EmailInput = () => {
    const { controlProps } = useField();

    return <input {...controlProps} />;
};

<Field invalid={!!error} size="md" dataTestId="email-field">
    <Field.Label>Email</Field.Label>
    <EmailInput />
    <Field.Hint>Мы не передаём email третьим лицам</Field.Hint>
    <Field.Error>{error}</Field.Error>
</Field>;
```
