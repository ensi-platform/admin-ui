# Loader

| Scenario | Proof |
| --- | --- |
| Inactive: no status, clicks reach children | `it('hides overlay when inactive')`, `it('lets clicks reach children when inactive')` |
| Active: `role="status"`, `aria-busy`, clicks blocked | `it('shows overlay and aria-busy when active')`, `it('blocks clicks on children while active')` |
| `loading` label, including an override | `it('shows overlay and aria-busy when active')`, `it('uses an overridden loading label')` |
| size class | `it('applies size class')` |
| `dataTestId` | `it('sets data-test-id from dataTestId')` |
| axe idle / active | `it('has no axe violations when idle and active')` |
| `invalid` | n/a — not in the API |
