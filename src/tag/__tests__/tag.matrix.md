# Tag

| Scenario | Proof |
| --- | --- |
| Children, size, variant | `it('renders children')`, `it('applies size and variant classes')` |
| `dataTestId` | `it('sets data-test-id from dataTestId')` |
| Remove click once, does not bubble | `it('calls onRemove once and does not bubble the click')` |
| Enter and Space remove | `it('removes the tag with Enter and Space')` |
| Disabled remove ignores click and keyboard; enabled remove is the positive control | `it('does not remove a disabled tag from click or keyboard')`, `it('removes the tag with Enter and Space')` |
| No remove button without `onRemove` | `it('does not render remove without onRemove')` |
| Pointer down does not move focus | `it('does not bubble pointerdown and keeps focus on the previous control')` |
| axe default / disabled | `it('has no axe violations in the default and disabled states')` |
| `invalid` / Form | n/a — not in the API |
