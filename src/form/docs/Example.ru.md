## Пример

```tsx
const schema = z.object({
    email: z.string().email(),
});

<Form
    initialValues={{ email: '' }}
    validationSchema={schema}
    onSubmit={async values => {
        await save(values);
    }}
>
    <FormInput name="email" label="Email" />
    <Button type="submit">Сохранить</Button>
</Form>;
```
