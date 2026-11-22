## Example

```tsx
<Rating aria-label="Score" value={value} onChange={setValue} />

<Form initialValues={{ score: 4 }} onSubmit={save}>
    <FormRating name="score" label="Score" hint="From 0 to 5" />
</Form>
```
