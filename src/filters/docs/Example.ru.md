## Пример

```tsx
<Form initialValues={values} onSubmit={apply}>
    <Filters>
        <Filters.Body>
            <GridLayout cols={4} gap={16}>
                <GridLayout.Item>
                    <FormInput name="name" label="Название" />
                </GridLayout.Item>
                <GridLayout.Item col={2}>
                    <FormDateRangePicker name="date" label="Дата" />
                </GridLayout.Item>
            </GridLayout>
        </Filters.Body>
        <Filters.Footer>
            <Button type="button">Настройка фильтров</Button>
            <Button type="reset">Сбросить</Button>
            <Button type="submit">Применить</Button>
        </Filters.Footer>
    </Filters>
</Form>
```
