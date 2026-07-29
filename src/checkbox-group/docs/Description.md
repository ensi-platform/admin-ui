# CheckboxGroup

Группа чекбоксов (`string[]`) на React Aria `CheckboxGroup`. Импорт: `import { Checkbox, CheckboxGroup, FormCheckboxGroup } from '@ensi-platform/admin-ui'`.

## Когда использовать

- набор опций с общим value `string[]`
- вёрстка items — снаружи через `children` (flex/grid)

## API (кратко)

### CheckboxGroup

- `value` / `defaultValue`: `string[]`
- `onChange(value: string[])`
- `children` — Checkbox’и + layout
- `size` — chrome (`data-size`); size items задавать на каждом Checkbox
- `invalid`, `disabled`, `dataTestId`

### FormCheckboxGroup

- `name`, `label`, `hint`, `children`
- value `string[]` из Form

## Пример

```tsx
<CheckboxGroup value={tags} onChange={setTags} aria-label="Теги">
  <div style={{ display: 'flex', gap: 12 }}>
    <Checkbox value="a">A</Checkbox>
    <Checkbox value="b">B</Checkbox>
  </div>
</CheckboxGroup>

<Form initialValues={{ tags: [] }} onSubmit={save}>
  <FormCheckboxGroup name="tags" label="Теги">
    <Checkbox value="a">A</Checkbox>
    <Checkbox value="b">B</Checkbox>
  </FormCheckboxGroup>
</Form>
```

## Не делать

- не ждать сетку items от Group — layout снаружи
- не наследовать size на Checkbox через context
- не дублировать RAC selection state
