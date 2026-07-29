## Example

```tsx
<Checkbox checked={v} onChange={setV}>
    I agree
</Checkbox>

<Form initialValues={{ agree: false }} onSubmit={save}>
    <FormCheckbox name="agree" hint="Required">
        I agree
    </FormCheckbox>
</Form>
```
