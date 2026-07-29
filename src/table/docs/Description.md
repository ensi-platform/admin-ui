# Table

Compound data-table chrome for admin lists. Import: `import { Table, useTableRowSelection } from '@ensi-platform/admin-ui-base'`.

## Когда использовать

- списки сущностей в админке (orders, products, …)
- нужен sticky header/footer, selection, sort affordance, row actions, page chrome
- **не** сюда: AutoFilters, URL pagination, meta-columns, column settings — это app-слой

## API (кратко)

Layout (`Table`): `size` (density) + `block` + `hasChecked` + `zebra`.

- `size`: sm | md | lg
- `block`: default true
- `hasChecked`: резерв под колонку чекбоксов
- `zebra`: еле заметный even-row bg (default false); checked / hover перебивают
- compound: `Scroll` / `Table` / `Header` / `Body` / `Footer` / `Row` / `Cell` / `HeaderCell` / `CheckboxCell` / `HeaderCheckboxCell` / `ActionBar` / `SortIndicator` / `Pagination` / `PageSize`
- `Scroll`: область скролла (sibling `Footer`)
- `Table`: нативный `<table>` — только `Header` / `Body` / `Row` / `Cell…` (**не** `Footer`)
- `Header`: `sticky?`
- `Footer`: бар под scroll (не `tfoot`); `sticky?` (default true); слева `PageSize`, справа `Pagination`
- `Loader` (из пакета): обычная композиция — обернуть то, что нужно накрыть (часто `Table.Table` внутри `Scroll`); Table про Loader не знает
- `Pagination`: controlled `page` + `pageCount` + `onPageChange` + `from` + `to` + `total`; range + prev/next; `rangeLabel?`; `prevLabel?` / `nextLabel?`; `disabled?`
- `PageSize`: controlled `value` + `onChange`; `options?` (default `[5, 10, 25, 50, 100]`); `label?`; `disabled?`
- `Cell` / `HeaderCell`: `numeric?`, `align?`, `utility?`, `noWrap?`, `width?`
- `HeaderCell`: `sortable?`, `sortDirection?`, `onSort?`
- `ActionBar`: `items`, `visibleCount?`
- hook: `useTableRowSelection(pageRowIds)` → header = select **текущей страницы** (`setAllOnPage`); при смене страницы в `onPageChange` вызывать `clearAll`

## Пример

```tsx
const ids = pageRows.map(r => r.id);
const { isSelected, toggle, isAllSelected, isIndeterminate, setAllOnPage, clearAll, selected } =
  useTableRowSelection(ids);

const onPageChange = (next: number) => {
  clearAll();
  setPage(next);
};

const onPageSizeChange = (size: number) => {
  clearAll();
  setPageSize(size);
  setPage(1);
};

<Table size="md" hasChecked>
  <Table.Scroll>
    <Loader active={isFetching}>
      <Table.Table>
        <Table.Header sticky>
          <Table.Row>
            <Table.HeaderCheckboxCell
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={setAllOnPage}
              aria-label="Select all"
            />
            <Table.HeaderCell sortable sortDirection={sort} onSort={setSort}>
              Name
            </Table.HeaderCell>
            <Table.HeaderCell numeric>Amount</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {pageRows.map(row => (
            <Table.Row key={row.id} checked={isSelected(row.id)}>
              <Table.CheckboxCell
                checked={isSelected(row.id)}
                onChange={() => toggle(row.id)}
                aria-label={`Select ${row.name}`}
              />
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell numeric>{row.amount}</Table.Cell>
              <Table.Cell utility>
                <Table.ActionBar
                  visibleCount={0}
                  items={[{ text: 'Edit', onClick: () => {} }]}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Table>
    </Loader>
  </Table.Scroll>
  <Table.Footer>
    <Table.PageSize value={pageSize} onChange={onPageSizeChange} />
    <Table.Pagination
      page={page}
      pageCount={pageCount}
      onPageChange={onPageChange}
      from={from}
      to={to}
      total={total}
    />
  </Table.Footer>
</Table>
```

## Не делать

- не класть `Table.Footer` внутрь `Table.Table` / `<table>`
- не тащить TanStack / meta / filters / URL page sync внутрь DS
- не дублировать примитив обёрткой без нужды
- сильную zebra не включать по умолчанию — только `zebra` (слабый mix surface)
- не переносить selection между страницами — `clearAll` на смене page / pageSize
- не вшивать pageSize в `Pagination` — отдельный chrome
- не вешать `loading` / sniff Loader на Table — композиция снаружи
