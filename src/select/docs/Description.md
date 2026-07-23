# Select

Single-select на React Aria `Select`. Импорт: `import { Select, FormSelect } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- выбор одного значения из справочника / enum
- с `Field` — a11y пропы снаружи (`id` / `aria-labelledby` / …)
- `FormSelect` — поле формы: Field + RHF через `useFieldHook`

## API (кратко)

### Select

- `options`: `{ value, label, disabled? }[]`
- `value` / `defaultValue` / `onChange` (`string | number | null`)
- `placeholder`, `clear`
- `size`: sm | md | lg
- `isInvalid`, `disabled`
- `dataTestId`, `className`
- без `as` / compound Item

### FormSelect

- `name` — Path в Form
- `label`, `hint`, `options`, `clear`
- `size`, `disabled`, `className`, `dataTestId` — на Field
- value / onChange / onBlur / валидность — из Form

## Пример

```tsx
<Select
  aria-label="Статус"
  options={[
    { value: 'draft', label: 'Черновик' },
    { value: 'published', label: 'Опубликован' },
  ]}
  clear
  placeholder="Выберите…"
/>

<Form initialValues={{ status: '' }} validationSchema={schema} onSubmit={save}>
  <FormSelect name="status" label="Статус" options={STATUS_OPTIONS} clear />
  <Button type="submit">Save</Button>
</Form>
```

`FormSelect` при `clear` пишет в RHF `''` (удобно для `z.string()`). Примитив `Select.onChange(null)`.

## Не делать

- не читать FieldContext внутри Select
- не дублировать FormFieldWrapper — FormSelect рядом с Select
- не копировать стили Select в АП
- multi / ComboBox — отдельные компоненты
