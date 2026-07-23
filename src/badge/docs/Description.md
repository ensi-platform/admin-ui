# Badge

Статусный pill для таблиц / page header. Импорт: `import { Badge } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- статус сущности («В сборке», «Оплачен»)
- read-only индикатор
- не для MultiSelect / фильтров — там `Tag`

## API (кратко)

- `size`: sm | md
- `variant`: neutral | success | warning | danger | info
- `dataTestId`, `className`
- `as` — нет
- без `onRemove`

## Пример

```tsx
<Badge variant="success">Оплачен</Badge>
<Badge size="sm" variant="info">В сборке</Badge>
```

## Не делать

- не копировать стили Badge в АП
- не использовать Badge как removable chip — это Tag
