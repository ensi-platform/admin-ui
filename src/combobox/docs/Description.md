# Combobox

Shared list + trigger chrome for Select / MultiSelect / Autocomplete. Import: `import { ComboboxList, ComboboxTrigger, … } from '@ensi-platform/admin-ui'`.

## Когда использовать

- Building Select / Combobox shells in this package
- Not a drop-in form control — use `Select` / `Autocomplete` for product UI

## API (кратко)

- `ComboboxList` — popover + options (+ optional loading/error/empty status)
- `ComboboxTrigger` — single value (`mode: 'select' | 'combobox'`)
- `ComboboxMultiTrigger` — tags via shared `SelectedTags` (`mode: 'select' | 'combobox'`, overflow `+N`, remove only via TagGroup)
- `useSelectedOptionsCache` / `resolveSelectedOptions`
- Types: `IComboboxOption`, `TComboboxValue`, `TComboboxSize`, `TComboboxVariant`

## Tokens

CSS Modules use `--aui-combobox-*` only. Clear control: `--aui-field-clear-*` via `@/field-clear-button`.
