# MultiAutocomplete

| Scenario | Proof |
| --- | --- |
| Combobox, accessible name | `it('renders combobox')` |
| Controlled tags; prop change does not emit | `it('shows selected tags from value and from defaultValue')` |
| Uncontrolled `defaultValue` | `it('shows selected tags from value and from defaultValue')` |
| Click adds several ids | `it('selects multiple options')` |
| Clear emits `[]` | `it('clears selection')` |
| Remove button drops one tag | `it('removes one tag')` |
| `clientFilter` on hides non-matches; off keeps the given list | `it('filters locally and keeps the full list when clientFilter is off')` |
| `hasMore` calls `onLoadMore`; `isLoadingMore` shows the loader | `it('calls onLoadMore when the sentinel is reached and shows the page loader')` |
| ArrowDown, Enter, Escape | `it('commits with the keyboard and closes on Escape')` |
| ArrowUp | `it('moves to the previous option with ArrowUp')` |
| Disabled option | `it('does not select a disabled option')` |
| Blur inside the field does not drop the input | `it('keeps the field open when focus stays inside')` |
| `block` (class is the proof) | `it('applies block class by default')` |
| `ref` | `it('assigns object ref')` |
| axe default / disabled / invalid | `it('has no axe violations in the default, disabled, and invalid states')` |
| Tag overflow `+N` | n/a — needs browser |
| Form submit, nullish, hint | `form-multi-autocomplete.test.tsx` |
| Popover geometry | n/a — needs browser |
