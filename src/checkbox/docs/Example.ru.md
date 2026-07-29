## Пример

```tsx
<Checkbox checked={v} onChange={setV}>
    Согласен
</Checkbox>

<Form initialValues={{ agree: false }} onSubmit={save}>
    <FormCheckbox name="agree" hint="Обязательно">
        Согласен
    </FormCheckbox>
</Form>
```
