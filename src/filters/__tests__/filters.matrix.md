# Filters

| Scenario | Proof |
| --- | --- |
| Body slot renders field content | `it('renders the body as a plain content slot')` |
| Footer slot renders the page buttons | `it('renders footer slots')` |
| `dataTestId` on root, body, footer | `it('renders the body as a plain content slot')`, `it('renders footer slots')` |
| `ref` on the section, body, and footer | `it('forwards ref to the section')`, `it('points refs at the body and the footer')` |
| Without provider | `it('renders without AdminUiProvider')` |
| axe default | `it('has no axe violations in the default state')` |
| `disabled` / `invalid` | n/a — not in the Filters API |
| `size` / `variant` / `as` | n/a — layout shell, no chrome variants |
| Built-in labels | n/a — buttons and field labels come from the page |
| Value, keyboard, clear | n/a — the section does not hold a value; controls stay outside |
| Form submit | n/a — no FormFilters; `Form` wraps this section from the page |
| Footer `space-between` | needs browser — CSS layout, no behavioral contract |
