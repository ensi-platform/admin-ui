Ready-made AP cascade menu: `header` slot (brand composed by the app), columns, `footer` slot, collapse (in brand), and L0 resize.

```tsx
import { CascadeMenu } from '@ensi-platform/admin-ui/cascade-menu';
```

## When to use

- Persistent AP navigation with a section tree (Ensi/Auchan Sidebar shape)
- Tree `items` + `allowedCodes` filter + `activePath`
- Single-column list primitive — see `MenuList`

## Behavior

- L0 stays in layout; folder → **hover flyout** (full-height = L0 height, flush to column, border-right; open section title at top)
- Aim-delay like DesktopMenu (diagonal move to panel does not flicker)
- No Back button; leave / outside click / leaf → collapse
- Leaf (`link`) → `onChange` and close flyout
- Collapse → icon rail (control in brand); open flyouts close on collapse; in rail, folder → same hover flyout, leaf → Tooltip
- Pins: leaf and folder **except L0**; RMB → Pin/Unpin and “Open in new tab” (leaf only); single Pinned L0 item → hover flyout with the list; empty RMB hint; `maxPinned` (default 8); `localStorage` via `pinUserId`
- Chrome: expanded `width` and `collapsed` also in `localStorage` via `pinUserId` (collapse does not overwrite stored width)

## API (summary)

| Prop                                                    | Values               | Default       | Description                                                 |
| ------------------------------------------------------- | -------------------- | ------------- | ----------------------------------------------------------- |
| `header`                                                | `ReactNode`          | —             | Header slot (brand composed by the app)                     |
| `items`                                                 | `ICascadeMenuItem[]` | —             | Menu tree                                                   |
| `allowedCodes`                                          | `string[]`           | all           | Filter by `code`                                            |
| `activePath`                                            | `string`             | —             | Pathname → leaf id for value/`onChange` (no menu highlight) |
| `value` / `defaultValue` / `onChange`                   |                      |               | Leaf id (navigation; no leaf pill)                          |
| `pinUserId`                                             | `string`             | —             | LS key for pins / width / collapsed                         |
| `pinnedCodes` / `defaultPinnedCodes` / `onPinnedChange` | `string[]`           |               | Controlled / uncontrolled pins                              |
| `maxPinned`                                             | `number`             | `8`           | Pin limit                                                   |
| `collapsed` / `defaultCollapsed` / `onCollapsedChange`  |                      | `false`       | Icon rail                                                   |
| `width` / `defaultWidth` / `onWidthChange`              | px                   | `280`         | L0 width                                                    |
| `minWidth` / `maxWidth`                                 | number               | `200` / `400` | L0 resize bounds                                            |
| `footer`                                                | `ReactNode`          | —             | Footer slot (user block composed by the app)                |
| `size`                                                  | `sm` \| `md` \| `lg` | `md`          | Item size                                                   |
| `dataTestId`                                            | `string`             | —             | `data-test-id`                                              |

`ICascadeMenuItem`: `text`, `code`, `link?`, `icon?`, `children?`.
