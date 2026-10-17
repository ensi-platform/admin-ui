# Link

| Scenario | Proof |
| --- | --- |
| Default anchor, href, `target="_self"` | `it('renders as anchor by default')` |
| External link keeps `target` and `rel` | `it('keeps an explicit target on the anchor')` |
| `as` custom component | `it('renders as custom component when as is set')` |
| Typography role | `it('applies typography role when set')` |
| `dataTestId` and className | `it('sets data-test-id from dataTestId')`, `it('merges className')` |
| Variant class | `it('renders as anchor by default')` |
| axe | `it('has no axe violations')` |
| Provider `linkComponent` | n/a — `Link` does not read it; `MenuList` and `AdminUiProvider` do |
| Keyboard activation | n/a — the browser follows `href`; jsdom does not navigate |
| `disabled` / `invalid` | n/a — not in the API |
