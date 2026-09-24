## Пример

```tsx
const [menu, setMenu] = useState<{ x: number; y: number; row: Order } | null>(null);

const OrderRow = ({ row }: { row: Order }) => (
    <DataTable.Row
        onContextMenu={event => {
            event.preventDefault();
            setMenu({ x: event.clientX, y: event.clientY, row });
        }}
    >
        <DataTable.Cell>{row.city}</DataTable.Cell>
        <DataTable.Cell>{row.email}</DataTable.Cell>
        <DataTable.Cell utility>
            <DataTable.Actions
                onClick={event => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    setMenu({ x: rect.left, y: rect.bottom, row });
                }}
            />
        </DataTable.Cell>
    </DataTable.Row>
);

<DataTable sort={sort} onSortChange={setSort} hasChecked zebra>
    <DataTable.Header sticky>
        <DataTable.Row>
            <DataTable.HeaderCell column="city" sortable>
                Город
                <DataTable.Filter active={city != null}>
                    <Select
                        aria-label="Город"
                        placeholder="Город"
                        options={cityOptions}
                        value={city}
                        clear
                        onChange={setCity}
                    />
                </DataTable.Filter>
            </DataTable.HeaderCell>
            <DataTable.HeaderCell>Почта</DataTable.HeaderCell>
        </DataTable.Row>
    </DataTable.Header>
    <DataTable.Body>
        {rows.map(row => (
            <OrderRow key={row.id} row={row} />
        ))}
    </DataTable.Body>
    <DataTable.Footer>
        <DataTable.PageSize value={pageSize} onChange={setPageSize} />
        <DataTable.Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
            from={from}
            to={to}
            total={total}
        />
    </DataTable.Footer>
</DataTable>
<ContextMenu open={menu != null} x={menu?.x ?? 0} y={menu?.y ?? 0} onClose={() => setMenu(null)}>
    <ContextMenu.Item
        onClick={() => {
            if (menu) open(menu.row);
            setMenu(null);
        }}
    >
        Открыть
    </ContextMenu.Item>
    <ContextMenu.Item
        variant="danger"
        disabled={menu?.row.locked}
        onClick={() => {
            if (menu) remove(menu.row);
            setMenu(null);
        }}
    >
        Удалить
    </ContextMenu.Item>
</ContextMenu>
```
