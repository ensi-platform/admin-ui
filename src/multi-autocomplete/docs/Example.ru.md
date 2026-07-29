## Пример

```tsx
<MultiAutocomplete aria-label="Метки" options={TAG_OPTIONS} clear placeholder="Начните вводить…" />

<Form initialValues={{ tags: [] }} validationSchema={schema} onSubmit={save}>
  <FormMultiAutocomplete name="tags" label="Метки" options={TAG_OPTIONS} clear />
  <Button type="submit">Сохранить</Button>
</Form>
```

`clear` вызывает `onChange([])`.
