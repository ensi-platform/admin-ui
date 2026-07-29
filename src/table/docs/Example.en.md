## Example

```tsx
const ids = pageRows.map(r => r.id);
const { isSelected, toggle, isAllSelected, isIndeterminate, setAllOnPage, clearAll } =
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
