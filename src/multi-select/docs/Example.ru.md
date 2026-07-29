## Пример

```tsx
<MultiSelect
  aria-label="Метки"
  options={[
    { value: 'vip', label: 'vip' },
    { value: 'regular', label: 'постоянный клиент' },
  ]}
  clear
  placeholder="Выберите…"
/>

<Form initialValues={{ tags: [] }} validationSchema={schema} onSubmit={save}>
  <FormMultiSelect name="tags" label="Метки" options={TAG_OPTIONS} clear />
  <Button type="submit">Сохранить</Button>
</Form>
```

`clear` вызывает `onChange([])`.
