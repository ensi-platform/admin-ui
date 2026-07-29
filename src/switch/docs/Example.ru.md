## Пример

```tsx
<Switch checked={v} onChange={setV}>
    Уведомления
</Switch>

<Form initialValues={{ enabled: false }} onSubmit={save}>
    <FormSwitch name="enabled" hint="Можно изменить позже">
        Включено
    </FormSwitch>
</Form>
```
