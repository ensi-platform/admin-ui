## 0.8.1 - 2026-10-05

### Bug Fixes
- minor fixes

## 0.8.0 - 2026-10-05

### Features
- new components
- `FlexLayout` for a row or a stack (`direction`, `gap`, `align`, `justify`, `FlexLayout.Item` `grow`). Equal field columns stay `GridLayout`
- `CopyButton` copies its text and shows a tooltip: the copied value on success, an error if the clipboard rejects. The check icon and tooltip stay for `timeout` (default 1000 ms)

## 0.7.0 - 2026-10-05

### Features
- add new components
- `VerticalTabs`: a column on the left and a panel on the right. Page sections stay `Tabs`
- `GridLayout` for fields and column splits (`cols`, `gap`, `GridLayout.Item` with `col` or `col="full"`). List filters are `Filters` (`Body` / `Footer`); the field grid is `GridLayout`

## 0.6.0 - 2026-10-04

### Features
- add new components + fix components and ai skills
- `Form` `disabled` and `readOnly` accept a boolean or a map of exact field names
- `readOnly` on `Input`, `TextArea`, and `NumberInput` (value stays focusable and copyable)
- `Button` `hidden` hides only the text; the icon stays. Pass `aria-label`

### Bug Fixes
- fix deps

## 0.5.0 - 2026-10-01

### Features
- fixes + new features

## 0.4.2 - 2026-09-25

### Bug Fixes
- fix root styles

## 0.4.1 - 2026-09-24

### Bug Fixes
- fix tests and packages

## 0.4.0 - 2026-09-24

### Features
- new components

## 0.3.0 - 2026-08-05

### Features
- update theme + add new components

## 0.2.0 - 2026-07-31

### Features
- update build + docs
- add toast
- add tabs + ci
- add table
- add datepicker fields
- add Autocomplete and MultiAutocomplete (sync/async)
- add modals + tooltip + popover + modal hub
- new components + fixes
- add new components + themes
- add new component + storybook/ai rules/settings

### Bug Fixes
- fix storybook static
- undefined
- fix stories
- fix table
- fix keyboard cases
- formating

## 0.1.0 - 2026-07-31

### Features

- Initial public release of `@ensi-platform/admin-ui`
