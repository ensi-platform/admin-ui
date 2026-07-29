# Tag

Метка / фильтр-чип с optional remove. Импорт: `import { Tag } from '@ensi-platform/admin-ui'`.

## Когда использовать

- выбранные значения в MultiSelect
- активные фильтры
- не для статусов в таблице — там `Badge`

## API (кратко)

- `size`: sm | md
- `onRemove?` — крестик; `aria-label` из `useAuiLabels().clear`
- `disabled?`
- `dataTestId`, `className`
- `as` — нет
- без status-variants

## Пример

```tsx
<Tag>vip</Tag>
<Tag onRemove={() => remove('vip')}>vip</Tag>
```

## Не делать

- не копировать стили Tag в АП
- не подменять Tag статусным Badge
