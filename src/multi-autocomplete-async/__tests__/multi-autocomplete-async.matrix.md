# MultiAutocompleteAsync

| Scenario | Proof |
| --- | --- |
| Suggest loads and a click commits `['id']` | `it('loads options via useSuggest')` |
| Clicking the selected option again removes it | `it('removes a selected option')` |
| `minLength` and `placeholder` | `it('waits for minLength before showing suggestions')` |
| Stale page is not shown while a newer query is loading | `it('does not show the previous page while a newer query is loading')` |
| `onBlur` | `it('calls onBlur when focus leaves the field')` |
| `disabled` does not load or emit | `it('does not load suggestions when disabled')` |
| `debounceMs` | same hook as AutocompleteAsync — `it('waits for the default debounce before loading suggestions')` |
| axe default / disabled | `it('has no axe violations in the default and disabled states')` |
| Form submit, nullish, hint | `form-multi-autocomplete-async.test.tsx` |
| Popover geometry | n/a — needs browser |
