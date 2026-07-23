# Switch

On/off тумблер на React Aria `Switch`. Импорт: `import { Switch, FormSwitch } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- настройки / флаги on-off
- `FormSwitch` — boolean-поле формы (Field Hint/Error, без Field.Label)

## API (кратко)

### Switch

- `checked` / `defaultChecked` / `onChange(boolean)`
- `children` — видимый лейбл (без children — `aria-label`)
- `size`, `isInvalid`, `disabled`, `dataTestId`
- без Group / `as` / `variant`

### FormSwitch

- `name`, `hint`, `children`
- value boolean из Form

## Пример

```tsx
<Switch checked={v} onChange={setV}>Уведомления</Switch>

<Form initialValues={{ enabled: false }} onSubmit={save}>
  <FormSwitch name="enabled" hint="…">Включено</FormSwitch>
</Form>
```

## Не делать

- не дублировать `aria-label` строковому children
- не использовать Checkbox вместо Switch для role=switch семантики
