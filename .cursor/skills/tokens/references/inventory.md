# Token inventory (v1)

Open this file from the `tokens` skill when adding or renaming a `--aui-*` name. `src/ds/tokens/semantic.css` and `primitives.css` outrank this list.

## Color primitives

```
grey-50 … grey-800
black-800, black-900, white, transparent
charcoal-50, charcoal-100, charcoal-500, charcoal-600, charcoal-700
neutral-50, neutral-100, neutral-200, neutral-300, neutral-400, neutral-500, neutral-800, neutral-900
red-50, red-500, red-600, red-700
green-50, green-500, green-700
yellow-50, yellow-500, yellow-700
```

Light brand is neutral (`neutral-800` = `#171717`, fg `neutral-50`). Dark brand is a light fill (`grey-100`) plus a dark fg. `page-fg-link` maps to page fg with an underline. `control-border-focus` maps to `neutral-400` in light and `grey-100` in dark. Status uses red, green, and yellow. Badge and toast info use neutral. Light page is white. The sidebar is `neutral-50`.

## Color semantic places

| place | Tokens |
| --- | --- |
| page | `page-bg-primary`, `page-fg-primary`, `page-fg-muted`, `page-fg-link` |
| surface | `surface-bg-primary`, `surface-bg-muted`, `surface-bg-muted-hover`, `surface-bg-muted-active`, `surface-bg-elevated`, `surface-border-primary`, `surface-border-muted` |
| overlay | `overlay-bg-primary` (shared backdrop; place UI aliases it) |
| control | `control-bg-brand`, `control-bg-brand-hover`, `control-bg-brand-active`, `control-bg-danger`, `control-bg-danger-hover`, `control-bg-danger-active`, `control-bg-success`, `control-bg-warning`, `control-fg-brand`, `control-fg-danger`, `control-border-focus`, `control-border-danger` |
| button | `button-bg/fg-primary[-hover\|-active]`, `button-bg/fg-secondary[-hover\|-active]`, `button-bg/fg-danger[-hover\|-active]`, `button-bg/fg-tertiary[-hover\|-active]`, `button-border-tertiary`, `button-border-focus`, `button-radius-md`, `button-gap-md`, `button-line-height`, `button-h-sm\|md\|lg`, `button-pad-y/x-sm\|md\|lg`, `button-duration-fast`, `button-duration-spin`, `button-ease-out` |
| link | `link-fg`, `link-fg-hover`, `link-border-focus`, `link-duration-fast`, `link-ease-out` |
| copy-button | `copy-button-fg`, `copy-button-fg-hover`, `copy-button-fg-active`, `copy-button-fg-copied`, `copy-button-fg-danger`, `copy-button-border-focus`, `copy-button-gap`, `copy-button-icon-size`, `copy-button-duration-fast`, `copy-button-ease-out` |
| input | `input-bg-primary`, `input-fg-primary`, `input-fg-muted`, `input-border-primary`, `input-border-focus`, `input-border-danger`, `input-radius-md`, `input-h-sm\|md\|lg`, `input-pad-x-sm\|md\|lg`, `input-gap-md` |
| textarea | `textarea-bg-primary`, `textarea-fg-primary`, `textarea-fg-muted`, `textarea-border-primary/focus/danger`, `textarea-radius-md`, `textarea-min-h-sm\|md\|lg`, `textarea-pad-x-sm\|md\|lg`, `textarea-pad-y-sm\|md\|lg`, `textarea-gap-md` |
| checkbox | `checkbox-bg-primary/selected`, `checkbox-fg-primary/selected`, `checkbox-border-primary/focus/danger/selected`, `checkbox-radius-md`, `checkbox-gap-md`, `checkbox-box-sm\|md\|lg`, `checkbox-icon-sm\|md\|lg`, `checkbox-group-gap-md` |
| suggest-checklist | `suggest-checklist-field-gap-md` (search field to the checkbox list; row gap stays `checkbox-group-gap-md`) |
| switch | `switch-track-bg-primary/selected`, `switch-thumb-bg-primary`, `switch-fg-primary`, `switch-border-focus/danger`, `switch-gap-md`, `switch-track-h/w-sm\|md\|lg`, `switch-thumb-sm\|md\|lg`, `switch-radius-md` |
| number-input | `number-input-bg/fg-primary`, `number-input-fg-muted`, `number-input-border-primary/focus/danger`, `number-input-radius-md`, `number-input-h-sm\|md\|lg`, `number-input-pad-x-sm\|md\|lg`, `number-input-gap-md` |
| number-range | `number-range-gap-md` (gap between the two fields; chrome is `number-input`) |
| filters | `filters-gap-md`, `filters-pad-y-md` (listing filter section; no surface chrome; the field grid is `GridLayout`) |
| grid-layout | `grid-layout-gap-0\|4\|8\|12\|16\|20\|24\|32\|40\|48\|64` (field and split grid; the template is set per instance) |
| flex-layout | `flex-layout-gap-0\|4\|8\|12\|16\|20\|24\|32\|40\|48\|64` (row and stack; gap step) |
| active-filters | `active-filters-gap-md`, `active-filters-border-hover`, `active-filters-border-focus`, `active-filters-icon-size-md`, `active-filters-icon-fg`, `active-filters-icon-fg-hover`, `active-filters-icon-gap`, `active-filters-list-gap`, `active-filters-panel-max-w`, `active-filters-panel-max-h`, `active-filters-clear-fg-hover` (applied chip row; chip chrome is `Tag`) |
| arrangement-settings | `arrangement-settings-gap-md`, `arrangement-settings-item-pad-x/y-md`, `arrangement-settings-item-radius-md`, `arrangement-settings-item-fg`, `arrangement-settings-item-bg-hover`, `arrangement-settings-grip-w/h-md`, `arrangement-settings-indicator`, `arrangement-settings-indicator-h`, `arrangement-settings-preview-bg`, `arrangement-settings-preview-shadow` |
| date-picker | field plus popover: `date-picker-bg/fg-primary`, `date-picker-fg-muted`, `date-picker-border-primary/focus/danger`, `date-picker-radius-md`, `date-picker-h-sm\|md\|lg`, `date-picker-pad-x-*`, `date-picker-gap-md`, `date-picker-icon-*`, `date-picker-popover-*` (including `popover-w`) |
| color-field | hex field plus popover: `color-field-bg/fg-primary`, `color-field-fg-muted`, `color-field-border-primary/focus/danger`, `color-field-radius-md`, `color-field-h-sm\|md\|lg`, `color-field-pad-x-*`, `color-field-gap-md`, `color-field-swatch-sm\|md\|lg`, `color-field-popover-*` |
| color-picker | palette: `color-picker-gap-md`, `color-picker-radius-md`, `color-picker-area`, `color-picker-slider-h`, `color-picker-thumb`, `color-picker-preset`, `color-picker-shadow` |
| date-range-picker | aliases the date-picker place (`date-range-picker-*`) |
| time-field | `time-field-bg/fg-primary`, `time-field-fg-muted`, `time-field-border-primary/focus/danger`, `time-field-radius-md`, `time-field-h-sm\|md\|lg`, `time-field-pad-x-*`, `time-field-gap-md`, `time-field-icon-*` |
| calendar | vertical scroll grid: `calendar-bg/fg-primary`, `calendar-fg-muted/selected`, `calendar-bg-selected/hover/range/today`, `calendar-border-today/focus`, `calendar-max-h`, `calendar-pad/gap-*`, `calendar-cell-size/radius-md`, `calendar-heading-pad-y-md`, `calendar-popover-w` |
| combobox | trigger and list chrome for Select, MultiSelect, and Autocomplete: `combobox-bg/fg-primary`, `combobox-fg-muted`, `combobox-border-primary/focus/danger`, `combobox-radius-md`, `combobox-h-sm\|md\|lg`, `combobox-pad-x/y-*`, `combobox-gap-*`, `combobox-icon-size/hit-*`, `combobox-list-pad-*`, `combobox-popover-*`, `combobox-item-*`, `combobox-list-status-*`, `combobox-skeleton-*`, `combobox-tag-*`, `combobox-overflow-*` |
| field-clear | clear control inside combobox triggers: `field-clear-radius-md`, `field-clear-icon-size/hit-*`, `field-clear-fg-muted/primary`, `field-clear-border-focus` |
| tooltip | `tooltip-bg/fg-primary`, `tooltip-radius-md`, `tooltip-pad-x/y-sm\|md\|lg`, `tooltip-max-w-md`, `tooltip-arrow-size-md`, `tooltip-shadow`, `tooltip-z` |
| popover | `popover-bg/fg-primary`, `popover-border-primary`, `popover-radius-md`, `popover-pad-x/y-sm\|md\|lg`, `popover-max-w-md`, `popover-arrow-size-md`, `popover-shadow`, `popover-z` |
| modal | `modal-overlay-bg-primary`, `modal-bg/fg-primary`, `modal-fg-muted`, `modal-border-primary`, `modal-shadow`, `modal-radius-md/fullscreen`, `modal-w-sm\|md\|lg/fullscreen`, `modal-h/max-h-fullscreen`, `modal-max-h`, `modal-pad-*`, `modal-gap-*`, `modal-close-*`, `modal-z`, `modal-duration-normal`, `modal-ease-out` |
| drawer | `drawer-overlay-bg-primary`, `drawer-bg/fg-primary`, `drawer-fg-muted`, `drawer-border-primary`, `drawer-shadow`, `drawer-radius-md`, `drawer-w-sm\|md\|lg/fullscreen`, `drawer-pad-*`, `drawer-gap-*`, `drawer-close-*`, `drawer-z`, `drawer-duration-normal`, `drawer-ease-out` |
| bottom-sheet | `bottom-sheet-overlay-bg-primary`, `bottom-sheet-bg/fg-primary`, `bottom-sheet-fg-muted`, `bottom-sheet-border-primary`, `bottom-sheet-shadow`, `bottom-sheet-radius-md/fullscreen`, `bottom-sheet-max-h`, `bottom-sheet-h-fullscreen`, `bottom-sheet-pad-*`, `bottom-sheet-gap-*`, `bottom-sheet-handle-*`, `bottom-sheet-close-*`, `bottom-sheet-z`, `bottom-sheet-duration-normal`, `bottom-sheet-ease-out` |
| tabs | `tabs-fg-primary/muted`, `tabs-indicator-primary/hover`, `tabs-border-focus`, `tabs-indicator-h/radius`, `tabs-gap-sm\|md\|lg`, `tabs-h-sm\|md\|lg`, `tabs-pad-y/x-sm\|md\|lg`, `tabs-panel-pad-t`, `tabs-duration-normal`, `tabs-ease-out` |
| vertical-tabs | `vertical-tabs-fg-primary/muted`, `vertical-tabs-bg-selected`, `vertical-tabs-border-focus`, `vertical-tabs-list-border`, `vertical-tabs-item-radius`, `vertical-tabs-col-w`, `vertical-tabs-col-gap`, `vertical-tabs-gap-sm\|md\|lg`, `vertical-tabs-pad-y/x-sm\|md\|lg`, `vertical-tabs-panel-shift`, `vertical-tabs-duration-normal`, `vertical-tabs-ease-out` |
| table | `table-filter-min-w` (header filter panel fits two range fields), `table-filter-sort-gap` (filter fields to sort actions), `table-page-size-min` |
| data-table | aliases the table place for the actions cell: `data-table-pad-x/y-utility`, `data-table-fg-muted/primary`, `data-table-border-focus`, `data-table-duration-fast`, `data-table-ease-out` |
| cascade-menu | `cascade-menu-gap-sm/md`, `cascade-menu-pad-x-sm`, `cascade-menu-pad-y-sm`, `cascade-menu-flyout-gap` (item gap inside a flyout) |
| dropzone | `dropzone-skeleton-line-h` |
| toast | `toast-close-fg-hover` (mixed from the toast accent and title on the toast root) |

## Spacing

Primitive, 4px steps in rem at a 16px root. Hairline borders stay `1px`.

```
--aui-spacing: 0.25rem
--aui-spacing-0 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64
  → 0 | var(--aui-spacing) | calc(* 2) | … | calc(* 16)
```

## Radius

```
--aui-radius: 0.25rem
--aui-radius-0 | 4 | 8 | 12 | 16  → 0 | var(--aui-radius) | calc(* 2..4)
```

Semantic: `control-radius-sm | md | lg` → `radius-4 | 8 | 12`. `page-radius-md` → `radius-8`.

## Control height

`control-h-sm | md | lg` → `calc(var(--aui-spacing) * 8 | 10 | 12)` (32 / 40 / 48 at 16px).

## Typography

Atoms in `primitives.css`:

```
--aui-font-family
--aui-font-size-xs | sm | md | lg | xl | 2xl
--aui-font-weight-regular | medium | semibold
--aui-line-height-xs | sm | md | lg | xl | 2xl | tight | normal
```

`AdminUiProvider` sets `font-size: 1rem` on its root. The rem base is the `html` font-size.

Roles are the CSS Module `typographyStyles` in `src/ds/typography/` (`import { typographyStyles } from '@ds/typography'`). The module uses `var(--aui-…)` only.

```
bodyXs → size-xs + regular + line-height-xs
bodyS → size-sm + regular + line-height-sm
bodySTight → size-sm + regular + line-height-tight
bodyM → size-md + regular + line-height-md
bodyL → size-lg + regular + line-height-lg
headingM → size-xl + semibold + line-height-xl  (list/detail page title)
headingL → size-2xl + semibold + line-height-2xl
```

Primitives (Field Label, Hint, Error, …) compose `typographyStyles` in JSX. A primitive CSS Module leaves `font-*` and `line-height` to that module and keeps place tokens for color, gap, and the rest. The reset (`box-sizing`, `margin: 0`) lives on `AdminUiProvider`. Semantic typography variables and `label*` roles are later. There is no `Bold` suffix and no weight prop.

## Field place

```
field-gap-sm | md | lg
field-label-fg | field-hint-fg | field-error-fg
```

No `--aui-field-*-size` or `--aui-field-*-line-height`. Type is `typographyStyles`.

## Detailed place lists

These extend the table rows above: `*-bg-readonly` for input and textarea, the whole dropzone place, and the full color-field and color-picker set. A new token in these places is checked against this list.

```
input-bg-primary | input-bg-readonly
input-fg-primary | input-fg-muted
input-border-primary | input-border-focus | input-border-danger
input-radius-md
input-h-sm | md | lg
input-pad-x-sm | md | lg
```

```
dropzone-bg-primary | dropzone-bg-target | dropzone-bg-selected
dropzone-fg-primary | dropzone-fg-muted | dropzone-fg-danger | dropzone-fg-selected
dropzone-border-primary | focus | selected | danger
dropzone-radius-sm | md
dropzone-pad-sm | md | lg
dropzone-gap
dropzone-icon-size | dropzone-tile-size | dropzone-mark-size | dropzone-hit
dropzone-row-h-sm | md | lg
dropzone-preview-w | dropzone-preview-h | dropzone-progress-h
dropzone-duration-fast | dropzone-duration-normal | dropzone-ease-out
```

```
color-field-bg/fg-primary | color-field-fg-muted
color-field-border-primary | focus | danger
color-field-radius-md
color-field-h-sm | md | lg
color-field-pad-x-sm | md | lg
color-field-gap-md
color-field-icon-size | color-field-icon-hit | color-field-clear-radius
color-field-swatch-sm | md | lg | color-field-swatch-radius | color-field-empty-inset
color-field-popover-bg | border | radius | pad | w | shadow | z
color-field-duration-fast | color-field-ease-out
color-picker-gap-md | color-picker-radius-md | color-picker-swatch-radius
color-picker-area | color-picker-slider-h | color-picker-thumb | color-picker-thumb-border | color-picker-thumb-ring
color-picker-preset | color-picker-shadow
```

```
textarea-bg-primary | textarea-bg-readonly
textarea-fg-primary | textarea-fg-muted
textarea-border-primary | textarea-border-focus | textarea-border-danger
textarea-radius-md
textarea-min-h-sm | md | lg
textarea-pad-x-sm | md | lg
textarea-pad-y-sm | md | lg
```

## Misc

`shadow-sm`, `shadow-md`, `z-dropdown`, `z-modal`.

## Motion places

`button`, `input`, `dropzone`, `textarea`, `number-input`, `date-picker`, `date-range-picker`, `time-field`, `color-field`, `calendar`, `checkbox`, `switch`, `combobox`, `field-clear`, `tooltip`, `popover`, `modal`, `drawer`, `bottom-sheet`, `tabs`, `vertical-tabs`, `copy-button`, `table`.

Leave these out of v1: Tailwind, a `color-` prefix, variants named `default` or `base`, a slash in a token name, W3C DTCG JSON, Style Dictionary, a JS token object, breakpoint tokens, and a dark class in a CSS Module.
