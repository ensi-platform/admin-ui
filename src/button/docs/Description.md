# Button

Примитив кнопки. Импорт: `import { Button } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- primary / secondary / tertiary действия
- submit в формах
- ссылка-как-кнопка через `as`

## API (кратко)

- `size`: `sm` | `md` | `lg`
- `variant`: `primary` | `secondary` | `tertiary`
- `icon`: `{ Component, after?, indent?, size?, className?, fill? }`
- `dataTestId`
- `as` — полиморфизм (по умолчанию `button`)

## Пример

```tsx
<Button variant="primary" size="md" dataTestId="save">
    Save
</Button>
```

## Не делать

- не копировать стили компонента в АП
- не дублировать примитив обёрткой без нужды
