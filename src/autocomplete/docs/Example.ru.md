## Пример

```tsx
<Autocomplete
  aria-label="Город"
  options={CITY_OPTIONS}
  clear
  placeholder="Начните вводить…"
/>

<Form initialValues={{ city: '' }} validationSchema={schema} onSubmit={save}>
  <FormAutocomplete name="city" label="Город" options={CITY_OPTIONS} clear />
  <Button type="submit">Сохранить</Button>
</Form>
```

`FormAutocomplete` при `clear` пишет в RHF `''`.
