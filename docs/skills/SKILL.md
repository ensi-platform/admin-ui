---
name: admin-ui
description: >-
    Build Ensi admin UI with @ensi-platform/admin-ui primitives (Button, Field,
    Form*, Select, Modal, Table, icons, tokens, Provider). Use whenever the user builds
    or changes admin screens, forms, filters, overlays, lists, detail pages, or
    asks which control to pick — even if they do not name the package.
---

# admin-ui

Skill for **consuming** the package (assemble UI). Authoring Description / stories — use `write-component-docs`.

## Before coding

1. Pick the primitive (table below).
2. If you build a whole screen (list, filters, detail page, page chrome), also read `node_modules/@ensi-platform/admin-ui/docs/design-language.md` first. It defines layer budget (container: bg XOR border, nesting <= 2), list/filters/detail layouts, theme colours.
3. Read — do not invent API:
   - `node_modules/@ensi-platform/admin-ui/src/<name>/docs/Description.md`
   - `node_modules/@ensi-platform/admin-ui/src/<name>/types.ts` (when present)
   - if unsure: `Example.md` in the same folder
4. Prefer Description over guessing from neighbouring JSX.

Package channel overview: `node_modules/@ensi-platform/admin-ui/docs/ai.md`. Architecture: `node_modules/@ensi-platform/admin-ui/docs/architecture.md`.

## Setup (host app)

- tokens once: `import '@ensi-platform/admin-ui/tokens'`
- which `--aui-*` an app layout may use: `node_modules/@ensi-platform/admin-ui/src/ds/tokens/docs/Description.md`
- `AdminUiProvider` from `@ensi-platform/admin-ui/provider` at the UI root (locale, portals, built-in labels, page substrate; content inset on host `main`)
- theme: `data-theme` on `document.documentElement` (`light` | `dark`)
- Full provider example (`labels`) and router `Link` wrapper (`react-router` / `next/link`): `node_modules/@ensi-platform/admin-ui/src/docs/getting-started/Description.md`

## Choose

Import `@ensi-platform/admin-ui/<folder>` (`button`, `date-picker`, …). Inside `Form`, use the `Form*` exported next to that control (`FormInput`, `FormDatePicker`, …). Props stay in that primitive’s `Description.md`.

| Need | Use | Not |
| --- | --- | --- |
| Persistent admin nav: nested section tree, hover flyout, pins, collapse. Tree in `items`; optional `allowedCodes` and current URL `activePath` | `CascadeMenu` | a second cascade, accordion, or card-nav. One column without logo / user / collapse — `MenuList` |
| Section list only: groups and leaf items, no nested accordion | `MenuList` | the full sidebar — `CascadeMenu` |
| User circle in the sidebar, header, or a list. Initials from `name` / `initials`, or a photo via `src` | `Avatar` | an ad-hoc initials span; a status — `Badge` |
| Primary, secondary, or danger action, or a form submit (`type="submit"`) | `Button` | a restyled `Link` |
| Read-only entity status (“Paid”, “In assembly”). No click and no remove | `Badge` | `Tag` |
| Removable chip: a `MultiSelect` value or one applied filter | `Tag` | `Badge` |
| Applied filters on a list: one chip per value, remove, and a clear link. Several values of one field collapse into a count chip | `ActiveFilters` | `Filters` (the form), `Badge` |
| Free single-line text: name, email, search | `Input` / `FormInput` | multiline — `TextArea`; a number — `NumberInput` |
| Free multiline text: comment, description, address | `TextArea` / `FormTextArea` | `Input` |
| One value from a dictionary or enum, no typing | `Select` / `FormSelect` | several values — `MultiSelect`; typing — `Autocomplete` |
| Several values from a dictionary or enum, no typing | `MultiSelect` / `FormMultiSelect` | `Select`; a status in a cell — `Badge` |
| One date, or a date with time (`granularity` on the same control) | `DatePicker` / `FormDatePicker` | a period — `DateRangePicker`; time only — `TimeField` |
| A date period: list filters, reports | `DateRangePicker` / `FormDateRangePicker` | one date — `DatePicker` |
| Time of day only | `TimeField` / `FormTimeField` | a date — `DatePicker` |
| Confirm (primary) or delete (danger). Custom tone and labels — `ActionPopup`. Open from a helper with `useModal({ Component, props })` | `ConfirmModal` / `DeleteModal` / `ActionPopup` from `action-popup` | raw `Modal`, unless the chrome itself is custom |
| Dialog shell over the page: custom body, not a confirm/delete preset | `Modal` | `ConfirmModal` / `DeleteModal` |
| Label, hint, and error around a control. Error text is passed in (including from RHF). `Field` has no `name` | `Field` | `FormControl`. Wiring a form field is `Form` + `Form*` |
| Short message after save, delete, or a failed request. Mount `ToastProvider` and `ToastRegion` yourself (they are not inside `AdminUiProvider`). Call `useToast()` → `appendToast` / `closeToast`. Default stack cap is 5 | `Toast` | `Loader`, which blocks the surface instead of messaging |
| Block clicks on a list, card, or form while data loads. On refetch the children stay mounted | `Loader` | `Toast` |
| Entity list whose sort and column filter live in the header, plus a row action menu | `DataTable` (+ `ContextMenu`) | bare `Table` |
| List chrome only: custom cells, pagination, `PageSize`. Row selection — `useTableRowSelection` | `Table` | `DataTable` when the header should sort or filter |
| Sections of one page or entity card. Underline, not a pill row | `Tabs` | bordered segment buttons; vertical tabs inside a tab — `VerticalTabs` |
| Vertical tabs inside one page tab: column on the left, panel on the right. Column width, gap, and selected fill are `--aui-vertical-tabs-*` | `VerticalTabs` | underline page tabs — `Tabs` |
| Equal columns of fields, or an explicit track split (`cols` number or track list, `GridLayout.Item` `col="full"`). Gap is a spacing step. List filters put it inside `Filters.Body` | `GridLayout` | `FlexLayout` for a row or a stack |
| A row or a stack: page title and buttons, or a button group. `FlexLayout.Item` `grow` takes the free space. Gap is a spacing step | `FlexLayout` | equal field columns — `GridLayout` |
| A short value the user copies (order id, number). Link style; tooltip shows the copied value, or that the copy failed | `CopyButton` | a plain `Button` |
| Filters or details at the side. Long content that must not cover the viewport the way `Modal` does | `Drawer` | a nested card on the page; on mobile — `BottomSheet` |
| The same panel on a narrow screen, dismissed with a swipe down | `BottomSheet` | a side `Drawer` |
| Filter form of a list page. Fields sit on the page: no card and no muted bar. A date or a range may span more columns than a short field | `Filters` | applied chips — `ActiveFilters`; which fields exist and their order — `ArrangementSettings` |
| The user chooses which filters or columns are visible and in which order. Values stay in `Filters`, columns stay in `Table` | `ArrangementSettings` | `Filters` for the values themselves |
| Create/edit page, or a filter submit, with a zod schema. RHF state lives in `Form`; each control is the matching `Form*` | `Form` + `FormInput` / `FormSelect` / … | hand-rolled RHF, React Aria `Form`, `FormControl` |
| One `boolean` | `Checkbox` / `FormCheckbox` | a settings on/off — `Switch`; several options — `CheckboxGroup` |
| Several options, more than one can be on (`string[]`) | `CheckboxGroup` / `FormCheckboxGroup` | one `Checkbox` |
| Settings flag, on/off, no checkmark | `Switch` / `FormSwitch` | `Checkbox` |
| Quantity, price, or weight. Money goes through `formatOptions`; store a `number` (there is no MoneyInput) | `NumberInput` / `FormNumberInput` | `Input` |
| From–to filter for an amount, quantity, or price | `NumberRange` / `FormNumberRange` | one number — `NumberInput`; a date period — `DateRangePicker` |
| A value on a track: scale, volume, ratio | `Slider` / `FormSlider` | an exact number from the keyboard — `NumberInput` |
| One value; the user types to filter a local list | `Autocomplete` / `FormAutocomplete` | no typing — `Select`; a request — `AutocompleteAsync` |
| One value; suggestions come from the app’s request (React Query / `fetch`) | `AutocompleteAsync` / `FormAutocompleteAsync` | a local list — `Autocomplete` |
| Several values; the user types to filter a local list | `MultiAutocomplete` / `FormMultiAutocomplete` | no typing — `MultiSelect`; a request — `MultiAutocompleteAsync` |
| Several values from backend suggestions | `MultiAutocompleteAsync` / `FormMultiAutocompleteAsync` | a local list — `MultiAutocomplete`; a checkbox list that is already open — `SuggestChecklist` |
| Several values inside a panel that is already open, such as a table header filter | `SuggestChecklist` | `MultiAutocompleteAsync`; never `Combobox` |
| Shared list chrome used inside Select and Autocomplete. No app-facing props | do not import | `Combobox`. The public controls are listed in `src/combobox/docs/Description.md` |
| Text navigation inside a table, form, or hint. Root is `<a>` until you pass the router link as `as` | `Link` | button look — `Button` with `as` |
| Navigation that should look like a button | `Button` with `as` and `href` | restyling `Link` |
| Short hint on an icon or a button with no visible text. Not shown on touch, so the control must work without it | `Tooltip` | a panel the user clicks — `Popover` |
| Click panel: filters, an action menu, a short form | `Popover` | plain text — `Tooltip`; right-click — `ContextMenu` |
| Right-click commands on a row, nav item, or cell (pin, open, delete) | `ContextMenu` | a menu opened from a button — `Popover` |
| Open a dialog from a helper, a menu, or an async chunk, with no local `useState` | `ModalProvider` + `useModal` from `modal-hub` | plumbing `open` through the tree |
| List or detail page title. Body copy is `bodyM` / `bodyS`; do not set `font-*` or `line-height` in your CSS | `typographyStyles.headingM` from `typography` (`headingL` when the title is larger) | a custom heading style |
| Icon-only button. `children` stays (it is the accessible name); `hidden` hides only that text; `aria-label` is required | `Button` with `icon` + `hidden` | empty `children` |
| An SVG from the kit. Color is `currentColor`. On a button pass it as `icon.Component`. Sidebar brand mark is `LogoEnsiMark`; `LogoEnsi` is the full wordmark. Names are in `src/icons/docs/Description.md` | a named export from `icons` (`Plus`, `Trash`, …) | an inline `<svg>` or another icon set |
| A value that must stay readable and selectable, but not editable. Only the text-like form fields honor this. `readOnly` may be a boolean or `{ [field name]: boolean }` | `Form` `readOnly` with `FormInput` / `FormTextArea` / `FormNumberInput` | `disabled` on those three (it drops focus and selection). Every other locked control uses `disabled` |
| The previous render’s value, or one callback after an overlay has fully closed (exit animation included, and if it unmounts mid-exit) | `usePrevious` / `useOverlayExitComplete` from `hooks` | a hand-rolled `useRef`. Debounce stays `usehooks-ts` (`useDebounceValue` / `useDebounceCallback`) |

When neighbours disagree, trust that primitive’s Description.

## Rules

- Public API is ours (`size` / `variant` / `dataTestId`, …); React Aria stays internal.
- Form fields: FormX next to the control; wrap chrome with `Field` — no `FormControl`.
- Do not paste long docs into the reply; read Description / types and code from them.
- Import only via subpaths: `@ensi-platform/admin-ui/button`, `@ensi-platform/admin-ui/provider`, … (no package root barrel).
