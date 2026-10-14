# Behavior matrix

Use as a checklist when building the scenario list. For each row write a test or «n/a — reason». Pick the sections that match the component kind; most controls need A + B + C + D.

## A. Every component

| Area | Check |
| --- | --- |
| API contract | Every prop in `types.ts` / Description API table has a test of its **observable effect** (not only a class) |
| `dataTestId` | lands on the documented element as `data-test-id` |
| `ref` / `as` | ref points at the documented element; `as` changes the DOM tag where documented |
| Defaults | defaults that matter for HTML/a11y (`type="button"`, `block`, role) |
| Slots | each slot/compound part renders in the right place and receives its props |
| Without provider | works (or fails with the documented error) without `AdminUiProvider` — use `render` from `@testing-library/react/pure` |
| Labels | built-in labels (`clear`, `close`, …) come from provider `labels` and are overridable |

## B. Value-holding controls (Input, Textarea, NumberInput, Select, Autocomplete, Checkbox, Switch, Slider, TimeField, DatePicker, …)

| Area | Check |
| --- | --- |
| Controlled | `value` drives what is shown; typing/selecting calls `onChange` but UI follows the prop; `rerender` with a new `value` updates the UI |
| Uncontrolled | `defaultValue` initial state; subsequent user input updates UI without a prop |
| `onChange` contract | argument shape and type (string vs number vs `null` on clear), called **once** per user action, **not** called on programmatic prop change |
| Clear | `clear` shows the button only when there is a value; click → `onChange(null)` (or documented value); focus lands where documented |
| Display | selected/typed value is **visible** to the user (label in trigger, formatted number, date text) — not just stored |
| Edge values | empty string, `0`, `null`, negative, min/max, value without matching option, duplicate options, very long text |
| Formatting/parsing | locale (`ru-RU`), decimal separator, paste, trimming — table-driven `it.each` |

## C. Interaction (mouse + keyboard + focus)

Test keyboard per the WAI-ARIA APG pattern of the role. Minimum keys:

| Role / pattern | Keys to cover |
| --- | --- |
| button / link | Enter, Space (button), disabled blocks both |
| checkbox / switch | Space toggles; Enter per documented behavior; label click toggles |
| text input / textarea | typing, Backspace, selection replace, `maxLength`/`readOnly` blocking |
| select / listbox | open: Enter/Space/ArrowDown; navigate: ArrowUp/Down, Home/End; commit: Enter; Escape closes and returns focus to trigger; type-ahead; disabled option is skipped and unselectable |
| combobox / autocomplete | typing filters; ArrowDown opens/moves; Enter commits; Escape closes (second Escape clears if documented); blur behavior; no-results state |
| tabs | ArrowLeft/Right (or Up/Down for vertical), Home/End, disabled tab skipped, selection follows focus or Enter per config |
| menu / context menu | open (click / contextmenu / keyboard), ArrowDown/Up, Enter activates, ArrowRight/Left for submenus, Escape closes, focus returns |
| slider | Arrow, PageUp/PageDown, Home/End; step; min/max clamping |
| dialog / drawer / sheet | focus moves in on open, Tab stays trapped, Escape closes, focus returns to opener |
| date / calendar grid | Arrow, PageUp/Down, Home/End, Enter selects, unavailable dates not selectable |

Also: click on label/group focuses or opens as documented; click on an inner interactive element (clear, chevron) does **not** trigger the outer handler; `Tab` order is sane.

## D. States

For each of `disabled`, `readOnly`, `invalid`, `required`, `loading`, empty:

- the state is reflected for AT (`aria-disabled`/`disabled`, `aria-invalid`, `aria-required`, `aria-busy`)
- the blocked actions truly do nothing (positive control in the enabled case first)
- the state does not break other behavior (e.g. `readOnly` still focusable and selectable text)

## E. Accessibility

| Check | How |
| --- | --- |
| Role and accessible name | `getByRole(role, { name })`; name from `aria-label`, `Field.Label`, `labelledby` |
| Field wiring | label ↔ control; `Field.Hint` and `Field.Error` text reachable via `aria-describedby`; `aria-invalid` when error is shown |
| State attributes | `aria-expanded`, `aria-selected`, `aria-checked`, `aria-current` flip with interaction |
| Focus | `toHaveFocus()` after open/close/clear/remove; no focus loss to `body` |
| Automated | axe check (`vitest-axe`) once available: `expect(await axe(container)).toHaveNoViolations()` for default and key states |

## F. Form integration (`FormX`)

| Check | How |
| --- | --- |
| Submit | user enters/selects → `onSubmit` receives the exact value and type |
| Validation | zod error → `Field.Error` visible, control `aria-invalid`; error clears after valid input |
| Reset / reinitialize | `reset()` and `enableReinitialize` restore the displayed value |
| Disabled / readOnly from `Form` | propagated to the control; explicit prop overrides if documented |
| Layout props | label, hint, `required` marker, `dataTestId` on the Field root |
| Nullish | `null` / `undefined` initial value renders empty, not `"null"` |

## G. Overlays (Modal, Drawer, BottomSheet, Popover, Tooltip, Menu, Toast, ActionPopup)

| Check | How |
| --- | --- |
| Open/close | controlled (`open` + `onOpenChange`) and uncontrolled/trigger-driven |
| Dismiss | Escape, outside click, close button; each respects its opt-out prop (`keyboardDismissable`, `isDismissable`, `preventDefault`) |
| Focus | moves in on open, trapped, restored to opener on close |
| Scroll lock / inert background | where documented |
| Portal | rendered into the provider's portal container, theme classes applied |
| Nesting | overlay inside overlay: Escape closes only the top one; outside click on nested layer does not close parent |
| Lifecycle | exit animation completes (`useOverlayExitComplete`), no dangling timers after unmount, no state update after unmount |
| Tooltip/Toast specifics | delay, hover + focus triggers, auto-dismiss timing (fake timers), stacking order, pause on hover |

## H. Collections and data (Table, DataTable, Filters, ActiveFilters, ArrangementSettings, SuggestChecklist, CheckboxGroup, MultiSelect, MultiAutocomplete)

| Check | How |
| --- | --- |
| Rendering | N items → N rows/options/tags with correct text; empty and loading states |
| Selection | select/deselect, select-all with partial state, cleared on data change if documented, `onChange` receives the full new set |
| Sorting / paging / page size | click cycles asc → desc → none; page change callback args; page size resets page if documented |
| Filters | apply, reset, active chip appears, removing chip updates value and calls the right handler |
| Reorder / drag | resulting order passed to callback; no-op drop does nothing |
| Async (`*-async`) | debounce, loading, error, pagination (next page appended), **stale response ignored** after a newer request, cache reuse |
| Multi-value | add, remove (click and Backspace), duplicates prevented, overflow indicator count |

## I. Presentational (Badge, Tag, Avatar, Loader, Link, Layouts)

Smaller set is fine, but still behavior-first:

- content/children/slots render in order
- size/variant: representative class **plus** anything functional (`Link` renders `<a href>`, router `linkComponent` from provider is used, external link attrs; `Avatar` falls back to initials/icon when the image fails; `Loader` exposes `role="status"`/label; `Tag` remove button label and callback)
- `as` / polymorphism, `className` merge, `style` pass-through

## J. Async and timing

- await every user action; use `findBy*`/`waitFor` with a real condition
- debounced/throttled logic with fake timers: assert **not** before the delay, **yes** after
- unmount during pending work does not call callbacks or warn
- rapid repeated actions: last one wins

## L. User input scenarios (all input-like components)

Derive from walking the source, not from the contract alone. Drive through `userEvent`.

| Scenario | Examples |
| --- | --- |
| Contradictory values | range: `end < start` typed in either order; min > max; second field conflicts with the first |
| Out of bounds | below `min`, above `max`, exactly on the bound (valid) |
| Partial input | only one segment/field filled, then blur; half-typed number/date |
| Boundary equal | `start === end`, `value === min`, single-item selection |
| Sequences | enter A then conflicting B; blur then re-enter; clear then retype; open popup, pick, reopen |
| Two channels | type vs pick from popup/calendar must give the same result; picking in reverse order (late day first) |
| Rejected change | controlled parent ignores `onChange`: UI must not diverge from `value` |
| Recovery | after invalid input + blur: value rolls back or `invalid` is shown, per contract; the form never receives the invalid value |

## K. Regression

Each `fix:` in `git log -- src/<name>` → one test named after the symptom that fails without the fix.
