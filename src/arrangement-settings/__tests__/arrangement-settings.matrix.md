# ArrangementSettings

| Scenario | Proof |
| --- | --- |
| Open drawer shows every item, hidden ones stay in the list | `it('saves visibility and drops a hidden field from the order')` |
| Check adds the id; uncheck removes it; save commits visible ids in list order | `it('saves visibility and drops a hidden field from the order')`, `it('turns a checked item off and saves the rest')`, `it('saves visible ids in list order and drops unknown ids')` |
| Click on the label toggles the row | `it('toggles a row from a click on the label')` |
| Checkbox pointer does not also activate the row | `it('stops the row press from the checkbox')` |
| Space on the checkbox toggles once | `it('toggles a checkbox once with Space')` |
| Escape discards the draft and does not call `onSave` | `it('discards the draft on dismiss')` |
| Reopen copies `value` again | `it('discards the draft on dismiss')` |
| `onExitComplete` after dismiss | `it('calls onExitComplete after dismiss')` |
| Item removed from `items` disappears | `it('hides a row when its field leaves the item list')` |
| `placement` `right` / default `left` | `it('opens from the right when placement is right')`, `it('opens from the left by default')` |
| `dataTestId` on the dialog | `it('puts data-test-id on the dialog')` |
| `save` and `arrangementList` labels, including an override | `it('uses overridden save and list labels')` |
| Drag handle is present; row is draggable | `it('unchecks an item on a draggable row')` |
| axe on the open drawer | `it('has no axe violations when open')` |
| Reorder drop, insertion line, drag preview | needs browser — jsdom has no layout |
| `disabled` / `invalid` / Form | n/a — not in the API |
| `ref` / `as` | n/a — not in the API |
