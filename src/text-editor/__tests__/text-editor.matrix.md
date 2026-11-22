# TextEditor

| Scenario | Proof |
| --- | --- |
| Textbox, accessible name | `it('renders a textbox')` |
| Controlled value; prop change does not emit | `it('follows value and does not call onChange when the prop changes')` |
| Parent ignores `onChange` | `it('keeps the controlled value when the parent ignores onChange')` |
| Empty document emits `''` | `it('emits an empty string for an empty document')` |
| Bold, italic, lists, heading, align | `it('toggles bold, italic, lists, a heading, and alignment')` |
| Underline, strike, code, quote, rule | `it('toggles underline, strike, code, a quote, and a rule')` |
| Link accepts any non-empty href | `it('inserts a link with href, target, and rel')` |
| Image src, alt, and width | `it('inserts an image from a URL and alt')` |
| Image file uses `uploadImage` | `it('inserts an uploaded image URL')` |
| Text and background color as inline hex | `it('applies text and background colors inline')` |
| Font family, size, and line height | `it('applies font family, size, and line height')` |
| Anchor id on the current block | `it('sets an id on the current block')` |
| Foreign HTML chip round-trip | `it('returns a foreign block as the original substring')` |
| Script stays a chip and does not run | `it('keeps a script as a chip and does not execute it')` |
| Video URL becomes an iframe | `it('inserts a video iframe from a URL')` |
| Table structure | `it('inserts a table')` |
| Word paste drops mso markup | `it('drops Word mso markup on paste')` |
| Source toggle | `it('switches the surface to a textarea and back')` |
| Fullscreen class | `it('marks the shell when fullscreen is on')` |
| `maxLength` counts visible text | `it('stops text input at maxLength')` |
| `disabled` does not emit | `it('does not change the value when disabled')` |
| `readOnly` | `it('keeps a read-only value unchanged')` |
| `invalid` | `it('sets aria-invalid when invalid')` |
| `size` / `block` | `it('applies size and block classes on the shell')` |
| `dataTestId` | `it('sets data-test-id from dataTestId')` |
| `ref` | `it('assigns object ref')` |
| axe default and script chip | `it('has no axe violations in the default and script chip states')` |
| `normalizeUrl`, `isEmptyDoc`, partition, Word strip | `utils.test.ts` |
| Form submit, script is stored, read-only map | `form-text-editor.test.tsx` |
| Bubble and popover geometry | n/a — jsdom has no layout; stories Bubble, Video, Emoji |
