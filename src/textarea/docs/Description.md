# TextArea

Многострочный текстовый контрол на React Aria `TextArea`. Импорт: `import { TextArea, FormTextArea } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- свободный многострочный ввод (comment, description, address)
- с `Field` — через `useField().controlProps`
- `FormTextArea` — поле формы: Field + RHF через `useFieldHook`

## API (кратко)

### TextArea

- `size`: sm | md | lg
- `invalid`, `disabled`
- `clear` — кнопка очистки → `onChange` с `''`
- `dataTestId`, `className`, `placeholder`, `rows`, …
- без `as` / `variant`
- не знает про Field — a11y пропы снаружи

### FormTextArea

- `name` — Path в Form
- `label`, `hint`, `clear`
- `size`, `disabled`, `className`, `dataTestId` — на Field
- value / onChange / onBlur / валидность — из Form

## Пример

```tsx
<TextArea placeholder="Комментарий" size="md" clear />

const CommentControl = () => {
  const { controlProps, size, invalid, disabled } = useField();
  return <TextArea {...controlProps} size={size} invalid={invalid} disabled={disabled} clear />;
};

<Field invalid={Boolean(error)}>
  <Field.Label>Комментарий</Field.Label>
  <CommentControl />
  <Field.Error>{error}</Field.Error>
</Field>

<Form initialValues={{ comment: '' }} validationSchema={schema} onSubmit={save}>
  <FormTextArea name="comment" label="Комментарий" hint="…" clear />
  <Button type="submit">Save</Button>
</Form>
```

## Не делать

- не читать FieldContext внутри TextArea
- не оборачивать в RAC `TextField` — shell у Field
- не дублировать FormFieldWrapper — FormTextArea рядом с TextArea
- не копировать стили TextArea в АП
