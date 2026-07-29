# Checkbox

Boolean-флаг на React Aria `Checkbox`. Импорт: `import { Checkbox, FormCheckbox } from '@ensi-platform/admin-ui'`.

Группа (`string[]`) — отдельный примитив `CheckboxGroup` / `FormCheckboxGroup`.

## Когда использовать

- соло `boolean` — Checkbox / FormCheckbox
- набор опций — см. CheckboxGroup

## API (кратко)

### Checkbox

- `checked` / `defaultChecked` / `onChange(boolean)` — соло
- `value` — ключ внутри CheckboxGroup (RAC)
- `children` — видимый лейбл (без children — `aria-label`)
- `size`, `indeterminate`, `invalid`, `disabled`, `dataTestId`
- без `label` prop / `as` / `variant`

### FormCheckbox

- `name`, `hint`, `children` — без Field.Label
- value boolean из Form

## Пример

```tsx
<Checkbox checked={v} onChange={setV}>Согласен</Checkbox>

<Form initialValues={{ agree: false }} onSubmit={save}>
  <FormCheckbox name="agree" hint="…">Согласен</FormCheckbox>
</Form>
```

## Не делать

- не ставить `aria-label` дублем к строковому children
- не читать CheckboxGroup context внутри Checkbox
- не оборачивать в RAC TextField
