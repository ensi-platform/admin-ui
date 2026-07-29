# MultiSelect

Мультивыбор на React Aria `Select` (`selectionMode="multiple"`). Импорт: `import { MultiSelect, FormMultiSelect } from '@ensi-platform/admin-ui'`.

## Когда использовать

- выбор нескольких значений из справочника / enum
- с `Field` — a11y пропы снаружи (`id` / `aria-labelledby` / …)
- `FormMultiSelect` — поле формы: Field + RHF через `useFieldHook`

## API (кратко)

### MultiSelect

- `options`: `{ value, label, disabled? }[]`
- `value` / `defaultValue` / `onChange` (`TComboboxValue[]`)
- `placeholder`, `clear` → `onChange([])`
- trigger: Tag + remove по одному
- `size`: sm | md | lg
- `invalid`, `disabled`
- `dataTestId`, `className`
- без `as` / compound Item

### FormMultiSelect

- `name` — Path в Form
- `label`, `hint`, `options`, `clear`
- `size`, `disabled`, `className`, `dataTestId` — на Field
- value / onChange / onBlur / валидность — из Form

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
  <Button type="submit">Save</Button>
</Form>
```

## Не делать

- не читать FieldContext внутри MultiSelect
- не дублировать FormFieldWrapper — FormMultiSelect рядом с MultiSelect
- не копировать стили MultiSelect в АП
- статус в таблице — `Badge`, не Tag в MultiSelect
