Admin sidebar with a section tree: `header` slot, root column, hover flyout panels, and `footer` slot. Supports a collapsed icon rail and resizing the root column.

```tsx
import { CascadeMenu } from '@ensi-platform/admin-ui/cascade-menu';
```

## When to use

- Persistent admin navigation with a nested section tree
- Tree in `items`, optional permission filter (`allowedCodes`) and current URL path (`activePath`)
- Single-column list without cascade — see `MenuList`

## Behavior

- The root column stays in layout; hovering a folder opens a full-height flyout flush to that column, with the open section title on top
- Moving the pointer diagonally toward the panel does not flicker (short aim delay)
- No Back control: flyouts close on leave, outside click, or choosing a linked item
- An item with `link` calls `onChange` and closes flyouts
- Collapsed mode is an icon rail (toggle in the header); open flyouts close on collapse; in the rail, folders still open on hover, linked items use `Tooltip`
- Pins: right-click items **outside the root column** for Pin / Unpin and “Open in new tab” (linked items only); a single “Pinned” root entry opens the list in a flyout; empty state shows a right-click hint; `maxPinned` (default 8); stored in `localStorage` under `pinUserId`
- Expanded `width` and `collapsed` are also stored in `localStorage` under `pinUserId` (collapsing does not overwrite the saved width)

## API (summary)

| Prop                                                    | Values               | Default       | Description                                                                              |
| ------------------------------------------------------- | -------------------- | ------------- | ---------------------------------------------------------------------------------------- |
| `header`                                                | `ReactNode`          | —             | Header slot (brand composed by the app)                                                  |
| `items`                                                 | `ICascadeMenuItem[]` | —             | Menu tree                                                                                |
| `allowedCodes`                                          | `string[]`           | all           | Show only items with these `code` values                                                 |
| `activePath`                                            | `string`             | —             | URL path → active leaf id for `value` / `onChange` (does not highlight ancestors in root) |
| `value` / `defaultValue` / `onChange`                   |                      |               | Active leaf id (navigation)                                                              |
| `pinUserId`                                             | `string`             | —             | `localStorage` key for pins, width, and collapsed                                        |
| `pinnedCodes` / `defaultPinnedCodes` / `onPinnedChange` | `string[]`           |               | Pin list: controlled / uncontrolled                                                      |
| `maxPinned`                                             | `number`             | `8`           | Maximum pins                                                                             |
| `collapsed` / `defaultCollapsed` / `onCollapsedChange`  |                      | `false`       | Collapsed icon rail                                                                      |
| `width` / `defaultWidth` / `onWidthChange`              | px                   | `280`         | Root column width                                                                        |
| `minWidth` / `maxWidth`                                 | number               | `200` / `400` | Resize bounds                                                                            |
| `footer`                                                | `ReactNode`          | —             | Footer slot (user block composed by the app)                                          |
| `size`                                                  | `sm` \| `md` \| `lg` | `md`          | Item size                                                                                |
| `dataTestId`                                            | `string`             | —             | `data-test-id`                                                                           |

`ICascadeMenuItem`: `text`, `code`, `link?`, `icon?`, `children?`.
