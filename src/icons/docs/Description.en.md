SVG icons for buttons, menus, and chrome. Color is `currentColor`.

```tsx
import { Plus } from '@ensi-platform/admin-ui/icons';
```

## When to use

- icon on a `Button` (`icon.Component`)
- sidebar brand mark — `LogoEnsiMark` (`LogoEnsi` is the full wordmark)

## API (short)

Each export is an SVG component.

| Prop   | Values     | Default | Description                                      |
| ------ | ---------- | ------- | ------------------------------------------------ |
| `title` | `string`   | —       | accessible name; without it the svg is `aria-hidden` |
| rest   | `svg` attributes | —  | `className`, `width`, `height`                   |

On `Button`, size and gap come from `icon.size` / `icon.indent`, not from `svg` attributes.

Names: `Award`, `Bell`, `Birka`, `Book`, `Calculator`, `Calendar`, `Cart`, `Chart`, `Check`, `ChevronDown`, `ChevronLeft`, `ChevronRight`, `Clear`, `Copy`, `Download`, `ExternalLink`, `Funnel`, `Globe`, `GripVertical`, `House`, `Image`, `Info`, `LogoEnsi`, `LogoEnsiMark`, `Message`, `MoreVertical`, `Package`, `PanelLeft`, `PanelLeftClose`, `Pencil`, `Pin`, `PinOff`, `Plus`, `Search`, `Settings`, `SortAscending`, `SortDescending`, `Trash`, `Trello`, `Truck`, `Upload`, `Users`, `Warehouse`, `Warning`.
