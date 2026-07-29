# Loader

Локальная вуаль + спиннер поверх контента на время fetch. Импорт: `import { Loader } from '@ensi-platform/admin-ui'`.

## Когда использовать

- блокировать клики по списку / карточке / форме, пока грузятся данные
- refetch поверх stale UI (дети не размонтируются)
- поверх таблицы — обернуть `Table.Table` (или весь `Table.Scroll`), `Table.Footer` оставить снаружи оверлея

## API (кратко)

Layout (`Loader`): только `size` (+ `active`).

- `size`: sm | md | lg (default `md`)
- `active`: показать вуаль + spinner
- `children`: контент под оверлеем
- `dataTestId`, `className`

## Пример

```tsx
<Table hasChecked>
  <Table.Scroll>
    <Loader active={isFetching}>
      <Table.Table>
        <Table.Header sticky>…</Table.Header>
        <Table.Body>{rows.map(…)}</Table.Body>
      </Table.Table>
    </Loader>
  </Table.Scroll>
  <Table.Footer>…</Table.Footer>
</Table>
```

## Не делать

- не копировать стили Loader в АП
- не вешать `loading` prop на Table
- не использовать тёмный modal-overlay для локальной вуали
