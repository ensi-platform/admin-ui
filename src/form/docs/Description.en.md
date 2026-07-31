Wrapper over react-hook-form and zod for admin create/edit pages and filters.

```tsx
import { Form, useFieldHook, getError } from '@ensi-platform/admin-ui/form';
```

## When to use

- create / edit flows with a zod schema
- filters with submit and validation
- wiring controls via `FormInput` / `FormSelect` / …

Not React Aria `Form` — this is RHF + zod.

## API (short)

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `initialValues` | `DefaultValues` | — | initial values (required) |
| `validationSchema` | `ZodType` | — | zod schema |
| `onSubmit` | `(values, form) => void` | — | submit; need `onSubmit` and/or `onChange` |
| `onChange` | `(values, form, exactChange) => void` | — | values change |
| `onBlur` | `(values, form, exactChange) => void` | — | form-level blur |
| `onError` | `(errors, form) => void` | — | validation errors on submit |
| `onReset` | `(values, form) => void` | — | reset |
| `enableReinitialize` | `boolean` | `false` | reset when `initialValues` change |
| `triggerOnReinitialize` | `boolean` | — | `form.trigger()` after reinitialize |
| `mode` | RHF `mode` | `all` | validation mode |
| `isForm` | `boolean` | `true` | native `<form>` |
| `disabled` | `boolean` | `false` | disable via FormContext |
| `className` / `id` | `string` | — | on the root element |

Helpers: `useFieldHook({ name })` for Form controls; `getError(fieldState.error)` — error message. RHF re-exports: `useFormContext`, `useFormState`, `useFieldArray`, `useWatch`, `useController`.
