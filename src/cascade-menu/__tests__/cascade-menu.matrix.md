# CascadeMenu

| Scenario | Proof |
| --- | --- |
| L0 folders, header, footer | `it('renders L0 folders, header, and footer')` |
| Hover opens a flyout | `it('opens the flyout when the pointer enters a folder')` |
| Leaf activates and closes the flyout | `it('activates leaf, calls onChange, and collapses flyout')` |
| Collapse rail, search Escape, search arrows and Enter | `it('toggles collapsed rail and hides flyout')`, `it('clears the query and closes the search overlay on Escape')`, `it('moves the search highlight and opens the active hit')` |
| Pin, new tab, empty pinned hint | `it('pins leaf and folder via context menu without navigating')`, `it('opens leaf in new tab from context menu')`, `it('shows empty Pinned hint when pins enabled and none pinned')` |
| `linkComponent` in search results | `it('renders search hits with the provider link component')` |
| Flyout top/height/left, aim delay, resize drag distances | needs browser — jsdom has no layout |
| Hook tests (`useHoverMenu`, `hoverAim`, chrome) | kept; aim and geometry are not replaced by the public hover test |
