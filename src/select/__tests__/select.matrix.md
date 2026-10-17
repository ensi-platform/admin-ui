# Select

| Scenario | Proof |
| --- | --- |
| Combobox button, accessible name | `it('renders combobox')` |
| Controlled `value`; prop change does not emit | `it('shows the selected label and keeps it when the value prop changes')` |
| Parent ignores `onChange` | `it('keeps the controlled value when the parent ignores onChange')` |
| Uncontrolled `defaultValue` | `it('shows the default value label')` |
| Click commits the option id once | `it('selects an option')` |
| Clear emits `null` | `it('clears value when clear is clicked')` |
| `placeholder` visible until a value is selected | `it('shows the placeholder until a value is selected')` |
| ArrowDown opens, Enter commits, Escape returns focus | `it('commits with the keyboard and returns focus on Escape')` |
| ArrowUp, Home, End; disabled option skipped | `it('moves with ArrowUp, Home, and End, and skips a disabled option')` |
| Type-ahead | `it('jumps to a matching option with type-ahead')` |
| Disabled option is not selectable | `it('does not select a disabled option')` |
| `disabled` blocks open (click and field click) | `it('does not open when disabled')`, `it('does not open from field click when disabled')` |
| Chevron click does not open | `it('does not open when interactive target inside trigger is clicked')` |
| Field click opens | `it('opens from field click on Group')` |
| `onBlur` | `it('calls onBlur when focus leaves the trigger')` |
| `invalid` (`data-invalid`; RAC native validation does not set `aria-invalid` on the trigger) | `it('sets data-invalid when invalid')` |
| `size` / `variant` / `block` (class is the proof) | `it('applies size and variant classes')`, `it('applies block class by default')`, `it('omits block class when block={false}')` |
| `dataTestId` | `it('sets data-test-id from dataTestId')` |
| `ref` | `it('assigns object ref')` |
| Field label wiring | `it('works inside Field')` |
| axe default / disabled / invalid | `it('has no axe violations in the default, disabled, and invalid states')` |
| Value with no matching option | n/a — RAC shows an empty trigger; no documented fallback label |
| `readOnly` | n/a — not in the Select contract |
| Form submit, validation, clear writes `''`, disabled from `Form` | `form-select.test.tsx` |
| Popover geometry | n/a — needs browser |
