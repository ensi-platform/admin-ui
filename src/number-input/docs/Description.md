# NumberInput

Числовой контрол на React Aria `NumberField`. Импорт: `import { NumberInput, FormNumberInput } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- количества, цены, веса
- деньги: `formatOptions={{ style: 'currency', currency: 'RUB' }}` (store = рубли)
- `FormNumberInput` — Field + RHF

## API (кратко)

### NumberInput

- `value` / `onChange`: `number | null`
- `min` / `max` / `step` — на view
- `prefix` / `suffix`
- `clear` — кнопка очистки → `onChange(null)`
- `size`, `invalid`, `disabled`, `dataTestId`
- без stepper в v1

### FormNumberInput

- `name`, `label`, `hint`, `size`, `disabled`, `clear`
- `formatOptions?: Intl.NumberFormatOptions` — отображение/парс (RAC)
- store = `number | null`

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

## Не делать

- не заводить MoneyInput — `formatOptions` + currency
- не читать FieldContext внутри NumberInput
