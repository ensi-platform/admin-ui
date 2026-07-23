# Input

Текстовый контрол на React Aria `Input`. Импорт: `import { Input, FormInput } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- свободный ввод (email, name, search query)
- с `Field` — через `useField().controlProps`
- `FormInput` — поле формы: Field + RHF через `useFieldHook`

## API (кратко)

### Input

- `size`: sm | md | lg
- `isInvalid`, `disabled`
- `dataTestId`, `className`, `placeholder`, `type`, …
- без `as` / `variant` / prefix/suffix
- не знает про Field — a11y пропы снаружи

### FormInput

- `name` — Path в Form
- `label`, `hint`
- `size`, `disabled`, `className`, `dataTestId` — на Field
- value / onChange / onBlur / валидность — из Form

## Пример

```tsx
<Input placeholder="Email" size="md" />

const EmailControl = () => {
  const { controlProps, size, isInvalid, disabled } = useField();
  return <Input {...controlProps} size={size} isInvalid={isInvalid} disabled={disabled} />;
};

<Field isInvalid={Boolean(error)}>
  <Field.Label>Email</Field.Label>
  <EmailControl />
  <Field.Error>{error}</Field.Error>
</Field>

<Form initialValues={{ email: '' }} validationSchema={schema} onSubmit={save}>
  <FormInput name="email" label="Email" hint="…" />
  <Button type="submit">Save</Button>
</Form>
```

## Не делать

- не читать FieldContext внутри Input
- не оборачивать в RAC `TextField` — shell у Field
- не дублировать FormFieldWrapper — FormInput рядом с Input
- не копировать стили Input в АП
