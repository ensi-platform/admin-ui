# Loader

Локальная вуаль + спиннер поверх контента на время fetch. Импорт: `import { Loader } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- блокировать клики по списку / карточке / форме, пока грузятся данные
- refetch поверх stale UI (дети не размонтируются)
- внутри `Table` — слот `<Loader active />` (вуаль только над scroll/`<table>`, Footer снаружи)

## API (кратко)

Layout (`Loader`): только `size` (+ `active`).

- `size`: sm | md | lg (default `md`)
- `active`: показать вуаль + spinner
- `children`: контент под оверлеем (в `Table` прокидывается автоматически)
- `dataTestId`, `className`

## Пример

```tsx
<Table hasChecked>
  <Table.Header sticky>…</Table.Header>
  <Table.Body>{rows.map(…)}</Table.Body>
  <Loader active={isFetching} />
  <Table.Footer>…</Table.Footer>
</Table>
```

## Не делать

- не копировать стили Loader в АП
- не вешать `loading` prop на Table — слот `<Loader />`
- не использовать тёмный modal-overlay для локальной вуали
