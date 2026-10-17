# MenuList

| Scenario | Proof |
| --- | --- |
| Provider `linkComponent` | `it('renders the provider link component')` |
| `value` marks the active leaf (`activeId`) | `it('marks the active leaf')` |
| Click and Enter call `onChange` (`setActiveId`) | `it('calls onChange when a leaf is activated')`, `it('activates a leaf with Enter')` |
| `as="button"` activates with Space and becomes active | `it('renders a button when as is button')` |
| Parent ignores `onChange`: active leaf stays | `it('keeps the active leaf when the parent ignores onChange')` |
| Disabled item | `it('does not activate a disabled item')` |
| Collapsed labels and tooltip | `it('hides group labels when collapsed')`, `it('shows tooltip for collapsed leaf but not for folder')` |
| axe default / disabled | `it('has no axe violations in the default and disabled states')` |
| Hover position of the tooltip | needs browser |
