## Example

```tsx
<Autocomplete
  aria-label="City"
  options={CITY_OPTIONS}
  clear
  placeholder="Start typing…"
/>

<Form initialValues={{ city: '' }} validationSchema={schema} onSubmit={save}>
  <FormAutocomplete name="city" label="City" options={CITY_OPTIONS} clear />
  <Button type="submit">Save</Button>
</Form>
```

`FormAutocomplete` with `clear` writes `''` to RHF.
