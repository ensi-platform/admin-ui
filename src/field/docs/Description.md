# Field

Compound-обёртка label / hint / error вокруг любого контрола. Импорт: `import { Field, useField } from '@ensi-platform/admin-ui'`.

## Когда использовать

- подпись и подсказка к Input / Select / кастомному контролу
- отображение ошибки валидации (текст снаружи, в т.ч. из RHF)
- вместо старого FormControl

## API (кратко)

- `size`: `sm` | `md` | `lg`
- `invalid`, `disabled`
- `dataTestId`
- `Field.Label` / `Field.Hint` / `Field.Error` — typography + disabled через `theme.ts` слота (`cva` + `Field.size`)
    - sm/md: Label `bodyS`, Hint/Error `bodyXs`
    - lg: Label `bodyM`, Hint/Error `bodyS`
- `useField().controlProps` — прокинуть на контрол (`id`, `aria-*`, `disabled`)

## Пример

```tsx
const EmailInput = () => {
    const { controlProps } = useField();

    return <input {...controlProps} />;
};

<Field invalid={!!error} size="md" dataTestId="email-field">
    <Field.Label>Email</Field.Label>
    <EmailInput />
    <Field.Hint>Мы не передаём email третьим лицам</Field.Hint>
    <Field.Error>{error}</Field.Error>
</Field>;
```

## Не делать

- не передавать `label` / `hint` / `error` пропами на root
- не вешать `name` / RHF на Field — это зона Form / FormX
- не копировать стили Field в АП
- не писать `font-*` / `line-height` / `margin: 0` в CSS Modules Field — typography + Provider reset
