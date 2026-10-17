# AutocompleteAsync

| Scenario | Proof |
| --- | --- |
| Suggest loads and a click commits the id | `it('loads options via useSuggest')` |
| Keyboard ArrowDown + Enter commits the label into the field | `it('commits a suggestion with the keyboard')` |
| Controlled value shows the option label once it loads | `it('shows label for controlled value when option loads')` |
| Cached label follows a rename and stays after the option leaves the list | `it('keeps the cached label when the option is renamed and then leaves the list')` |
| Value with no matching option stays empty | `it('ignores controlled value with no matching option')` |
| Clear emits `null` and empties the field | `it('clears selection and input')` |
| Controlled `null` clears the field | `it('clears input when controlled value becomes null')` |
| `minLength` | `it('respects minLength before enabling suggest')` |
| `debounceMs` default 300 | `it('waits for the default debounce before loading suggestions')` |
| `isLoading` | `it('passes isLoading from suggest result')` |
| `isError` | `it('shows an error status when suggest fails')` |
| Stale page is not shown while a newer query is loading | `it('does not show the previous page while a newer query is loading')` |
| `disabled` | `it('does not load suggestions when disabled')` |
| `placeholder` | passed through to Autocomplete; asserted on MultiAutocompleteAsync and Autocomplete |
| axe default / disabled | `it('has no axe violations in the default and disabled states')` |
| `invalid` | n/a — no error chrome of its own; Field error is the form shell |
| Page append / duplicate values | `suggest-pages.test.tsx` |
| Form submit, initial label, clear writes `''` | `form-autocomplete-async.test.tsx` |
| Popover geometry | n/a — needs browser |
