SVG-иконки для кнопок, меню и хрома. Цвет — `currentColor`.

```tsx
import { Plus } from '@ensi-platform/admin-ui/icons';
```

## Когда использовать

- иконка у `Button` (`icon.Component`)
- знак бренда в сайдбаре — `LogoEnsiMark` (`LogoEnsi` — полный логотип)

## API (кратко)

Каждый экспорт — SVG-компонент.

| Prop    | Значения        | По умолчанию | Описание                                              |
| ------- | --------------- | ------------ | ----------------------------------------------------- |
| `title` | `string`        | —            | доступное имя; без него у `svg` стоит `aria-hidden`   |
| остальные | атрибуты `svg` | —            | `className`, `width`, `height`                        |

На `Button` размер и отступ задаёт `icon.size` / `icon.indent`, не атрибуты `svg`.

Имена: `Award`, `Bell`, `Birka`, `Book`, `Calculator`, `Calendar`, `Cart`, `Chart`, `Check`, `ChevronDown`, `ChevronLeft`, `ChevronRight`, `Clear`, `Copy`, `Download`, `ExternalLink`, `Funnel`, `Globe`, `GripVertical`, `House`, `Image`, `Info`, `LogoEnsi`, `LogoEnsiMark`, `Message`, `MoreVertical`, `Package`, `PanelLeft`, `PanelLeftClose`, `Pencil`, `Pin`, `PinOff`, `Plus`, `Search`, `Settings`, `SortAscending`, `SortDescending`, `Trash`, `Trello`, `Truck`, `Upload`, `Users`, `Warehouse`, `Warning`.
