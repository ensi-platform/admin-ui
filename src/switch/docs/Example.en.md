## Example

```tsx
<Switch checked={v} onChange={setV}>
    Notifications
</Switch>

<Form initialValues={{ enabled: false }} onSubmit={save}>
    <FormSwitch name="enabled" hint="Can be changed later">
        Enabled
    </FormSwitch>
</Form>
```
