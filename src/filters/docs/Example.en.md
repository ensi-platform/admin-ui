## Example

```tsx
<Form initialValues={values} onSubmit={apply}>
    <Filters>
        <Filters.Body>
            <GridLayout cols={4} gap={16}>
                <GridLayout.Item>
                    <FormInput name="name" label="Name" />
                </GridLayout.Item>
                <GridLayout.Item col={2}>
                    <FormDateRangePicker name="date" label="Date" />
                </GridLayout.Item>
            </GridLayout>
        </Filters.Body>
        <Filters.Footer>
            <Button type="button">Filter settings</Button>
            <Button type="reset">Reset</Button>
            <Button type="submit">Apply</Button>
        </Filters.Footer>
    </Filters>
</Form>
```
