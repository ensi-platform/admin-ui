## Example

```tsx
<Grid cols={2} gap={16}>
    <FormInput name="last_name" label="Last name" />
    <FormInput name="first_name" label="First name" />
    <Grid.Item col="full">
        <FormInput name="password" label="Password" />
    </Grid.Item>
</Grid>

<Grid cols={['minmax(0, 1fr)', '16.25rem']} gap={0}>
    <div>Main</div>
    <aside>Aside</aside>
</Grid>
```
