# SuggestChecklist

| Scenario | Proof |
| --- | --- |
| Type filters; click selects and reports the id | `it('shows a suggestion checkbox and reports the selected value')` |
| Space selects the focused option | `it('checks a suggestion with Space')` |
| Parent ignores `onChange` | `it('keeps a controlled selection when the parent ignores onChange')` |
| Uncontrolled `defaultValue` is selected | `it('checks the default value')` |
| Deselect a controlled value | `it('unchecks a controlled value')` |
| Selected row stays after it leaves the page | `it('keeps a selected option pinned after it leaves the page')` |
| Unknown selected id is omitted | `it('omits a selected value that was never loaded')` |
| `minLength` and `placeholder` | `it('waits for minLength and shows the placeholder')` |
| `isLoading` | `it('shows the loading status while suggest is in flight')` |
| `isError` | `it('shows an error when suggest fails')` |
| Next page loader | `it('shows the next-page loader')` |
| `disabled` | `it('does not load suggestions when disabled')` |
| axe default / disabled | `it('has no axe violations in the default and disabled states')` |
| `debounceMs` | same hook as AutocompleteAsync — `it('waits for the default debounce before loading suggestions')` |
| Virtual windowing | needs browser — list uses `Virtualizer`; jsdom does not prove which rows are mounted |
