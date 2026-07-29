# Form

Обёртка над react-hook-form + zod. Импорт: `import { Form, useFieldHook, getError } from '@ensi-platform/admin-ui'`.

## Когда использовать

- страницы создания / редактирования в АП
- фильтры с submit + zod-схемой
- связка контролов через `useFieldHook` (FormInput / FormSelect — рядом с примитивом, не FormFieldWrapper)

## API (кратко)

- `initialValues` — обязательны
- `validationSchema` — zod
- `onSubmit` и/или `onChange` — обязателен хотя бы один
- `onError` / `onReset` / `onBlur`
- `enableReinitialize`, `triggerOnReinitialize`
- `mode` (default `all`), `isForm`, `disabled`, `className`, `id`
- `useFieldHook({ name })` — для Form-компонентов контролов
- `getError(fieldState.error)` — message ошибки
- re-export RHF: `useFormContext`, `useFormState`, `useFieldArray`, `useWatch`, `useController`

## Пример

```tsx
const schema = z.object({
    email: z.string().email(),
});

<Form
    initialValues={{ email: '' }}
    validationSchema={schema}
    onSubmit={async values => {
        await save(values);
    }}
>
    <FormInput name="email" label="Email" />
    <Button type="submit">Save</Button>
</Form>;
```

## Не делать

- не заводить FormField / FormFieldWrapper — FormX рядом с Input/Select
- не путать с React Aria `Form` (у нас RHF + zod)
- не класть бизнес-схемы zod в этот пакет
