## Пример

```tsx
<Form initialValues={values} onSubmit={apply}>
    <Filters>
        <Filters.Grid columns={4} span={{ text: 1, date: 2 }}>
            <Filters.Cell kind="text">
                <FormInput name="name" label="Название" />
            </Filters.Cell>
            <Filters.Cell kind="date">
                <FormDateRangePicker name="date" label="Дата" />
            </Filters.Cell>
        </Filters.Grid>
        <Filters.Footer>
            <Button type="button">Настройка фильтров</Button>
            <Button type="reset">Сбросить</Button>
            <Button type="submit">Применить</Button>
        </Filters.Footer>
    </Filters>
</Form>
```
