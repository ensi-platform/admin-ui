## Пример

```tsx
<Password aria-label="Пароль" />

<Form initialValues={{ password: '' }} onSubmit={save}>
  <FormPassword name="password" label="Пароль" />
  <Button type="submit">Сохранить</Button>
</Form>
```
