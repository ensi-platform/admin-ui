Обёртка над react-hook-form и zod для страниц и фильтров в админке.

```tsx
import { Form, useFieldHook, getError } from '@ensi-platform/admin-ui';
```

## Когда использовать

- создание / редактирование сущностей с zod-схемой
- фильтры с submit и валидацией
- связка контролов через `FormInput` / `FormSelect` / …

Не путать с React Aria `Form` — здесь RHF + zod.

## API (кратко)

| Prop | Значения | По умолчанию | Описание |
| --- | --- | --- | --- |
| `initialValues` | `DefaultValues` | — | начальные значения (обязательно) |
| `validationSchema` | `ZodType` | — | схема zod |
| `onSubmit` | `(values, form) => void` | — | submit; нужен `onSubmit` и/или `onChange` |
| `onChange` | `(values, form, exactChange) => void` | — | изменение значений |
| `onBlur` | `(values, form, exactChange) => void` | — | blur на уровне формы |
| `onError` | `(errors, form) => void` | — | ошибки валидации при submit |
| `onReset` | `(values, form) => void` | — | сброс |
| `enableReinitialize` | `boolean` | `false` | reset при смене `initialValues` |
| `triggerOnReinitialize` | `boolean` | — | `form.trigger()` после reinitialize |
| `mode` | RHF `mode` | `all` | режим валидации |
| `isForm` | `boolean` | `true` | нативный `<form>` |
| `disabled` | `boolean` | `false` | disable через FormContext |
| `className` / `id` | `string` | — | на корневой элемент |

Хелперы: `useFieldHook({ name })` для Form-контролов; `getError(fieldState.error)` — текст ошибки. Re-export RHF: `useFormContext`, `useFormState`, `useFieldArray`, `useWatch`, `useController`.
