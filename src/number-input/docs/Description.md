# NumberInput

Числовой контрол на React Aria `NumberField`. Импорт: `import { NumberInput, FormNumberInput, kopecksTransform, createScaleTransform } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- количества, цены, веса
- деньги: `transform={kopecksTransform}` + `suffix="₽"` (store = копейки)
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
- `transform?: { format, parse }` — store ↔ view
- без transform store = `number | null`

## Пример

```tsx
<NumberInput aria-label="Qty" value={qty} onChange={setQty} clear />

<Form
  initialValues={{ price: 1050 }}
  validationSchema={z.object({ price: z.number().min(0) })}
  onSubmit={save}
>
  <FormNumberInput
    name="price"
    label="Цена"
    suffix="₽"
    clear
    transform={kopecksTransform}
    step={0.01}
  />
</Form>
```

## Не делать

- не класть transform в текстовый Input
- не заводить MoneyInput — пресет + suffix
- не читать FieldContext внутри NumberInput
