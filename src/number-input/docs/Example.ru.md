## Пример

```tsx
<NumberInput aria-label="Qty" value={qty} onChange={setQty} clear />

<Form
  initialValues={{ price: 10.5 }}
  validationSchema={z.object({ price: z.number().min(0) })}
  onSubmit={save}
>
  <FormNumberInput
    name="price"
    label="Цена"
    clear
    step={0.01}
    formatOptions={{ style: 'currency', currency: 'RUB' }}
  />
</Form>
```
