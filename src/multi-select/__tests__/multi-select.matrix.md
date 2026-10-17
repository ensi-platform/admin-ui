# MultiSelect

| Scenario | Proof |
| --- | --- |
| Button, accessible name | `it('renders combobox button')` |
| Controlled tags; prop change does not emit | `it('shows selected tags from value and from defaultValue')` |
| Uncontrolled `defaultValue` | `it('shows selected tags from value and from defaultValue')` |
| Click adds ids | `it('selects multiple options')` |
| Second click removes; the value list never contains duplicates | `it('does not add the same option twice')` |
| Clear emits `[]` | `it('clears all values when clear is clicked')` |
| Remove button drops one tag | `it('removes one tag')` |
| Backspace on the focused tag drops that tag | `it('removes the focused tag with Backspace')` |
| `placeholder` click opens the list | `it('opens listbox when placeholder is clicked')` |
| Tag label click opens and does not remove | `it('opens listbox when tag label is clicked without removing')` |
| ArrowDown, Enter, Escape | `it('commits with the keyboard and returns focus on Escape')` |
| Disabled option | `it('does not select a disabled option')` |
| `disabled` | `it('does not open when disabled')`, `it('does not open from field click when disabled')` |
| `invalid` | `it('sets data-invalid when invalid')` |
| `size` / `variant` / `block` (class is the proof) | `it('applies size and variant classes')`, `it('applies block class by default')`, `it('omits block class when block={false}')` |
| `dataTestId` | `it('sets data-test-id from dataTestId')` |
| `ref` | `it('assigns object ref')` |
| Field wiring | `it('works inside Field')` |
| Keyboard focus ring | `it('marks the trigger when focus comes from the keyboard')` |
| axe default / disabled / invalid | `it('has no axe violations in the default, disabled, and invalid states')` |
| Tag overflow `+N` | n/a — needs browser (jsdom has no layout) |
| Form submit, clear | `form-multi-select.test.tsx` |
