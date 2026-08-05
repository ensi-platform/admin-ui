Готовое cascade-меню АП: слот `header` (бренд собирает приложение), колонки, слот `footer`, свернуть (в brand) и resize L0.

```tsx
import { CascadeMenu } from '@ensi-platform/admin-ui/cascade-menu';
```

## Когда использовать

- постоянное меню АП с деревом разделов (как Ensi/Ашан Sidebar)
- данные `items` + filter `allowedCodes` + `activePath`
- низкоуровневый список одной колонки — см. `MenuList`

## Поведение

- L0 в layout; folder → **hover-flyout** (full-height = высота L0, flush к колонке, border-right; сверху — заголовок открытого раздела)
- aim-delay как DesktopMenu (диагональный уход к панели не мигает)
- без кнопки Back; leave / клик снаружи / leaf → схлоп
- leaf (`link`) → `onChange` и закрытие flyout
- collapse → icon-rail (кнопка в brand); при сворачивании открытые flyout закрываются; в rail folder → тот же hover-flyout, leaf → Tooltip
- пины: leaf и folder **не L0**; RMB → Pin/Unpin и «Open in new tab» (только leaf); один пункт Pinned в L0 → hover-flyout со списком; пустой hint про ПКМ; лимит `maxPinned` (по умолчанию 8); `localStorage` по `pinUserId`
- chrome: expanded `width` и `collapsed` тоже в `localStorage` по `pinUserId` (collapse не перезаписывает сохранённую ширину)

## API (кратко)

| Prop                                                    | Значения             | По умолчанию  | Описание                                                       |
| ------------------------------------------------------- | -------------------- | ------------- | -------------------------------------------------------------- |
| `header`                                                | `ReactNode`          | —             | слот шапки (бренд собирает приложение)                         |
| `items`                                                 | `ICascadeMenuItem[]` | —             | дерево меню                                                    |
| `allowedCodes`                                          | `string[]`           | все           | filter по `code`                                               |
| `activePath`                                            | `string`             | —             | pathname → leaf id для `onChange`/value (без подсветки в меню) |
| `value` / `defaultValue` / `onChange`                   |                      |               | leaf id (навигация; без pill у leaf)                           |
| `pinUserId`                                             | `string`             | —             | ключ LS для pins / width / collapsed                           |
| `pinnedCodes` / `defaultPinnedCodes` / `onPinnedChange` | `string[]`           |               | controlled / uncontrolled пины                                 |
| `maxPinned`                                             | `number`             | `8`           | лимит пинов                                                    |
| `collapsed` / `defaultCollapsed` / `onCollapsedChange`  |                      | `false`       | icon-rail                                                      |
| `width` / `defaultWidth` / `onWidthChange`              | px                   | `280`         | ширина L0                                                      |
| `minWidth` / `maxWidth`                                 | number               | `200` / `400` | пределы resize L0                                              |
| `footer`                                                | `ReactNode`          | —             | слот футера (блок пользователя собирает приложение)            |
| `size`                                                  | `sm` \| `md` \| `lg` | `md`          | размер пунктов                                                 |
| `dataTestId`                                            | `string`             | —             | атрибут `data-test-id`                                         |

`ICascadeMenuItem`: `text`, `code`, `link?`, `icon?`, `children?`.
