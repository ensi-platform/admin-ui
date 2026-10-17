# ContextMenu

| Scenario | Proof |
| --- | --- |
| Closed render | `it('renders nothing when open is false')` |
| Portal into the provider root | `it('portals menu into the provider root')` |
| `x` / `y` and default `md` / `primary` | `it('portals menu into the provider root at x/y')` |
| Content change keeps the placed position | `it('keeps the placed position when the menu content changes')` |
| Callback and object `ref` | `it('forwards callback ref to menu root')` |
| `dataTestId` on menu and item | `it('sets data-test-id from dataTestId')` |
| Danger item | `it('marks a danger item')` |
| Outside press closes | `it('closes on outside mousedown')` |
| Inside press does not close | `it('does not close on mousedown inside menu')` |
| Escape closes | `it('closes on Escape')` |
| Other keys do not close | `it('does not close on a key other than Escape')` |
| Enter activates the focused item | `it('activates the focused item with Enter')` |
| Space activates the focused item | `it('activates the focused item with Space')` |
| Tab skips a disabled item | `it('moves focus to the next enabled item with Tab and skips a disabled item')` |
| Click activates | `it('calls Item onClick')` |
| Disabled item does not activate | `it('does not call onClick when Item is disabled')` |
| Item icon | `it('renders Item icon')` |
| Separator | `it('renders Separator')` |
| `onMouseEnter` | `it('calls onMouseEnter when the pointer enters the menu')` |
| `size` on the menu and items | `it('applies the sm size to the menu and its items')` |
| axe open | `it('has no axe violations when open')` |
| Viewport flip | `placeContextMenu` in `utils.test.ts`; needs browser for a real rect |
| ArrowUp / ArrowDown / Home / End | n/a — items are buttons; keyboard is Tab, Enter, Space, Escape |
| Submenus | n/a — flat list |
| `invalid` | n/a — not in the API |
| Form | n/a — no FormContextMenu |
