# Design language (admin UI)

Visual canon for Ensi admin screens. `--aui-*` tokens live in Storybook Design System / Tokens and in `src/ds/tokens/docs/Description.md`. This file is **layers, sidebar, and how to assemble screens**.

## Formula

A fill (bg) or a stroke (border) on its own is fine.
Many of them **together**, **and** inside nested boxes, is noise.

| Rule | |
| --- | --- |
| Zone container | **XOR**: either `surface-bg-*` or `surface-border-*`, not both |
| Nesting budget | ≤ **2** surface boxes from `page` to the deepest leaf |
| Chip / Tag / Badge | one signal: tint **or** outline, not both |
| Separating zones | gap / divider / bg contrast — not another card |

**Exceptions** (bg + border are allowed):

- an interactive control (`Input`, `Select`, …)
- focus ring
- semantic alert (danger/warning box)

Layer reference: Kontur.Diadoc (fills and strokes exist, stacked frames do not).
Anti-reference: Elba / old nested boxes (muted bar → bordered controls inside → another card outside).

## App chrome / CascadeMenu

Ready-made column: `@ensi-platform/admin-ui/cascade-menu` (`CascadeMenu`).
Parts: `MenuList` (`@ensi-platform/admin-ui/menu-list`), `Avatar` (`@ensi-platform/admin-ui/avatar`), logo `LogoEnsiMark` + the text `ensi-opensource`.

**Chrome source of truth:** Storybook `App/CascadeMenu` + this section (WIP).

| | Yes | No |
| --- | --- | --- |
| Navigation | hover flyout on the arrow (aim-delay); L0 stays in the layout | flat dissolve; accordion; Back button |
| Logo | `LogoEnsiMark` + text `ensi-opensource`, `currentColor`; optional `title` under the brand; collapse → Mark only | full `LogoEnsi` wordmark in the opensource chrome; a hard-coded `#000` / `#fff` in the SVG; collapse only in the footer |
| L0 column | light: `neutral-50` `#fafafa` (page is white); dark: `--aui-black-900`; hover `--aui-surface-bg-muted` / `--aui-grey-700`; fg = page; resize; collapse → icon rail; in the rail a folder hover opens a flyout, a leaf opens a Tooltip | a column in another hue; collapse that disables the flyout |
| Flyout | full height = L0 height; flush left; same bg as L0; border-right divider; no shadow/radius; also works from the collapsed rail | floating card from the item; push layout; surface / light panel |
| Active | `data-open` only on the open flyout folder; current leaf has no pill (breadcrumbs) | a persistent path pill from `activePath`; a soft pill on the leaf; pill **and** left bar **and** border |
| Pins | one Pinned item on L0 → hover flyout with the list; hint about right-click when empty; RMB Pin/Unpin (not on L0) + Open in new tab; leaf+folder; divider; limit 8; LS keyed by `pinUserId` | N pins listed directly on L0; pin on L0; trailing pin button; a card around pins; DnD; sticky flyout |
| User | divider + `Avatar` → `Popover` | user inside a bordered card |
| Search | button next to collapse; dimmed backdrop + a small window above center (field and a list of `link` leaves + path); Escape / backdrop click closes; the rail does not expand | an in-place tree filter; counters |

CascadeMenu is layer 0 (app chrome). It does **not** count toward the content budget of tables and forms.

The `sidebar | page` layout belongs to the consumer (the flyout covers the page).
Z-order: L0+flyout (`--aui-z-chrome`) above a sticky table (`--aui-table-z-sticky`), below dropdown/modal (`--aui-z-dropdown` / `--aui-z-modal`).

## Screens (assembled from Base)

Primitives: `CascadeMenu` / `MenuList`, `Button`, `Tag`, `Badge`, `Table`, `Tabs`, `VerticalTabs`, `Field` + controls, and `Drawer` when needed.

### List — table

- title (`headingM`); `Button` secondary “Filters” + primary “+ New …”
- applied filters: `ActiveFilters` (`Tag` + a “Clear” link) — **no** bordered bar around the row
- `Table` flush on `page` — **no** outer rounded card
- status in a cell — `Badge` (tint only)
- pagination: active = fill; **no** border box on every page
- do not use a segmented “Table | Filters” (two outlined buttons)

### List — filters

- the same title / primary action
- a grid of `Field` + Select / DateRange / … on `page`
- **no** card wrapper and **no** muted bar around the controls
- a long form goes in a `Drawer`, not another nested box on the page
- no pill tabs as document-type filters

### Detail

- back link; title + `Badge`; `⋯` + primary “Save”
- page sections — underline `Tabs` (not a pill row with a border)
- sections inside one tab — `VerticalTabs` (column on the left, panel on the right)
- sections: H2 + gap; fields on `page` in `Grid` — **no** card per section
- one alert (bg+border) is the only heavy nested block
- tags inside a field — tint, with no second stroke on top of `Field`

## Theme (from `src/ds/tokens`)

Light / dark are one contract, remapped (`data-theme`). Dark is not a different product look. Font: Inter. List / detail page title — `typographyStyles.headingM`. Space / radius / control height — rem (root 16px on `AdminUiProvider`).

| Role | Light | Dark |
| --- | --- | --- |
| page bg | `#ffffff` | `#1b1d22` (`black-900`) |
| page fg | `#0a0a0a` (`neutral-900`) | `#f1f5f9` (`grey-100`) |
| fg muted | `#737373` (`neutral-500`) | `#8b929e` (`grey-400`) |
| link | = page fg (underline); hover `neutral-800` | = page fg; hover white |
| sidebar | `#fafafa` (`neutral-50`) | = page |
| surface muted (secondary btn / tag) | `#f5f5f5` (`neutral-100`) | `#3f4651` (`grey-600`) |
| surface primary (input fill) | `#ffffff` | `#212328` (`black-800`) |
| table fill | = page (flush) | = page (flush) |
| surface border | `#e5e5e5` (`neutral-200`) | `#3f4651` (`grey-600`) |
| primary button | bg `#171717` (`neutral-800`), fg `#fafafa` | bg `#f1f5f9`, fg `#1b1d22` |
| focus | `#a1a1a1` (`neutral-400`) | grey-100 |
| badge success/warning/danger | soft `*-50` bg + `*-700` fg | `color-mix(*-500 22%, surface)` + `*-500` fg |
| badge info | = neutral | = neutral |
| control radius | `8px` (`radius-8`) | same |

Light accent = neutral (`neutral-800` / `#171717`). Dark accent = a light grey fill. Status = red/green/yellow only (info = neutral).

## Related

- consumer skill: [`skills/`](./skills/) — which primitive to pick; screen visuals — this file
