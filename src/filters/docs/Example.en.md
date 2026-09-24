## Example

```tsx
<Form initialValues={values} onSubmit={apply}>
    <Filters>
        <Filters.Grid columns={4} span={{ text: 1, date: 2 }}>
            <Filters.Cell kind="text">
                <FormInput name="name" label="Name" />
            </Filters.Cell>
            <Filters.Cell kind="date">
                <FormDateRangePicker name="date" label="Date" />
            </Filters.Cell>
        </Filters.Grid>
        <Filters.Footer>
            <Button type="button">Filter settings</Button>
            <Button type="reset">Reset</Button>
            <Button type="submit">Apply</Button>
        </Filters.Footer>
    </Filters>
</Form>
```
