## Example

```tsx
<NumberRange
  fromLabel="From"
  toLabel="To"
  fromPlaceholder="From"
  toPlaceholder="To"
  value={amount}
  onChange={setAmount}
  clear
  min={0}
/>

<Form initialValues={{ amount: { from: 10, to: 100 } }} onSubmit={save}>
  <FormNumberRange
    name="amount"
    label="Amount"
    fromLabel="From"
    toLabel="To"
    clear
    min={0}
  />
</Form>
```
