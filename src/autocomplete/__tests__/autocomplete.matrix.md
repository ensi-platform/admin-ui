# Autocomplete

| Scenario | Proof |
| --- | --- |
| Combobox, accessible name | `it('renders combobox')` |
| Controlled `value`; prop change does not emit | `it('shows the selected label from value and from defaultValue')` |
| Parent ignores `onChange` | `it('keeps the controlled value when the parent ignores onChange')` |
| Uncontrolled `defaultValue` | `it('shows the selected label from value and from defaultValue')` |
| Click commits the option id | `it('filters and selects an option')` |
| Clear emits `null` | `it('clears value when clear is clicked')` |
| `inputValue` stays when the parent ignores `onInputChange` | `it('reports typed text and keeps a controlled inputValue')` |
| `defaultInputValue` | `it('shows defaultInputValue')` |
| `placeholder` | `it('shows the placeholder')` |
| ArrowDown, Enter, Escape | `it('commits a filtered option with the keyboard and closes on Escape')` |
| ArrowUp | `it('moves to the previous option with ArrowUp and commits it')` |
| Disabled option | `it('does not select a disabled option')` |
| `disabled` | `it('does not open when disabled')` |
| `onBlur` | `it('calls onBlur when focus leaves the field')` |
| `isLoading` / `isError` / empty | `it('shows loading status')`, `it('shows an error status when suggest fails')` |
| `hasMore` / `isLoadingMore` | `it('shows the next-page loader')`, `it('keeps a load-more sentinel without the page loader')` |
| `clientFilter` off keeps the given items | covered by the loader tests (`clientFilter={false}` still lists options) |
| `invalid` | axe invalid state; RAC sets `data-invalid` |
| `size` / `variant` / `block` (class is the proof) | `it('applies size and variant classes')`, `it('applies block class by default')` |
| `dataTestId` | `it('sets data-test-id from dataTestId')` |
| `ref` | `it('assigns object ref')` |
| Field wiring | `it('wires Field control props')` |
| axe default / disabled / invalid | `it('has no axe violations in the default, disabled, and invalid states')` |
| Home / End | n/a — combobox list moves with arrows; Home/End are not part of the ComboBox contract here |
| Form submit, validation, clear writes `''` | `form-autocomplete.test.tsx` |
| Popover geometry | n/a — needs browser |
