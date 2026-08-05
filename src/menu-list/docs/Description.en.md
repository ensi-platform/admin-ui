Flat menu list with uppercase group labels and soft-pill active state.

```tsx
import { MenuList } from '@ensi-platform/admin-ui/menu-list';
```

## When to use

- section list in a sidebar or secondary nav
- groups + leaf items without nested accordion
- full column with logo/user/collapse — see `CascadeMenu`

## API (short)

### MenuList

| Prop           | Values                    | Default   | Description                 |
| -------------- | ------------------------- | --------- | --------------------------- |
| `value`        | `string`                  | —         | active item id (controlled) |
| `defaultValue` | `string`                  | —         | initial active item         |
| `onChange`     | `(value: string) => void` | —         | active change               |
| `size`         | `sm` \| `md` \| `lg`      | `md`      | size                        |
| `variant`      | `primary`                 | `primary` | visual variant              |
| `collapsed`    | `boolean`                 | `false`   | icon-only (labels hidden)   |
| `disabled`     | `boolean`                 | `false`   | disables all items          |
| `dataTestId`   | `string`                  | —         | `data-test-id`              |

Slots: `MenuList.Group` / `MenuList.Item`.

### MenuList.Group

| Prop    | Values   | Default | Description |
| ------- | -------- | ------- | ----------- |
| `label` | `string` | —       | group label |

### MenuList.Item

| Prop         | Values       | Default        | Description                |
| ------------ | ------------ | -------------- | -------------------------- |
| `id`         | `string`     | —              | unique id                  |
| `icon`       | `TSVGRIcon`  | —              | leading icon               |
| `href`       | `string`     | —              | link; root defaults to `a` |
| `as`         | element type | `a` / `button` | polymorphic root           |
| `disabled`   | `boolean`    | `false`        | disables the item          |
| `dataTestId` | `string`     | —              | `data-test-id`             |
