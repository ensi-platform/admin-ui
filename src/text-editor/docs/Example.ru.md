## Пример

```tsx
<TextEditor aria-label="Текст страницы" defaultValue="<p>Абзац</p>" maxLength={2000} onChange={setHtml} />

<Form initialValues={{ content: '' }} onSubmit={save}>
  <FormTextEditor name="content" label="Текст" hint="Заголовки, списки, ссылки" />
  <Button type="submit">Сохранить</Button>
</Form>
```
