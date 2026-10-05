## Пример

```tsx
<GridLayout cols={2} gap={16}>
    <FormInput name="last_name" label="Фамилия" />
    <FormInput name="first_name" label="Имя" />
    <GridLayout.Item col="full">
        <FormInput name="password" label="Пароль" />
    </GridLayout.Item>
</GridLayout>

<GridLayout cols={['minmax(0, 1fr)', '16.25rem']} gap={0}>
    <div>Основное</div>
    <aside>Сбоку</aside>
</GridLayout>
```
