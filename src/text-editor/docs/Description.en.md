Alpha. Not part of the npm package. This story is the only public surface.

Visual HTML editor: the toolbar builds markup, and Source shows the same string in `TextArea`.

## When to use

- page, notification, or SEO copy that the API stores as an HTML string
- plain multiline text — see `TextArea`
- an image file only when the screen passes `uploadImage`; otherwise the image is a URL

## API (short)

### TextEditor

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | HTML; an empty document is `''` |
| `defaultValue` | `string` | `''` | initial HTML without an external value |
| `onChange` | `(value: string) => void` | — | next HTML string |
| `size` | `sm` \| `md` \| `lg` | `md` | size; inside `Field`, inherits `Field.size` |
| `invalid` | `boolean` | `false` | invalid state |
| `disabled` | `boolean` | `false` | disabled |
| `readOnly` | `boolean` | `false` | visible, not editable |
| `block` | `boolean` | `true` | stretch to the parent width |
| `fontFamilies` | `string[]` | five system fonts | replaces the font menu |
| `uploadImage` | `(file: File) => Promise<string>` | — | stores a file and inserts the returned URL |
| `maxLength` | `number` | — | visible-text ceiling; further input does not grow |
| `dataTestId` | `string` | — | `data-test-id` attribute |

Grouped toolbar: history, paragraph and `h1`–`h4`, font, size, line height, marks, sub/sup, color, alignment, lists and tasks, indent, quote, code, rule, link, anchor, image, video (`iframe`), emoji, table. A selection bubble carries inline commands only. Markup outside the schema (`div`, `section`, `script`, `style`) is an HTML chip: it is not executed in the admin page, and the original slice is what gets saved. The storefront sanitizes HTML, not the editor.

### FormTextEditor

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | field name in `Form` |
| `label` | `ReactNode` | — | label |
| `hint` | `ReactNode` | — | hint |
| `size` | `sm` \| `md` \| `lg` | `md` | `Field` size |
| `disabled` | `boolean` | — | disabled |
| `readOnly` | `boolean` | — | read-only |
| `dataTestId` | `string` | — | `data-test-id` on `Field` |

While the editor is alpha, the `@tiptap/*` packages stay dev dependencies of this package.
