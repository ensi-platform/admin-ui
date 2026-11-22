## Пример

```tsx
<Rating aria-label="Оценка" value={value} onChange={setValue} />

<Form initialValues={{ score: 4 }} onSubmit={save}>
    <FormRating name="score" label="Оценка" hint="От 0 до 5" />
</Form>
```
