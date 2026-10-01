## Example

```tsx
<Slider
    aria-label="Scale"
    minValue={87.5}
    maxValue={125}
    step={6.25}
    value={value}
    onChange={setValue}
    formatValue={current => `${current}%`}
/>

<Form initialValues={{ scale: 100 }} onSubmit={save}>
    <FormSlider name="scale" label="Scale" minValue={87.5} maxValue={125} step={6.25} />
</Form>
```
