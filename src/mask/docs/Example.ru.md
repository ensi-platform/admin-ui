## Пример

```tsx
const PHONE_MASK = { mask: '+7 (000) 000-00-00' };

<Mask aria-label="Телефон" opts={PHONE_MASK} clear />

<Form initialValues={{ phone: '' }} onSubmit={save}>
  <FormMask name="phone" label="Телефон" opts={PHONE_MASK} clear />
  <Button type="submit">Сохранить</Button>
</Form>
```
