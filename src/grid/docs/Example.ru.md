## Пример

```tsx
<Grid cols={2} gap={16}>
    <FormInput name="last_name" label="Фамилия" />
    <FormInput name="first_name" label="Имя" />
    <Grid.Item col="full">
        <FormInput name="password" label="Пароль" />
    </Grid.Item>
</Grid>

<Grid cols={['minmax(0, 1fr)', '16.25rem']} gap={0}>
    <div>Основное</div>
    <aside>Сбоку</aside>
</Grid>
```
