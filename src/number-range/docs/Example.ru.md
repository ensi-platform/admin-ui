## Пример

```tsx
<NumberRange
  fromLabel="От"
  toLabel="До"
  fromPlaceholder="От"
  toPlaceholder="До"
  value={amount}
  onChange={setAmount}
  clear
  min={0}
/>

<Form initialValues={{ amount: { from: 10, to: 100 } }} onSubmit={save}>
  <FormNumberRange
    name="amount"
    label="Сумма"
    fromLabel="От"
    toLabel="До"
    clear
    min={0}
  />
</Form>
```
